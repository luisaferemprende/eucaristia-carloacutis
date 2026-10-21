// Envía el recordatorio diario REAL por Web Push. Vercel lo llama UNA vez al
// día (vercel.json) — el plan gratis (Hobby) no permite tareas más seguidas
// que esa; antes corría cada 15 minutos para acertar la hora exacta de cada
// quien, pero eso hacía FALLAR TODO EL DESPLIEGUE en Hobby (descubierto
// 2026-10-20: ningún cambio se publicaba desde hacía días por esto). Mientras
// no se contrate el plan Pro, el aviso ya no llega a la hora elegida por cada
// persona — llega una vez al día, a la misma hora para todos (ver ESTADO.md).
import { NextResponse } from 'next/server';
import webpush from 'web-push';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

function fechaLocalISO(zonaHoraria: string): string | null {
  try {
    const f = new Intl.DateTimeFormat('en-CA', { timeZone: zonaHoraria, year: 'numeric', month: '2-digit', day: '2-digit' });
    return f.format(new Date()); // en-CA → YYYY-MM-DD
  } catch {
    return null; // zona horaria inválida: no revienta el cron entero por una fila mala.
  }
}

export async function GET(request: Request) {
  const secreto = request.headers.get('authorization')?.replace('Bearer ', '');
  if (!secreto || secreto !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const vapidPublic = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const vapidPrivate = process.env.VAPID_PRIVATE_KEY;
  const vapidContacto = process.env.VAPID_CONTACT_EMAIL;
  if (!vapidPublic || !vapidPrivate || !vapidContacto) {
    return NextResponse.json({ error: 'Faltan las llaves VAPID en el servidor' }, { status: 500 });
  }
  webpush.setVapidDetails(vapidContacto, vapidPublic, vapidPrivate);

  // service_role: este endpoint corre en el servidor, nunca en el navegador.
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

  const { data: suscripciones, error } = await supabase
    .from('push_subscriptions')
    .select('id, endpoint, p256dh, auth_key, zona_horaria');
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  let enviados = 0;
  let descartados = 0;
  for (const s of suscripciones ?? []) {
    const hoy = fechaLocalISO(s.zona_horaria);
    if (!hoy) continue;
    const { data: yaEnviado } = await supabase
      .from('push_enviados')
      .select('subscription_id')
      .eq('subscription_id', s.id)
      .eq('fecha', hoy)
      .maybeSingle();
    if (yaEnviado) continue;

    try {
      await webpush.sendNotification(
        { endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth_key } },
        JSON.stringify({
          titulo: 'Tu Autopista de 3 Minutos',
          cuerpo: 'Hoy te espera el pensamiento de un santo y un milagro eucarístico.',
          url: '/app',
        }),
      );
      await supabase.from('push_enviados').insert({ subscription_id: s.id, fecha: hoy });
      enviados++;
    } catch (e) {
      // Suscripción vencida/inválida (ej. desinstaló la app): se borra para no
      // reintentar siempre el mismo error.
      const status = (e as { statusCode?: number }).statusCode;
      if (status === 404 || status === 410) await supabase.from('push_subscriptions').delete().eq('id', s.id);
      descartados++;
    }
  }

  return NextResponse.json({ revisados: suscripciones?.length ?? 0, enviados, descartados });
}
