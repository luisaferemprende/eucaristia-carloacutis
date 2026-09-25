// PENDIENTE — se construye en la Sesión 4 (02B-ONBOARDING-Y-PAYWALL.md).
// El CTA de la landing ya apunta aquí (Modelo 2, variante anónima); este stub
// evita un enlace roto mientras no existe el recorrido real. Ver ESTADO.md.
export default function OnboardingPendiente() {
  return (
    <main className="min-h-dvh flex flex-col items-center justify-center gap-4 bg-[var(--bg)] text-[var(--text-primary)] px-6 text-center [font-family:var(--font-body)]">
      <p className="text-[var(--text-secondary)]">
        Tu primer día con La Autopista de 3 Minutos está en camino.
      </p>
      <a href="/" className="text-[16px] font-semibold text-[var(--accent-2)] underline">
        Volver al inicio
      </a>
    </main>
  );
}
