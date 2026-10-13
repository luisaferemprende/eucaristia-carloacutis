'use client';

// El Mapa Sacro: exploración libre de los milagros eucarísticos, con un
// conmutador Mapa/Lista. El mapa se carga dinámico (sin SSR) porque Leaflet
// necesita `window`. Al tocar un punto, se abre un panel inferior (bottom
// sheet) con lo esencial y un botón a la ficha completa.

import { useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter, useSearchParams } from 'next/navigation';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronLeft, List, MapIcon, Search, X } from 'lucide-react';
import { EmblemaEucaristico } from '@/components/app/emblema-eucaristico';
import type { MilagroResumen } from '@/lib/milagros';

const sinAcentos = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

const MapaSacro = dynamic(() => import('@/components/app/mapa-sacro').then((m) => m.MapaSacro), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center bg-[var(--surface-2)]">
      <p className="text-[13px] text-[var(--text-tertiary)]">Cargando el mapa…</p>
    </div>
  ),
});

type Vista = 'mapa' | 'lista';

export function MapaSacroCliente({ milagros }: { milagros: MilagroResumen[] }) {
  const router = useRouter();
  const params = useSearchParams();
  const [vista, setVista] = useState<Vista>('mapa');
  const [seleccionado, setSeleccionado] = useState<string | null>(params.get('lugar'));
  const [busqueda, setBusqueda] = useState('');

  const visibles = useMemo(() => {
    const texto = sinAcentos(busqueda.trim());
    if (!texto) return milagros;
    return milagros.filter((m) => sinAcentos(m.lugar).includes(texto));
  }, [milagros, busqueda]);
  const conUbicacion = useMemo(() => visibles.filter((m) => m.lat != null && m.lng != null), [visibles]);
  const puntos = useMemo(() => conUbicacion.map((m) => ({ lugar: m.lugar, lat: m.lat!, lng: m.lng! })), [conUbicacion]);
  const activo = milagros.find((m) => m.lugar === seleccionado) ?? null;
  const verFicha = (lugar: string) => router.push(`/app/milagro?lugar=${encodeURIComponent(lugar)}`);

  return (
    <div className="relative flex flex-1 flex-col">
      <header className="z-10 flex items-center gap-2 bg-[var(--bg)] px-4 pb-3 pt-4">
        <button
          type="button"
          aria-label="Volver a Hoy"
          onClick={() => router.push('/app')}
          className="flex size-11 shrink-0 items-center justify-center text-[var(--text-secondary)] [touch-action:manipulation]"
        >
          <ChevronLeft size={22} aria-hidden="true" />
        </button>
        <h1 className="min-w-0 flex-1 text-[18px] font-bold leading-tight text-[var(--text-primary)] [font-family:var(--font-display)]">
          El Mapa Sacro
        </h1>
        <div className="flex shrink-0 rounded-full bg-[var(--surface-2)] p-1">
          {([
            ['mapa', MapIcon],
            ['lista', List],
          ] as const).map(([v, Icono]) => (
            <button
              key={v}
              type="button"
              aria-pressed={vista === v}
              onClick={() => setVista(v)}
              className={`flex size-9 items-center justify-center rounded-full [touch-action:manipulation] ${
                vista === v ? 'bg-[var(--accent)] text-[var(--on-accent-fill)] shadow-[var(--shadow-chip)]' : 'text-[var(--text-tertiary)]'
              }`}
            >
              <Icono size={16} aria-hidden="true" />
            </button>
          ))}
        </div>
      </header>

      <div className="relative px-4 pb-3">
        <Search size={16} className="pointer-events-none absolute left-7 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" aria-hidden="true" />
        <input
          type="text"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar por país o lugar…"
          className="h-11 w-full rounded-full border border-[color-mix(in_oklab,var(--text-tertiary)_20%,transparent)] bg-[var(--surface)] pl-10 pr-4 text-[15px] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)]"
        />
      </div>

      {vista === 'mapa' ? (
        <div className="relative flex-1">
          <MapaSacro puntos={puntos} seleccionado={seleccionado} onSeleccionar={setSeleccionado} />
          {conUbicacion.length === 0 && (
            <div className="pointer-events-none absolute inset-x-6 top-6 rounded-[var(--radius-card)] bg-[var(--surface)] p-4 text-center shadow-[var(--shadow-2)]">
              <p className="text-[13px] text-[var(--text-secondary)]">
                {busqueda ? 'No encontramos milagros de ese lugar.' : 'Todavía no hay milagros ubicados en el mapa. Vuelve pronto.'}
              </p>
            </div>
          )}
        </div>
      ) : (
        <ul className="flex-1 overflow-y-auto px-4 pb-6">
          {visibles.map((m) => (
            <li key={m.lugar} className="mb-3">
              <button
                type="button"
                onClick={() => verFicha(m.lugar)}
                className="flex w-full items-center gap-3 rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--text-tertiary)_20%,transparent)] bg-[var(--surface)] p-4 text-left [touch-action:manipulation]"
              >
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--accent-2)_14%,transparent)] shadow-[var(--shadow-chip)]">
                  <EmblemaEucaristico className="h-7 w-7" color="var(--accent-2)" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[15px] font-semibold text-[var(--text-primary)]">
                    {m.lugar}
                    {m.epoca && <span className="font-normal text-[var(--text-tertiary)]"> · {m.epoca}</span>}
                  </p>
                  <p className="mt-0.5 truncate text-[13px] text-[var(--text-secondary)]">{m.resumen}</p>
                </div>
              </button>
            </li>
          ))}
          {visibles.length === 0 && (
            <li className="rounded-[var(--radius-card)] border border-dashed border-[color-mix(in_oklab,var(--text-tertiary)_30%,transparent)] p-4 text-center">
              <p className="text-[13px] text-[var(--text-tertiary)]">No encontramos milagros de ese lugar.</p>
            </li>
          )}
          <li className="mt-4 rounded-[var(--radius-card)] border border-dashed border-[color-mix(in_oklab,var(--text-tertiary)_30%,transparent)] p-4 text-center">
            <p className="text-[13px] text-[var(--text-tertiary)]">
              Iremos sumando aquí más milagros eucarísticos del catálogo mundial, uno por uno, con su historia bien verificada.
            </p>
          </li>
        </ul>
      )}

      <AnimatePresence>
        {activo && vista === 'mapa' && (
          <motion.div
            key={activo.lugar}
            initial={{ y: 220, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 220, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            style={{ willChange: 'transform', transform: 'translateZ(0)' }}
            className="fixed inset-x-0 bottom-16 z-[1001] rounded-t-[var(--radius-card)] border-t border-[color-mix(in_oklab,var(--accent)_25%,transparent)] bg-[var(--surface)] p-5 shadow-[var(--shadow-2)]"
          >
            <button
              type="button"
              aria-label="Cerrar"
              onClick={() => setSeleccionado(null)}
              className="absolute right-4 top-4 flex size-8 items-center justify-center text-[var(--text-tertiary)] [touch-action:manipulation]"
            >
              <X size={16} aria-hidden="true" />
            </button>
            <div className="flex items-center gap-3 pr-8">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--accent-2)_14%,transparent)] shadow-[var(--shadow-chip)]">
                <EmblemaEucaristico className="h-8 w-8" color="var(--accent-2)" />
              </span>
              <div className="min-w-0">
                <p className="text-[15px] font-semibold text-[var(--text-primary)]">
                  {activo.lugar}
                  {activo.epoca && <span className="font-normal text-[var(--text-tertiary)]"> · {activo.epoca}</span>}
                </p>
                <p className="mt-0.5 line-clamp-2 text-[13px] text-[var(--text-secondary)]">{activo.resumen}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => verFicha(activo.lugar)}
              className="mt-4 h-12 w-full rounded-[var(--radius-button)] bg-[var(--accent)] text-[14px] font-semibold text-[var(--on-accent-fill)] shadow-[var(--shadow-cta)] [touch-action:manipulation]"
            >
              Ver la ficha completa
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
