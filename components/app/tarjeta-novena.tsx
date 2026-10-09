'use client';

// TARJETA-PREMIO de una novena completada: una estampa devocional siempre en el
// tema de noche — retrato del santo en un arco con doble marco dorado, sello con
// los días, frase y fecha. "Descargar/Compartir" dibuja la MISMA estampa en un
// canvas de 1080×1350 leyendo los colores reales de los tokens (sin hex
// duplicados) y la comparte o descarga como imagen.

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

// Trazo de un arco (puerta de capilla): lados rectos y cima semicircular.
function trazoArco(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
  const r = w / 2;
  ctx.beginPath();
  ctx.moveTo(x, y + h);
  ctx.lineTo(x, y + r);
  ctx.arc(x + r, y + r, r, Math.PI, 0);
  ctx.lineTo(x + w, y + h);
  ctx.closePath();
}

function envolverTexto(ctx: CanvasRenderingContext2D, texto: string, maxAncho: number): string[] {
  const lineas: string[] = [];
  let actual = '';
  for (const p of texto.split(' ')) {
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

// Cruz pequeña dibujada (no depende de que la fuente tenga el glifo).
function cruzPequena(ctx: CanvasRenderingContext2D, cx: number, cy: number, s: number) {
  ctx.fillRect(cx - 2, cy - s, 4, s * 2);
  ctx.fillRect(cx - s * 0.62, cy - s * 0.42, s * 1.24, 4);
}

export function TarjetaNovena({ santo, diasTotal, fecha, nombrePersona }: Props) {
  const tarjetaRef = useRef<HTMLDivElement>(null);
  const [generando, setGenerando] = useState(false);
  const [error, setError] = useState(false);
  const puedeCompartir = typeof navigator !== 'undefined' && typeof navigator.share === 'function';

  const crearImagen = async (): Promise<Blob> => {
    const cs = getComputedStyle(tarjetaRef.current!);
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
    const oro = v('--accent');

    // Fondo con profundidad: base + halo dorado arriba + viñeta
    ctx.fillStyle = v('--bg');
    ctx.fillRect(0, 0, W, H);
    const halo = ctx.createRadialGradient(W / 2, 360, 40, W / 2, 360, 700);
    halo.addColorStop(0, `${oro}38`);
    halo.addColorStop(1, `${oro}00`);
    ctx.fillStyle = halo;
    ctx.fillRect(0, 0, W, H);

    // Doble marco fino
    ctx.strokeStyle = oro;
    ctx.lineWidth = 3;
    ctx.globalAlpha = 0.6;
    ctx.beginPath();
    ctx.roundRect(36, 36, W - 72, H - 72, 48);
    ctx.stroke();
    ctx.globalAlpha = 0.25;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(60, 60, W - 120, H - 120, 36);
    ctx.stroke();
    ctx.globalAlpha = 1;

    // Retrato en arco con doble marco
    const aw = 600;
    const ah = 690;
    const ax = (W - aw) / 2;
    const ay = 130;
    if (santo.imagenUrl) {
      const img = await cargarImagen(santo.imagenUrl);
      ctx.save();
      trazoArco(ctx, ax, ay, aw, ah);
      ctx.clip();
      const escala = Math.max(aw / img.width, ah / img.height);
      const dw = img.width * escala;
      const dh = img.height * escala;
      ctx.drawImage(img, ax + (aw - dw) / 2, ay - (dh - ah) * 0.1, dw, dh);
      ctx.restore();
    }
    ctx.strokeStyle = oro;
    ctx.lineWidth = 5;
    trazoArco(ctx, ax, ay, aw, ah);
    ctx.stroke();
    ctx.globalAlpha = 0.55;
    ctx.lineWidth = 2;
    trazoArco(ctx, ax - 18, ay - 18, aw + 36, ah + 36);
    ctx.stroke();
    ctx.globalAlpha = 1;

    // Sello con los días
    const sx = W / 2;
    const sy = ay + ah + 6;
    ctx.fillStyle = oro;
    ctx.beginPath();
    ctx.arc(sx, sy, 82, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = v('--on-accent-fill');
    ctx.globalAlpha = 0.45;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(sx, sy, 70, 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = 1;
    ctx.fillStyle = v('--on-accent-fill');
    ctx.textAlign = 'center';
    ctx.font = `700 70px ${fuenteDisplay}`;
    ctx.fillText(String(diasTotal), sx, sy + 14);
    ctx.font = `700 20px ${fuenteCuerpo}`;
    ctx.letterSpacing = '5px';
    ctx.fillText('DÍAS', sx + 2, sy + 44);
    ctx.letterSpacing = '0px';

    // Textos
    ctx.fillStyle = oro;
    ctx.font = `600 28px ${fuenteCuerpo}`;
    ctx.letterSpacing = '7px';
    ctx.fillText('NOVENA COMPLETADA', W / 2, 985);
    ctx.letterSpacing = '0px';

    ctx.fillStyle = v('--text-primary');
    ctx.font = `600 72px ${fuenteDisplay}`;
    const nombre = envolverTexto(ctx, santo.nombre, W - 200);
    nombre.forEach((l, i) => ctx.fillText(l, W / 2, 1065 + i * 80));
    let y = 1065 + (nombre.length - 1) * 80 + 40;

    // Divisor con cruz
    ctx.fillStyle = oro;
    ctx.globalAlpha = 0.6;
    ctx.fillRect(W / 2 - 190, y, 150, 2);
    ctx.fillRect(W / 2 + 40, y, 150, 2);
    ctx.globalAlpha = 1;
    cruzPequena(ctx, W / 2, y + 1, 14);
    y += 62;

    if (santo.frase) {
      ctx.fillStyle = v('--text-secondary');
      ctx.font = `italic 400 40px ${fuenteDisplay}`;
      const lineas = envolverTexto(ctx, `«${santo.frase}»`, W - 280);
      lineas.forEach((l, i) => ctx.fillText(l, W / 2, y + i * 52));
    }

    ctx.fillStyle = v('--text-secondary');
    ctx.font = `500 30px ${fuenteCuerpo}`;
    ctx.fillText([nombrePersona, fechaLarga(fecha)].filter(Boolean).join('  ·  '), W / 2, 1248);
    ctx.fillStyle = oro;
    ctx.font = `700 28px ${fuenteCuerpo}`;
    ctx.letterSpacing = '3px';
    ctx.fillText('EUCARISTÍAVIVA', W / 2, 1292);
    ctx.letterSpacing = '0px';

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
        await navigator.share({ files: [archivo], text: `Completé mi novena con ${santo.nombre} en EucaristíaViva` });
      } else {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'mi-novena-eucaristiaviva.png';
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (e) {
      // Cerrar el menú de compartir no es un error.
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
        className="tema-noche relative overflow-hidden rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--accent)_55%,transparent)] bg-[var(--bg)] p-4 text-center shadow-[var(--shadow-2)]"
      >
        {/* Segundo marco fino, como una estampa */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-2 rounded-[calc(var(--radius-card)-6px)] border border-[color-mix(in_oklab,var(--accent)_22%,transparent)]"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-24 h-72 w-72 -translate-x-1/2 rounded-full"
          style={{ background: 'radial-gradient(circle, color-mix(in oklab, var(--accent) 22%, transparent) 0%, transparent 70%)' }}
        />

        <div className="relative mx-auto mt-4 w-[72%] pb-10">
          <div className="rounded-t-full border border-[color-mix(in_oklab,var(--accent)_55%,transparent)] p-1.5">
            {santo.imagenUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={santo.imagenUrl}
                alt={santo.imagenAlt ?? santo.nombre}
                className="aspect-[600/690] w-full rounded-t-full border-2 border-[var(--accent)] object-cover object-[50%_18%]"
              />
            ) : (
              <div className="aspect-[600/690] w-full rounded-t-full border-2 border-[var(--accent)] bg-[var(--surface)]" />
            )}
          </div>
          {/* Sello */}
          <div className="absolute -bottom-0 left-1/2 flex size-[72px] -translate-x-1/2 flex-col items-center justify-center rounded-full bg-[var(--accent)] text-[var(--on-accent-fill)] shadow-[0_8px_20px_color-mix(in_oklab,var(--accent)_35%,transparent)] ring-2 ring-[color-mix(in_oklab,var(--on-accent-fill)_35%,transparent)] ring-inset">
            <span className="text-[28px] font-bold leading-none [font-family:var(--font-display)]">{diasTotal}</span>
            <span className="mt-0.5 text-[10px] font-bold tracking-[0.2em]">DÍAS</span>
          </div>
        </div>

        <p className="relative mt-5 text-[13px] font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
          Novena completada
        </p>
        <h2 className="relative mt-2 text-balance text-[26px] font-semibold leading-tight text-[var(--text-primary)] [font-family:var(--font-display)]">
          {santo.nombre}
        </h2>
        <div className="relative my-3 flex items-center justify-center gap-2" aria-hidden="true">
          <span className="h-px w-12 bg-[color-mix(in_oklab,var(--accent)_60%,transparent)]" />
          <span className="relative block size-3">
            <span className="absolute left-1/2 top-0 h-3 w-px -translate-x-1/2 bg-[var(--accent)]" />
            <span className="absolute left-0 top-[3px] h-px w-3 bg-[var(--accent)]" />
          </span>
          <span className="h-px w-12 bg-[color-mix(in_oklab,var(--accent)_60%,transparent)]" />
        </div>
        {santo.frase && (
          <p className="relative text-balance px-4 text-[16px] italic leading-snug text-[var(--text-secondary)] [font-family:var(--font-display)]">
            «{santo.frase}»
          </p>
        )}
        <p className="relative mt-4 text-[13px] text-[var(--text-secondary)]">
          {[nombrePersona, fechaLarga(fecha)].filter(Boolean).join(' · ')}
        </p>
        <p className="relative mt-1 mb-2 text-[13px] font-bold tracking-[0.12em] text-[var(--accent)]">EUCARISTÍAVIVA</p>
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
