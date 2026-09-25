// PENDIENTE — el login real (magic link/OTP, Hotmart-first) se construye en la
// Sesión 6 junto con Supabase (26-AUTH-MODERNO.md). Ver ESTADO.md.
export default function Entrar() {
  return (
    <main className="min-h-dvh flex flex-col items-center justify-center gap-4 bg-[var(--bg)] text-[var(--text-primary)] px-6 text-center [font-family:var(--font-body)]">
      <p className="text-[var(--text-secondary)]">
        El acceso a tu cuenta está en camino.
      </p>
      <a href="/" className="text-[16px] font-semibold text-[var(--accent-2)] underline">
        Volver al inicio
      </a>
    </main>
  );
}
