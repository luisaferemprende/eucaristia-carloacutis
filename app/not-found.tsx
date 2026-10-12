// Página 404 propia — sin esto, Next.js muestra su página genérica en inglés.
import Link from 'next/link';

export default function NoEncontrado() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-[var(--bg)] px-6 text-center [font-family:var(--font-body)]">
      <p className="text-[48px] font-bold text-[var(--accent)] [font-family:var(--font-display)]">404</p>
      <h1 className="mt-2 text-[20px] font-bold text-[var(--text-primary)] [font-family:var(--font-display)]">
        No encontramos esta página
      </h1>
      <p className="mt-2 max-w-xs text-[15px] text-[var(--text-secondary)]">
        El enlace puede estar roto o la página ya no existe.
      </p>
      <Link
        href="/"
        className="mt-6 flex h-14 items-center rounded-[var(--radius-button)] bg-[var(--accent)] px-8 text-[16px] font-semibold text-[var(--on-accent-fill)] shadow-[var(--shadow-cta)] [touch-action:manipulation]"
      >
        Volver al inicio
      </Link>
    </main>
  );
}
