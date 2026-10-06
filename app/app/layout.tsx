// SHELL DE LA APP INTERNA — min-h-dvh + nav al fondo (53). Server Component:
// exige sesión real (Sesión 6) antes de mostrar cualquier dato — sin esto,
// /app quedaría abierta a cualquiera sin haber iniciado sesión.

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { AppShellCliente } from '@/components/app/shell-cliente';

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect('/entrar');

  return <AppShellCliente>{children}</AppShellCliente>;
}
