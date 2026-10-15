'use server';

// Server Action: agregar una fila de gasto de adquisición a mano. RLS exige
// is_admin() en la tabla acquisition_spend — si quien llama no es admin, el
// insert simplemente falla (no hace falta service_role para esto).

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { requireAdminPage } from '@/lib/admin-guard';

const EsquemaGasto = z.object({
  channel: z.string().trim().min(1).max(40),
  amount: z.coerce.number().positive(),
  currency: z.string().trim().length(3).default('USD'),
  period_start: z.string().date(),
  period_end: z.string().date(),
});

export async function agregarGastoAdquisicion(formData: FormData) {
  const { supabase } = await requireAdminPage();
  const parseo = EsquemaGasto.safeParse(Object.fromEntries(formData));
  if (!parseo.success) return;

  await supabase.from('acquisition_spend').insert(parseo.data);
  revalidatePath('/admin/ventas');
}
