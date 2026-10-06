import { createBrowserClient } from '@supabase/ssr';

// Cliente del NAVEGADOR — usa la clave publicable (protegida por RLS, nunca la
// service_role). Seguro en componentes 'use client' (09-SEGURIDAD.md).
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );
}
