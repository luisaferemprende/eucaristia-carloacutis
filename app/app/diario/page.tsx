'use client';

// PANTALLA SECUNDARIA — Diario. Acción de crear JUNTO a la lista que alimenta
// (regla UX 12) + fechas reales por entrada (regla UX 13).

import { useState } from 'react';
import { motion, type Variants } from 'motion/react';
import { Plus } from 'lucide-react';
import { DIARIO_DEMO } from '@/lib/demo-data';

const lista: Variants = { hidden: {}, visible: { transition: { staggerChildren: 0.05 } } };
const item: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] } },
};

const FECHA_LARGA = new Intl.DateTimeFormat('es', { weekday: 'short', day: 'numeric', month: 'short' });

export default function Diario() {
  const [entradas] = useState(DIARIO_DEMO);

  return (
    <motion.main variants={lista} initial="hidden" animate="visible" className="flex-1 px-4 pt-6 pb-4">
      <motion.header variants={item} className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-[13px] font-medium text-[var(--text-tertiary)]">Solo entre tú y Dios</p>
          <h1 className="mt-1 text-balance text-[28px] font-bold leading-[1.1] text-[var(--text-primary)] [font-family:var(--font-display)]">
            Tu diario espiritual
          </h1>
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          type="button"
          aria-label="Escribir una nueva entrada"
          className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[var(--accent)] text-[var(--text-primary)] shadow-[0_8px_20px_color-mix(in_oklab,var(--accent)_28%,transparent)] [touch-action:manipulation]"
        >
          <Plus size={22} aria-hidden="true" />
        </motion.button>
      </motion.header>

      <ul className="flex flex-col gap-3">
        {entradas.map((e) => (
          <motion.li
            key={e.id}
            variants={item}
            className="rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--text-tertiary)_20%,transparent)] bg-[var(--surface)] p-5"
          >
            <p className="text-[12px] font-semibold uppercase tracking-[0.06em] text-[var(--text-tertiary)]">
              {FECHA_LARGA.format(e.fecha)}
            </p>
            <p className="mt-2 text-[15px] leading-relaxed text-[var(--text-primary)]">{e.texto}</p>
          </motion.li>
        ))}
      </ul>
    </motion.main>
  );
}
