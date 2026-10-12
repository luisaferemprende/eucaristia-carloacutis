import { createClient } from '@/lib/supabase/client';

// Notificaciones push reales (Web Push + VAPID). Funcionan en Chrome/Edge en
// Android y escritorio; en iPhone, Safari exige primero "Agregar a inicio"
// (instalar la app) — fuera de eso, no hay forma de mandar avisos en iOS.

function base64UrlABuffer(base64Url: string): Uint8Array<ArrayBuffer> {
  const base64 = (base64Url + '='.repeat((4 - (base64Url.length % 4)) % 4)).replace(/-/g, '+').replace(/_/g, '/');
  const raw = atob(base64);
  const bytes = new Uint8Array(new ArrayBuffer(raw.length));
  for (let i = 0; i < raw.length; i++) bytes[i] = raw.charCodeAt(i);
  return bytes;
}

export function pushSoportado(): boolean {
  return typeof window !== 'undefined' && 'serviceWorker' in navigator && 'PushManager' in window;
}

export async function suscripcionActual(): Promise<PushSubscription | null> {
  if (!pushSoportado()) return null;
  const registro = await navigator.serviceWorker.getRegistration();
  if (!registro) return null;
  return registro.pushManager.getSubscription();
}

export async function activarNotificaciones(): Promise<{ ok: boolean; motivo?: string }> {
  if (!pushSoportado()) return { ok: false, motivo: 'Tu navegador no admite notificaciones.' };

  const permiso = await Notification.requestPermission();
  if (permiso !== 'granted') return { ok: false, motivo: 'No diste permiso para avisarte.' };

  const clavePublica = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  if (!clavePublica) return { ok: false, motivo: 'Falta configurar el servidor de avisos.' };

  const registro = await navigator.serviceWorker.register('/sw.js');
  await navigator.serviceWorker.ready;
  let suscripcion = await registro.pushManager.getSubscription();
  if (!suscripcion) {
    suscripcion = await registro.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: base64UrlABuffer(clavePublica),
    });
  }

  const json = suscripcion.toJSON();
  const supabase = createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user || !json.endpoint || !json.keys) return { ok: false, motivo: 'Tu sesión expiró.' };

  const zonaHoraria = Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/Bogota';
  const { error } = await supabase.from('push_subscriptions').upsert(
    {
      user_id: userData.user.id,
      endpoint: json.endpoint,
      p256dh: json.keys.p256dh,
      auth_key: json.keys.auth,
      zona_horaria: zonaHoraria,
    },
    { onConflict: 'endpoint' },
  );
  if (error) return { ok: false, motivo: 'No pudimos guardar tu aviso. Intenta de nuevo.' };
  return { ok: true };
}

export async function desactivarNotificaciones(): Promise<void> {
  const suscripcion = await suscripcionActual();
  if (!suscripcion) return;
  const endpoint = suscripcion.endpoint;
  await suscripcion.unsubscribe();
  const supabase = createClient();
  await supabase.from('push_subscriptions').delete().eq('endpoint', endpoint);
}
