// Envía el recordatorio diario REAL por Web Push. Vercel lo llama cada 15
// minutos (vercel.json). Protegido con CRON_SECRET: sin el secreto correcto,
// responde 401 — nadie más puede disparar avisos a los usuarios.
import { NextResponse } from 'next/server';
import webpush from 'web-push';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

// Hora LOCAL objetivo (en el huso horario de cada persona) para cada momento
// elegido en el onboarding/Perfil. "cuando_pueda" recibe un único empujón
// suave a media tarde, en vez de nada.
const HORA_OBJETIVO: Record<string, number> = { despertar: 7, misa: 11, dormir: 21, cuando_pueda: 18 };

function horaLocal(zonaHoraria: string): number {
  try {
    const partes = new Intl.DateTimeFormat('en-US', { timeZone: zonaHoraria, hour: 'numeric', hourCycle: 'h23' }).formatToParts(
      new Date(),
    );
    return Number(partes.find((p) => p.type === 'hour')?.value ?? -1);
  } catch {
    return -1; // zona horaria inválida guardada: no se le envía nada (fail-safe, no falla el cron)
  }
}

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
    .select('id, endpoint, p256dh, auth_key, zona_horaria, profiles:user_id(momento_dia)');
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  let enviados = 0;
  let descartados = 0;
  for (const s of suscripciones ?? []) {
    const momento = (s.profiles as unknown as { momento_dia: string } | null)?.momento_dia ?? 'despertar';
    const horaObjetivo = HORA_OBJETIVO[momento] ?? HORA_OBJETIVO.despertar;
    if (horaLocal(s.zona_horaria) !== horaObjetivo) continue;

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
