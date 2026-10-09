'use client';

// TARJETA-PREMIO de una novena completada: siempre en el tema de noche (es una
// pieza para guardar y compartir), con el retrato del santo, su frase y la
// fecha. "Descargar" dibuja la MISMA tarjeta en un canvas de 1080×1350 leyendo
// los colores reales de los tokens (nada de hex duplicados) y la comparte o
// descarga como imagen.

import { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Download, Share2 } from 'lucide-react';
import { fechaLarga, type SantoNovena } from '@/lib/novena';

interface Props {
  santo: SantoNovena;
  diasTotal: number;
  fecha: string | null;
  nombrePersona: string;
}

function cargarImagen(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function rectRedondeado(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
}

function envolverTexto(ctx: CanvasRenderingContext2D, texto: string, maxAncho: number): string[] {
  const palabras = texto.split(' ');
  const lineas: string[] = [];
  let actual = '';
  for (const p of palabras) {
    const prueba = actual ? `${actual} ${p}` : p;
    if (ctx.measureText(prueba).width > maxAncho && actual) {
      lineas.push(actual);
      actual = p;
    } else {
      actual = prueba;
    }
  }
  if (actual) lineas.push(actual);
  return lineas;
}

export function TarjetaNovena({ santo, diasTotal, fecha, nombrePersona }: Props) {
  const tarjetaRef = useRef<HTMLDivElement>(null);
  const [generando, setGenerando] = useState(false);
  const [error, setError] = useState(false);
  const puedeCompartir = typeof navigator !== 'undefined' && typeof navigator.share === 'function';

  const crearImagen = async (): Promise<Blob> => {
    const el = tarjetaRef.current!;
    const cs = getComputedStyle(el);
    const v = (n: string) => cs.getPropertyValue(n).trim();
    const fuenteDisplay = v('--font-display') || 'serif';
    const fuenteCuerpo = v('--font-body') || 'sans-serif';
    await document.fonts.ready;

    const W = 1080;
    const H = 1350;
    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = v('--bg');
    ctx.fillRect(0, 0, W, H);
    const halo = ctx.createRadialGradient(W * 0.8, 120, 0, W * 0.8, 120, 620);
    halo.addColorStop(0, `${v('--accent')}40`);
    halo.addColorStop(1, `${v('--accent')}00`);
    ctx.fillStyle = halo;
    ctx.fillRect(0, 0, W, H);

    ctx.strokeStyle = v('--accent');
    ctx.globalAlpha = 0.55;
    ctx.lineWidth = 3;
    rectRedondeado(ctx, 36, 36, W - 72, H - 72, 48);
    ctx.stroke();
    ctx.globalAlpha = 1;

    const imgX = 120;
    const imgY = 120;
    const imgW = W - 240;
    const imgH = 640;
    if (santo.imagenUrl) {
      const img = await cargarImagen(santo.imagenUrl);
      ctx.save();
      rectRedondeado(ctx, imgX, imgY, imgW, imgH, 36);
      ctx.clip();
      const escala = Math.max(imgW / img.width, imgH / img.height);
      const dw = img.width * escala;
      const dh = img.height * escala;
      ctx.drawImage(img, imgX + (imgW - dw) / 2, imgY - (dh - imgH) * 0.12, dw, dh);
      ctx.restore();
    }

    ctx.textAlign = 'center';
    ctx.fillStyle = v('--accent');
    ctx.font = `600 30px ${fuenteCuerpo}`;
    ctx.letterSpacing = '6px';
    ctx.fillText('NOVENA COMPLETADA', W / 2, 840);
    ctx.letterSpacing = '0px';

    ctx.fillStyle = v('--text-primary');
    ctx.font = `600 66px ${fuenteDisplay}`;
    const nombreLineas = envolverTexto(ctx, santo.nombre, W - 220);
    nombreLineas.forEach((l, i) => ctx.fillText(l, W / 2, 925 + i * 76));
    const yFrase = 925 + nombreLineas.length * 76 + 20;

    if (santo.frase) {
      ctx.fillStyle = v('--text-secondary');
      ctx.font = `italic 400 42px ${fuenteDisplay}`;
      envolverTexto(ctx, `«${santo.frase}»`, W - 260).forEach((l, i) => ctx.fillText(l, W / 2, yFrase + i * 56));
    }

    ctx.fillStyle = v('--text-secondary');
    ctx.font = `500 32px ${fuenteCuerpo}`;
    const linea = [nombrePersona, `${diasTotal} días`, fechaLarga(fecha)].filter(Boolean).join('  ·  ');
    ctx.fillText(linea, W / 2, 1225);
    ctx.fillStyle = v('--accent');
    ctx.font = `700 30px ${fuenteCuerpo}`;
    ctx.fillText('EucaristíaViva', W / 2, 1275);

    return new Promise((resolve, reject) => canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('sin imagen'))), 'image/png'));
  };

  const guardar = async () => {
    if (generando) return;
    setGenerando(true);
    setError(false);
    try {
      const blob = await crearImagen();
      const archivo = new File([blob], 'mi-novena-eucaristiaviva.png', { type: 'image/png' });
      if (puedeCompartir && navigator.canShare?.({ files: [archivo] })) {
        await navigator.share({ files: [archivo], text: `Completé mi novena con ${santo.nombre} en EucaristíaViva`});
      } else {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'mi-novena-eucaristiaviva.png';
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (e) {
      // El usuario cerrando el menú de compartir no es un error.
      if (!(e instanceof DOMException && e.name === 'AbortError')) setError(true);
    } finally {
      setGenerando(false);
    }
  };

  return (
    <div>
      <motion.div
        ref={tarjetaRef}
        initial={{ opacity: 0, y: 16, rotate: -1.5 }}
        animate={{ opacity: 1, y: 0, rotate: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="tema-noche relative overflow-hidden rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--accent)_55%,transparent)] bg-[var(--bg)] p-6 text-center shadow-[var(--shadow-2)]"
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -right-12 -top-12 h-52 w-52 rounded-full"
          style={{ background: 'radial-gradient(circle, color-mix(in oklab, var(--accent) 25%, transparent) 0%, transparent 70%)' }}
        />
        {santo.imagenUrl && (
          <figure className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={santo.imagenUrl}
              alt={santo.imagenAlt ?? santo.nombre}
              className="aspect-[4/3] w-full rounded-[var(--radius-button)] object-cover object-[50%_20%]"
            />
          </figure>
        )}
        <p className="relative mt-5 text-[13px] font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
          Novena completada
        </p>
        <h2 className="relative mt-2 text-balance text-[24px] font-semibold leading-tight text-[var(--text-primary)] [font-family:var(--font-display)]">
          {santo.nombre}
        </h2>
        {santo.frase && (
          <p className="relative mt-3 text-balance text-[16px] italic leading-snug text-[var(--text-secondary)] [font-family:var(--font-display)]">
            «{santo.frase}»
          </p>
        )}
        <p className="relative mt-5 text-[13px] text-[var(--text-secondary)]">
          {[nombrePersona, `${diasTotal} días`, fechaLarga(fecha)].filter(Boolean).join(' · ')}
        </p>
        <p className="relative mt-1 text-[13px] font-bold text-[var(--accent)]">EucaristíaViva</p>
      </motion.div>

      {santo.imagenCredito && <p className="mt-2 text-center text-[11px] text-[var(--text-tertiary)]">{santo.imagenCredito}</p>}

      <motion.button
        whileTap={{ scale: 0.97 }}
        type="button"
        onClick={guardar}
        disabled={generando}
        className="mt-4 flex h-14 w-full items-center justify-center gap-2 rounded-[var(--radius-button)] bg-[var(--accent)] text-[16px] font-semibold text-[var(--on-accent-fill)] shadow-[0_10px_28px_color-mix(in_oklab,var(--accent)_30%,transparent)] [touch-action:manipulation] disabled:opacity-60"
      >
        {puedeCompartir ? <Share2 size={20} aria-hidden="true" /> : <Download size={20} aria-hidden="true" />}
        {generando ? 'Preparando tu tarjeta…' : puedeCompartir ? 'Compartir mi tarjeta' : 'Descargar mi tarjeta'}
      </motion.button>
      {error && (
        <p role="alert" className="mt-2 text-center text-[13px] text-[var(--danger)]">
          No pudimos crear la imagen. Inténtalo de nuevo.
        </p>
      )}
    </div>
  );
}
