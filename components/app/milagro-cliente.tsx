'use client';

// Ficha detallada del milagro eucarístico del día — 3 bloques (contexto,
// hecho milagroso, ciencia/Iglesia), insignia de lugar+época, cierre
// devocional con la frase del santo del día, y acciones reales: guardar en
// reflexiones y ver el lugar en el Mapa Sacro.

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, type Variants } from 'motion/react';
import { BookMarked, ChevronLeft, FlaskConical, Landmark, Map, Quote, Sparkles } from 'lucide-react';
import { EmblemaEucaristico } from '@/components/app/emblema-eucaristico';
import { TextoConDestacados } from '@/components/app/texto-destacado';
import { createClient } from '@/lib/supabase/client';
import type { ContenidoDiario } from '@/lib/contenido-hoy';

const lista: Variants = { hidden: {}, visible: { transition: { staggerChildren: 0.07 } } };
const item: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } },
};

const BLOQUES = [
  { clave: 'milagro_contexto' as const, titulo: 'El contexto histórico', Icono: Landmark },
  { clave: 'milagro_hecho' as const, titulo: 'El hecho milagroso', Icono: Sparkles },
  { clave: 'milagro_iglesia' as const, titulo: 'Lo que dice la ciencia y la Iglesia', Icono: FlaskConical },
];

