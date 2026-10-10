'use client';

// PANTALLA SECUNDARIA — Perfil. Estado de la cuenta + ajustes + salida real
// (antes "Cerrar sesión" no hacía nada — hallazgo real, regla UX 11).
// Estadísticas con datos REALES (racha, rosarios, novenas) — nunca inventados.

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, type Variants } from 'motion/react';
import {
  Award,
  Bell,
  Check,
  ChevronRight,
  CreditCard,
  Flame,
  Flower2,
  Image as ImageIcon,
  LogOut,
  ShieldCheck,
  X,
} from 'lucide-react';
import { CountUp } from '@/components/app/ui';
import { EmblemaEucaristico } from '@/components/app/emblema-eucaristico';
import { createClient } from '@/lib/supabase/client';

const lista: Variants = { hidden: {}, visible: { transition: { staggerChildren: 0.05 } } };
const item: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] } },
};

const MOMENTOS: Record<string, string> = {
  despertar: 'Al despertar',
  misa: 'Antes de misa',
  dormir: 'Antes de dormir',
  cuando_pueda: 'Cuando puedas',
};

export interface PerfilData {
  nombre: string;
  correo: string;
  rachaActual: number;
  rachaMejor: number;
  rosariosRezados: number;
  novenasCompletadas: number;
  momentoDia: string;
  plan: { nombre: string; estado: string } | null;
  creditosImagenes: { nombre: string; credito: string }[];
}

