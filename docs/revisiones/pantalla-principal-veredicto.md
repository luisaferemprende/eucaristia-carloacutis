# VEREDICTO revisor-visual — pantalla-principal (Hoy/M0)
Fecha: 2026-09-26 00:00
Screenshot: docs/revisiones/app-hoy-375.png
Usabilidad: 29/40
Craft: 13/20
Copy (si vende): N-A
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. Barra inferior: el indicador de desarrollo de Next.js (círculo negro "N") tapa el ícono/label de "Hoy" en el screenshot entregado → desactivar devIndicators en next.config y volver a capturar limpio antes de re-evaluar.
2. CTA "Vivir mis 3 minutos": al completarse queda disabled permanentemente sin undo/toggle (verificado en app/app/page.tsx líneas 60-85) → permitir des-marcar o dar una ventana de deshacer tras completar.
3. Header: `capitalize` de Tailwind sobre la fecha completa produce "Sábado, 26 De Septiembre" (capitaliza también la preposición "De"), gramaticalmente incorrecto en español → formatear la fecha capitalizando solo la primera letra, no cada palabra.
4. Código sin ningún estado de error/loading para cuando racha/novena/pensamiento vengan de backend real (hoy son imports estáticos de lib/demo-data.ts) → agregar skeleton + error state antes de conectar datos reales.
5. Identidad ownable apoyada solo en color (oro/teal) + tipografía Zodiak; ningún dispositivo visual propio de la ficha (halo de custodia, textura de trigo) es visible en esta pantalla concreta → sumar al menos 1 detalle ownable visible en esta vista, no solo en el kit general.
