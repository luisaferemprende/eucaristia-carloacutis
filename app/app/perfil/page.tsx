// PANTALLA SECUNDARIA — Perfil. Server Component: perfil + correo real + plan.

import { createClient } from '@/lib/supabase/server';
import { PerfilCliente } from '@/components/app/perfil-cliente';

export default async function Perfil() {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user!;

  const [{ data: perfil }, { data: suscripcion }, { data: novenas }] = await Promise.all([
    supabase.from('profiles').select('nombre, racha_mejor, momento_dia').eq('id', user.id).single(),
    supabase.from('subscriptions').select('plan, estado').eq('user_id', user.id).maybeSingle(),
    supabase.from('novenas').select('nombre_tarjeta, santo_nombre, imagen_credito').not('imagen_credito', 'is', null),
  ]);

  return (
    <PerfilCliente
      nombre={perfil?.nombre ?? 'Peregrino'}
      correo={user.email ?? ''}
      rachaMejor={perfil?.racha_mejor ?? 0}
      momentoDia={perfil?.momento_dia ?? 'despertar'}
      plan={suscripcion ? { nombre: suscripcion.plan === 'anual' ? 'Anual' : 'Mensual', estado: suscripcion.estado } : null}
      creditosImagenes={(novenas ?? []).map((n) => ({
        nombre: (n.nombre_tarjeta as string) ?? (n.santo_nombre as string),
        credito: n.imagen_credito as string,
      }))}
    />
  );
}
