// PANEL DE ADMINISTRACIÓN — Server Component: exige rol admin verificado en el
// SERVIDOR antes de mostrar nada (requireAdminPage). Pensado para computador
// (el dueño lo usa para ver números, no es parte de la app mobile-first).

import { requireAdminPage } from '@/lib/admin-guard';
import { AdminShell } from '@/components/admin/admin-shell';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdminPage();
  return <AdminShell>{children}</AdminShell>;
}
