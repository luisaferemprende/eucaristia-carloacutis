import { createClient as createSupabaseClient } from '@supabase/supabase-js';

// Cliente de SERVICIO — usa la clave secreta (service_role), que se salta TODAS
// las reglas de seguridad (RLS). SOLO se importa desde código de servidor que ya
// verificó por su cuenta que quien llama es admin (ver lib/admin-guard.ts).
// JAMÁS importar este archivo desde un componente 'use client'.
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const clave = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !clave) {
    throw new Error(
      'Falta configurar SUPABASE_SERVICE_ROLE_KEY en el servidor (.env.local y Vercel) — sin ella el panel de administración no puede crear usuarios ni leer todo.'
    );
  }
  return createSupabaseClient(url, clave, { auth: { persistSession: false } });
}
