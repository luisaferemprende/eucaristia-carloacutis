// PANTALLA SECUNDARIA — Perfil. Server Component: perfil + correo real + plan.

import { createClient } from '@/lib/supabase/server';
import { PerfilCliente } from '@/components/app/perfil-cliente';

export default async function Perfil() {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user!;

  const [{ data: perfil }, { data: suscripcion }] = await Promise.all([
    supabase.from('profiles').select('nombre, racha_mejor, momento_dia').eq('id', user.id).single(),
    supabase.from('subscriptions').select('plan, estado').eq('user_id', user.id).maybeSingle(),
  ]);

  return (
    <PerfilCliente
      nombre={perfil?.nombre ?? 'Peregrino'}
      correo={user.email ?? ''}
      rachaMejor={perfil?.racha_mejor ?? 0}
      momentoDia={perfil?.momento_dia ?? 'despertar'}
      plan={suscripcion ? { nombre: suscripcion.plan === 'anual' ? 'Anual' : 'Mensual', estado: suscripcion.estado } : null}
    />
  );
}
