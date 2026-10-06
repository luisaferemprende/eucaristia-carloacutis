'use client';

// PANTALLA SECUNDARIA — Novena. Progreso día a día visible de un vistazo (regla
// UX 15: estado con ícono, no solo color) + fechas reales de la novena en curso.

import { motion, type Variants } from 'motion/react';
import { Check, Flame } from 'lucide-react';
import { AnilloProgresoApp } from '@/components/app/ui';
import { NOVENA_ACTUAL } from '@/lib/demo-data';

const lista: Variants = { hidden: {}, visible: { transition: { staggerChildren: 0.05 } } };
const item: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] } },
};

export default function Novena() {
  const pct = Math.round((NOVENA_ACTUAL.diaActual / NOVENA_ACTUAL.diasTotal) * 100);

  return (
    <motion.main variants={lista} initial="hidden" animate="visible" className="flex-1 px-4 pt-6 pb-4">
      <motion.header variants={item} className="mb-6">
        <p className="text-[13px] font-medium text-[var(--text-tertiary)]">Tu novena</p>
        <h1 className="mt-1 text-balance text-[28px] font-bold leading-[1.1] text-[var(--text-primary)] [font-family:var(--font-display)]">
          {NOVENA_ACTUAL.nombre}
        </h1>
      </motion.header>

      <motion.section
        variants={item}
        className="flex items-center gap-5 rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--accent)_20%,transparent)] bg-[var(--surface)] p-6"
      >
        <div className="relative shrink-0">
          <AnilloProgresoApp pct={pct} size={72} />
          <span className="absolute inset-0 flex items-center justify-center text-[15px] font-bold tabular-nums text-[var(--text-primary)]">
            {pct}%
          </span>
        </div>
        <div className="min-w-0">
          <p className="text-[15px] font-semibold text-[var(--text-primary)]">
            Día {NOVENA_ACTUAL.diaActual} de {NOVENA_ACTUAL.diasTotal}
          </p>
          <p className="mt-1 text-[13px] leading-snug text-[var(--text-secondary)]">
            Vas por tu segunda novena completa. Sin fallar ni un día.
          </p>
        </div>
      </motion.section>

      <motion.section variants={item} className="mt-6" aria-label="Días de la novena">
        <h2 className="mb-3 text-[17px] font-semibold text-[var(--text-primary)]">Tu recorrido</h2>
        <ul className="flex flex-col gap-2">
          {NOVENA_ACTUAL.dias.map((d) => (
            <motion.li
              key={d.numero}
              variants={item}
              className={`flex items-center gap-3 rounded-[var(--radius-card)] border p-4 ${
                d.estado === 'hoy'
                  ? 'border-[var(--accent)] bg-[color-mix(in_oklab,var(--accent)_8%,transparent)]'
                  : 'border-[color-mix(in_oklab,var(--text-tertiary)_18%,transparent)] bg-[var(--surface)]'
              }`}
            >
              <span
                aria-hidden="true"
                className={`flex size-9 shrink-0 items-center justify-center rounded-full ${
                  d.estado === 'hecho'
                    ? 'bg-[var(--accent-2)] text-[var(--surface)]'
                    : d.estado === 'hoy'
                      ? 'border-2 border-[var(--accent)] text-[var(--accent)]'
                      : 'border border-[color-mix(in_oklab,var(--text-tertiary)_35%,transparent)] text-[var(--text-tertiary)]'
                }`}
              >
                {d.estado === 'hecho' ? <Check size={16} strokeWidth={3} /> : d.estado === 'hoy' ? <Flame size={16} /> : d.numero}
              </span>
              <span className="text-[15px] font-medium text-[var(--text-primary)]">Día {d.numero}</span>
              <span className="ml-auto text-[13px] text-[var(--text-secondary)]">
                {d.estado === 'hecho' ? 'Completado' : d.estado === 'hoy' ? 'Hoy' : 'Pendiente'}
              </span>
            </motion.li>
          ))}
        </ul>
      </motion.section>
    </motion.main>
  );
}
