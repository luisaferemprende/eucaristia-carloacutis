'use client';

// LA AUTOPISTA DE 3 MINUTOS, guiada: 1) el pensamiento de un santo, 2) un
// milagro eucarístico, 3) la micro-preparación para comulgar. Al terminar se
// registra el día de verdad (RPC `marcar_hoy_hecho` con la fecha LOCAL) y se
// celebra con la racha. Nada se registra antes de llegar al final.

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'motion/react';
import { BookHeart, Check, ChevronLeft, Flame, Quote, Sparkles } from 'lucide-react';
import { CountUp } from '@/components/app/ui';
import { RetratoSanto } from '@/components/app/emblema-eucaristico';
import { createClient } from '@/lib/supabase/client';
import { fechaLocalISO, type ContenidoDiario } from '@/lib/contenido-hoy';

type Fase = 'leyendo' | 'guardando' | 'error' | 'celebracion';

const TITULOS = ['Un santo te habla', 'Un milagro de hoy', 'Prepárate para comulgar'] as const;

const EASE = [0.16, 1, 0.3, 1] as const;

export function VivirCliente({
  contenido,
  rachaActual,
  fechasHechas,
}: {
  contenido: ContenidoDiario | null;
  rachaActual: number;
  fechasHechas: string[];
}) {
  const router = useRouter();
  const [paso, setPaso] = useState(0);
  const [fase, setFase] = useState<Fase>('leyendo');
  const [racha, setRacha] = useState(rachaActual);
  // El día "hecho" se decide con la fecha LOCAL (el servidor corre en UTC).
  const [yaHecho] = useState(() => fechasHechas.includes(fechaLocalISO()));

  const volver = () => router.push('/app');

  const terminar = async () => {
    if (yaHecho) return volver();
    if (fase === 'guardando') return;
    setFase('guardando');
    const supabase = createClient();
    const { data, error } = await supabase.rpc('marcar_hoy_hecho', { p_fecha: fechaLocalISO() });
    if (error) {
      setFase('error');
      return;
    }
    setRacha((data as { racha_actual: number } | null)?.racha_actual ?? rachaActual + 1);
    setFase('celebracion');
  };

  if (!contenido) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <p className="text-[22px] font-semibold text-[var(--text-primary)] [font-family:var(--font-display)]">
          Hoy todavía estamos preparando tu contenido
        </p>
        <p className="mt-2 text-[15px] text-[var(--text-secondary)]">Vuelve en un rato — tu racha te espera.</p>
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

  if (fase === 'celebracion') {
    return (
      <main className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-6 text-center">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/4 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ background: 'radial-gradient(circle, color-mix(in oklab, var(--accent) 22%, transparent) 0%, transparent 70%)' }}
        />
        <motion.span
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', bounce: 0.5, duration: 0.6 }}
          className="relative flex size-24 items-center justify-center rounded-full bg-[var(--accent)] text-[var(--on-accent-fill)] shadow-[0_16px_40px_color-mix(in_oklab,var(--accent)_35%,transparent)]"
        >
          <Check size={44} strokeWidth={3} aria-hidden="true" />
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.35, ease: EASE }}
          className="relative mt-8 text-balance text-[28px] font-bold leading-[1.15] text-[var(--text-primary)] [font-family:var(--font-display)]"
        >
          Viviste tu Autopista de hoy
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.35, ease: EASE }}
          className="relative mt-4 flex items-center gap-2 rounded-full bg-[color-mix(in_oklab,var(--accent)_14%,transparent)] px-4 py-2"
          aria-label={`Racha de ${racha} días`}
        >
          <Flame size={20} color="var(--accent)" aria-hidden="true" />
          <span className="text-[18px] font-bold text-[var(--accent-text)]">
            <CountUp value={racha} /> {racha === 1 ? 'día seguido' : 'días seguidos'}
          </span>
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55 }}
          className="relative mt-4 max-w-xs text-[15px] leading-relaxed text-[var(--text-secondary)]"
        >
          Lleva contigo lo de hoy. Si quieres, escríbelo en tu diario antes de que se te olvide.
        </motion.p>
        <div className="relative mt-8 flex w-full flex-col gap-3">
          <motion.button
            whileTap={{ scale: 0.97 }}
            type="button"
            onClick={() => router.push('/app/diario')}
            className="flex h-14 items-center justify-center gap-2 rounded-[var(--radius-button)] bg-[var(--accent)] text-[16px] font-semibold text-[var(--on-accent-fill)] shadow-[0_10px_28px_color-mix(in_oklab,var(--accent)_30%,transparent)] [touch-action:manipulation]"
          >
            <BookHeart size={20} aria-hidden="true" />
            Escribir en mi diario
          </motion.button>
          <button
            type="button"
            onClick={volver}
            className="h-14 rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--text-tertiary)_28%,transparent)] text-[15px] font-medium text-[var(--text-secondary)] [touch-action:manipulation]"
          >
            Volver a Hoy
          </button>
        </div>
      </main>
    );
  }

  const ultimo = paso === TITULOS.length - 1;
  const parrafosMilagro = (contenido.milagro_historia ?? contenido.milagro_resumen).split('\n\n').filter(Boolean);
  const pasosPreparacion = (contenido.preparacion ?? '').split('\n').filter(Boolean);

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
          <p className="text-[13px] font-medium text-[var(--text-tertiary)]">
            Paso {paso + 1} de {TITULOS.length}
          </p>
          <h1 className="text-[22px] font-bold leading-tight text-[var(--text-primary)] [font-family:var(--font-display)]">
            {TITULOS[paso]}
          </h1>
        </div>
      </header>

      <div className="mb-4 flex gap-2" role="progressbar" aria-valuemin={1} aria-valuemax={3} aria-valuenow={paso + 1}>
        {TITULOS.map((_, i) => (
          <span
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
              i <= paso ? 'bg-[var(--accent)]' : 'bg-[color-mix(in_oklab,var(--text-tertiary)_22%,transparent)]'
            }`}
          />
        ))}
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.section
          key={paso}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16 }}
          transition={{ duration: 0.25, ease: EASE }}
          className="relative flex flex-1 flex-col overflow-hidden rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--accent)_20%,transparent)] bg-[var(--surface)] p-6 shadow-[var(--shadow-2)]"
        >
          {/* Dispositivo ownable: halo de custodia */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full"
            style={{ background: 'radial-gradient(circle, color-mix(in oklab, var(--accent) 12%, transparent) 0%, transparent 70%)' }}
          />

          {paso === 0 && (
            <>
              <div className="relative flex flex-col items-center text-center">
                <RetratoSanto
                  url={contenido.santo_imagen_url}
                  alt={contenido.santo_imagen_alt}
                  className="h-[160px] w-[136px]"
                />
                <p className="mt-4 text-[13px] font-semibold uppercase tracking-[0.06em] text-[var(--accent-text)]">
                  {contenido.santo_nombre}
                </p>
              </div>
              <Quote size={28} color="var(--accent)" aria-hidden="true" className="relative mt-4" />
              <p className="relative mt-2 text-balance text-[24px] font-semibold leading-[1.35] text-[var(--text-primary)] [font-family:var(--font-display)]">
                {contenido.pensamiento}
              </p>
              {contenido.pregunta_dia && (
                <div className="relative mt-6 rounded-[var(--radius-button)] bg-[var(--surface-2)] p-4">
                  <p className="text-[13px] font-semibold text-[var(--text-secondary)]">Para llevarte hoy</p>
                  <p className="mt-1 text-[16px] leading-relaxed text-[var(--text-primary)]">{contenido.pregunta_dia}</p>
                </div>
              )}
            </>
          )}

          {paso === 1 && (
            <>
              <p className="relative inline-flex w-fit items-center gap-1.5 rounded-full bg-[var(--chip-bg)] px-3 py-1 text-[13px] font-medium text-[var(--accent-text)]">
                <Sparkles size={14} aria-hidden="true" />
                {contenido.milagro_lugar}
              </p>
              <div className="relative mt-4 space-y-4">
                {parrafosMilagro.map((p, i) => (
                  <p key={i} className="text-[16px] leading-relaxed text-[var(--text-primary)]">
                    {p}
                  </p>
                ))}
              </div>
              {contenido.milagro_fuente && (
                <p className="relative mt-auto pt-6 text-[13px] text-[var(--text-tertiary)]">
                  Fuente: {contenido.milagro_fuente}
                </p>
              )}
            </>
          )}

          {paso === 2 && (
            <>
              <p className="relative text-[16px] leading-relaxed text-[var(--text-secondary)]">
                Un minuto antes de comulgar cambia cómo la recibes. Hazlo despacio:
              </p>
              <ol className="relative mt-5 space-y-4">
                {pasosPreparacion.map((texto, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--accent)_16%,transparent)] text-[14px] font-bold text-[var(--accent-text)]">
                      {i + 1}
                    </span>
                    <p className="pt-0.5 text-[16px] leading-relaxed text-[var(--text-primary)]">{texto}</p>
                  </li>
                ))}
              </ol>
            </>
          )}
        </motion.section>
      </AnimatePresence>

      {fase === 'error' && (
        <p role="alert" className="mt-3 text-center text-[13px] text-[var(--danger)]">
          No pudimos guardar tu día. Revisa tu conexión y vuelve a tocar el botón.
        </p>
      )}

      {/* Barra de acción pegada sobre el nav: el texto del milagro es largo y el botón nunca queda fuera de vista */}
      <div className="sticky bottom-16 -mx-4 mt-4 flex gap-3 bg-[var(--bg)] px-4 pt-3 pb-3 shadow-[0_-8px_16px_var(--bg)]">
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
          disabled={fase === 'guardando'}
          onClick={() => (ultimo ? terminar() : setPaso(paso + 1))}
          className={`h-14 flex-1 rounded-[var(--radius-button)] bg-[var(--accent)] text-[16px] font-semibold text-[var(--on-accent-fill)] shadow-[0_10px_28px_color-mix(in_oklab,var(--accent)_30%,transparent)] transition-opacity [touch-action:manipulation] ${
            fase === 'guardando' ? 'opacity-60' : ''
          }`}
        >
          {ultimo ? (fase === 'guardando' ? 'Guardando…' : yaHecho ? 'Volver a Hoy' : 'Terminé mis 3 minutos') : 'Siguiente'}
        </motion.button>
      </div>
    </main>
  );
}
