'use client';

// COMPONENTES COMPARTIDOS DE LA APP INTERNA (Sesión 5 — 53-PANTALLA-CANONICA).
// Mismos tokens del proyecto (components/landing/tokens.css + .tema-noche).

import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { motion, useMotionValue, useReducedMotion, useTransform, animate } from 'motion/react';
import { BookHeart, Flame, Home, User } from 'lucide-react';

const NAV = [
  { href: '/app', label: 'Hoy', icono: Home },
  { href: '/app/novena', label: 'Novena', icono: Flame },
  { href: '/app/diario', label: 'Diario', icono: BookHeart },
  { href: '/app/perfil', label: 'Perfil', icono: User },
] as const;

// Cápsula flotante (no pegada al borde): el destino activo se eleva en una
// burbuja dorada por encima de la barra — un solo dispositivo hace de
// indicador, nada de línea + ícono coloreado a la vez.
export function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  return (
    <div className="sticky bottom-0 bg-[var(--bg)] px-4 pb-[max(14px,env(safe-area-inset-bottom))] pt-3">
      <nav
        aria-label="Navegación principal"
        className="mx-auto flex h-16 max-w-md items-stretch justify-around rounded-full border border-[color-mix(in_oklab,var(--text-tertiary)_14%,transparent)] bg-[var(--surface)] px-2 shadow-[var(--shadow-2)]"
      >
        {NAV.map(({ href, label, icono: Icono }) => {
          const activo = href === '/app' ? pathname === '/app' : pathname.startsWith(href);
          return (
            <motion.button
              key={href}
              whileTap={{ scale: 0.96 }}
              type="button"
              onClick={() => router.push(href)}
              aria-current={activo ? 'page' : undefined}
              className="relative flex flex-1 flex-col items-center justify-end gap-1 pb-2 [touch-action:manipulation]"
            >
              <span className="relative flex h-6 w-11 items-center justify-center">
                {activo && (
                  <motion.span
                    layoutId="nav-burbuja"
                    transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                    aria-hidden="true"
                    className="absolute -top-7 flex size-12 items-center justify-center rounded-full bg-[var(--accent)] shadow-[0_8px_18px_color-mix(in_oklab,var(--accent)_35%,transparent)]"
                  >
                    <Icono size={22} color="var(--on-accent-fill)" strokeWidth={2.4} />
                  </motion.span>
                )}
                {!activo && <Icono size={22} aria-hidden="true" color="var(--text-tertiary)" strokeWidth={2} />}
              </span>
              <span
                className={`text-[11px] font-medium ${activo ? 'text-[var(--accent-text)]' : 'text-[var(--text-tertiary)]'}`}
              >
                {label}
              </span>
            </motion.button>
          );
        })}
      </nav>
    </div>
  );
}

/* ── Conteo animado del número héroe (53 baseline #2) — nunca estático ── */
export function CountUp({ value }: { value: number }) {
  const reduce = useReducedMotion();
  const mv = useMotionValue(reduce ? value : 0);
  const texto = useTransform(mv, (v) => Math.round(v).toString());
  useEffect(() => {
    const ctrl = animate(mv, value, { duration: reduce ? 0 : 0.7, ease: [0.16, 1, 0.3, 1] });
    return () => ctrl.stop();
  }, [value, mv, reduce]);
  return <motion.span className="tabular-nums">{texto}</motion.span>;
}

/* ── Anillo de progreso (53 baseline #3) — SE DIBUJA, nunca aparece lleno ── */
export function AnilloProgresoApp({ pct, size = 64 }: { pct: number; size?: number }) {
  const r = (size - 10) / 2;
  const c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} role="img" aria-label={`Progreso: ${pct}%`}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={7} stroke="var(--chip-bg)" />
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        strokeWidth={7}
        stroke="var(--accent)"
        strokeLinecap="round"
        strokeDasharray={c}
        initial={{ strokeDashoffset: c }}
        animate={{ strokeDashoffset: c * (1 - pct / 100) }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
    </svg>
  );
}

export function saludoPorHora(h: number): string {
  if (h < 12) return 'Buenos días';
  if (h < 19) return 'Buenas tardes';
  return 'Buenas noches';
}
