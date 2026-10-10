'use client';

// PANTALLA SECUNDARIA — Diario. Acción de crear JUNTO a la lista que alimenta
// (regla UX 12) + fechas reales por entrada (regla UX 13). El botón "+" abre
// un formulario inline. Cada entrada se puede leer completa, editar o borrar
// (regla UX 8: undo/confirmación en acciones irreversibles — el borrado pide
// confirmar antes de ejecutarse).

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion, type Variants } from 'motion/react';
import { ChevronDown, Pencil, Plus, Trash2, X } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

const lista: Variants = { hidden: {}, visible: { transition: { staggerChildren: 0.05 } } };
const item: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] } },
};

const FECHA_LARGA = new Intl.DateTimeFormat('es', { weekday: 'long', day: 'numeric', month: 'long' });
const LARGO_CORTE = 140;

export interface EntradaDiario {
  id: string;
  fecha: string;
  texto: string;
}

function EntradaCard({
  entrada,
  onCambio,
}: {
  entrada: EntradaDiario;
  onCambio: (accion: 'editar' | 'borrar', id: string, textoNuevo?: string) => Promise<void>;
}) {
  const [abierta, setAbierta] = useState(false);
  const [editando, setEditando] = useState(false);
  const [texto, setTexto] = useState(entrada.texto);
  const [confirmarBorrar, setConfirmarBorrar] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const esLarga = entrada.texto.length > LARGO_CORTE;

  const guardarEdicion = async () => {
    if (!texto.trim() || guardando) return;
    setGuardando(true);
    await onCambio('editar', entrada.id, texto.trim());
    setGuardando(false);
    setEditando(false);
  };

  const confirmarYBorrar = async () => {
    setGuardando(true);
    await onCambio('borrar', entrada.id);
  };

  return (
    <motion.li
      variants={item}
      className="rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--text-tertiary)_20%,transparent)] bg-[var(--surface)] p-5"
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-[12px] font-semibold uppercase tracking-[0.06em] text-[var(--text-tertiary)]">
          {FECHA_LARGA.format(new Date(entrada.fecha))}
        </p>
        {!editando && (
          <div className="flex shrink-0 gap-1">
            <button
              type="button"
              aria-label="Editar esta entrada"
              onClick={() => setEditando(true)}
              className="flex size-8 items-center justify-center rounded-full text-[var(--text-tertiary)] [touch-action:manipulation]"
            >
              <Pencil size={15} aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-label="Borrar esta entrada"
              onClick={() => setConfirmarBorrar(true)}
              className="flex size-8 items-center justify-center rounded-full text-[var(--text-tertiary)] [touch-action:manipulation]"
            >
              <Trash2 size={15} aria-hidden="true" />
            </button>
          </div>
        )}
      </div>

      {editando ? (
        <div className="mt-2">
          <textarea
            autoFocus
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            rows={4}
            className="w-full resize-none rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--text-tertiary)_24%,transparent)] bg-[var(--bg)] p-3 text-[15px] leading-relaxed text-[var(--text-primary)] outline-none focus:border-[var(--accent)]"
          />
          <div className="mt-2 flex gap-2">
            <button
              type="button"
              onClick={() => {
                setEditando(false);
                setTexto(entrada.texto);
              }}
              className="h-10 rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--text-tertiary)_28%,transparent)] px-4 text-[13px] font-medium text-[var(--text-secondary)] [touch-action:manipulation]"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={guardarEdicion}
              disabled={!texto.trim() || guardando}
              className="h-10 flex-1 rounded-[var(--radius-button)] bg-[var(--accent)] text-[13px] font-semibold text-[var(--on-accent-fill)] disabled:opacity-60 [touch-action:manipulation]"
            >
              {guardando ? 'Guardando…' : 'Guardar cambios'}
            </button>
          </div>
        </div>
      ) : (
        <>
          <p
            className={`mt-2 text-[15px] leading-relaxed text-[var(--text-primary)] ${
              esLarga && !abierta ? 'line-clamp-3' : ''
            }`}
          >
            {entrada.texto}
          </p>
          {esLarga && (
            <button
              type="button"
              onClick={() => setAbierta((v) => !v)}
              className="mt-1.5 flex items-center gap-1 text-[13px] font-medium text-[var(--accent-text)] [touch-action:manipulation]"
            >
              {abierta ? 'Leer menos' : 'Leer completa'}
              <ChevronDown
                size={14}
                aria-hidden="true"
                className={`transition-transform duration-200 ${abierta ? 'rotate-180' : ''}`}
              />
            </button>
          )}
        </>
      )}

      <AnimatePresence>
        {confirmarBorrar && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 overflow-hidden rounded-[var(--radius-button)] bg-[color-mix(in_oklab,var(--danger)_8%,transparent)] p-3"
          >
            <p className="text-[13px] text-[var(--text-primary)]">¿Borrar esta entrada? No se puede deshacer.</p>
            <div className="mt-2 flex gap-2">
              <button
                type="button"
                onClick={() => setConfirmarBorrar(false)}
                className="h-9 rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--text-tertiary)_28%,transparent)] px-3 text-[12px] font-medium text-[var(--text-secondary)] [touch-action:manipulation]"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirmarYBorrar}
                disabled={guardando}
                className="h-9 flex-1 rounded-[var(--radius-button)] bg-[var(--danger)] text-[12px] font-semibold text-white disabled:opacity-60 [touch-action:manipulation]"
              >
                {guardando ? 'Borrando…' : 'Sí, borrar'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.li>
  );
}

export function DiarioCliente({ entradas: entradasIniciales }: { entradas: EntradaDiario[] }) {
  const router = useRouter();
  const [entradas, setEntradas] = useState(entradasIniciales);
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

  const cambiarEntrada = async (accion: 'editar' | 'borrar', id: string, textoNuevo?: string) => {
    const supabase = createClient();
    if (accion === 'editar' && textoNuevo) {
      const { error } = await supabase.from('diary_entries').update({ texto: textoNuevo }).eq('id', id);
      if (!error) setEntradas((es) => es.map((e) => (e.id === id ? { ...e, texto: textoNuevo } : e)));
    } else if (accion === 'borrar') {
      const { error } = await supabase.from('diary_entries').delete().eq('id', id);
      if (!error) setEntradas((es) => es.filter((e) => e.id !== id));
    }
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
            <EntradaCard key={e.id} entrada={e} onCambio={cambiarEntrada} />
          ))}
        </ul>
      )}
    </motion.main>
  );
}
