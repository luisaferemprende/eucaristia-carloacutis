'use client';

// Mano ofreciendo una vela/lamparita — para el botón "Encender mi vela".
// Dibujado en vectores con los colores de la app (no la imagen original en
// negro y turquesa): la llama usa el oro litúrgico cuando está encendida, y
// un tono neutro cuando todavía no se encendió — igual que el resto de íconos
// de estado en la app (ej. el check de "día hecho"). Una vez encendida, la
// llama tiembla suavemente de verdad (no es un gif, es la misma llama
// animándose) — se respeta "reducir movimiento" del sistema.
import { motion, useReducedMotion } from 'motion/react';

export function IconoVela({ size = 20, encendida = false }: { size?: number; encendida?: boolean }) {
  const reducir = useReducedMotion();
  const colorLlama = encendida ? 'var(--accent)' : 'var(--text-tertiary)';
  const colorMano = encendida ? 'var(--accent-text)' : 'currentColor';
  const animarLlama = encendida && !reducir;

  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" role="img" aria-hidden="true">
      {/* Llama — tiembla suavemente una vez encendida */}
      <motion.path
        d="M24 6 C26.5 10 28 13 28 16.5 C28 19.5 26.2 22 24 22 C21.8 22 20 19.5 20 16.5 C20 15 20.6 13.6 21.6 12.2 C21.7 13.4 22.3 14.2 23 14.2 C23.8 14.2 24.3 13.2 24 11.8 C23.7 10 23.6 8 24 6 Z"
        stroke={colorLlama}
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ originX: '24px', originY: '22px' }}
        animate={
          animarLlama
            ? { scaleY: [1, 1.1, 0.96, 1.06, 1], scaleX: [1, 0.95, 1.04, 0.98, 1], rotate: [0, -2, 2, -1, 0] }
            : { scaleY: 1, scaleX: 1, rotate: 0 }
        }
        transition={animarLlama ? { duration: 1.6, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.2 }}
      />
      {/* Copa / lámpara */}
      <path d="M16.5 23 C16.5 26.5 19.8 29 24 29 C28.2 29 31.5 26.5 31.5 23" stroke={colorMano} strokeWidth="2.6" strokeLinecap="round" />
      {/* Mano ofreciendo, de izquierda a derecha */}
      <path
        d="M5 34.5 C5.5 32 8 31 10.5 32 L15 33.8 C16 32 18.5 30.8 21 31.4 L26 32.6 C27 31 29.5 30 32 30.8 L37 32.6 C39.5 33.6 41 35.6 40 38 C39.2 40 36.8 40.8 34.5 40.2 C28 41.8 19.5 41.8 12.5 39.8 C8.5 38.7 5.5 37.3 5 34.5 Z"
        stroke={colorMano}
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
