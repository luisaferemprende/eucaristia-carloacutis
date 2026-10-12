// Emblema eucarístico (custodia de rayos con hostia y cruz) y retrato en arco del
// santo. Si el santo tiene retrato con licencia verificada se muestra; si no, el
// emblema ocupa su lugar — nunca una imagen dudosa. Sin hooks: sirve en servidor y cliente.

const RAYOS = Array.from({ length: 32 }, (_, i) => {
  const a = (i / 32) * Math.PI * 2;
  const largo = i % 2 === 0 ? 150 : 112;
  const r2 = (n: number) => Number(n.toFixed(2));
  return {
    x1: r2(Math.cos(a) * 82),
    y1: r2(Math.sin(a) * 82),
    x2: r2(Math.cos(a) * largo),
    y2: r2(Math.sin(a) * largo),
    larga: i % 2 === 0,
  };
});

export function EmblemaEucaristico({
  className = '',
  color = 'var(--accent)',
}: {
  className?: string;
  /** Color de los rayos y el aro — oro (--accent) por defecto; teal (--accent-2) para contextos de milagro. */
  color?: string;
}) {
  return (
    <svg viewBox="-170 -170 340 340" className={className} role="img" aria-label="Eucaristía">
      {RAYOS.map((r, i) => (
        <line
          key={i}
          x1={r.x1}
          y1={r.y1}
          x2={r.x2}
          y2={r.y2}
          strokeLinecap="round"
          strokeWidth={r.larga ? 5 : 3}
          style={{ stroke: color, opacity: r.larga ? 0.9 : 0.55 }}
        />
      ))}
      <circle r="66" style={{ fill: 'var(--text-primary)' }} />
      <circle r="74" fill="none" strokeWidth="4" style={{ stroke: color }} />
      <rect x="-5" y="-34" width="10" height="68" style={{ fill: 'var(--bg)' }} />
      <rect x="-22" y="-16" width="44" height="10" style={{ fill: 'var(--bg)' }} />
    </svg>
  );
}

// Cáliz con la hostia (cruz dentro del círculo) — reemplaza íconos genéricos
// (ej. una estrella) en tarjetas relacionadas con el milagro eucarístico.
// Monocromo, como el resto de íconos dentro de un chip de color.
export function IconoCalizHostia({ size = 20, color = 'var(--accent-2)' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" role="img" aria-hidden="true">
      <circle cx="12" cy="5" r="3.1" stroke={color} strokeWidth="1.6" />
      <path d="M12 3.6 L12 6.4 M10.7 5 L13.3 5" stroke={color} strokeWidth="1.3" strokeLinecap="round" />
      <path
        d="M7 9 L17 9 M7.5 9 C7.5 12.4 9.7 14.2 12 14.2 C14.3 14.2 16.5 12.4 16.5 9 M12 14.2 L12 17.2 M9.3 17.2 C9.3 18.4 10.4 18.8 12 18.8 C13.6 18.8 14.7 18.4 14.7 17.2 M8.6 20 L15.4 20"
        stroke={color}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function RetratoSanto({
  url,
  alt,
  className = 'h-[72px] w-[60px]',
}: {
  url: string | null;
  alt: string | null;
  className?: string;
}) {
  return (
    <div
      className={`relative shrink-0 overflow-hidden rounded-t-full border-2 border-[var(--accent)] bg-gradient-to-b from-[var(--surface-2)] to-[var(--surface)] ${className}`}
    >
      {url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt={alt ?? ''} className="size-full object-cover object-[50%_18%]" />
      ) : (
        <EmblemaEucaristico className="absolute left-1/2 top-[46%] w-[150%] -translate-x-1/2 -translate-y-1/2" />
      )}
    </div>
  );
}
