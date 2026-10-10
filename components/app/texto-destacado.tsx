// Resalta en teal los hallazgos clave que el propio contenido marcó entre
// **doble asterisco** — así, al escribir un nuevo día de milagro, basta
// envolver el dato científico/histórico (una cifra, un hallazgo) para que se
// note en pantalla, sin tocar código. Convención documentada en ESTADO.md.
export function TextoConDestacados({ texto, className = '' }: { texto: string; className?: string }) {
  const partes = texto.split(/\*\*(.+?)\*\*/g);
  return (
    <p className={className}>
      {partes.map((parte, i) =>
        i % 2 === 1 ? (
          <strong key={i} className="font-semibold text-[var(--accent-2)]">
            {parte}
          </strong>
        ) : (
          <span key={i}>{parte}</span>
        ),
      )}
    </p>
  );
}
