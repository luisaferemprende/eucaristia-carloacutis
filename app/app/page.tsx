'use client';

// PANTALLA PRINCIPAL (M0) — la más vista de la app (56/32). Composición copiada
// del ejemplo canónico (53): header con fecha real → héroe con dato animado +
// next-best-action → lista de valor → microcopy de confianza → nav al fondo.
// Datos semilla de lib/demo-data.ts (32: nunca se enseña vacía).

import { useState } from 'react';
import { motion, type Variants } from 'motion/react';
import { BookHeart, Check, ChevronRight, Flame, Sparkles } from 'lucide-react';
import { AnilloProgresoApp, CountUp, saludoPorHora } from '@/components/app/ui';
import { CONTENIDO_HOY, DIARIO_DEMO, NOVENA_ACTUAL, USUARIO_DEMO } from '@/lib/demo-data';

const lista: Variants = { hidden: {}, visible: { transition: { staggerChildren: 0.07 } } };
const item: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } },
};

// Fecha en español con SOLO la primera letra en mayúscula ("Sábado, 26 de
// septiembre") — Tailwind `capitalize` capitaliza cada palabra, incluida la
// preposición "de" (hallazgo real del revisor-visual).
function fechaCorta(d: Date): string {
  const f = new Intl.DateTimeFormat('es', { weekday: 'long', day: 'numeric', month: 'long' }).format(d);
  return f.charAt(0).toUpperCase() + f.slice(1);
}

// Trunca en el último espacio antes del límite — nunca a media palabra.
function truncarPalabra(texto: string, maxChars: number): string {
  if (texto.length <= maxChars) return texto;
  const corte = texto.slice(0, maxChars);
  const ultimoEspacio = corte.lastIndexOf(' ');
  return `${corte.slice(0, ultimoEspacio > 0 ? ultimoEspacio : maxChars)}…`;
}

