import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

// Verifica que quien pide la página es ADMIN de verdad, preguntándole a la base
// de datos (nunca confiando en que el link esté "escondido" — eso es IDOR).
// Para Server Components/páginas: redirige si no es admin.
export async function requireAdminPage() {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) redirect('/entrar');

  const { data: perfil } = await supabase.from('profiles').select('role').eq('id', userData.user.id).single();
  if (perfil?.role !== 'admin') redirect('/app');

  return { supabase, userId: userData.user.id };
}

// Para Route Handlers (/api/admin/*): nunca redirige (rompería el JSON de la
// respuesta) — devuelve null si es admin, o la Response de error que hay que
// retornar tal cual.
export async function requireAdminApi(): Promise<
  { ok: true; supabase: Awaited<ReturnType<typeof createClient>>; userId: string } | { ok: false; response: Response }
> {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    return { ok: false, response: Response.json({ error: 'No autenticado' }, { status: 401 }) };
  }
  const { data: perfil } = await supabase.from('profiles').select('role').eq('id', userData.user.id).single();
  if (perfil?.role !== 'admin') {
    return { ok: false, response: Response.json({ error: 'No autorizado' }, { status: 403 }) };
  }
  return { ok: true, supabase, userId: userData.user.id };
}