function ModalPlan({ plan, onCerrar }: { plan: PerfilData['plan']; onCerrar: () => void }) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Tu plan"
      className="fixed inset-0 z-50 flex items-end justify-center bg-[color-mix(in_oklab,var(--text-primary)_40%,transparent)] px-4 pb-4 sm:items-center"
      onClick={onCerrar}
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm overflow-hidden rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--accent)_25%,transparent)] bg-[var(--surface)] shadow-[var(--shadow-2)]"
      >
        <div className="relative px-6 pt-6 text-center">
          <button
            type="button"
            aria-label="Cerrar"
            onClick={onCerrar}
            className="absolute right-4 top-4 flex size-8 items-center justify-center text-[var(--text-tertiary)] [touch-action:manipulation]"
          >
            <X size={18} aria-hidden="true" />
          </button>
          <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--accent)_14%,transparent)]">
            <EmblemaEucaristico className="h-9 w-9" />
          </span>
          <h2 className="mt-3 text-[20px] font-bold text-[var(--text-primary)] [font-family:var(--font-display)]">
            {plan ? 'Tu plan' : 'Vive la Eucaristía sin límites'}
          </h2>
          {plan ? (
            <p className="mt-1 text-[14px] text-[var(--text-secondary)]">
              Plan {plan.nombre} · {plan.estado}
            </p>
          ) : (
            <p className="mt-1 text-[14px] text-[var(--text-secondary)]">
              Menos de $0.08 al día con el plan anual.
            </p>
          )}
        </div>

        {!plan && (
          <div className="px-6 pb-2 pt-4">
            <div className="rounded-[var(--radius-button)] border border-[var(--accent)] bg-[color-mix(in_oklab,var(--accent)_6%,transparent)] p-4">
              <div className="flex items-baseline justify-between">
                <span className="text-[15px] font-semibold text-[var(--text-primary)]">Anual</span>
                <span className="text-[13px] font-semibold text-[var(--accent-text)]">Ahorra 37%</span>
              </div>
              <p className="mt-1 text-[22px] font-bold text-[var(--text-primary)] [font-family:var(--font-display)]">
                $2.50<span className="text-[14px] font-medium text-[var(--text-secondary)]">/mes</span>
              </p>
              <p className="text-[12px] text-[var(--text-tertiary)]">Se cobra $29.99 una vez al año</p>
            </div>
            <ul className="mt-4 flex flex-col gap-2">
              {[
                'Acceso ilimitado a las 4 novenas y sus tarjetas-premio',
                'Los 20 misterios del Rosario con meditación e imagen',
                'Tu diario espiritual privado, sin límite de entradas',
                'Apoyas directamente a que sigamos sumando contenido',
              ].map((b) => (
                <li key={b} className="flex items-start gap-2 text-[13px] leading-snug text-[var(--text-secondary)]">
                  <Check size={15} color="var(--accent-2)" aria-hidden="true" className="mt-0.5 shrink-0" />
                  {b}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="p-6 pt-4">
          <button
            type="button"
            onClick={onCerrar}
            className="h-12 w-full rounded-[var(--radius-button)] bg-[var(--accent)] text-[15px] font-semibold text-[var(--on-accent-fill)] [touch-action:manipulation]"
          >
            Entendido
          </button>
          {!plan && (
            <p className="mt-2 text-center text-[12px] text-[var(--text-tertiary)]">
              Muy pronto podrás activar tu plan directo desde aquí.
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export function PerfilCliente(d: PerfilData) {
  const router = useRouter();
  const [saliendo, setSaliendo] = useState(false);
  const [planAbierto, setPlanAbierto] = useState(false);

  const cerrarSesion = async () => {
    setSaliendo(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <motion.main variants={lista} initial="hidden" animate="visible" className="flex-1 px-4 pt-6 pb-4">
      <motion.header variants={item} className="mb-6 flex items-center gap-4">
        <span
          aria-hidden="true"
          className="flex size-14 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--accent)_16%,transparent)] text-[20px] font-bold text-[var(--accent-text)] [font-family:var(--font-display)]"
        >
          {d.nombre.charAt(0).toUpperCase()}
        </span>
        <div className="min-w-0">
          <h1 className="text-[20px] font-bold text-[var(--text-primary)] [font-family:var(--font-display)]">
            {d.nombre}
          </h1>
          <p className="mt-0.5 truncate text-[13px] text-[var(--text-secondary)]">{d.correo}</p>
        </div>
      </motion.header>

      {/* Estadísticas — datos reales, nunca decorativos */}
      <motion.div variants={item} className="mb-6 grid grid-cols-3 gap-2">
        <div className="rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--text-tertiary)_18%,transparent)] bg-[var(--surface)] p-3 text-center">
          <Flame size={18} color="var(--accent)" aria-hidden="true" className="mx-auto" />
          <p className="mt-1 text-[20px] font-bold text-[var(--text-primary)] [font-family:var(--font-display)]">
            <CountUp value={d.rachaActual} />
          </p>
          <p className="text-[11px] leading-tight text-[var(--text-tertiary)]">días de racha</p>
        </div>
        <div className="rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--text-tertiary)_18%,transparent)] bg-[var(--surface)] p-3 text-center">
          <Flower2 size={18} color="var(--accent)" aria-hidden="true" className="mx-auto" />
          <p className="mt-1 text-[20px] font-bold text-[var(--text-primary)] [font-family:var(--font-display)]">
            <CountUp value={d.rosariosRezados} />
          </p>
          <p className="text-[11px] leading-tight text-[var(--text-tertiary)]">rosarios rezados</p>
        </div>
        <div className="rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--text-tertiary)_18%,transparent)] bg-[var(--surface)] p-3 text-center">
          <Award size={18} color="var(--accent)" aria-hidden="true" className="mx-auto" />
          <p className="mt-1 text-[20px] font-bold text-[var(--text-primary)] [font-family:var(--font-display)]">
            <CountUp value={d.novenasCompletadas} />
          </p>
          <p className="text-[11px] leading-tight text-[var(--text-tertiary)]">novenas completadas</p>
        </div>
      </motion.div>

      <motion.ul variants={item} className="flex flex-col gap-2">
        <li>
          <button
            type="button"
            onClick={() => setPlanAbierto(true)}
            className="flex w-full items-center gap-3 rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--text-tertiary)_20%,transparent)] bg-[var(--surface)] p-4 text-left [touch-action:manipulation]"
          >
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[var(--chip-bg)]">
              <CreditCard size={18} color="var(--accent)" aria-hidden="true" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[15px] font-medium text-[var(--text-primary)]">Mi plan</span>
              <span className="mt-0.5 block text-[13px] text-[var(--text-secondary)]">
                {d.plan ? `${d.plan.nombre} · ${d.plan.estado}` : 'Sin plan activo todavía'}
              </span>
            </span>
            <ChevronRight size={18} color="var(--text-tertiary)" aria-hidden="true" className="shrink-0" />
          </button>
        </li>
        <li className="flex items-center gap-3 rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--text-tertiary)_20%,transparent)] bg-[var(--surface)] p-4">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[var(--chip-bg)]">
            <Bell size={18} color="var(--accent)" aria-hidden="true" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[15px] font-medium text-[var(--text-primary)]">Recordatorio diario</span>
            <span className="mt-0.5 block text-[13px] text-[var(--text-secondary)]">
              {MOMENTOS[d.momentoDia] ?? 'Al despertar'}
            </span>
          </span>
        </li>
        <li>
          <a
            href="/privacidad"
            className="flex items-center gap-3 rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--text-tertiary)_20%,transparent)] bg-[var(--surface)] p-4 [touch-action:manipulation]"
          >
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[var(--chip-bg)]">
              <ShieldCheck size={18} color="var(--accent)" aria-hidden="true" />
            </span>
            <span className="min-w-0 flex-1 text-[15px] font-medium text-[var(--text-primary)]">Privacidad y datos</span>
            <ChevronRight size={18} color="var(--text-tertiary)" aria-hidden="true" className="shrink-0" />
          </a>
        </li>
      </motion.ul>

      {d.creditosImagenes.length > 0 && (
        <motion.section variants={item} className="mt-6">
          <h2 className="mb-2 flex items-center gap-1.5 text-[13px] font-semibold text-[var(--text-secondary)]">
            <ImageIcon size={14} aria-hidden="true" />
            Créditos de imágenes
          </h2>
          <ul className="flex flex-col gap-1.5 rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--text-tertiary)_20%,transparent)] bg-[var(--surface)] p-4">
            {d.creditosImagenes.map((c) => (
              <li key={c.nombre} className="text-[12px] leading-relaxed text-[var(--text-tertiary)]">
                <span className="font-medium text-[var(--text-secondary)]">{c.nombre}:</span> {c.credito}
              </li>
            ))}
          </ul>
        </motion.section>
      )}

      <motion.button
        variants={item}
        whileTap={{ scale: 0.98 }}
        type="button"
        onClick={cerrarSesion}
        disabled={saliendo}
        className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--text-tertiary)_28%,transparent)] text-[15px] font-medium text-[var(--text-secondary)] disabled:opacity-60 [touch-action:manipulation]"
      >
        <LogOut size={18} aria-hidden="true" />
        {saliendo ? 'Saliendo…' : 'Cerrar sesión'}
      </motion.button>

      {planAbierto && <ModalPlan plan={d.plan} onCerrar={() => setPlanAbierto(false)} />}
    </motion.main>
  );
}
