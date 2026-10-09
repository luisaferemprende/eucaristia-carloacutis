'use client';

// PANTALLA SECUNDARIA — Novena. Cada día trae su reflexión, oración y propósito;
// el botón "Terminé el día de hoy" avanza UN día por día (RPC `marcar_dia_novena`
// con la fecha local). Al día 9 aparece la tarjeta-premio del santo. Las tarjetas
// ya ganadas quedan guardadas aquí. Sin novena activa: elegir una de verdad.

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion, type Variants } from 'motion/react';
import { Check, ChevronDown, ChevronLeft, Flame, HandHeart, Lock, Sparkles } from 'lucide-react';
import { AnilloProgresoApp } from '@/components/app/ui';
import { TarjetaNovena } from '@/components/app/tarjeta-novena';
import { createClient } from '@/lib/supabase/client';
import { fechaLocalISO } from '@/lib/contenido-hoy';
import {
  ORACIONES_DE_SIEMPRE,
  fechaLarga,
  type NovenaActiva,
  type NovenaCompletada,
  type NovenaDisponible,
  type SantoNovena,
} from '@/lib/novena';

const lista: Variants = { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } };
const item: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] } },
};

interface PremioVisible {
  santo: SantoNovena;
  diasTotal: number;
  fecha: string | null;
}

