// RESUMEN — Server Component: trae lo mínimo para el vistazo rápido. Nada se
// inventa: lo que no existe todavía se muestra como "Sin datos".

import { requireAdminPage } from '@/lib/admin-guard';
import { TarjetaMetrica, BannerAvisos, TituloSeccion, type Aviso } from '@/components/admin/ui';
import { Users, Flame, CreditCard, ShieldAlert } from 'lucide-react';

export default async function AdminResumen() {
  const { supabase } = await requireAdminPage();

  const hace7Dias = new Date();
  hace7Dias.setDate(hace7Dias.getDate() - 7);
  const hace24h = new Date();
  hace24h.setDate(hace24h.getDate() - 1);

  const [{ count: totalUsuarios }, { count: activosHoy }, { count: suscripcionesActivas }, { count: erroresRecientes }] =
    await Promise.all([
      supabase.from('profiles').select('id', { count: 'exact', head: true }),
      supabase.from('event_log').select('user_id', { count: 'exact', head: true }).eq('type', 'sesion_iniciada').gte('created_at', hace24h.toISOString()),
      supabase.from('subscriptions').select('id', { count: 'exact', head: true }).eq('estado', 'activa'),
      supabase.from('error_log').select('id', { count: 'exact', head: true }).gte('created_at', hace7Dias.toISOString()),
    ]);

  const avisos: Aviso[] = [];
  if ((erroresRecientes ?? 0) > 10) {
    avisos.push({ nivel: 'alerta', texto: `${erroresRecientes} errores en los últimos 7 días — revisa la sección Salud para ver cuál se repite más.` });
  }
  if ((totalUsuarios ?? 0) > 0 && (suscripcionesActivas ?? 0) === 0) {
    avisos.push({ nivel: 'info', texto: 'Todavía no hay ninguna suscripción activa registrada — normal si Hotmart aún no está conectado.' });
  }

  return (
    <div>
      <TituloSeccion subtitulo="Lo más importante de tu app, de un vistazo.">Resumen</TituloSeccion>
      <div className="mb-6">
        <BannerAvisos avisos={avisos} />
      </div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <TarjetaMetrica titulo="Usuarios totales" valor={String(totalUsuarios ?? 0)} insight="Cuentas registradas en tu app." Icono={Users} />
        <TarjetaMetrica titulo="Activos hoy" valor={String(activosHoy ?? 0)} insight="Abrieron la app en las últimas 24 horas." Icono={Flame} />
        <TarjetaMetrica titulo="Suscripciones activas" valor={String(suscripcionesActivas ?? 0)} sinDatos={!suscripcionesActivas} Icono={CreditCard} />
        <TarjetaMetrica titulo="Errores (7 días)" valor={String(erroresRecientes ?? 0)} insight="Capturados por la app, no inventados." Icono={ShieldAlert} />
      </div>
    </div>
  );
}
