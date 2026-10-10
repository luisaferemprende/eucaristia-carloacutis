'use client';

// SESIÓN 4 — Onboarding + Paywall (Modelo 2, variante anónima: 02C/ESTADO.md).
// 6 pasos de personalización (02B: 4-8 para bienestar/hábito) + loading +
// paywall de SECUENCIA (3 pantallas, C0 de 50: +37% vs 1 sola página) + salida
// a /entrar (login). Copy derivado de FICHA-AVATAR.md — cada pregunta ecoa un
// dolor/deseo real, nunca fricción decorativa (02B).

import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { AnimatePresence, motion, type Variants } from 'motion/react';
import { Calendar, Check, Clock, HeartHandshake, Sparkles, X } from 'lucide-react';
import {
  AnilloProgreso,
  BarraProgreso,
  BotonAtras,
  CtaFunnel,
  OpcionChip,
  PasoAnimado,
} from '@/components/funnel/ui';

type Respuestas = {
  motivo?: string;
  frecuencia?: string;
  momento?: string;
  santo?: string;
};

const MOMENTOS: Record<string, string> = {
  despertar: 'al despertar',
  misa: 'antes de misa',
  dormir: 'antes de dormir',
  cuando_pueda: 'cuando puedas',
};

const SANTOS = ['Carlo Acutis', 'San Pío de Pietrelcina', 'Santo Tomás de Aquino', 'Santa Teresita'];

// PASOS 1-6 = preguntas/reconocimiento · 7 = loading · 8-10 = paywall (secuencia C0)
const TOTAL_PASOS = 10;

