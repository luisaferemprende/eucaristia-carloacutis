'use client';

// PANTALLA SECUNDARIA — Perfil. Estado de la cuenta + ajustes + salida real
// (antes "Cerrar sesión" no hacía nada — hallazgo real, regla UX 11).

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, type Variants } from 'motion/react';
import { Bell, ChevronRight, CreditCard, Image as ImageIcon, LogOut, ShieldCheck } from 'lucide-react';
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
  rachaMejor: number;
  momentoDia: string;
  plan: { nombre: string; estado: string } | null;
  creditosImagenes: { nombre: string; credito: string }[];
}

export function PerfilCliente(d: PerfilData) {
  const router = useRouter();
  const [saliendo, setSaliendo] = useState(false);

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

      <motion.ul variants={item} className="flex flex-col gap-2">
        <li className="flex items-center gap-3 rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--text-tertiary)_20%,transparent)] bg-[var(--surface)] p-4">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[var(--chip-bg)]">
            <CreditCard size={18} color="var(--accent)" aria-hidden="true" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[15px] font-medium text-[var(--text-primary)]">Mi plan</span>
            <span className="mt-0.5 block text-[13px] text-[var(--text-secondary)]">
              {d.plan ? `${d.plan.nombre} · ${d.plan.estado}` : 'Sin plan activo todavía'}
            </span>
          </span>
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
    </motion.main>
  );
}
