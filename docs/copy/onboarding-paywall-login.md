# COPY MARCADO — Onboarding, Paywall y Login de EucaristíaViva
(deriva de FICHA-AVATAR.md — cada pregunta ecoa un dolor/deseo real. Ruta: Modelo 2, variante
anónima — `/onboarding` sin login previo, paywall al final, `/entrar` recién después.)

## Onboarding — 6 pasos (día, hereda :root)
1. **Motivo** (segmentación): "¿Qué te trae hoy aquí?" — 4 opciones ligadas a los dolores de FICHA-AVATAR (novena sin terminar, comunión mecánica, soledad espiritual, profundizar).
2. **Frecuencia** (segmentación): "¿Con qué frecuencia comulgas hoy?"
3. **Reconocimiento**: "Esto no es falta de fe" — responde directo al dolor elegido en el paso 1 (rama `inercia` vs. genérica), reencuadra sin culpar.
4. **Momento** (personalización con utilidad real — define la hora del recordatorio): "¿En qué momento del día quieres tus 3 minutos?"
5. **Elección de santo** (personalización + apropiación): "¿Qué santo quieres que te acompañe esta semana?" — Carlo Acutis, San Pío, Santo Tomás, Santa Teresita, o "Sorpréndeme cada día".
6. **Reconocimiento final** (Labor Illusion + etiquetado positivo, antes del loading): "Tus respuestas te describen" — resume con los datos reales del usuario (santo + momento).

## Loading — "Construyendo tu Autopista de 3 Minutos…"
4 líneas secuenciales (750ms c/u) que citan el santo elegido y el mecanismo (pensamiento, milagro, recordatorio, intención) — Labor Illusion antes del paywall (50 B1).

## Paywall — secuencia de 3 pantallas (noche, `.tema-noche`)
1. **Recap**: "Tu Autopista de 3 Minutos con [santo] está lista" — invested-cost visible ("Hecha con tus 5 respuestas") + 3 features del mecanismo completo (santos+milagro / preparación / diario+novena+comunidad).
2. **Timeline** (C4): Hoy (acceso completo) → Día 5 (aviso por correo) → Día 7 (primer cobro real $29.99/año, cancela antes sin costo).
3. **Precio**: anual pre-seleccionado ($2.50/mes, "Ahorra 37%", se cobra $29.99/año) vs. mensual ($3.99/mes); CTA "Empezar mis 7 días gratis"; salida limpia "Ahora no"; fila de confianza (ícono candado + "Pago seguro por Hotmart · Garantía de 15 días").
4. **Confirmación simulada** (C3ter — Hotmart aún no conectado, Sesión 6): nunca finge un cobro real; explica qué va a pasar cuando se conecte el pago y lleva a `/entrar`.

## Login — `/entrar` (día, spec E)
- CTA primario: magic link ("Enviarme mi enlace"). Secundario: "Continuar con Google" (outline).
- 3 estados: reposo → enviando ("Enviando…") → enviado (confirmación con el correo tecleado) — y error genérico anti-enumeración ("Revisa tu correo — si es válido, te llegará el enlace"), nunca revela si el correo existe (26-AUTH-MODERNO.md).
- Backend simulado (setTimeout) hasta Sesión 6 — Supabase Auth real.
