'use client';

// PANTALLA SECUNDARIA — Novena. Progreso día a día visible de un vistazo (regla
// UX 15: estado con ícono, no solo color) + fechas reales de la novena en curso.
// Si no hay novena activa, el empty state ACTIVA (15): elegir una de verdad.

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, type Variants } from 'motion/react';
import { Check, Flame } from 'lucide-react';
import { AnilloProgresoApp } from '@/components/app/ui';
import { createClient } from '@/lib/supabase/client';

const lista: Variants = { hidden: {}, visible: { transition: { staggerChildren: 0.05 } } };
const item: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] } },
};

type EstadoDia = 'hecho' | 'hoy' | 'pendiente';

export interface NovenaActivaData {
  nombre: string;
  diaActual: number;
  diasTotal: number;
}

export interface NovenaDisponible {
  id: string;
  nombre: string;
  diasTotal: number;
}

function Progreso({ novena }: { novena: NovenaActivaData }) {
  const pct = Math.round((novena.diaActual / novena.diasTotal) * 100);
  const dias = Array.from({ length: novena.diasTotal }, (_, i) => {
    const numero = i + 1;
    const estado: EstadoDia = numero < novena.diaActual ? 'hecho' : numero === novena.diaActual ? 'hoy' : 'pendiente';
    return { numero, estado };
  });

  return (
    <motion.main variants={lista} initial="hidden" animate="visible" className="flex-1 px-4 pt-6 pb-4">
      <motion.header variants={item} className="mb-6">
        <p className="text-[13px] font-medium text-[var(--text-tertiary)]">Tu novena</p>
        <h1 className="mt-1 text-balance text-[28px] font-bold leading-[1.1] text-[var(--text-primary)] [font-family:var(--font-display)]">
          {novena.nombre}
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
            Día {novena.diaActual} de {novena.diasTotal}
          </p>
          <p className="mt-1 text-[13px] leading-snug text-[var(--text-secondary)]">Sin fallar ni un día.</p>
        </div>
      </motion.section>

      <motion.section variants={item} className="mt-6" aria-label="Días de la novena">
        <h2 className="mb-3 text-[17px] font-semibold text-[var(--text-primary)]">Tu recorrido</h2>
        <ul className="flex flex-col gap-2">
          {dias.map((d) => (
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

function Elegir({ disponibles }: { disponibles: NovenaDisponible[] }) {
  const router = useRouter();
  const [eligiendo, setEligiendo] = useState<string | null>(null);

  const elegir = async (novenaId: string) => {
    setEligiendo(novenaId);
    const supabase = createClient();
    const { data: userData } = await supabase.auth.getUser();
    if (userData.user) {
      await supabase.from('novena_participation').insert({ user_id: userData.user.id, novena_id: novenaId });
      router.refresh();
    }
    setEligiendo(null);
  };

  return (
    <motion.main variants={lista} initial="hidden" animate="visible" className="flex-1 px-4 pt-6 pb-4">
      <motion.header variants={item} className="mb-6">
        <p className="text-[13px] font-medium text-[var(--text-tertiary)]">Tu novena</p>
        <h1 className="mt-1 text-balance text-[28px] font-bold leading-[1.1] text-[var(--text-primary)] [font-family:var(--font-display)]">
          Elige tu primera novena
        </h1>
        <p className="mt-2 text-[14px] text-[var(--text-secondary)]">9 días guiados, sin fallar ni uno.</p>
      </motion.header>
      <motion.ul variants={item} className="flex flex-col gap-3">
        {disponibles.map((n) => (
          <li key={n.id}>
            <motion.button
              whileTap={{ scale: 0.98 }}
              disabled={eligiendo !== null}
              onClick={() => elegir(n.id)}
              className="flex w-full items-center justify-between gap-3 rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--text-tertiary)_22%,transparent)] bg-[var(--surface)] p-4 text-left [touch-action:manipulation] disabled:opacity-60"
            >
              <span className="text-[15px] font-medium text-[var(--text-primary)]">{n.nombre}</span>
              <span className="text-[13px] text-[var(--text-secondary)]">
                {eligiendo === n.id ? 'Empezando…' : `${n.diasTotal} días`}
              </span>
            </motion.button>
          </li>
        ))}
      </motion.ul>
    </motion.main>
  );
}

export function NovenaCliente({
  activa,
  disponibles,
}: {
  activa: NovenaActivaData | null;
  disponibles: NovenaDisponible[];
}) {
  return activa ? <Progreso novena={activa} /> : <Elegir disponibles={disponibles} />;
}
