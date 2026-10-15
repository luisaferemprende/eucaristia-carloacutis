// USUARIOS — lista real, con el estado de suscripción de cada quien si existe.

import { requireAdminPage } from '@/lib/admin-guard';
import { UsuariosCliente } from '@/components/admin/usuarios-cliente';

export default async function AdminUsuarios() {
  const { supabase } = await requireAdminPage();

  const [{ data: perfiles }, { data: suscripciones }] = await Promise.all([
    supabase.from('profiles').select('id, nombre, email, role, racha_actual, created_at').order('created_at', { ascending: false }),
    supabase.from('subscriptions').select('user_id, plan, estado, vence_en'),
  ]);

  const suscripcionPorUsuario = new Map((suscripciones ?? []).map((s) => [s.user_id as string, s]));

  const usuarios = (perfiles ?? []).map((p) => {
    const sub = suscripcionPorUsuario.get(p.id as string);
    return {
      id: p.id as string,
      nombre: p.nombre as string,
      email: p.email as string | null,
      role: p.role as string,
      rachaActual: p.racha_actual as number,
      creadoEn: p.created_at as string,
      plan: (sub?.plan as string) ?? null,
      estado: (sub?.estado as string) ?? null,
    };
  });

  return <UsuariosCliente usuariosIniciales={usuarios} />;
}
