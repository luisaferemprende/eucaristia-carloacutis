// Piezas compartidas del panel: tarjeta de métrica (dato héroe + insight,
// 17-VISUALIZACION-DATOS), estado "Sin datos" honesto (nunca se inventa un
// número), y el banner de avisos automáticos para el dueño.

import type { LucideIcon } from 'lucide-react';
import { AlertTriangle, CheckCircle2, Info } from 'lucide-react';

export function TarjetaMetrica({
  titulo,
  valor,
  insight,
  sinDatos,
  Icono,
}: {
  titulo: string;
  valor: string;
  insight?: string;
  sinDatos?: boolean;
  Icono?: LucideIcon;
}) {
  return (
    <div className="rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--text-tertiary)_16%,transparent)] bg-[var(--surface)] p-5">
      <div className="flex items-center gap-2">
        {Icono && <Icono size={15} color="var(--text-tertiary)" aria-hidden="true" />}
        <p className="text-[13px] font-semibold text-[var(--text-secondary)]">{titulo}</p>
      </div>
      <p
        className={`mt-2 text-[28px] font-bold leading-none [font-family:var(--font-display)] ${
          sinDatos ? 'text-[var(--text-tertiary)]' : 'text-[var(--text-primary)]'
        }`}
      >
        {sinDatos ? 'Sin datos' : valor}
      </p>
      {insight && !sinDatos && <p className="mt-2 text-[13px] leading-snug text-[var(--text-secondary)]">{insight}</p>}
      {sinDatos && <p className="mt-2 text-[13px] leading-snug text-[var(--text-tertiary)]">Todavía no hay datos reales para calcular esto.</p>}
    </div>
  );
}

export type NivelAviso = 'info' | 'alerta' | 'bien';

export interface Aviso {
  nivel: NivelAviso;
  texto: string;
}

export function BannerAvisos({ avisos }: { avisos: Aviso[] }) {
  if (avisos.length === 0) {
    return (
      <div className="flex items-center gap-3 rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--accent-2)_30%,transparent)] bg-[color-mix(in_oklab,var(--accent-2)_8%,transparent)] px-5 py-4">
        <Info size={18} color="var(--accent-2)" aria-hidden="true" className="shrink-0" />
        <p className="text-[14px] text-[var(--text-primary)]">Todavía no hay datos suficientes para evaluar avisos — vuelve cuando tengas algunas ventas o usuarios activos.</p>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-2">
      {avisos.map((a, i) => (
        <div
          key={i}
          className={`flex items-start gap-3 rounded-[var(--radius-card)] border px-5 py-4 ${
            a.nivel === 'bien'
              ? 'border-[color-mix(in_oklab,var(--accent-2)_30%,transparent)] bg-[color-mix(in_oklab,var(--accent-2)_8%,transparent)]'
              : a.nivel === 'alerta'
                ? 'border-[color-mix(in_oklab,var(--danger)_30%,transparent)] bg-[color-mix(in_oklab,var(--danger)_8%,transparent)]'
                : 'border-[color-mix(in_oklab,var(--accent)_30%,transparent)] bg-[color-mix(in_oklab,var(--accent)_8%,transparent)]'
          }`}
        >
          {a.nivel === 'bien' ? (
            <CheckCircle2 size={18} color="var(--accent-2)" aria-hidden="true" className="mt-0.5 shrink-0" />
          ) : (
            <AlertTriangle size={18} color={a.nivel === 'alerta' ? 'var(--danger)' : 'var(--accent-text)'} aria-hidden="true" className="mt-0.5 shrink-0" />
          )}
          <p className="text-[14px] leading-relaxed text-[var(--text-primary)]">{a.texto}</p>
        </div>
      ))}
    </div>
  );
}

export function TituloSeccion({ children, subtitulo }: { children: React.ReactNode; subtitulo?: string }) {
  return (
    <div className="mb-6">
      <h1 className="text-[24px] font-bold leading-tight text-[var(--text-primary)] [font-family:var(--font-display)]">{children}</h1>
      {subtitulo && <p className="mt-1 text-[14px] text-[var(--text-secondary)]">{subtitulo}</p>}
    </div>
  );
}
