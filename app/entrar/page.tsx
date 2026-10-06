'use client';

// Login real (50 Sección E): magic link como CTA primario, Google como
// secundaria, 3 estados explícitos (enviando/enviado/error) y error
// anti-enumeración (nunca revela si el correo existe — 26-AUTH-MODERNO.md).
// Sesión 6: conectado a Supabase Auth de verdad.

import { useState, type FormEvent } from 'react';
import { motion } from 'motion/react';
import { Mail } from 'lucide-react';
import { CtaFunnel } from '@/components/funnel/ui';
import { createClient } from '@/lib/supabase/client';

type Estado = 'reposo' | 'enviando' | 'enviado' | 'error';

export default function Entrar() {
  const [correo, setCorreo] = useState('');
  const [estado, setEstado] = useState<Estado>('reposo');

  const enviarEnlace = async (e: FormEvent) => {
    e.preventDefault();
    if (!correo.includes('@')) {
      setEstado('error');
      return;
    }
    setEstado('enviando');
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email: correo,
      options: { emailRedirectTo: `${window.location.origin}/app` },
    });
    // Anti-enumeración: Supabase ya responde igual exista o no el correo para
    // signInWithOtp — cualquier error de red/formato muestra el mismo mensaje genérico.
    setEstado(error ? 'error' : 'enviado');
  };

  const continuarConGoogle = async () => {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/app` },
    });
  };

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-[var(--bg)] px-6 [font-family:var(--font-body)]">
      <div className="w-full max-w-[360px]">
        <h1 className="text-balance text-center text-[26px] font-bold leading-[1.2] text-[var(--text-primary)] [font-family:var(--font-display)]">
          Entra a tu Autopista de 3 Minutos
        </h1>
        <p className="mt-2 text-center text-[15px] text-[var(--text-secondary)]">
          Sin contraseñas que olvidar — te mandamos un enlace a tu correo.
        </p>

        {estado === 'enviado' ? (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 flex flex-col items-center gap-3 rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--accent)_30%,transparent)] bg-[color-mix(in_oklab,var(--accent)_8%,transparent)] p-5 text-center"
          >
            <Mail size={26} className="text-[var(--accent)]" />
            <p className="text-[15px] leading-relaxed text-[var(--text-primary)]">
              Te escribimos a <span className="font-semibold">{correo}</span>. Abre ese correo y
              toca el enlace para entrar.
            </p>
            <button
              onClick={() => setEstado('reposo')}
              className="text-[14px] font-medium text-[var(--text-secondary)] underline-offset-2 hover:underline"
            >
              Usar otro correo
            </button>
          </motion.div>
        ) : (
          <form onSubmit={enviarEnlace} className="mt-8 flex flex-col gap-3">
            <div>
              <label htmlFor="correo" className="sr-only">
                Correo electrónico
              </label>
              <input
                id="correo"
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="tu@correo.com"
                value={correo}
                onChange={(e) => {
                  setCorreo(e.target.value);
                  if (estado === 'error') setEstado('reposo');
                }}
                className={`h-14 w-full rounded-[var(--radius-button)] border bg-[var(--surface)] px-4 text-[16px] text-[var(--text-primary)] outline-none transition-colors placeholder:text-[var(--text-tertiary)] ${
                  estado === 'error'
                    ? 'border-[var(--danger)]'
                    : 'border-[color-mix(in_oklab,var(--text-tertiary)_28%,transparent)] focus:border-[var(--accent)]'
                }`}
              />
              {estado === 'error' && (
                <p className="mt-2 text-[13px] text-[var(--danger)]">
                  Revisa tu correo — si es válido, te llegará el enlace.
                </p>
              )}
            </div>

            <CtaFunnel type="submit" disabled={estado === 'enviando'}>
              {estado === 'enviando' ? 'Enviando…' : 'Enviarme mi enlace'}
            </CtaFunnel>

            <div className="my-1 flex items-center gap-3 text-[13px] text-[var(--text-tertiary)]">
              <span className="h-px flex-1 bg-[color-mix(in_oklab,var(--text-tertiary)_22%,transparent)]" />
              o
              <span className="h-px flex-1 bg-[color-mix(in_oklab,var(--text-tertiary)_22%,transparent)]" />
            </div>

            <button
              type="button"
              onClick={continuarConGoogle}
              className="flex h-14 w-full items-center justify-center gap-3 rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--text-tertiary)_28%,transparent)] bg-[var(--surface)] text-[15px] font-semibold text-[var(--text-primary)] transition-opacity [touch-action:manipulation] active:opacity-70"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="#4285F4" d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.47c-.28 1.5-1.13 2.77-2.4 3.62v3h3.87c2.27-2.09 3.58-5.17 3.58-8.81z" />
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.07 7.94-2.92l-3.87-3c-1.07.72-2.44 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.28v3.09C3.26 21.3 7.26 24 12 24z" />
                <path fill="#FBBC05" d="M5.27 14.27a7.24 7.24 0 0 1 0-4.54v-3.09H1.28a11.97 11.97 0 0 0 0 10.72z" />
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.94 1.19 15.24 0 12 0 7.26 0 3.26 2.7 1.28 6.64l3.99 3.09C6.22 6.86 8.87 4.75 12 4.75z" />
              </svg>
              Continuar con Google
            </button>
          </form>
        )}

        <p className="mt-8 text-center text-[13px] text-[var(--text-tertiary)]">
          Al continuar aceptas nuestros{' '}
          <a href="/terminos" className="underline">
            Términos
          </a>{' '}
          y{' '}
          <a href="/privacidad" className="underline">
            Privacidad
          </a>
          .
        </p>
      </div>
    </main>
  );
}
