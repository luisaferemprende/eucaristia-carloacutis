'use client';

// Rosario guiado: un misterio por pantalla (cita bíblica + meditación).
// Opcional y aparte de la Autopista de 3 Minutos — nunca bloquea el ritual diario.
// Al terminar, se gana una rosa REAL en la Corona (tabla `rosario_dias`).

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'motion/react';
import { BookOpen, ChevronLeft, Flower2 } from 'lucide-react';
import { CoronaDeRosas } from '@/components/app/corona-de-rosas';
import { createClient } from '@/lib/supabase/client';
import { fechaLocalISO } from '@/lib/contenido-hoy';
import { CONJUNTOS, conjuntoDeHoy, type ConjuntoId } from '@/lib/rosario';

const ORDEN: ConjuntoId[] = ['gozosos', 'dolorosos', 'gloriosos', 'luminosos'];

export function RosarioCliente({ diasRezados }: { diasRezados: string[] }) {
  const router = useRouter();
  const [conjunto, setConjunto] = useState<ConjuntoId | null>(null);
  const [paso, setPaso] = useState(0);
  const [celebrando, setCelebrando] = useState(false);
  const [diasConHoy, setDiasConHoy] = useState(diasRezados);

  useEffect(() => {
    setConjunto(conjuntoDeHoy());
  }, []);

  const volver = () => router.push('/app');

  useEffect(() => {
    if (!celebrando) return;
    const t = setTimeout(volver, 2200);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [celebrando]);

  if (celebrando) {
    return (
      <main
        role="status"
        aria-live="polite"
        onClick={volver}
        className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-6 text-center [touch-action:manipulation]"
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ background: 'radial-gradient(circle, color-mix(in oklab, var(--accent) 24%, transparent) 0%, transparent 70%)' }}
        />
        <motion.span
          initial={{ scale: 0.3, rotate: -20, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{ type: 'spring', bounce: 0.5, duration: 0.7 }}
          className="relative flex size-24 items-center justify-center rounded-full bg-[var(--accent)] text-[var(--on-accent-fill)] shadow-[0_16px_40px_color-mix(in_oklab,var(--accent)_35%,transparent)]"
        >
          <Flower2 size={44} strokeWidth={2.2} aria-hidden="true" />
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.35 }}
          className="relative mt-8 text-balance text-[26px] font-bold leading-[1.2] text-[var(--text-primary)] [font-family:var(--font-display)]"
        >
          Le entregaste tu rosa de hoy a María
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.3 }}
          className="relative mt-2 text-[15px] text-[var(--text-secondary)]"
        >
          Tu Corona sigue floreciendo.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.3 }}
          className="relative mt-6"
        >
          <CoronaDeRosas diasRezados={diasConHoy} size={180} />
        </motion.div>
      </main>
    );
  }

  if (!conjunto) return <main className="flex-1" />;

  const datos = CONJUNTOS[conjunto];
  const misterio = datos.misterios[paso];
  const ultimo = paso === datos.misterios.length - 1;

  const cambiarConjunto = (c: ConjuntoId) => {
    setConjunto(c);
    setPaso(0);
  };

  const terminarRosario = async () => {
    const hoy = fechaLocalISO();
    if (!diasConHoy.includes(hoy)) {
      const supabase = createClient();
      const { data: userData } = await supabase.auth.getUser();
      if (userData.user) {
        await supabase.from('rosario_dias').upsert({ user_id: userData.user.id, fecha: hoy }, { onConflict: 'user_id,fecha' });
      }
      setDiasConHoy((d) => [...d, hoy]);
    }
    setCelebrando(true);
  };

  return (
    <main className="flex flex-1 flex-col px-4 pt-4 pb-4">
      <header className="mb-4 flex items-center gap-2">
        <button
          type="button"
          aria-label="Volver a Hoy"
          onClick={volver}
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
          className="flex flex-1 flex-col overflow-hidden rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--accent)_20%,transparent)] bg-[var(--surface)] p-6 shadow-[var(--shadow-2)]"
        >
          <p className="text-[13px] font-semibold uppercase tracking-[0.06em] text-[var(--accent-text)]">
            Misterio {paso + 1} de 5
          </p>

          {/* Encuadre limpio y completo — sin barras difuminadas a los lados */}
          <figure className="mt-4">
            <div className="overflow-hidden rounded-[var(--radius-button)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={misterio.imagen.src} alt={misterio.imagen.alt} className="aspect-[4/5] w-full object-cover" />
            </div>
            <figcaption className="mt-1 text-[11px] text-[var(--text-tertiary)]">{misterio.imagen.credito}</figcaption>
          </figure>

          <h2 className="mt-3 text-balance text-[24px] font-semibold leading-[1.25] text-[var(--text-primary)] [font-family:var(--font-display)]">
            {misterio.nombre}
          </h2>
          <p className="mt-2 inline-flex w-fit items-center gap-1.5 rounded-full bg-[var(--chip-bg)] px-3 py-1 text-[13px] font-medium text-[var(--accent-text)]">
            <BookOpen size={14} aria-hidden="true" />
            {misterio.cita}
          </p>

          <p className="mt-4 text-[15px] leading-relaxed text-[var(--text-secondary)]">{misterio.escena}</p>

          <div className="mt-4 rounded-[var(--radius-button)] bg-[var(--surface-2)] p-4">
            <p className="text-[13px] font-semibold text-[var(--text-secondary)]">Para meditar</p>
            <p className="mt-1 text-[16px] leading-relaxed text-[var(--text-primary)]">{misterio.meditacion}</p>
          </div>

          <p className="mt-3 border-l-2 border-[var(--accent)] pl-3 text-[14px] leading-relaxed text-[var(--text-secondary)]">
            <span className="font-semibold text-[var(--accent-text)]">Puedes pedir: </span>
            {misterio.pide}
          </p>

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
          onClick={() => (ultimo ? terminarRosario() : setPaso(paso + 1))}
          className="h-14 flex-1 rounded-[var(--radius-button)] bg-[var(--accent)] text-[16px] font-semibold text-[var(--on-accent-fill)] shadow-[0_10px_28px_color-mix(in_oklab,var(--accent)_30%,transparent)] [touch-action:manipulation]"
        >
          {ultimo ? 'Terminé mi rosario' : 'Siguiente misterio'}
        </motion.button>
      </div>
    </main>
  );
}
