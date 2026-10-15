// PATCH /api/admin/usuarios/[id] — da o quita acceso a mano (por si el
// webhook de Hotmart falla o no llega). Escribe en `subscriptions` con la
// clave de servicio, igual que lo haría el webhook — nunca desde el cliente.

import { z } from 'zod';
import { requireAdminApi } from '@/lib/admin-guard';
import { createAdminClient } from '@/lib/supabase/admin';

// Vocabulario REAL de la tabla subscriptions hoy (CHECK constraint) — en
// español. Ojo: 18-VENTA-HOTMART.md documenta estados en inglés para el
// futuro webhook; hay que resolver esa diferencia antes de conectar Hotmart
// (anotado en ESTADO.md).
const EsquemaEstado = z.object({ estado: z.enum(['activa', 'cancelada']) });

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireAdminApi();
  if (!guard.ok) return guard.response;

  const { id } = await params;
  const cuerpo = await request.json().catch(() => null);
  const parseo = EsquemaEstado.safeParse(cuerpo);
  if (!parseo.success) {
    return Response.json({ error: 'Datos inválidos' }, { status: 400 });
  }

  let admin;
  try {
    admin = createAdminClient();
  } catch (e) {
    return Response.json({ error: e instanceof Error ? e.message : 'Falta configurar el servidor' }, { status: 500 });
  }

  const { error } = await admin
    .from('subscriptions')
    .upsert({ user_id: id, estado: parseo.data.estado, plan: 'mensual' }, { onConflict: 'user_id' });

  if (error) {
    return Response.json({ error: 'No se pudo actualizar el acceso.' }, { status: 500 });
  }
  return Response.json({ ok: true });
}
