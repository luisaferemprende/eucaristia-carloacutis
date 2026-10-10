'use client';

// PARTE INTERACTIVA de la pantalla Hoy — recibe datos YA cargados por el
// Server Component (app/app/page.tsx). El botón principal abre la experiencia
// guiada de 3 minutos (/app/vivir), que es la que registra el día de verdad.

import { useEffect, useState } from 'react';
import { motion, type Variants } from 'motion/react';
import { BookHeart, Check, ChevronRight, Flame, Flower2, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { AnilloProgresoApp, CountUp, saludoPorHora } from '@/components/app/ui';
import { RetratoSanto } from '@/components/app/emblema-eucaristico';
import { fechaLocalISO } from '@/lib/contenido-hoy';
import { CONJUNTOS, conjuntoDeHoy, type ConjuntoId } from '@/lib/rosario';

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

export interface HoyData {
  nombre: string;
  racha: number;
  fechasHechas: string[];
  santoNombre: string;
  santoImagenUrl: string | null;
  santoImagenAlt: string | null;
  pensamiento: string;
  milagroLugar: string;
  milagroResumen: string;
  novena: { nombre: string; diasHechos: number; diasTotal: number } | null;
  ultimaEntradaDiario: string | null;
  /** Días reales (de los últimos 7) con el Rosario rezado — Corona de Rosas. */
  rosasEstaSemana: number;
}

export function HoyCliente(d: HoyData) {
  const router = useRouter();
  // "Hoy" se decide con la fecha LOCAL del dispositivo (el servidor está en UTC).
  const [hecho, setHecho] = useState(false);
  useEffect(() => setHecho(d.fechasHechas.includes(fechaLocalISO())), [d.fechasHechas]);
  // El día de la semana se lee en el dispositivo (el servidor está en otra zona horaria).
  const [conjuntoHoy, setConjuntoHoy] = useState<ConjuntoId | null>(null);
  useEffect(() => setConjuntoHoy(conjuntoDeHoy()), []);
  const ahora = new Date();
  const fecha = fechaCorta(ahora);
  const pctNovena = d.novena ? Math.round((d.novena.diasHechos / d.novena.diasTotal) * 100) : 0;

  const abrirTresMinutos = () => router.push('/app/vivir');

  return (
    <motion.main variants={lista} initial="hidden" animate="visible" className="relative flex-1 px-4 pt-6 pb-4">
      {/* Halo dorado detrás de la cabecera — calidez desde el primer segundo, sin tocar el texto */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-56"
        style={{
          background:
            'radial-gradient(560px 280px at 50% 0%, color-mix(in oklab, var(--accent) 6%, transparent) 0%, transparent 72%)',
        }}
      />
      {/* ——— HEADER: fecha real + saludo + racha (badge, no el héroe) ——— */}
      <motion.header variants={item} className="mb-6 flex items-end justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[13px] font-medium text-[var(--text-tertiary)]">{fecha}</p>
          <h1 className="mt-1 text-balance text-[28px] font-bold leading-[1.1] tracking-[-0.01em] text-[var(--text-primary)] [font-family:var(--font-display)]">
            {saludoPorHora(ahora.getHours())}, {d.nombre}
          </h1>
        </div>
        <div
          className="flex shrink-0 items-center gap-1.5 rounded-full bg-[color-mix(in_oklab,var(--accent)_14%,transparent)] px-3 py-1.5"
          aria-label={`Racha de ${d.racha} días`}
        >
          <Flame size={16} color="var(--accent)" aria-hidden="true" />
          <span className="text-[14px] font-bold tabular-nums text-[var(--accent-text)]">
            <CountUp value={d.racha} />
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
        <div className="relative flex items-start justify-between gap-4">
          <div className="min-w-0 pt-1">
            <p className="text-[13px] font-semibold uppercase tracking-[0.06em] text-[var(--accent-text)]">
              El pensamiento de hoy
            </p>
            <p className="mt-1 text-[17px] font-semibold leading-tight text-[var(--text-primary)] [font-family:var(--font-display)]">
              {d.santoNombre}
            </p>
          </div>
          <RetratoSanto url={d.santoImagenUrl} alt={d.santoImagenAlt} />
        </div>
        <p className="mt-4 text-balance text-[22px] font-semibold leading-[1.35] text-[var(--text-primary)] [font-family:var(--font-display)]">
          &ldquo;{d.pensamiento}&rdquo;
        </p>
        <motion.button
          whileTap={{ scale: 0.97 }}
          type="button"
          onClick={abrirTresMinutos}
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
      <motion.a
        href="/app/milagro"
        variants={item}
        whileTap={{ scale: 0.98 }}
        aria-label="Leer la historia del milagro eucarístico de hoy"
        className="mt-4 flex items-start gap-3 rounded-[var(--radius-card)] bg-[var(--surface-2)] p-5 [touch-action:manipulation]"
      >
        <span
          aria-hidden="true"
          className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--accent-2)_14%,transparent)]"
        >
          <Sparkles size={20} color="var(--accent-2)" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-semibold text-[var(--text-secondary)]">Milagro eucarístico de hoy</p>
          <p className="mt-0.5 text-[15px] font-medium leading-snug text-[var(--text-primary)]">{d.milagroLugar}</p>
          <p className="mt-1 text-[13px] leading-snug text-[var(--text-secondary)]">{d.milagroResumen}</p>
          <p className="mt-2 text-[13px] font-semibold text-[var(--accent-text)]">Leer la historia</p>
        </div>
        <ChevronRight size={20} color="var(--text-tertiary)" aria-hidden="true" className="mt-3 shrink-0" />
      </motion.a>

      {/* ——— NOVENA EN CURSO: teaser con anillo real, lleva a la pestaña Novena ——— */}
      {d.novena ? (
        <motion.a
          href="/app/novena"
          variants={item}
          whileTap={{ scale: 0.98 }}
          className="mt-4 flex items-center gap-4 rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--text-tertiary)_20%,transparent)] bg-[var(--surface)] p-5 [touch-action:manipulation]"
        >
          <AnilloProgresoApp pct={pctNovena} size={52} />
          <div className="min-w-0 flex-1">
            <p className="text-[15px] font-semibold text-[var(--text-primary)]">{d.novena.nombre}</p>
            <p className="mt-0.5 text-[13px] text-[var(--text-secondary)]">
              {d.novena.diasHechos === 0
                ? 'Empieza hoy tu día 1'
                : `${d.novena.diasHechos} de ${d.novena.diasTotal} días hechos`}
            </p>
          </div>
          <ChevronRight size={20} color="var(--text-tertiary)" aria-hidden="true" className="shrink-0" />
        </motion.a>
      ) : (
        <motion.a
          href="/app/novena"
          variants={item}
          whileTap={{ scale: 0.98 }}
          className="mt-4 flex items-center gap-4 rounded-[var(--radius-card)] border border-dashed border-[color-mix(in_oklab,var(--text-tertiary)_35%,transparent)] bg-[var(--surface)] p-5 [touch-action:manipulation]"
        >
          <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[var(--chip-bg)]">
            <Flame size={20} color="var(--accent)" aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[15px] font-semibold text-[var(--text-primary)]">Elige tu novena</p>
            <p className="mt-0.5 text-[13px] text-[var(--text-secondary)]">
              Empieza tu primera novena completa, 9 días guiados
            </p>
          </div>
          <ChevronRight size={20} color="var(--text-tertiary)" aria-hidden="true" className="shrink-0" />
        </motion.a>
      )}

      {/* ——— ROSARIO: misterios del día, opcional y aparte de los 3 minutos ——— */}
      {conjuntoHoy && (
        <motion.a
          href="/app/rosario"
          variants={item}
          whileTap={{ scale: 0.98 }}
          className="mt-4 flex items-center gap-3 rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--text-tertiary)_20%,transparent)] bg-[var(--surface)] p-5 [touch-action:manipulation]"
        >
          <span
            aria-hidden="true"
            className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[var(--chip-bg)]"
          >
            <Flower2 size={20} color="var(--accent)" aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[15px] font-semibold text-[var(--text-primary)]">Rosario de hoy</p>
            <p className="mt-0.5 text-[13px] text-[var(--text-secondary)]">
              {CONJUNTOS[conjuntoHoy].titulo} · 5 meditaciones
            </p>
          </div>
          <span
            aria-label={`${d.rosasEstaSemana} de 7 rosas esta semana`}
            className="flex shrink-0 items-center gap-1 rounded-full bg-[color-mix(in_oklab,var(--accent)_12%,transparent)] px-2 py-1 text-[12px] font-semibold text-[var(--accent-text)]"
          >
            <Flower2 size={12} aria-hidden="true" />
            {d.rosasEstaSemana}/7
          </span>
          <ChevronRight size={20} color="var(--text-tertiary)" aria-hidden="true" className="shrink-0" />
        </motion.a>
      )}

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
            {d.ultimaEntradaDiario ? `"${truncarPalabra(d.ultimaEntradaDiario, 28)}"` : 'Escribe tu primera entrada de hoy'}
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
