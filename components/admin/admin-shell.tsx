'use client';

// Armazón del panel: pensado para pantalla de computador, no mobile-first como
// el resto de la app — el dueño lo usa para ver números, no para orar. Tema
// día fijo (no sigue el ciclo noche/día devocional): es una herramienta, no
// un momento de recogimiento.

import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Users, CreditCard, Activity, ShieldAlert, ExternalLink } from 'lucide-react';

const NAV = [
  { href: '/admin', label: 'Resumen', icono: LayoutDashboard },
  { href: '/admin/usuarios', label: 'Usuarios', icono: Users },
  { href: '/admin/ventas', label: 'Ventas', icono: CreditCard },
  { href: '/admin/uso', label: 'Uso', icono: Activity },
  { href: '/admin/salud', label: 'Salud', icono: ShieldAlert },
] as const;

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="flex min-h-dvh bg-[var(--bg)] text-[var(--text-primary)] [font-family:var(--font-body)]">
      <aside className="flex w-60 shrink-0 flex-col border-r border-[color-mix(in_oklab,var(--text-tertiary)_16%,transparent)] bg-[var(--surface)] px-4 py-6">
        <p className="px-2 text-[13px] font-semibold uppercase tracking-[0.06em] text-[var(--text-tertiary)]">Panel del dueño</p>
        <h1 className="mt-1 px-2 text-[18px] font-bold leading-tight [font-family:var(--font-display)]">EucaristíaViva</h1>
        <nav className="mt-6 flex flex-col gap-1">
          {NAV.map(({ href, label, icono: Icono }) => {
            const activo = href === '/admin' ? pathname === '/admin' : pathname.startsWith(href);
            return (
              <button
                key={href}
                type="button"
                onClick={() => router.push(href)}
                className={`flex items-center gap-3 rounded-[var(--radius-button)] px-3 py-2 text-left text-[14px] font-medium transition-colors ${
                  activo
                    ? 'bg-[color-mix(in_oklab,var(--accent)_14%,transparent)] text-[var(--accent-text)]'
                    : 'text-[var(--text-secondary)] hover:bg-[var(--surface-2)]'
                }`}
              >
                <Icono size={18} aria-hidden="true" />
                {label}
              </button>
            );
          })}
        </nav>
        <button
          type="button"
          onClick={() => router.push('/app')}
          className="mt-auto flex items-center gap-2 rounded-[var(--radius-button)] px-3 py-2 text-left text-[13px] font-medium text-[var(--text-tertiary)] hover:bg-[var(--surface-2)]"
        >
          <ExternalLink size={15} aria-hidden="true" />
          Volver a la app
        </button>
      </aside>
      <main className="min-w-0 flex-1 overflow-y-auto px-8 py-8">
        <div className="mx-auto max-w-5xl">{children}</div>
      </main>
    </div>
  );
}