/* ───────────────────────── Padre Nuestro, Ave María y Gloria ───────────────────────── */
function OracionesDeSiempre() {
  const [abierto, setAbierto] = useState(false);
  return (
    <div className="relative mt-3 overflow-hidden rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--text-tertiary)_22%,transparent)]">
      <button
        type="button"
        onClick={() => setAbierto(!abierto)}
        aria-expanded={abierto}
        className="flex w-full items-center gap-3 p-4 text-left [touch-action:manipulation]"
      >
        <span className="min-w-0 flex-1">
          <span className="block text-[13px] font-semibold text-[var(--text-secondary)]">Para terminar, reza</span>
          <span className="block text-[15px] text-[var(--text-primary)]">Padre Nuestro, Ave María y Gloria</span>
        </span>
        <ChevronDown
          size={18}
          color="var(--text-tertiary)"
          aria-hidden="true"
          className={`shrink-0 transition-transform duration-200 ${abierto ? 'rotate-180' : ''}`}
        />
      </button>
      <AnimatePresence initial={false}>
        {abierto && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="space-y-3 px-4 pb-4">
              {ORACIONES_DE_SIEMPRE.map((o) => (
                <div key={o.nombre}>
                  <p className="text-[13px] font-semibold text-[var(--accent-text)]">{o.nombre}</p>
                  <p className="mt-0.5 text-[14px] leading-relaxed text-[var(--text-primary)]">{o.texto}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ───────────────────────── Vista de la tarjeta-premio ───────────────────────── */
function VistaPremio({
  premio,
  nombrePersona,
  celebrando,
  onCerrar,
}: {
  premio: PremioVisible;
  nombrePersona: string;
  celebrando: boolean;
  onCerrar: () => void;
}) {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-1 flex-col px-4 pt-4 pb-6"
    >
      <header className="mb-4 flex items-center gap-2">
        <button
          type="button"
          aria-label="Volver a la novena"
          onClick={onCerrar}
          className="flex size-11 shrink-0 items-center justify-center text-[var(--text-secondary)] [touch-action:manipulation]"
        >
          <ChevronLeft size={22} aria-hidden="true" />
        </button>
        <div className="min-w-0">
          <p className="text-[13px] font-medium text-[var(--text-tertiary)]">
            {celebrando ? '¡Lo lograste!' : 'Tus tarjetas'}
          </p>
          <h1 className="text-[22px] font-bold leading-tight text-[var(--text-primary)] [font-family:var(--font-display)]">
            {celebrando ? 'Terminaste tu novena' : premio.santo.nombre}
          </h1>
        </div>
      </header>
      {celebrando && (
        <p className="mb-4 px-1 text-[15px] leading-relaxed text-[var(--text-secondary)]">
          Nueve días seguidos de oración no es poca cosa. Esta tarjeta es tuya: guárdala o compártela con quien quieras animar.
        </p>
      )}
      <TarjetaNovena santo={premio.santo} diasTotal={premio.diasTotal} fecha={premio.fecha} nombrePersona={nombrePersona} />
      <button
        type="button"
        onClick={onCerrar}
        className="mt-3 h-14 rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--text-tertiary)_28%,transparent)] text-[15px] font-medium text-[var(--text-secondary)] [touch-action:manipulation]"
      >
        {celebrando ? 'Continuar' : 'Volver'}
      </button>
    </motion.main>
  );
}

/* ───────────────────────── Novena en curso ───────────────────────── */
function Progreso({
  novena,
  nombrePersona,
  onCompletada,
}: {
  novena: NovenaActiva;
  nombrePersona: string;
  onCompletada: (p: PremioVisible) => void;
}) {
  const router = useRouter();
  const [hechoHoy, setHechoHoy] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState(false);
  const [abierto, setAbierto] = useState<number | null>(null);
  const [porQueAbierto, setPorQueAbierto] = useState(novena.diasHechos === 0);
  const [recienHecho, setRecienHecho] = useState<number | null>(null);

  useEffect(() => setHechoHoy(novena.ultimoDiaMarcado === fechaLocalISO()), [novena.ultimoDiaMarcado]);

  const hechos = novena.diasHechos;
  const pct = Math.round((hechos / novena.diasTotal) * 100);
  const diaDeHoy = novena.dias.find((d) => d.dia === novena.diaActual);
  const faltaAyer = !hechoHoy && hechos > 0 && novena.ultimoDiaMarcado !== null && novena.ultimoDiaMarcado < fechaAyer();

  const terminarDia = async () => {
    if (guardando || hechoHoy || !diaDeHoy) return;
    setGuardando(true);
    setError(false);
    const supabase = createClient();
    const { data, error: err } = await supabase.rpc('marcar_dia_novena', { p_fecha: fechaLocalISO() });
    setGuardando(false);
    if (err || !data) {
      setError(true);
      return;
    }
    const fila = data as { completada: boolean; completada_en: string | null };
    if (fila.completada) {
      onCompletada({ santo: novena.santo, diasTotal: novena.diasTotal, fecha: fila.completada_en ?? fechaLocalISO() });
      router.refresh();
      return;
    }
    setHechoHoy(true);
    setRecienHecho(diaDeHoy.dia);
    router.refresh();
  };

  return (
    <motion.main variants={lista} initial="hidden" animate="visible" className="flex-1 px-4 pt-6 pb-6">
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
            {hechos === 0 ? 'Empiezas hoy' : `${hechos} de ${novena.diasTotal} días hechos`}
          </p>
          <p className="mt-1 text-[13px] leading-snug text-[var(--text-secondary)]">
            {hechoHoy
              ? 'Hoy ya hiciste tu día. El siguiente se abre mañana.'
              : faltaAyer
                ? 'Retoma donde ibas: no pasa nada por un día de pausa.'
                : `Hoy toca el día ${novena.diaActual}.`}
          </p>
        </div>
      </motion.section>

      {/* ——— Por qué esta novena ——— */}
      {novena.porQue && (
        <motion.section
          variants={item}
          className="mt-4 overflow-hidden rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--text-tertiary)_20%,transparent)] bg-[var(--surface)]"
        >
          <button
            type="button"
            onClick={() => setPorQueAbierto(!porQueAbierto)}
            aria-expanded={porQueAbierto}
            className="flex w-full items-center gap-3 p-5 text-left [touch-action:manipulation]"
          >
            {novena.santo.imagenUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={novena.santo.imagenUrl}
                alt={novena.santo.imagenAlt ?? novena.santo.nombre}
                className="size-12 shrink-0 rounded-full object-cover object-[50%_20%]"
              />
            ) : (
              <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[var(--chip-bg)]">
                <Sparkles size={20} color="var(--accent)" aria-hidden="true" />
              </span>
            )}
            <span className="min-w-0 flex-1">
              <span className="block text-[15px] font-semibold text-[var(--text-primary)]">
                ¿Por qué esta novena con {novena.santo.nombre}?
              </span>
              <span className="mt-0.5 block text-[13px] text-[var(--text-secondary)]">Su historia y por qué te acompaña</span>
            </span>
            <ChevronDown
              size={20}
              color="var(--text-tertiary)"
              aria-hidden="true"
              className={`shrink-0 transition-transform duration-200 ${porQueAbierto ? 'rotate-180' : ''}`}
            />
          </button>
          <AnimatePresence initial={false}>
            {porQueAbierto && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden"
              >
                <div className="px-5 pb-5">
                  {novena.datos.length > 0 && (
                    <ul className="mb-4 flex flex-wrap gap-2">
                      {novena.datos.map((d) => (
                        <li key={d} className="rounded-full bg-[var(--chip-bg)] px-3 py-1 text-[13px] font-medium text-[var(--accent-text)]">
                          {d}
                        </li>
                      ))}
                    </ul>
                  )}
                  <div className="space-y-3">
                    {novena.porQue!.split('\n\n').map((p, i) => (
                      <p key={i} className="text-[15px] leading-relaxed text-[var(--text-primary)]">
                        {p}
                      </p>
                    ))}
                  </div>
                  {novena.santo.imagenCredito && (
                    <p className="mt-3 text-[11px] text-[var(--text-tertiary)]">{novena.santo.imagenCredito}</p>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>
      )}

      {/* ——— El día de hoy ——— */}
      {diaDeHoy && !hechoHoy && (
        <motion.section
          variants={item}
          aria-label={`Día ${diaDeHoy.dia}`}
          className="relative mt-4 overflow-hidden rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--accent)_28%,transparent)] bg-[var(--surface)] p-6 shadow-[var(--shadow-2)]"
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full"
            style={{ background: 'radial-gradient(circle, color-mix(in oklab, var(--accent) 12%, transparent) 0%, transparent 70%)' }}
          />
          <p className="relative text-[13px] font-semibold uppercase tracking-[0.06em] text-[var(--accent-text)]">
            Día {diaDeHoy.dia} de {novena.diasTotal}
          </p>
          <h2 className="relative mt-2 text-balance text-[24px] font-semibold leading-[1.25] text-[var(--text-primary)] [font-family:var(--font-display)]">
            {diaDeHoy.titulo}
          </h2>
          {diaDeHoy.entrada && (
            <p className="relative mt-3 border-l-2 border-[var(--accent)] pl-3 text-[15px] italic leading-relaxed text-[var(--text-secondary)]">
              {diaDeHoy.entrada}
            </p>
          )}
          <p className="relative mt-4 text-[16px] leading-relaxed text-[var(--text-primary)]">{diaDeHoy.reflexion}</p>
          <div className="relative mt-5 rounded-[var(--radius-button)] bg-[var(--surface-2)] p-4">
            <p className="text-[13px] font-semibold text-[var(--text-secondary)]">Oración a {novena.santo.nombre}</p>
            <p className="mt-1 text-[15px] italic leading-relaxed text-[var(--text-primary)]">{diaDeHoy.oracion}</p>
          </div>
          <OracionesDeSiempre />

          <div className="relative mt-3 flex items-start gap-3 rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--accent)_30%,transparent)] p-4">
            <HandHeart size={20} color="var(--accent-text)" aria-hidden="true" className="mt-0.5 shrink-0" />
            <div>
              <p className="text-[13px] font-semibold text-[var(--accent-text)]">Tu propósito de hoy</p>
              <p className="mt-0.5 text-[15px] leading-snug text-[var(--text-primary)]">{diaDeHoy.proposito}</p>
            </div>
          </div>
          {error && (
            <p role="alert" className="relative mt-3 text-[13px] text-[var(--danger)]">
              No pudimos guardar tu día. Revisa tu conexión y vuelve a intentarlo.
            </p>
          )}
          <motion.button
            whileTap={{ scale: 0.97 }}
            type="button"
            onClick={terminarDia}
            disabled={guardando}
            className="relative mt-5 flex h-14 w-full items-center justify-center gap-2 rounded-[var(--radius-button)] bg-[var(--accent)] text-[16px] font-semibold text-[var(--on-accent-fill)] shadow-[0_10px_28px_color-mix(in_oklab,var(--accent)_30%,transparent)] [touch-action:manipulation] disabled:opacity-60"
          >
            <Check size={20} strokeWidth={3} aria-hidden="true" />
            {guardando
              ? 'Guardando…'
              : diaDeHoy.dia === novena.diasTotal
                ? 'Terminé la novena'
                : 'Terminé el día de hoy'}
          </motion.button>
        </motion.section>
      )}

      {hechoHoy && (
        <motion.section
          variants={item}
          className="mt-4 flex items-start gap-4 rounded-[var(--radius-card)] bg-[color-mix(in_oklab,var(--accent-2)_12%,transparent)] p-5"
        >
          <motion.span
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', bounce: 0.45, duration: 0.4 }}
            className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[var(--accent-2)] text-[var(--surface)]"
          >
            <Check size={22} strokeWidth={3} aria-hidden="true" />
          </motion.span>
          <div>
            <p className="text-[16px] font-semibold text-[var(--text-primary)]">
              {recienHecho ? `¡Día ${recienHecho} completado!` : 'Tu día de hoy está hecho'}
            </p>
            <p className="mt-1 text-[14px] leading-snug text-[var(--text-secondary)]">
              Vuelve mañana para el día {Math.min(recienHecho ? recienHecho + 1 : novena.diaActual, novena.diasTotal)}. Cada día cuenta.
            </p>
          </div>
        </motion.section>
      )}

      {/* ——— Recorrido ——— */}
      <motion.section variants={item} className="mt-6" aria-label="Días de la novena">
        <h2 className="mb-3 text-[17px] font-semibold text-[var(--text-primary)]">Tu recorrido</h2>
        <ul className="flex flex-col gap-2">
          {novena.dias.map((d) => {
            const hecho = d.dia <= hechos;
            const hoy = !hecho && d.dia === novena.diaActual;
            const legible = hecho;
            const expandido = abierto === d.dia;
            return (
              <motion.li
                key={d.dia}
                variants={item}
                className={`overflow-hidden rounded-[var(--radius-card)] border ${
                  hoy
                    ? 'border-[var(--accent)] bg-[color-mix(in_oklab,var(--accent)_8%,transparent)]'
                    : 'border-[color-mix(in_oklab,var(--text-tertiary)_18%,transparent)] bg-[var(--surface)]'
                }`}
              >
                <button
                  type="button"
                  disabled={!legible}
                  aria-expanded={legible ? expandido : undefined}
                  onClick={() => setAbierto(expandido ? null : d.dia)}
                  className="flex w-full items-center gap-3 p-4 text-left [touch-action:manipulation] disabled:cursor-default"
                >
                  <span
                    aria-hidden="true"
                    className={`flex size-9 shrink-0 items-center justify-center rounded-full ${
                      hecho
                        ? 'bg-[var(--accent-2)] text-[var(--surface)]'
                        : hoy
                          ? 'border-2 border-[var(--accent)] text-[var(--accent)]'
                          : 'border border-[color-mix(in_oklab,var(--text-tertiary)_35%,transparent)] text-[var(--text-tertiary)]'
                    }`}
                  >
                    {hecho ? <Check size={16} strokeWidth={3} /> : hoy ? <Flame size={16} /> : d.dia}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[15px] font-medium text-[var(--text-primary)]">Día {d.dia}</span>
                    <span className="block truncate text-[13px] text-[var(--text-secondary)]">{d.titulo}</span>
                  </span>
                  {legible ? (
                    <ChevronDown
                      size={18}
                      color="var(--text-tertiary)"
                      aria-hidden="true"
                      className={`shrink-0 transition-transform duration-200 ${expandido ? 'rotate-180' : ''}`}
                    />
                  ) : (
                    <span className="flex shrink-0 items-center gap-1 text-[13px] text-[var(--text-secondary)]">
                      {hoy ? 'Hoy' : (<><Lock size={12} aria-hidden="true" /> Pendiente</>)}
                    </span>
                  )}
                </button>
                <AnimatePresence initial={false}>
                  {expandido && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="space-y-3 px-4 pb-4">
                        {d.entrada && (
                          <p className="border-l-2 border-[var(--accent)] pl-3 text-[14px] italic leading-relaxed text-[var(--text-secondary)]">
                            {d.entrada}
                          </p>
                        )}
                        <p className="text-[15px] leading-relaxed text-[var(--text-primary)]">{d.reflexion}</p>
                        <p className="text-[15px] italic leading-relaxed text-[var(--text-secondary)]">{d.oracion}</p>
                        <p className="text-[14px] text-[var(--accent-text)]">
                          <span className="font-semibold">Propósito: </span>
                          {d.proposito}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.li>
            );
          })}
        </ul>
      </motion.section>
      <span className="sr-only">{nombrePersona}</span>
    </motion.main>
  );
}

function fechaAyer(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return fechaLocalISO(d);
}

/* ───────────────────────── Elegir novena + tarjetas ganadas ───────────────────────── */
function Elegir({
  disponibles,
  completadas,
  onVerTarjeta,
}: {
  disponibles: NovenaDisponible[];
  completadas: NovenaCompletada[];
  onVerTarjeta: (c: NovenaCompletada) => void;
}) {
  const router = useRouter();
  const [eligiendo, setEligiendo] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const hechasIds = new Set(completadas.map((c) => c.nombre));

  const elegir = async (novenaId: string) => {
    setEligiendo(novenaId);
    setError(false);
    const supabase = createClient();
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      setError(true);
      setEligiendo(null);
      return;
    }
    const { error: err } = await supabase
      .from('novena_participation')
      .insert({ user_id: userData.user.id, novena_id: novenaId });
    if (err) {
      setError(true);
      setEligiendo(null);
      return;
    }
    router.refresh();
    setEligiendo(null);
  };

  return (
    <motion.main variants={lista} initial="hidden" animate="visible" className="flex-1 px-4 pt-6 pb-6">
      <motion.header variants={item} className="mb-6">
        <p className="text-[13px] font-medium text-[var(--text-tertiary)]">Tu novena</p>
        <h1 className="mt-1 text-balance text-[28px] font-bold leading-[1.1] text-[var(--text-primary)] [font-family:var(--font-display)]">
          {completadas.length > 0 ? 'Elige tu siguiente novena' : 'Elige tu primera novena'}
        </h1>
        <p className="mt-2 text-[14px] text-[var(--text-secondary)]">
          9 días guiados. Al terminar, ganas la tarjeta del santo.
        </p>
      </motion.header>

      {completadas.length > 0 && (
        <motion.section variants={item} className="mb-6" aria-label="Tus tarjetas">
          <h2 className="mb-3 text-[17px] font-semibold text-[var(--text-primary)]">Tus tarjetas</h2>
          <ul className="flex gap-3 overflow-x-auto pb-1 [scrollbar-width:none]">
            {completadas.map((c) => (
              <li key={c.id} className="shrink-0">
                <button
                  type="button"
                  onClick={() => onVerTarjeta(c)}
                  className="w-[132px] overflow-hidden rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--accent)_40%,transparent)] bg-[var(--surface)] text-left [touch-action:manipulation]"
                >
                  {c.santo.imagenUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={c.santo.imagenUrl}
                      alt={c.santo.imagenAlt ?? c.santo.nombre}
                      className="aspect-[4/3] w-full object-cover object-[50%_20%]"
                    />
                  ) : (
                    <span className="flex aspect-[4/3] w-full items-center justify-center bg-[var(--chip-bg)]">
                      <Sparkles size={24} color="var(--accent)" aria-hidden="true" />
                    </span>
                  )}
                  <span className="block p-3">
                    <span className="block truncate text-[13px] font-semibold text-[var(--text-primary)]">{c.santo.nombre}</span>
                    <span className="block text-[11px] text-[var(--text-tertiary)]">{fechaLarga(c.fecha)}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </motion.section>
      )}

      <motion.ul variants={item} className="flex flex-col gap-3">
        {disponibles.map((n) => {
          const hecha = hechasIds.has(n.nombre);
          const bloqueada = !n.conContenido || hecha;
          return (
            <li key={n.id}>
              <motion.button
                whileTap={{ scale: bloqueada ? 1 : 0.98 }}
                disabled={eligiendo !== null || bloqueada}
                onClick={() => elegir(n.id)}
                className="flex w-full items-center justify-between gap-3 rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--text-tertiary)_22%,transparent)] bg-[var(--surface)] p-4 text-left [touch-action:manipulation] disabled:opacity-60"
              >
                <span className="text-[15px] font-medium text-[var(--text-primary)]">{n.nombre}</span>
                <span className="shrink-0 text-[13px] text-[var(--text-secondary)]">
                  {hecha ? 'Completada' : !n.conContenido ? 'Próximamente' : eligiendo === n.id ? 'Empezando…' : `${n.diasTotal} días`}
                </span>
              </motion.button>
            </li>
          );
        })}
      </motion.ul>
      {error && (
        <p role="alert" className="mt-3 text-[13px] text-[var(--danger)]">
          No pudimos empezar la novena. Revisa tu conexión y vuelve a intentarlo.
        </p>
      )}
    </motion.main>
  );
}

/* ───────────────────────── Entrada ───────────────────────── */
export function NovenaCliente({
  nombrePersona,
  activa,
  completadas,
  disponibles,
}: {
  nombrePersona: string;
  activa: NovenaActiva | null;
  completadas: NovenaCompletada[];
  disponibles: NovenaDisponible[];
}) {
  const [premio, setPremio] = useState<PremioVisible | null>(null);
  const [celebrando, setCelebrando] = useState(false);

  if (premio) {
    return (
      <VistaPremio
        premio={premio}
        nombrePersona={nombrePersona}
        celebrando={celebrando}
        onCerrar={() => {
          setPremio(null);
          setCelebrando(false);
        }}
      />
    );
  }

  if (activa) {
    return (
      <Progreso
        novena={activa}
        nombrePersona={nombrePersona}
        onCompletada={(p) => {
          setCelebrando(true);
          setPremio(p);
        }}
      />
    );
  }

  return (
    <Elegir
      disponibles={disponibles}
      completadas={completadas}
      onVerTarjeta={(c) => setPremio({ santo: c.santo, diasTotal: c.diasTotal, fecha: c.fecha })}
    />
  );
}