export default function Onboarding() {
  const [paso, setPaso] = useState(1);
  const [direccion, setDireccion] = useState<1 | -1>(1);
  const [respuestas, setRespuestas] = useState<Respuestas>({});
  const [planElegido, setPlanElegido] = useState<'anual' | 'mensual'>('anual');
  const [confirmado, setConfirmado] = useState(false);

  const avanzar = (cambios?: Partial<Respuestas>) => {
    const siguientes = cambios ? { ...respuestas, ...cambios } : respuestas;
    if (cambios) setRespuestas(siguientes);
    setDireccion(1);
    setPaso((p) => {
      const nuevo = Math.min(p + 1, TOTAL_PASOS);
      // Al llegar al loading (paso 7) ya están las 4 respuestas — se guardan para
      // aplicarlas al perfil real en cuanto la persona inicie sesión (/app las lee
      // una sola vez y limpia la clave: la cuenta todavía no existe en este punto).
      if (nuevo === 7) {
        try {
          window.localStorage.setItem('ev_onboarding_respuestas', JSON.stringify(siguientes));
        } catch {
          // localStorage no disponible (modo privado) — se pierde la personalización
          // inicial sin romper el flujo; el perfil queda con los valores por defecto.
        }
      }
      return nuevo;
    });
  };
  const retroceder = () => {
    setDireccion(-1);
    setPaso((p) => Math.max(p - 1, 1));
  };

  // "sorpresa" nunca se muestra tal cual en pantalla (quedaba literal: "con sorpresa").
  const santoElegido =
    respuestas.santo && respuestas.santo !== 'sorpresa' ? respuestas.santo : 'un santo distinto cada día';
  const momentoElegido = MOMENTOS[respuestas.momento ?? 'despertar'];

  return (
    <main className="min-h-dvh bg-[var(--bg)] [font-family:var(--font-body)]">
      {paso <= 6 && (
        <div className="relative mx-auto flex min-h-dvh max-w-[480px] flex-col overflow-hidden px-5 pb-10 pt-4">
          {/* Profundidad: mesh sutil arriba — nunca fondo plano (DESIGN-CORE §2) */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[280px]"
            style={{
              background:
                'radial-gradient(480px 280px at 50% 0%, color-mix(in oklab, var(--accent) 7%, transparent) 0%, transparent 70%)',
            }}
          />
          <div className="flex items-center gap-2">
            {paso > 1 && <BotonAtras onClick={retroceder} />}
            <BarraProgreso paso={paso} total={6} />
            <a
              href="/"
              aria-label="Salir del recorrido de inicio"
              className="flex h-11 w-11 shrink-0 items-center justify-center text-[var(--text-secondary)]"
            >
              <X size={20} aria-hidden="true" />
            </a>
          </div>
          <div className="flex flex-1 flex-col justify-start pt-10 pb-8">
            <AnimatePresence mode="wait" initial={false}>
              {paso === 1 && (
                <PasoAnimado key="p1" clave="p1" direccion={direccion}>
                  <PreguntaMotivo
                    valor={respuestas.motivo}
                    onElegir={(v) => avanzar({ motivo: v })}
                  />
                </PasoAnimado>
              )}
              {paso === 2 && (
                <PasoAnimado key="p2" clave="p2" direccion={direccion}>
                  <PreguntaFrecuencia
                    valor={respuestas.frecuencia}
                    onElegir={(v) => avanzar({ frecuencia: v })}
                  />
                </PasoAnimado>
              )}
              {paso === 3 && (
                <PasoAnimado key="p3" clave="p3" direccion={direccion}>
                  <Reconocimiento
                    icono={<Sparkles size={28} className="text-[var(--accent)]" />}
                    titulo="Esto no es falta de fe"
                    texto={
                      respuestas.motivo === 'inercia'
                        ? 'Comulgar y sentir que "nada cambió" no significa que tu fe esté vacía — significa que nadie te dio 3 minutos para prepararte antes. Eso es lo primero que vamos a cambiar.'
                        : 'Empezar con fe y perderte a mitad de camino no es falta de voluntad — es que nunca tuviste un método de 3 minutos que sí se pueda sostener todos los días. Eso es lo primero que vamos a cambiar.'
                    }
                    onContinuar={() => avanzar()}
                   
                  />
                </PasoAnimado>
              )}
              {paso === 4 && (
                <PasoAnimado key="p4" clave="p4" direccion={direccion}>
                  <PreguntaMomento
                    valor={respuestas.momento}
                    onElegir={(v) => avanzar({ momento: v })}
                  />
                </PasoAnimado>
              )}
              {paso === 5 && (
                <PasoAnimado key="p5" clave="p5" direccion={direccion}>
                  <PreguntaSanto
                    valor={respuestas.santo}
                    onElegir={(v) => avanzar({ santo: v })}
                  />
                </PasoAnimado>
              )}
              {paso === 6 && (
                <PasoAnimado key="p6" clave="p6" direccion={direccion}>
                  <Reconocimiento
                    icono={<Check size={28} className="text-[var(--accent)]" />}
                    titulo="Tus respuestas te describen"
                    texto={`Eres alguien que no se conforma con ir por inercia — por eso hoy elegiste algo distinto. Tu Autopista de 3 Minutos ya está lista con ${santoElegido}, ${momentoElegido}.`}
                    onContinuar={() => avanzar()}
                    cta="Ver mi Autopista de 3 Minutos"
                   
                  />
                </PasoAnimado>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}

      {paso === 7 && <PantallaLoading santo={santoElegido} onListo={() => avanzar()} />}

      {paso === 8 && (
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="tema-noche min-h-dvh bg-[var(--bg)]"
        >
          <PaywallRecap santo={santoElegido} onContinuar={() => avanzar()} />
        </motion.div>
      )}
      {paso === 9 && (
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="tema-noche min-h-dvh bg-[var(--bg)]"
        >
          <PaywallTimeline onContinuar={() => avanzar()} onAtras={retroceder} />
        </motion.div>
      )}
      {paso === 10 && (
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="tema-noche min-h-dvh bg-[var(--bg)]"
        >
          {!confirmado ? (
            <PaywallPrecio
              plan={planElegido}
              onCambiarPlan={setPlanElegido}
              onAtras={retroceder}
              onConfirmar={() => setConfirmado(true)}
            />
          ) : (
            <ConfirmacionSimulada plan={planElegido} />
          )}
        </motion.div>
      )}
    </main>
  );
}

/* ============================== PREGUNTAS (50 A1-A3) ============================== */

const listaPregunta: Variants = { hidden: {}, visible: { transition: { staggerChildren: 0.07 } } };
const itemPregunta: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } },
};

function IconoPregunta({ children }: { children: ReactNode }) {
  return (
    <motion.div
      variants={itemPregunta}
      className="relative mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--accent)_12%,transparent)]"
    >
      {/* Dispositivo ownable en miniatura: halo degradé detrás del ícono de cada pregunta */}
      <span
        aria-hidden="true"
        className="absolute inset-[-6px] -z-10 rounded-full"
        style={{ background: 'radial-gradient(circle, color-mix(in oklab, var(--accent) 16%, transparent) 0%, transparent 75%)' }}
      />
      {children}
    </motion.div>
  );
}

/* Pregunta genérica de opción única: comparte stagger de entrada (baseline #1) y
   el delay de ~280ms antes de avanzar para que el check del chip se vea (heurística
   de feedback — hallazgo real del revisor-visual, ronda 1). */
function PreguntaOpciones({
  icono,
  titulo,
  subtitulo,
  opciones,
  valor,
  onElegir,
}: {
  icono: ReactNode;
  titulo: string;
  subtitulo?: string;
  opciones: { v: string; t: string }[];
  valor?: string;
  onElegir: (v: string) => void;
}) {
  const [seleccionLocal, setSeleccionLocal] = useState<string | null>(null);
  const mostrado = seleccionLocal ?? valor;
  const elegir = (v: string) => {
    setSeleccionLocal(v);
    setTimeout(() => onElegir(v), 280);
  };
  return (
    <motion.div variants={listaPregunta} initial="hidden" animate="visible" className="flex flex-col gap-3">
      <IconoPregunta>{icono}</IconoPregunta>
      <motion.h1
        variants={itemPregunta}
        className="text-balance text-[28px] font-bold leading-[1.15] text-[var(--text-primary)] [font-family:var(--font-display)]"
      >
        {titulo}
      </motion.h1>
      {subtitulo && (
        <motion.p variants={itemPregunta} className="mb-2 text-[15px] text-[var(--text-secondary)]">
          {subtitulo}
        </motion.p>
      )}
      {opciones.map((o) => (
        <motion.div key={o.v} variants={itemPregunta}>
          <OpcionChip seleccionado={mostrado === o.v} onClick={() => elegir(o.v)}>
            {o.t}
          </OpcionChip>
        </motion.div>
      ))}
    </motion.div>
  );
}

function PreguntaMotivo({ valor, onElegir }: { valor?: string; onElegir: (v: string) => void }) {
  return (
    <PreguntaOpciones
      icono={<HeartHandshake size={22} className="text-[var(--accent)]" />}
      titulo="¿Qué te trae hoy aquí?"
      subtitulo="Esto define tu primer día."
      opciones={[
        { v: 'novena', t: 'Quiero terminar una novena, por fin' },
        { v: 'inercia', t: 'Quiero comulgar sin que sea automático' },
        { v: 'sola', t: 'Quiero sentirme acompañada en mi fe' },
        { v: 'profundo', t: 'Quiero vivir la Eucaristía más a fondo' },
      ]}
      valor={valor}
      onElegir={onElegir}
    />
  );
}

function PreguntaFrecuencia({ valor, onElegir }: { valor?: string; onElegir: (v: string) => void }) {
  return (
    <PreguntaOpciones
      icono={<Calendar size={22} className="text-[var(--accent)]" />}
      titulo="¿Con qué frecuencia comulgas hoy?"
      opciones={[
        { v: 'domingo', t: 'Cada domingo' },
        { v: 'semana', t: 'Varias veces por semana' },
        { v: 'sin_ritmo', t: 'Cuando puedo, sin ritmo fijo' },
        { v: 'reinicio', t: 'Quiero empezar de nuevo' },
      ]}
      valor={valor}
      onElegir={onElegir}
    />
  );
}

function PreguntaMomento({ valor, onElegir }: { valor?: string; onElegir: (v: string) => void }) {
  return (
    <PreguntaOpciones
      icono={<Clock size={22} className="text-[var(--accent)]" />}
      titulo="¿En qué momento del día quieres tus 3 minutos?"
      subtitulo="Así te avisamos justo a esa hora."
      opciones={[
        { v: 'despertar', t: 'Al despertar' },
        { v: 'misa', t: 'Antes de misa' },
        { v: 'dormir', t: 'Antes de dormir' },
        { v: 'cuando_pueda', t: 'Cuando pueda' },
      ]}
      valor={valor}
      onElegir={onElegir}
    />
  );
}

function PreguntaSanto({ valor, onElegir }: { valor?: string; onElegir: (v: string) => void }) {
  return (
    <PreguntaOpciones
      icono={<Sparkles size={22} className="text-[var(--accent)]" />}
      titulo="¿Qué santo quieres que te acompañe esta semana?"
      opciones={[...SANTOS.map((s) => ({ v: s, t: s })), { v: 'sorpresa', t: 'Sorpréndeme cada día' }]}
      valor={valor}
      onElegir={onElegir}
    />
  );
}

/* ============================== RECONOCIMIENTO (50 A5) ============================== */

function Reconocimiento({
  icono,
  titulo,
  texto,
  onContinuar,
  cta = 'Continuar',
}: {
  icono: React.ReactNode;
  titulo: string;
  texto: string;
  onContinuar: () => void;
  cta?: string;
}) {
  return (
    <div className="flex flex-col">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--accent)_12%,transparent)]"
      >
        {icono}
      </motion.div>
      <motion.h2
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.18, duration: 0.3 }}
        className="mt-6 text-balance text-center text-[26px] font-bold leading-[1.15] text-[var(--text-primary)] [font-family:var(--font-display)]"
      >
        {titulo}
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.26, duration: 0.3 }}
        className="mt-4 text-center text-[16px] leading-relaxed text-[var(--text-secondary)]"
      >
        {texto}
      </motion.p>
      <div className="mt-10">
        <CtaFunnel onClick={onContinuar}>{cta}</CtaFunnel>
      </div>
    </div>
  );
}

