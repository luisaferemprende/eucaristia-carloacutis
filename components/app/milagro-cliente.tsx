'use client';

// Historia completa del milagro eucarístico del día. Lectura tranquila:
// lugar, relato en párrafos, lo que dice la Iglesia y la fuente citada.

import { useRouter } from 'next/navigation';
import { motion, type Variants } from 'motion/react';
import { BookOpenCheck, ChevronLeft, MapPin, Sparkles } from 'lucide-react';
import type { ContenidoDiario } from '@/lib/contenido-hoy';

const lista: Variants = { hidden: {}, visible: { transition: { staggerChildren: 0.07 } } };
const item: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } },
};

export function MilagroCliente({ contenido }: { contenido: ContenidoDiario | null }) {
  const router = useRouter();
  const volver = () => router.push('/app');

  if (!contenido) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <p className="text-[22px] font-semibold text-[var(--text-primary)] [font-family:var(--font-display)]">
          Hoy todavía estamos preparando el milagro
        </p>
        <button
          type="button"
          onClick={volver}
          className="mt-6 h-14 rounded-[var(--radius-button)] bg-[var(--accent)] px-8 text-[16px] font-semibold text-[var(--on-accent-fill)] [touch-action:manipulation]"
        >
          Volver a Hoy
        </button>
      </main>
    );
  }

  const parrafos = (contenido.milagro_historia ?? contenido.milagro_resumen).split('\n\n').filter(Boolean);
  const ultimo = parrafos.length > 1 ? parrafos[parrafos.length - 1] : null;
  const relato = ultimo ? parrafos.slice(0, -1) : parrafos;

  return (
    <motion.main variants={lista} initial="hidden" animate="visible" className="flex-1 px-4 pt-4 pb-6">
      <motion.header variants={item} className="mb-4 flex items-center gap-2">
        <button
          type="button"
          aria-label="Volver a Hoy"
          onClick={volver}
          className="flex size-11 shrink-0 items-center justify-center text-[var(--text-secondary)] [touch-action:manipulation]"
        >
          <ChevronLeft size={22} aria-hidden="true" />
        </button>
        <div className="min-w-0">
          <p className="text-[13px] font-medium text-[var(--text-tertiary)]">Milagro eucarístico de hoy</p>
          <h1 className="text-[22px] font-bold leading-tight text-[var(--text-primary)] [font-family:var(--font-display)]">
            {contenido.milagro_lugar}
          </h1>
        </div>
      </motion.header>

      <motion.section
        variants={item}
        className="relative overflow-hidden rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--accent)_20%,transparent)] bg-[var(--surface)] p-6 shadow-[var(--shadow-2)]"
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full"
          style={{ background: 'radial-gradient(circle, color-mix(in oklab, var(--accent) 12%, transparent) 0%, transparent 70%)' }}
        />
        <div className="relative flex items-center gap-3">
          <span
            aria-hidden="true"
            className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--accent-2)_14%,transparent)]"
          >
            <Sparkles size={20} color="var(--accent-2)" />
          </span>
          <p className="inline-flex items-center gap-1.5 rounded-full bg-[var(--chip-bg)] px-3 py-1 text-[13px] font-medium text-[var(--accent-text)]">
            <MapPin size={14} aria-hidden="true" />
            {contenido.milagro_lugar}
          </p>
        </div>
        <p className="relative mt-4 text-balance text-[22px] font-semibold leading-[1.35] text-[var(--text-primary)] [font-family:var(--font-display)]">
          {contenido.milagro_resumen}
        </p>
      </motion.section>

      <motion.section variants={item} aria-label="La historia" className="mt-6 space-y-4 px-1">
        {relato.map((p, i) => (
          <p key={i} className="text-[16px] leading-relaxed text-[var(--text-primary)]">
            {p}
          </p>
        ))}
      </motion.section>

      {ultimo && (
        <motion.aside
          variants={item}
          className="mt-6 flex items-start gap-3 rounded-[var(--radius-card)] bg-[var(--surface-2)] p-5"
        >
          <BookOpenCheck size={22} color="var(--accent-2)" aria-hidden="true" className="mt-0.5 shrink-0" />
          <div>
            <p className="text-[13px] font-semibold text-[var(--text-secondary)]">Lo que dice la Iglesia</p>
            <p className="mt-1 text-[15px] leading-relaxed text-[var(--text-primary)]">{ultimo}</p>
          </div>
        </motion.aside>
      )}

      {contenido.milagro_fuente && (
        <motion.p variants={item} className="mt-4 px-1 text-[13px] leading-snug text-[var(--text-tertiary)]">
          Fuente: {contenido.milagro_fuente}
        </motion.p>
      )}

      <motion.button
        variants={item}
        whileTap={{ scale: 0.97 }}
        type="button"
        onClick={volver}
        className="mt-6 h-14 w-full rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--text-tertiary)_28%,transparent)] text-[15px] font-medium text-[var(--text-secondary)] [touch-action:manipulation]"
      >
        Volver a Hoy
      </motion.button>
    </motion.main>
  );
}
