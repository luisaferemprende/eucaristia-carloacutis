'use client';

// Red de seguridad de TODA la app interna (Hoy/Novena/Rosario/Diario/Perfil):
// si una pantalla falla (sin internet, un error del servidor), esto se muestra
// en vez de la pantalla en blanco o el error crudo de Next.js (regla de oro:
// "la app nunca muestra pantalla blanca"). `reset` reintenta sin recargar todo.

import { useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { EmblemaEucaristico } from '@/components/app/emblema-eucaristico';
import { createClient } from '@/lib/supabase/client';
import { registrarError } from '@/lib/eventos';

export default function ErrorApp({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Queda en la consola del navegador para poder diagnosticar — nunca se le muestra a la usuaria.
    console.error('Error en /app:', error);
    createClient()
      .auth.getUser()
      .then(({ data }) => registrarError(error, 'app', data.user?.id));
  }, [error]);

  return (
    <main className="flex min-h-dvh flex-1 flex-col items-center justify-center bg-[var(--bg)] px-6 text-center [font-family:var(--font-body)]">
      <EmblemaEucaristico className="h-16 w-16" />
      <h1 className="mt-6 text-[22px] font-bold text-[var(--text-primary)] [font-family:var(--font-display)]">
        Algo no cargó bien
      </h1>
      <p className="mt-2 max-w-xs text-[15px] leading-relaxed text-[var(--text-secondary)]">
        Puede ser tu conexión o un tropiezo de un momento. Tu racha y tus datos están a salvo.
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-6 flex h-14 items-center gap-2 rounded-[var(--radius-button)] bg-[var(--accent)] px-8 text-[16px] font-semibold text-[var(--on-accent-fill)] shadow-[var(--shadow-cta)] [touch-action:manipulation]"
      >
        <RefreshCw size={18} aria-hidden="true" />
        Reintentar
      </button>
    </main>
  );
}
