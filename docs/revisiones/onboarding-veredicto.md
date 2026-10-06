# VEREDICTO revisor-visual — onboarding (pregunta 1 / PreguntaMotivo)
Fecha: 2026-09-26 00:00
Screenshot: docs/revisiones/onboarding-375.png
Usabilidad: 30/40
Craft: 12/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. [pantalla completa] Vacío muerto arriba (~140px antes del ícono) y abajo (~190px tras el último chip) por `justify-center` en el contenedor flex — desbalance visible a simple vista → anclar contenido con `justify-start` + padding-top fijo, que el bloque de opciones respire cerca del borde inferior en vez de flotar centrado.
2. [paso 1, sin BotonAtras ni cierre] No hay salida/cierre visible en la primera pregunta (heurística 3 — control y libertad): solo funciona el back del OS/navegador → agregar ícono "X" discreto o enlace "Salir", igual al que ya existe en PaywallPrecio.
3. [OpcionChip → onElegir → avanzar, app/onboarding/page.tsx] Selección demasiado abrupta: al tocar una opción la pregunta cambia instantáneamente, sin pausa para ver el check de confirmación en el chip → agregar 200-300ms de delay antes de `avanzar()`.
4. [PasoAnimado, components/funnel/ui.tsx] Sin stagger de entrada: ícono, título, subtítulo y las 4 opciones entran todos juntos como un solo bloque (falta baseline de movimiento #1) → escalonar cada elemento con delay incremental de 50-80ms.
5. [fondo de toda la pantalla] Profundidad plana: un solo color sólido (#F8F9FA) sin tinte/gradiente sutil, solo 2 niveles (base + card) sin área hundida → agregar un tinte/gradiente muy leve detrás del ícono o en la zona superior.
