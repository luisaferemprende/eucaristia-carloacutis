import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Puerta de llegada del enlace del correo / Google: cambia el `code` por la
// sesión real (flujo PKCE de Supabase) y manda a la persona a su app.
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/app';
  // Solo rutas internas: nunca redirigir a un dominio externo (open redirect).
  const destino = next.startsWith('/') && !next.startsWith('//') ? next : '/app';

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(`${origin}${destino}`);
  }
  return NextResponse.redirect(`${origin}/entrar?error=enlace`);
}
