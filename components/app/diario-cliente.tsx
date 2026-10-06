'use client';

// PANTALLA SECUNDARIA — Diario. Acción de crear JUNTO a la lista que alimenta
// (regla UX 12) + fechas reales por entrada (regla UX 13). El botón "+" abre
// un formulario inline — antes no hacía nada (hallazgo real, regla UX 11).

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, type Variants } from 'motion/react';
import { Plus, X } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

const lista: Variants = { hidden: {}, visible: { transition: { staggerChildren: 0.05 } } };
const item: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] } },
};

const FECHA_LARGA = new Intl.DateTimeFormat('es', { weekday: 'short', day: 'numeric', month: 'short' });

export interface EntradaDiario {
  id: string;
  fecha: string;
  texto: string;
}

export function DiarioCliente({ entradas }: { entradas: EntradaDiario[] }) {
  const router = useRouter();
  const [escribiendo, setEscribiendo] = useState(false);
  const [texto, setTexto] = useState('');
  const [guardando, setGuardando] = useState(false);

  const guardar = async () => {
    if (!texto.trim() || guardando) return;
    setGuardando(true);
    const supabase = createClient();
    const { data: userData } = await supabase.auth.getUser();
    if (userData.user) {
      await supabase.from('diary_entries').insert({ user_id: userData.user.id, texto: texto.trim() });
      setTexto('');
      setEscribiendo(false);
      router.refresh();
    }
    setGuardando(false);
  };

  return (
    <motion.main variants={lista} initial="hidden" animate="visible" className="flex-1 px-4 pt-6 pb-4">
      <motion.header variants={item} className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-[13px] font-medium text-[var(--text-tertiary)]">Solo entre tú y Dios</p>
          <h1 className="mt-1 text-balance text-[28px] font-bold leading-[1.1] text-[var(--text-primary)] [font-family:var(--font-display)]">
            Tu diario espiritual
          </h1>
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          type="button"
          aria-label={escribiendo ? 'Cerrar' : 'Escribir una nueva entrada'}
          onClick={() => setEscribiendo((v) => !v)}
          className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[var(--accent)] text-[var(--on-accent-fill)] shadow-[0_8px_20px_color-mix(in_oklab,var(--accent)_28%,transparent)] [touch-action:manipulation]"
        >
          {escribiendo ? <X size={22} aria-hidden="true" /> : <Plus size={22} aria-hidden="true" />}
        </motion.button>
      </motion.header>

      {escribiendo && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mb-4 overflow-hidden rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--accent)_25%,transparent)] bg-[var(--surface)] p-4"
        >
          <textarea
            autoFocus
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder="¿Qué quieres decirle a Dios hoy?"
            rows={4}
            className="w-full resize-none bg-transparent text-[15px] text-[var(--text-primary)] outline-none placeholder:text-[var(--text-tertiary)]"
          />
          <button
            type="button"
            onClick={guardar}
            disabled={!texto.trim() || guardando}
            className="mt-2 h-11 w-full rounded-[var(--radius-button)] bg-[var(--accent)] text-[15px] font-semibold text-[var(--on-accent-fill)] disabled:opacity-50 [touch-action:manipulation]"
          >
            {guardando ? 'Guardando…' : 'Guardar entrada'}
          </button>
        </motion.div>
      )}

      {entradas.length === 0 ? (
        <motion.div
          variants={item}
          className="flex flex-col items-center gap-2 rounded-[var(--radius-card)] border border-dashed border-[color-mix(in_oklab,var(--text-tertiary)_35%,transparent)] px-6 py-10 text-center"
        >
          <p className="text-[15px] font-medium text-[var(--text-primary)]">Tu diario está vacío por ahora</p>
          <p className="text-[13px] text-[var(--text-secondary)]">Toca el botón de arriba y escribe tu primera entrada.</p>
        </motion.div>
      ) : (
        <ul className="flex flex-col gap-3">
          {entradas.map((e) => (
            <motion.li
              key={e.id}
              variants={item}
              className="rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--text-tertiary)_20%,transparent)] bg-[var(--surface)] p-5"
            >
              <p className="text-[12px] font-semibold uppercase tracking-[0.06em] text-[var(--text-tertiary)]">
                {FECHA_LARGA.format(new Date(e.fecha))}
              </p>
              <p className="mt-2 text-[15px] leading-relaxed text-[var(--text-primary)]">{e.texto}</p>
            </motion.li>
          ))}
        </ul>
      )}
    </motion.main>
  );
}
