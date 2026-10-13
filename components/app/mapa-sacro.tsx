'use client';

// El mapa real (Leaflet, no el envoltorio react-leaflet, para no pelear con
// peer deps de React 19). Mapa base CARTO Positron: libre, claro y neutro —
// coincide con el marfil de la app sin tener que pintar un mapa propio.
// Los puntos son círculos dorados dibujados a mano (DivIcon), así heredan
// los mismos tokens de color que el resto de la app.

import { useEffect, useRef } from 'react';
import type { Map as LeafletMap } from 'leaflet';
import 'leaflet/dist/leaflet.css';

export interface PuntoMapa {
  lugar: string;
  lat: number;
  lng: number;
}

export function MapaSacro({
  puntos,
  seleccionado,
  onSeleccionar,
}: {
  puntos: PuntoMapa[];
  seleccionado: string | null;
  onSeleccionar: (lugar: string) => void;
}) {
  const contenedorRef = useRef<HTMLDivElement>(null);
  const mapaRef = useRef<LeafletMap | null>(null);

  useEffect(() => {
    let cancelado = false;
    import('leaflet').then((L) => {
      if (cancelado || !contenedorRef.current || mapaRef.current) return;
      const mapa = L.map(contenedorRef.current, { zoomControl: false, attributionControl: true }).setView([20, 0], 2);
      L.control.zoom({ position: 'bottomright' }).addTo(mapa);
      // OpenStreetMap estándar (libre, sin llave) — un filtro CSS lo lleva del
      // estilo de colores de siempre a un tono marfil/sepia neutro, acorde a
      // la app. Los puntos dorados NO llevan el filtro (van en otro pane).
      const capa = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap',
        maxZoom: 19,
      }).addTo(mapa);
      const tilePane = mapa.getPane('tilePane');
      if (tilePane) tilePane.style.filter = 'grayscale(55%) sepia(18%) brightness(1.06) contrast(0.92)';
      void capa;
      mapaRef.current = mapa;

      puntos.forEach((p) => {
        const icono = L.divIcon({
          className: '',
          html: `<span style="display:block;width:16px;height:16px;border-radius:9999px;background:var(--accent);border:2px solid var(--on-accent-fill);box-shadow:0 0 0 4px color-mix(in oklab, var(--accent) 30%, transparent)"></span>`,
          iconSize: [16, 16],
          iconAnchor: [8, 8],
        });
        L.marker([p.lat, p.lng], { icon: icono })
          .addTo(mapa)
          .on('click', () => onSeleccionar(p.lugar));
      });
    });
    return () => {
      cancelado = true;
      mapaRef.current?.remove();
      mapaRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [puntos]);

  useEffect(() => {
    if (!seleccionado || !mapaRef.current) return;
    const punto = puntos.find((p) => p.lugar === seleccionado);
    if (punto) mapaRef.current.flyTo([punto.lat, punto.lng], 6, { duration: 0.6 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seleccionado]);

  return <div ref={contenedorRef} className="absolute inset-0" />;
}
