'use client';

// PANTALLA SECUNDARIA — Perfil. Estado de la cuenta + ajustes + salida —
// nunca solo un botón de "cerrar sesión" perdido.

import { motion, type Variants } from 'motion/react';
import { Bell, ChevronRight, CreditCard, LogOut, ShieldCheck } from 'lucide-react';
import { USUARIO_DEMO } from '@/lib/demo-data';

const lista: Variants = { hidden: {}, visible: { transition: { staggerChildren: 0.05 } } };
const item: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] } },
};

const OPCIONES = [
  { icono: CreditCard, label: 'Mi plan', detalle: 'Anual · $29.99/año', href: '#' },
  { icono: Bell, label: 'Recordatorio diario', detalle: 'Al despertar', href: '#' },
  { icono: ShieldCheck, label: 'Privacidad y datos', detalle: undefined, href: '/privacidad' },
] as const;

export default function Perfil() {
  return (
    <motion.main variants={lista} initial="hidden" animate="visible" className="flex-1 px-4 pt-6 pb-4">
      <motion.header variants={item} className="mb-6 flex items-center gap-4">
        <span
          aria-hidden="true"
          className="flex size-14 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--accent)_16%,transparent)] text-[20px] font-bold text-[var(--accent-text)] [font-family:var(--font-display)]"
        >
          {USUARIO_DEMO.nombre.charAt(0)}
        </span>
        <div className="min-w-0">
          <h1 className="text-[20px] font-bold text-[var(--text-primary)] [font-family:var(--font-display)]">
            {USUARIO_DEMO.nombre}
          </h1>
          <p className="mt-0.5 text-[13px] text-[var(--text-secondary)]">
            Tu mejor racha: {USUARIO_DEMO.mejorRacha} días
          </p>
        </div>
      </motion.header>

      <motion.ul variants={item} className="flex flex-col gap-2">
        {OPCIONES.map((o) => (
          <li key={o.label}>
            <a
              href={o.href}
              className="flex items-center gap-3 rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--text-tertiary)_20%,transparent)] bg-[var(--surface)] p-4 [touch-action:manipulation]"
            >
              <span
                aria-hidden="true"
                className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[var(--chip-bg)]"
              >
                <o.icono size={18} color="var(--accent)" aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[15px] font-medium text-[var(--text-primary)]">{o.label}</span>
                {o.detalle && (
                  <span className="mt-0.5 block text-[13px] text-[var(--text-secondary)]">{o.detalle}</span>
                )}
              </span>
              <ChevronRight size={18} color="var(--text-tertiary)" aria-hidden="true" className="shrink-0" />
            </a>
          </li>
        ))}
      </motion.ul>

      <motion.button
        variants={item}
        whileTap={{ scale: 0.98 }}
        type="button"
        className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--text-tertiary)_28%,transparent)] text-[15px] font-medium text-[var(--text-secondary)] [touch-action:manipulation]"
      >
        <LogOut size={18} aria-hidden="true" />
        Cerrar sesión
      </motion.button>
    </motion.main>
  );
}