export function MilagroCliente({ contenido, guardadoInicial }: { contenido: ContenidoDiario | null; guardadoInicial: boolean }) {
  const router = useRouter();
  const [guardado, setGuardado] = useState(guardadoInicial);
  const [guardando, setGuardando] = useState(false);
  const volver = () => router.push('/app');

  if (!contenido) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <p className="text-[22px] font-semibold text-[var(--text-primary)] [font-family:var(--font-display)]">
          Hoy todavía estamos preparando el milagro
        </p>
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

  // Si el día todavía no tiene los 3 bloques nuevos escritos, se cae al relato
  // largo de siempre — nunca una pantalla vacía ni un bloque inventado.
  const tieneTresBloques = contenido.milagro_contexto && contenido.milagro_hecho && contenido.milagro_iglesia;
  const relatoLargo = (contenido.milagro_historia ?? contenido.milagro_resumen).split('\n\n').filter(Boolean);

  const alternarGuardado = async () => {
    if (guardando) return;
    setGuardando(true);
    const supabase = createClient();
    const { data: userData } = await supabase.auth.getUser();
    if (userData.user) {
      if (guardado) {
        await supabase
          .from('reflexiones_guardadas')
          .delete()
          .eq('user_id', userData.user.id)
          .eq('milagro_lugar', contenido.milagro_lugar);
        setGuardado(false);
      } else {
        await supabase
          .from('reflexiones_guardadas')
          .upsert({ user_id: userData.user.id, milagro_lugar: contenido.milagro_lugar }, { onConflict: 'user_id,milagro_lugar' });
        setGuardado(true);
      }
    }
    setGuardando(false);
  };

  return (
    <motion.main variants={lista} initial="hidden" animate="visible" className="flex-1 px-4 pt-4 pb-6">
      <motion.header variants={item} className="mb-4 flex items-center gap-2">
        <button
          type="button"
          aria-label="Volver a Hoy"
          onClick={volver}
          className="flex size-11 shrink-0 items-center justify-center text-[var(--text-secondary)] [touch-action:manipulation]"
        >
          <ChevronLeft size={22} aria-hidden="true" />
        </button>
        <p className="text-[13px] font-medium text-[var(--text-tertiary)]">Milagro eucarístico de hoy</p>
      </motion.header>

      {/* Cabecera: insignia de lugar + época */}
      <motion.section
        variants={item}
        className="relative overflow-hidden rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--accent)_20%,transparent)] bg-[var(--surface)] p-6 shadow-[var(--shadow-2)]"
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full"
          style={{ background: 'radial-gradient(circle, color-mix(in oklab, var(--accent) 12%, transparent) 0%, transparent 70%)' }}
        />
        <span
          aria-hidden="true"
          className="relative flex size-12 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--accent-2)_14%,transparent)] shadow-[var(--shadow-chip)]"
        >
          <EmblemaEucaristico className="h-8 w-8" color="var(--accent-2)" />
        </span>
        <h1 className="relative mt-3 text-balance text-[24px] font-bold leading-[1.2] text-[var(--text-primary)] [font-family:var(--font-display)]">
          {contenido.milagro_lugar}
        </h1>
        <p className="relative mt-1 inline-flex w-fit items-center gap-1.5 rounded-full bg-[var(--chip-bg)] px-3 py-1 text-[13px] font-medium text-[var(--accent-text)]">
          {contenido.milagro_lugar}
          {contenido.milagro_epoca && ` · ${contenido.milagro_epoca}`}
        </p>
        <p className="relative mt-4 text-balance text-[18px] font-semibold leading-[1.4] text-[var(--text-primary)] [font-family:var(--font-display)]">
          {contenido.milagro_resumen}
        </p>
      </motion.section>

      {/* Los 3 bloques, o el relato largo si este día aún no los tiene */}
      {tieneTresBloques ? (
        <div className="mt-6 flex flex-col gap-4">
          {BLOQUES.map(({ clave, titulo, Icono }) => (
            <motion.section
              key={clave}
              variants={item}
              className="rounded-[var(--radius-card)] bg-[var(--surface-2)] p-5"
            >
              <div className="flex items-center gap-2">
                <Icono size={16} color="var(--accent-2)" aria-hidden="true" />
                <p className="text-[13px] font-semibold text-[var(--text-secondary)]">{titulo}</p>
              </div>
              <TextoConDestacados
                texto={contenido[clave] ?? ''}
                className="mt-2 text-[16px] leading-relaxed text-[var(--text-primary)]"
              />
            </motion.section>
          ))}
        </div>
      ) : (
        <motion.section variants={item} aria-label="La historia" className="mt-6 space-y-5 px-1">
          {relatoLargo.map((p, i) => (
            <TextoConDestacados key={i} texto={p} className="text-[16px] leading-relaxed text-[var(--text-primary)]" />
          ))}
        </motion.section>
      )}

      {contenido.milagro_fuente && (
        <motion.p variants={item} className="mt-4 px-1 text-[13px] leading-snug text-[var(--text-tertiary)]">
          Fuente: {contenido.milagro_fuente}
        </motion.p>
      )}

      {/* Cierre devocional: la frase del santo del día sobre la Eucaristía */}
      <motion.aside
        variants={item}
        className="mt-6 rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--accent)_25%,transparent)] bg-[var(--bg)] p-5 text-center"
      >
        <Quote size={22} color="var(--accent)" aria-hidden="true" className="mx-auto" />
        <p className="mt-2 text-balance text-[18px] italic leading-snug text-[var(--text-primary)] [font-family:var(--font-display)]">
          «{contenido.pensamiento}»
        </p>
        <p className="mt-2 text-[13px] font-semibold uppercase tracking-[0.06em] text-[var(--accent-text)]">
          {contenido.santo_nombre}
        </p>
      </motion.aside>

      <motion.div variants={item} className="mt-6 flex gap-3">
        <button
          type="button"
          onClick={alternarGuardado}
          disabled={guardando}
          className={`flex h-14 flex-1 items-center justify-center gap-2 rounded-[var(--radius-button)] border text-[14px] font-semibold [touch-action:manipulation] disabled:opacity-60 ${
            guardado
              ? 'border-[var(--accent)] bg-[color-mix(in_oklab,var(--accent)_10%,transparent)] text-[var(--accent-text)]'
              : 'border-[color-mix(in_oklab,var(--text-tertiary)_28%,transparent)] text-[var(--text-secondary)]'
          }`}
        >
          <BookMarked size={18} aria-hidden="true" />
          {guardado ? 'Guardado' : 'Guardar en mis reflexiones'}
        </button>
        {contenido.milagro_lat != null && contenido.milagro_lng != null && (
          <button
            type="button"
            onClick={() => router.push(`/app/mapa?lugar=${encodeURIComponent(contenido.milagro_lugar)}`)}
            className="flex h-14 flex-1 items-center justify-center gap-2 rounded-[var(--radius-button)] bg-[var(--accent)] text-[14px] font-semibold text-[var(--on-accent-fill)] shadow-[var(--shadow-cta)] [touch-action:manipulation]"
          >
            <Map size={18} aria-hidden="true" />
            Ver en el mapa
          </button>
        )}
      </motion.div>
    </motion.main>
  );
}