/* ============================== LOADING (50 B1-B2) ============================== */

function PantallaLoading({ santo, onListo }: { santo: string; onListo: () => void }) {
  const lineas = useMemo(
    () => [
      `Preparando el pensamiento de ${santo}`,
      'Elegimos tu milagro eucarístico de hoy',
      'Ajustando tu recordatorio a tu horario',
      'Guardando tu primera intención',
    ],
    [santo]
  );
  const [activa, setActiva] = useState(0);

  useEffect(() => {
    let cancelado = false;
    let timer: ReturnType<typeof setTimeout>;
    let i = 0;
    const avanzarLinea = () => {
      if (cancelado) return;
      i += 1;
      setActiva(i);
      if (i < lineas.length) {
        timer = setTimeout(avanzarLinea, 750);
      } else {
        timer = setTimeout(onListo, 900);
      }
    };
    timer = setTimeout(avanzarLinea, 750);
    return () => {
      cancelado = true;
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pct = Math.round((Math.min(activa, lineas.length) / lineas.length) * 100);

  return (
    <div
      className="flex min-h-dvh flex-col items-center justify-center px-6"
      aria-live="polite"
      aria-busy={activa < lineas.length}
    >
      <AnilloProgreso pct={pct} />
      <h2 className="mt-6 text-[23px] font-bold text-[var(--text-primary)] [font-family:var(--font-display)]">
        Construyendo tu Autopista de 3 Minutos…
      </h2>
      <ul className="mt-8 flex w-full max-w-[320px] flex-col gap-3">
        {lineas.map((l, i) => (
          <li
            key={l}
            className={`flex items-center gap-3 text-[15px] transition-opacity duration-200 ${
              i < activa ? 'opacity-100' : i === activa ? 'opacity-100' : 'opacity-40'
            }`}
          >
            {i < activa ? (
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--accent)]">
                <Check size={12} strokeWidth={3} className="text-[var(--text-primary)]" />
              </span>
            ) : i === activa ? (
              <motion.span
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="h-2.5 w-2.5 shrink-0 rounded-full bg-[var(--accent)]"
              />
            ) : (
              <span className="h-2.5 w-2.5 shrink-0 rounded-full border border-[var(--text-tertiary)]" />
            )}
            <span className="text-[var(--text-primary)]">{l}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ============================== PAYWALL — secuencia de 3 (50 C0) ============================== */

function PaywallRecap({ santo, onContinuar }: { santo: string; onContinuar: () => void }) {
  return (
    <div className="mx-auto flex min-h-dvh max-w-[480px] flex-col px-5 py-10 text-[var(--text-primary)]">
      <h1 className="text-balance text-[28px] font-bold leading-[1.15] [font-family:var(--font-display)]">
        Tu Autopista de 3 Minutos con {santo} está lista
      </h1>
      <p className="mt-2 text-[14px] text-[var(--text-secondary)]">Hecha con tus 5 respuestas.</p>
      <div className="mt-8 flex flex-col gap-4 rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--text-tertiary)_22%,transparent)] bg-[var(--surface)] p-5">
        {[
          'El pensamiento diario de los santos y un milagro eucarístico',
          'Tu micro-preparación de 3 minutos antes de la comunión',
          'Tu diario privado y tu novena con la comunidad',
        ].map((f) => (
          <div key={f} className="flex items-start gap-3">
            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--accent)_16%,transparent)]">
              <Check size={13} strokeWidth={3} className="text-[var(--accent)]" />
            </span>
            <p className="text-[15px] leading-snug">{f}</p>
          </div>
        ))}
      </div>
      <div className="mt-auto pt-10">
        <CtaFunnel onClick={onContinuar}>Ver cómo funciona mi prueba</CtaFunnel>
      </div>
    </div>
  );
}

function PaywallTimeline({ onContinuar, onAtras }: { onContinuar: () => void; onAtras: () => void }) {
  const nodos = [
    { t: 'Hoy — acceso completo', s: 'Todo tu plan, sin límites', activo: true },
    { t: 'Día 5 — te avisamos', s: 'Correo antes de cualquier cobro', activo: true },
    { t: 'Día 7 — primer cobro: $29.99/año', s: 'Cancela antes sin costo', activo: false },
  ];
  return (
    <div className="mx-auto flex min-h-dvh max-w-[480px] flex-col px-5 py-10 text-[var(--text-primary)]">
      <BotonAtras onClick={onAtras} />
      <h1 className="mt-4 text-balance text-[26px] font-bold leading-[1.2] [font-family:var(--font-display)]">
        Hoy no pagas nada
      </h1>
      <div className="mt-8 flex flex-col">
        {nodos.map((n, i) => (
          <div key={n.t} className="grid grid-cols-[20px_1fr] gap-3 pb-7 last:pb-0">
            <div className="relative flex justify-center">
              <span
                className={`mt-1 h-3 w-3 rounded-full ${
                  n.activo ? 'bg-[var(--accent)]' : 'border-2 border-[var(--text-tertiary)]'
                }`}
              />
              {i < nodos.length - 1 && (
                <span className="absolute top-4 h-full w-[2px] bg-[color-mix(in_oklab,var(--accent)_35%,transparent)]" />
              )}
            </div>
            <div>
              <p className="text-[15px] font-semibold">{n.t}</p>
              <p className="mt-0.5 text-[13px] text-[var(--text-secondary)]">{n.s}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-auto flex flex-col gap-3 pt-10">
        <div className="flex flex-col gap-2 text-[13px] text-[var(--text-secondary)]">
          {['Hoy no pagas nada', 'Te avisamos 1 día antes del cobro', 'Cancela en 1 tap'].map((b) => (
            <div key={b} className="flex items-center gap-2">
              <Check size={14} className="text-[var(--accent)]" />
              <span>{b}</span>
            </div>
          ))}
        </div>
        <CtaFunnel onClick={onContinuar}>Empezar mis 7 días gratis</CtaFunnel>
      </div>
    </div>
  );
}

function PaywallPrecio({
  plan,
  onCambiarPlan,
  onAtras,
  onConfirmar,
}: {
  plan: 'anual' | 'mensual';
  onCambiarPlan: (p: 'anual' | 'mensual') => void;
  onAtras: () => void;
  onConfirmar: () => void;
}) {
  return (
    <div className="mx-auto flex min-h-dvh max-w-[480px] flex-col px-5 py-6 text-[var(--text-primary)]">
      <div className="flex items-center justify-between">
        <BotonAtras onClick={onAtras} />
        <a href="/" aria-label="Cerrar" className="flex h-11 w-11 items-center justify-center text-[var(--text-secondary)]">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </a>
      </div>

      <h1 className="mt-2 text-balance text-[26px] font-bold leading-[1.2] [font-family:var(--font-display)]">
        Empieza mi <span className="text-[var(--accent)]">Autopista de 3 Minutos</span>
      </h1>

      <div className="mt-6 flex flex-col gap-3">
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => onCambiarPlan('anual')}
          className={`relative rounded-[var(--radius-card)] border p-4 text-left transition-colors ${
            plan === 'anual'
              ? 'border-[var(--accent)] bg-[color-mix(in_oklab,var(--accent)_8%,transparent)]'
              : 'border-[color-mix(in_oklab,var(--text-tertiary)_28%,transparent)] bg-[var(--surface)]'
          }`}
        >
          <span className="absolute -top-[10px] left-4 rounded-full bg-[var(--accent)] px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-[0.06em] text-[var(--on-accent-fill)]">
            Ahorra 37%
          </span>
          {plan === 'anual' && (
            <motion.span
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.2, type: 'spring', bounce: 0.35 }}
              className="absolute top-4 right-4 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--accent)] text-[var(--on-accent-fill)]"
            >
              <Check size={12} strokeWidth={3} />
            </motion.span>
          )}
          <div className="flex items-center justify-between pr-7">
            <span className="text-[15px] font-semibold">Anual</span>
            <span className="text-[22px] font-bold tabular-nums [font-family:var(--font-display)]">
              $2.50<span className="text-[13px] font-medium text-[var(--text-secondary)]">/mes</span>
            </span>
          </div>
          <p className="mt-1 text-[13px] text-[var(--text-secondary)]">
            Se cobra $29.99/año · menos de $0.08 al día
          </p>
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => onCambiarPlan('mensual')}
          className={`relative rounded-[var(--radius-card)] border p-4 text-left transition-colors ${
            plan === 'mensual'
              ? 'border-[var(--accent)] bg-[color-mix(in_oklab,var(--accent)_8%,transparent)]'
              : 'border-[color-mix(in_oklab,var(--text-tertiary)_28%,transparent)] bg-[var(--surface)]'
          }`}
        >
          {plan === 'mensual' && (
            <motion.span
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.2, type: 'spring', bounce: 0.35 }}
              className="absolute top-4 right-4 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--accent)] text-[var(--on-accent-fill)]"
            >
              <Check size={12} strokeWidth={3} />
            </motion.span>
          )}
          <div className="flex items-center justify-between pr-7">
            <span className="text-[15px] font-semibold">Mensual</span>
            <span className="text-[22px] font-bold tabular-nums [font-family:var(--font-display)]">
              $3.99<span className="text-[13px] font-medium text-[var(--text-secondary)]">/mes</span>
            </span>
          </div>
        </motion.button>
      </div>

      {/* Dispositivo ownable prometido en FICHA-ARTE para pantallas nocturnas: hairline degradé */}
      <div
        aria-hidden="true"
        className="mt-6 h-px w-full"
        style={{ background: 'linear-gradient(90deg, transparent, color-mix(in oklab, var(--accent) 45%, transparent), transparent)' }}
      />

      <p className="mt-6 text-[13px] text-[var(--text-secondary)]">
        Menos que los $70/año de la app líder — sin catálogo enorme y disperso, un solo hábito
        enfocado en la Eucaristía.
      </p>

      <ul className="mt-4 flex flex-col gap-3">
        {[
          'El pensamiento diario de los santos y los milagros eucarísticos',
          'Tu micro-preparación de 3 minutos antes de cada comunión',
          'Diario espiritual privado, para siempre',
          plan === 'anual' ? 'Tu novena — ya no rezas sola' : 'Cancelas cuando quieras',
        ].map((f) => (
          <li key={f} className="flex items-start gap-3 text-[14px] leading-snug text-[var(--text-secondary)]">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--accent)_16%,transparent)]">
              <Check size={12} strokeWidth={3} className="text-[var(--accent)]" />
            </span>
            <span>{f}</span>
          </li>
        ))}
      </ul>

      <div className="mt-auto flex flex-col items-center gap-3 pt-8">
        <CtaFunnel onClick={onConfirmar}>Empezar mis 7 días gratis</CtaFunnel>
        <p className="text-center text-[13px] text-[var(--text-secondary)]">
          Cancela cuando quieras · te avisamos antes del cobro
        </p>
        <a href="/" className="text-[14px] font-medium text-[var(--text-secondary)] underline-offset-2 hover:underline">
          Ahora no
        </a>
        <p className="mt-2 flex items-center gap-1.5 text-[12px] text-[var(--text-tertiary)]">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <rect x="4" y="10" width="16" height="10" rx="2" />
            <path d="M8 10V7a4 4 0 0 1 8 0v3" />
          </svg>
          Pago seguro por Hotmart · Garantía de 15 días
        </p>
      </div>
    </div>
  );
}

function ConfirmacionSimulada({ plan }: { plan: 'anual' | 'mensual' }) {
  return (
    <div className="mx-auto flex min-h-dvh max-w-[480px] flex-col items-center justify-center px-6 text-center text-[var(--text-primary)]">
      <motion.span
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', bounce: 0.4, duration: 0.5 }}
        className="flex h-16 w-16 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--accent)_16%,transparent)]"
      >
        <Check size={30} className="text-[var(--accent)]" />
      </motion.span>
      <h1 className="mt-6 text-[24px] font-bold [font-family:var(--font-display)]">Tu lugar está reservado</h1>
      <p className="mt-3 max-w-[320px] text-[15px] leading-relaxed text-[var(--text-secondary)]">
        Elegiste el plan {plan === 'anual' ? 'anual ($29.99/año)' : 'mensual ($3.99/mes)'}. Cuando
        conectemos el pago, aquí completarás tu compra de forma segura en Hotmart y entrarás
        directo a tu primer día.
      </p>
      <div className="mt-8 w-full">
        <CtaFunnel href="/entrar">Continuar a mi cuenta</CtaFunnel>
      </div>
    </div>
  );
}
