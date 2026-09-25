// PENDIENTE — se redacta con 47-LEGAL-FISCAL-Y-PRIVACIDAD.md en cuanto el dueño
// dé los DATOS DEL RESPONSABLE (nombre/razón social, país, email de contacto).
// Ver ESTADO.md → Pendientes del usuario.
export default function Privacidad() {
  return (
    <main className="min-h-dvh flex flex-col items-center justify-center gap-4 bg-[var(--bg)] text-[var(--text-primary)] px-6 text-center [font-family:var(--font-body)]">
      <h1 className="text-[24px] font-bold [font-family:var(--font-display)]">Política de Privacidad</h1>
      <p className="max-w-[52ch] text-[16px] text-[var(--text-secondary)]">
        Estamos puliendo los últimos detalles de esta página. Vuelve en unos días para leerla completa.
      </p>
      <a href="/" className="text-[16px] font-semibold text-[var(--accent-2)] underline">
        Volver al inicio
      </a>
    </main>
  );
}
