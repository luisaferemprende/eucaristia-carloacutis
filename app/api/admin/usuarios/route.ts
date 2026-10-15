// POST /api/admin/usuarios — invita a una persona por correo+nombre (admin).
// Verificado EN SERVIDOR (requireAdminApi), nunca confiando en que la ruta
// esté "escondida" en el cliente. Usa la clave de servicio para crear el
// usuario de Auth real; el perfil lo crea solo el trigger de siempre.

import { z } from 'zod';
import { requireAdminApi } from '@/lib/admin-guard';
import { createAdminClient } from '@/lib/supabase/admin';

const EsquemaInvitacion = z.object({
  email: z.string().trim().toLowerCase().email('Correo inválido'),
  nombre: z.string().trim().min(1, 'Falta el nombre').max(80, 'El nombre es muy largo'),
});

export async function POST(request: Request) {
  const guard = await requireAdminApi();
  if (!guard.ok) return guard.response;

  const cuerpo = await request.json().catch(() => null);
  const parseo = EsquemaInvitacion.safeParse(cuerpo);
  if (!parseo.success) {
    return Response.json({ error: parseo.error.issues[0]?.message ?? 'Datos inválidos' }, { status: 400 });
  }
  const { email, nombre } = parseo.data;

  let admin;
  try {
    admin = createAdminClient();
  } catch (e) {
    return Response.json({ error: e instanceof Error ? e.message : 'Falta configurar el servidor' }, { status: 500 });
  }

  const { error } = await admin.auth.admin.inviteUserByEmail(email, { data: { nombre } });
  if (error) {
    // Supabase devuelve este mensaje si el correo ya tiene cuenta — se traduce a simple.
    const yaExiste = /already.*registered|already.*exists/i.test(error.message);
    return Response.json(
      { error: yaExiste ? 'Ese correo ya tiene una cuenta.' : 'No se pudo enviar la invitación — intenta de nuevo en un momento.' },
      { status: yaExiste ? 409 : 502 }
    );
  }

  return Response.json({ ok: true });
}
