'use client';

// Rosario guiado: un misterio por pantalla (cita bíblica + meditación + santo).
// Opcional y aparte de la Autopista de 3 Minutos — nunca bloquea el ritual diario.

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'motion/react';
import { BookOpen, ChevronLeft } from 'lucide-react';
import { CONJUNTOS, conjuntoDeHoy, type ConjuntoId } from '@/lib/rosario';

const ORDEN: ConjuntoId[] = ['gozosos', 'dolorosos', 'gloriosos', 'luminosos'];

export function RosarioCliente() {
  const router = useRouter();
  const [conjunto, setConjunto] = useState<ConjuntoId | null>(null);
  const [paso, setPaso] = useState(0);

  useEffect(() => {
    setConjunto(conjuntoDeHoy());
  }, []);

  if (!conjunto) return <main className="flex-1" />;

  const datos = CONJUNTOS[conjunto];
  const misterio = datos.misterios[paso];
  const ultimo = paso === datos.misterios.length - 1;

  const cambiarConjunto = (c: ConjuntoId) => {
    setConjunto(c);
    setPaso(0);
  };

  return (
    <main className="flex flex-1 flex-col px-4 pt-4 pb-4">
      <header className="mb-4 flex items-center gap-2">
        <button
          type="button"
          aria-label="Volver a Hoy"
          onClick={() => router.push('/app')}
          className="flex size-11 shrink-0 items-center justify-center text-[var(--text-secondary)] [touch-action:manipulation]"
        >
          <ChevronLeft size={22} aria-hidden="true" />
        </button>
        <div className="min-w-0">
          <p className="text-[13px] font-medium text-[var(--text-tertiary)]">Santo Rosario · {datos.dias}</p>
          <h1 className="text-[22px] font-bold leading-tight text-[var(--text-primary)] [font-family:var(--font-display)]">
            {datos.titulo}
          </h1>
        </div>
      </header>

      <div className="mb-4 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
        {ORDEN.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => cambiarConjunto(c)}
            aria-pressed={c === conjunto}
            className={`shrink-0 rounded-full border px-3 py-1.5 text-[13px] font-medium capitalize [touch-action:manipulation] ${
              c === conjunto
                ? 'border-[var(--accent)] bg-[color-mix(in_oklab,var(--accent)_12%,transparent)] text-[var(--accent-text)]'
                : 'border-[color-mix(in_oklab,var(--text-tertiary)_28%,transparent)] text-[var(--text-secondary)]'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="mb-4 flex gap-1.5" aria-label={`Misterio ${paso + 1} de 5`}>
        {datos.misterios.map((_, i) => (
          <span
            key={i}
            className={`h-1 flex-1 rounded-full ${
              i <= paso ? 'bg-[var(--accent)]' : 'bg-[color-mix(in_oklab,var(--text-tertiary)_22%,transparent)]'
            }`}
          />
        ))}
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.section
          key={`${conjunto}-${paso}`}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-1 flex-col rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--accent)_20%,transparent)] bg-[var(--surface)] p-6 shadow-[var(--shadow-2)]"
        >
          <p className="text-[13px] font-semibold uppercase tracking-[0.06em] text-[var(--accent-text)]">
            Misterio {paso + 1} de 5
          </p>

          {misterio.imagen && (
            <figure className="mt-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={misterio.imagen.src}
                alt={misterio.imagen.alt}
                className="aspect-[4/3] w-full rounded-[var(--radius-button)] object-cover"
              />
              <figcaption className="mt-1 text-[11px] text-[var(--text-tertiary)]">{misterio.imagen.credito}</figcaption>
            </figure>
          )}

          <h2 className="mt-3 text-balance text-[24px] font-semibold leading-[1.25] text-[var(--text-primary)] [font-family:var(--font-display)]">
            {misterio.nombre}
          </h2>
          <p className="mt-2 inline-flex w-fit items-center gap-1.5 rounded-full bg-[var(--chip-bg)] px-3 py-1 text-[13px] font-medium text-[var(--accent-text)]">
            <BookOpen size={14} aria-hidden="true" />
            {misterio.cita}
          </p>

          {misterio.meditacion ? (
            <p className="mt-4 text-[16px] leading-relaxed text-[var(--text-primary)]">{misterio.meditacion}</p>
          ) : (
            <p className="mt-4 text-[15px] leading-relaxed text-[var(--text-secondary)]">
              Lee el pasaje y medita este misterio. La meditación guiada de este misterio llega muy pronto.
            </p>
          )}

          {misterio.santo && (
            <p className="mt-4 border-l-2 border-[var(--accent)] pl-3 text-[14px] italic leading-relaxed text-[var(--text-secondary)]">
              {misterio.santo}
            </p>
          )}

          <p className="mt-auto pt-6 text-[13px] text-[var(--text-tertiary)]">
            Padre Nuestro · 10 Ave Marías · Gloria
          </p>
        </motion.section>
      </AnimatePresence>

      <div className="mt-4 flex gap-3">
        {paso > 0 && (
          <button
            type="button"
            onClick={() => setPaso(paso - 1)}
            className="h-14 rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--text-tertiary)_28%,transparent)] px-5 text-[15px] font-medium text-[var(--text-secondary)] [touch-action:manipulation]"
          >
            Atrás
          </button>
        )}
        <motion.button
          whileTap={{ scale: 0.97 }}
          type="button"
          onClick={() => (ultimo ? router.push('/app') : setPaso(paso + 1))}
          className="h-14 flex-1 rounded-[var(--radius-button)] bg-[var(--accent)] text-[16px] font-semibold text-[var(--on-accent-fill)] shadow-[0_10px_28px_color-mix(in_oklab,var(--accent)_30%,transparent)] [touch-action:manipulation]"
        >
          {ultimo ? 'Terminé mi rosario' : 'Siguiente misterio'}
        </motion.button>
      </div>
    </main>
  );
}
