import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// Cliente del SERVIDOR (Server Components/Actions) — lee/escribe las cookies
// de sesión para que (select auth.uid()) resuelva el usuario real en RLS.
export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
          } catch {
            // Llamado desde un Server Component sin poder escribir cookies —
            // el middleware ya se encarga de refrescar la sesión.
          }
        },
      },
    }
  );
}
