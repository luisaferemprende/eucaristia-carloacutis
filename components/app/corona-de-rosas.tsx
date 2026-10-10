'use client';

// La Corona de Rosas: metáfora visual de constancia — un anillo de 7 rosas,
// una por cada día de la semana en curso. Se llena con días REALES rezados
// (tabla `rosario_dias`), nunca con un número decorativo.

import { motion } from 'motion/react';
import { Flower2 } from 'lucide-react';
import { fechaLocalISO } from '@/lib/contenido-hoy';

function ultimos7Dias(): string[] {
  const dias: string[] = [];
  const hoy = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(hoy);
    d.setDate(hoy.getDate() - i);
    dias.push(fechaLocalISO(d));
  }
  return dias;
}

export function CoronaDeRosas({ diasRezados, size = 220 }: { diasRezados: string[]; size?: number }) {
  const dias = ultimos7Dias();
  const hoy = fechaLocalISO();
  const ganadas = dias.filter((d) => diasRezados.includes(d)).length;
  const radio = size / 2 - 26;

  return (
    <div className="relative mx-auto" style={{ width: size, height: size }}>
      {dias.map((d, i) => {
        const angulo = (i / 7) * Math.PI * 2 - Math.PI / 2;
        const x = size / 2 + radio * Math.cos(angulo);
        const y = size / 2 + radio * Math.sin(angulo);
        const ganada = diasRezados.includes(d);
        const esHoy = d === hoy;
        return (
          <motion.span
            key={d}
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: i * 0.05, type: 'spring', bounce: 0.4 }}
            className={`absolute flex size-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full ${
              ganada
                ? 'bg-[var(--accent)] shadow-[0_6px_16px_color-mix(in_oklab,var(--accent)_35%,transparent)]'
                : 'border-2 border-dashed border-[color-mix(in_oklab,var(--text-tertiary)_35%,transparent)] bg-[var(--surface)]'
            } ${esHoy && !ganada ? 'border-[var(--accent)]' : ''}`}
            style={{ left: x, top: y }}
          >
            <Flower2
              size={20}
              color={ganada ? 'var(--on-accent-fill)' : 'var(--text-tertiary)'}
              strokeWidth={ganada ? 2.4 : 1.8}
              aria-hidden="true"
            />
          </motion.span>
        );
      })}
      <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center text-center">
        <span className="text-[26px] font-bold text-[var(--text-primary)] [font-family:var(--font-display)]">
          {ganadas}/7
        </span>
        <span className="text-[11px] font-medium text-[var(--text-tertiary)]">rosas esta semana</span>
      </div>
    </div>
  );
}
