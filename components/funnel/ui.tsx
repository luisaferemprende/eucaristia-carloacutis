'use client';

// COMPONENTES COMPARTIDOS DEL FUNNEL — onboarding + paywall + login (50 A-E).
// Reutiliza los tokens de components/landing/tokens.css (--bg, --accent, etc.)
// más el modo noche de app/globals.css (.tema-noche). Radios/sombras del kit.

import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Check } from 'lucide-react';

/* ── Barra de progreso: línea fina, % real, endowed progress (50 A2) ── */
export function BarraProgreso({ paso, total }: { paso: number; total: number }) {
  const pct = Math.max(8, Math.round((paso / total) * 100));
  return (
    <div className="h-[3px] w-full overflow-hidden rounded-full bg-[color-mix(in_oklab,var(--text-tertiary)_16%,transparent)]">
      <motion.div
        className="h-full rounded-full bg-[var(--accent)]"
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      />
    </div>
  );
}

/* ── Botón atrás: chevron 44px táctil (50 A2) ── */
export function BotonAtras({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label="Volver a la pregunta anterior"
      className="flex h-11 w-11 shrink-0 items-center justify-center text-[var(--text-secondary)]"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M15 18l-6-6 6-6" />
      </svg>
    </button>
  );
}

/* ── Chip de opción: ancho completo, estado seleccionado (50 A2/A3) ── */
export function OpcionChip({
  seleccionado,
  onClick,
  children,
}: {
  seleccionado: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.97 }}
      className={`flex w-full items-center justify-between gap-3 rounded-[var(--radius-button)] border px-5 py-4 text-left text-[16px] font-medium transition-colors duration-150 ${
        seleccionado
          ? 'border-[var(--accent)] bg-[color-mix(in_oklab,var(--accent)_10%,transparent)] text-[var(--text-primary)]'
          : 'border-[color-mix(in_oklab,var(--text-tertiary)_28%,transparent)] bg-[var(--surface)] text-[var(--text-primary)]'
      }`}
    >
      <span>{children}</span>
      {seleccionado && (
        <motion.span
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.2, type: 'spring', bounce: 0.35 }}
          className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--accent)] text-[var(--on-accent-fill)]"
        >
          <Check size={13} strokeWidth={3} />
        </motion.span>
      )}
    </motion.button>
  );
}

/* ── Transición entre pasos: slide + fade (50 A4) ── */
export function PasoAnimado({
  children,
  direccion,
  clave,
}: {
  children: ReactNode;
  direccion: 1 | -1;
  clave: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      key={clave}
      initial={reduce ? { opacity: 0 } : { opacity: 0, x: 40 * direccion }}
      animate={{ opacity: 1, x: 0 }}
      exit={reduce ? { opacity: 0 } : { opacity: 0, x: -24 * direccion }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ── CTA primario del funnel: ≥52px, acento pleno, texto legible (50 C2/E) ── */
export function CtaFunnel({
  children,
  onClick,
  disabled,
  href,
  type = 'button',
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  href?: string;
  type?: 'button' | 'submit';
}) {
  const clases = `flex h-14 w-full items-center justify-center rounded-[var(--radius-button)] bg-[var(--accent)] text-[16px] font-semibold text-[var(--on-accent-fill)] shadow-[0_10px_28px_color-mix(in_oklab,var(--accent)_30%,transparent)] transition-opacity duration-150 [touch-action:manipulation] ${
    disabled ? 'opacity-50' : ''
  }`;
  if (href) {
    return (
      <motion.a whileTap={disabled ? undefined : { scale: 0.97 }} href={disabled ? undefined : href} className={clases}>
        {children}
      </motion.a>
    );
  }
  return (
    <motion.button
      whileTap={disabled ? undefined : { scale: 0.97 }}
      onClick={onClick}
      disabled={disabled}
      type={type}
      className={clases}
    >
      {children}
    </motion.button>
  );
}

/* ── Anillo de progreso del loading (50 B1) ── */
export function AnilloProgreso({ pct }: { pct: number }) {
  const r = 52;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative flex h-[120px] w-[120px] items-center justify-center">
      <svg width="120" height="120" viewBox="0 0 120 120" className="absolute -rotate-90">
        <circle cx="60" cy="60" r={r} fill="none" stroke="color-mix(in oklab, var(--accent) 14%, transparent)" strokeWidth="9" />
        <motion.circle
          cx="60"
          cy="60"
          r={r}
          fill="none"
          stroke="var(--accent)"
          strokeWidth="9"
          strokeLinecap="round"
          strokeDasharray={c}
          animate={{ strokeDashoffset: c - (c * pct) / 100 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        />
      </svg>
      <span className="text-[24px] font-bold tabular-nums text-[var(--text-primary)] [font-family:var(--font-display)]">
        {pct}%
      </span>
    </div>
  );
}