export default function Hoy() {
  const [hecho, setHecho] = useState(false);
  const ahora = new Date();
  const fecha = fechaCorta(ahora);
  const pctNovena = Math.round((NOVENA_ACTUAL.diaActual / NOVENA_ACTUAL.diasTotal) * 100);
  const ultimaEntrada = DIARIO_DEMO[0];

  return (
    <motion.main variants={lista} initial="hidden" animate="visible" className="flex-1 px-4 pt-6 pb-4">
      {/* ——— HEADER: fecha real + saludo + racha (badge, no el héroe) ——— */}
      <motion.header variants={item} className="mb-6 flex items-end justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[13px] font-medium text-[var(--text-tertiary)]">{fecha}</p>
          <h1 className="mt-1 text-balance text-[28px] font-bold leading-[1.1] tracking-[-0.01em] text-[var(--text-primary)] [font-family:var(--font-display)]">
            {saludoPorHora(ahora.getHours())}, {USUARIO_DEMO.nombre}
          </h1>
        </div>
        <div
          className="flex shrink-0 items-center gap-1.5 rounded-full bg-[color-mix(in_oklab,var(--accent)_14%,transparent)] px-3 py-1.5"
          aria-label={`Racha de ${USUARIO_DEMO.racha} días`}
        >
          <Flame size={16} color="var(--accent)" aria-hidden="true" />
          <span className="text-[14px] font-bold tabular-nums text-[var(--accent-text)]">
            <CountUp value={USUARIO_DEMO.racha} />
          </span>
        </div>
      </motion.header>

      {/* ——— OBJETO PRINCIPAL: el pensamiento de hoy — el valor central de la app ——— */}
      <motion.section
        variants={item}
        aria-label="El pensamiento de hoy"
        className="relative overflow-hidden rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--accent)_20%,transparent)] bg-[var(--surface)] p-6 shadow-[var(--shadow-2)]"
      >
        {/* Dispositivo ownable: halo de custodia detrás del pensamiento del día */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full"
          style={{ background: 'radial-gradient(circle, color-mix(in oklab, var(--accent) 12%, transparent) 0%, transparent 70%)' }}
        />
        <p className="text-[13px] font-semibold uppercase tracking-[0.06em] text-[var(--accent-text)]">
          El pensamiento de hoy · {CONTENIDO_HOY.santo.nombre}
        </p>
        <p className="mt-3 text-balance text-[22px] font-semibold leading-[1.35] text-[var(--text-primary)] [font-family:var(--font-display)]">
          &ldquo;{CONTENIDO_HOY.santo.cita}&rdquo;
        </p>
        <motion.button
          whileTap={{ scale: 0.97 }}
          type="button"
          onClick={() => setHecho((h) => !h)}
          aria-pressed={hecho}
          className={`mt-6 flex h-[52px] w-full items-center justify-center gap-2 rounded-[var(--radius-button)] text-[16px] font-semibold transition-colors duration-150 [touch-action:manipulation] ${
            hecho
              ? 'bg-[color-mix(in_oklab,var(--accent-2)_16%,transparent)] text-[var(--accent-2)]'
              : 'bg-[var(--accent)] text-[var(--on-accent-fill)] shadow-[0_10px_28px_color-mix(in_oklab,var(--accent)_30%,transparent)]'
          }`}
        >
          {hecho ? (
            <motion.span
              key="hecho"
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', bounce: 0.45, duration: 0.4 }}
              className="flex items-center gap-2"
            >
              <Check size={20} strokeWidth={3} aria-hidden="true" />
              Viviste tu Autopista de hoy
            </motion.span>
          ) : (
            'Vivir mis 3 minutos'
          )}
        </motion.button>
      </motion.section>

      {/* ——— MILAGRO DE HOY: segunda pieza del mecanismo ——— */}
      <motion.section
        variants={item}
        aria-label="El milagro eucarístico de hoy"
        className="mt-4 flex items-start gap-3 rounded-[var(--radius-card)] bg-[var(--surface-2)] p-5"
      >
        <span
          aria-hidden="true"
          className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--accent-2)_14%,transparent)]"
        >
          <Sparkles size={20} color="var(--accent-2)" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p className="text-[13px] font-semibold text-[var(--text-secondary)]">Milagro eucarístico de hoy</p>
          <p className="mt-0.5 text-[15px] font-medium leading-snug text-[var(--text-primary)]">
            {CONTENIDO_HOY.milagro.lugar}
          </p>
          <p className="mt-1 text-[13px] leading-snug text-[var(--text-secondary)]">
            {CONTENIDO_HOY.milagro.resumen}
          </p>
        </div>
      </motion.section>

      {/* ——— NOVENA EN CURSO: teaser con anillo real, lleva a la pestaña Novena ——— */}
      <motion.a
        href="/app/novena"
        variants={item}
        whileTap={{ scale: 0.98 }}
        className="mt-4 flex items-center gap-4 rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--text-tertiary)_20%,transparent)] bg-[var(--surface)] p-5 [touch-action:manipulation]"
      >
        <AnilloProgresoApp pct={pctNovena} size={52} />
        <div className="min-w-0 flex-1">
          <p className="text-[15px] font-semibold text-[var(--text-primary)]">{NOVENA_ACTUAL.nombre}</p>
          <p className="mt-0.5 text-[13px] text-[var(--text-secondary)]">
            Día {NOVENA_ACTUAL.diaActual} de {NOVENA_ACTUAL.diasTotal} · sin fallar ni un día
          </p>
        </div>
        <ChevronRight size={20} color="var(--text-tertiary)" aria-hidden="true" className="shrink-0" />
      </motion.a>

      {/* ——— DIARIO: última entrada + acceso rápido ——— */}
      <motion.a
        href="/app/diario"
        variants={item}
        whileTap={{ scale: 0.98 }}
        className="mt-4 flex items-start gap-3 rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--text-tertiary)_20%,transparent)] bg-[var(--surface)] p-5 [touch-action:manipulation]"
      >
        <span
          aria-hidden="true"
          className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[var(--chip-bg)]"
        >
          <BookHeart size={20} color="var(--accent)" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[15px] font-semibold text-[var(--text-primary)]">Tu diario espiritual</p>
          <p className="mt-0.5 overflow-hidden text-[13px] whitespace-nowrap text-[var(--text-secondary)]">
            &ldquo;{truncarPalabra(ultimaEntrada.texto, 28)}&rdquo;
          </p>
        </div>
        <ChevronRight size={20} color="var(--text-tertiary)" aria-hidden="true" className="shrink-0" />
      </motion.a>

      <motion.p variants={item} className="mt-6 text-center text-[13px] text-[var(--text-tertiary)]">
        Tu diario y tu racha viven solo en tu cuenta.
      </motion.p>
    </motion.main>
  );
}
