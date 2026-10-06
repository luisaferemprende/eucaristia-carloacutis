# VEREDICTO revisor-visual — paywall (PaywallPrecio, paso 10 onboarding)
Fecha: 2026-09-26 00:00
Screenshot: docs/revisiones/paywall-375.png
Usabilidad: 32/40
Craft: 8/20
Copy (si vende): 15/20
Fidelidad (si hubo referencia): N-A
Veredicto: NO LISTA
Top defectos:
1. Botón "Empezar mis 7 días gratis" y badge "AHORRA 37%" en tema-noche pintan texto casi-blanco
   (--text-primary #F0F2F5) sobre fill dorado (--accent #D4AF37) → contraste medido ~1.9:1, muy
   debajo de 3:1 (CTA) y 4.5:1 (texto pequeño del badge). Fix: en .tema-noche, el texto sobre fill
   de acento debe ser oscuro sólido (ej. var(--bg) o #1C1400), no --text-primary.
2. FICHA-ARTE.md promete "hairline dorada como separador en pantallas nocturnas (paywall)" como el
   dispositivo ownable de esta pantalla — no existe ningún hairline en PaywallPrecio (grep sin
   resultados en app/onboarding/page.tsx). Fix: agregar el separador degradé dorado de 1-2px entre
   header/título, planes/checklist o checklist/CTA, como se comprometió en la ficha.
3. Los pasos 8-10 (toda la secuencia de paywall, incluida esta pantalla) no están envueltos en
   <PasoAnimado>/<AnimatePresence> como sí lo están los pasos 1-6 — la pantalla que decide el
   dinero aparece de golpe, sin stagger de entrada (baseline obligatoria #1 de movimiento). Fix:
   envolver paso 8-10 igual que 1-6 y aplicar stagger a título/cards/checklist.
4. Titular "Empieza mi Autopista de 3 Minutos" en texto plano, sin ninguna palabra resaltada en el
   color de acento — viola la regla de énfasis para superficies de conversión (bold + 1-3 palabras
   clave en acento) y aplana la jerarquía visual. Fix: resaltar "Autopista de 3 Minutos" en
   var(--accent) dentro del H1.
5. Las tarjetas de plan "Anual"/"Mensual" reinventan el patrón de selección sin reusar el
   componente compartido OpcionChip (sin whileTap, sin check visual de seleccionado — solo cambia
   el color del borde) — inconsistente con el resto del onboarding que sí usa OpcionChip con
   motion + check. Fix: reusar OpcionChip o replicar su whileTap scale 0.97 + check de seleccionado.

Nota aparte (no contada en el puntaje): en el área "Pago seguro por Hotmart" del screenshot aparece
un círculo negro con una "N" que no corresponde al SVG de candado del código — parece un artefacto
de extensión del navegador contaminando la captura. Se recomienda re-tomar el screenshot en un
perfil limpio/Playwright sin extensiones antes de la próxima revisión, para verificar esa zona con
certeza.
