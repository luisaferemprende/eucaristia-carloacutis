# ESTADO — EucaristíaViva
Última actualización: 2026-09-25 | Sesión actual: 4

⏸️ CHECKPOINT — Última acción completada: Sesión 3 cerrada — el usuario decidió AVANZAR con el veredicto de landing pendiente (NO LISTA, 28/40 usabilidad · 15/20 craft · 16/20 copy) documentado en "Problemas conocidos", en vez de seguir puliéndolo ahora. / Siguiente acción exacta: arrancar Sesión 4 (Onboarding, paywall y login) — leer 02B-ONBOARDING-Y-PAYWALL.md + 50-DISENO-ONBOARDING-PAYWALL.md + 26-AUTH-MODERNO.md, y construir el primer paso real de `/onboarding` (hoy es un stub).

## Qué es esta app (3 líneas máximo)
Reto diario de 3 minutos centrado en la Eucaristía: el pensamiento de un santo (Carlo Acutis y otros grandes devotos eucarísticos) + la historia de un milagro eucarístico + una micro-preparación para la comunión, respaldado por un diario espiritual privado y retos de novenas en grupo. Para católicas practicantes ocupadas (avatar: Carmen Rosa) que sienten que van a misa por inercia y quieren constancia sin pagar precios abusivos. Monetización: $3.99/mes o $29.99/año, 7 días de prueba gratis.

## Promesa central
"Vive la Eucaristía a fondo, en 3 minutos al día — con la sabiduría de los santos y los milagros eucarísticos del mundo, sin pagar los $70 al año que cobran las apps masivas."

## Reporte de validación (Sesión 1)
- Veredicto: Excelente oportunidad — idea validada por el usuario antes de llegar y confirmada con la ficha de la app modelo (Hallow).
- App modelo (FICHA-MODELO.md — APROBADA): Hallow — Prayer & Meditation. 3 señales de revenue independientes (ver FICHA-MODELO.md).
- Brecha confirmada: nadie bautizó un mecanismo enfocado 100% en la Eucaristía (santos + milagros eucarísticos) a precio bajo.
- Precio de referencia del mercado: Hallow $9.99/mes o $69.99/año. Nuestro precio: $3.99/mes o $29.99/año.
- Gate de unidad económica (40 — PASA): margen bruto ≈91% (mensual) / ≈86% (anual) en venta directa; ≈45% por afiliado. Detalle en versión anterior de este archivo (git log) si se necesita.

## Dirección de Arte (Sesión 2 — CERRADA y aprobada por el usuario)
- FICHA-ARTE.md: existe y APROBADA — el usuario vio el tour (vista-previa-app.html), pidió 3 micro-ajustes (badge de ahorro, contraste del tab activo, punto vivo animado) y luego la tipografía final (Zodiak/DM Sans); todo aplicado y aprobado.
- Resumen: modo DOBLE (día #F8F9FA/#111827 · noche #11162A/#1C2541/#F0F2F5) · acento oro litúrgico #D4AF37 (acción — SOLO como fill sólido con texto --text-primary, NUNCA como texto sobre fondo claro: mide ~1.6:1 y falla WCAG) · acento teal #0F766E (éxito) · Display Zodiak (títulos/frases de santos) · Body DM Sans · radio 16/12.
- Token nuevo descubierto en la Sesión 3 (landing): `--accent-text` en `components/landing/tokens.css` — el oro oscurecido 55%/45% hacia --text-primary, para cuando el acento necesita ser TEXTO sobre fondo claro (Kicker, badges, links). Sobre fondo invertido oscuro (CtaFinal), se sobrescribe a `var(--accent)` puro. Anotar esta regla en cualquier FICHA-ARTE futura con esta paleta.

## Avatar y venta (Sesión 1 — cosa juzgada; el DOLOR se amplió en Sesión 3, ver nota)
- FICHA-AVATAR.md: existe y APROBADA (12 frases VoC con fuente).
- Resumen: avatar Carmen Rosa, 38 años. Deseo #1: terminar una novena/vivir su fe sin fallar.
- ⚠️ **PENDIENTE DE SINCRONIZAR:** el usuario amplió el dolor principal en la Sesión 3 de "solo abandona novenas" a "va a misa por inercia, comulga mecánicamente, siente que la Eucaristía no transforma su día a día" (inercia espiritual, más amplio que solo el ciclo de la novena). FICHA-AVATAR.md todavía no tiene esta ampliación por escrito — el copy de la landing YA la refleja, pero la ficha debe actualizarse en la próxima sesión para que ambas queden trazables entre sí.

## Estrategia de monetización (Sesión 1 — cosa juzgada, sin cambios)
- Modelo 2 (onboarding-first, variante anónima) · Trial 7 días ambos planes · Garantía 15 días (>7, pasa la regla dura) · Pricing $3.99/mes o $29.99/año ($2.50/mes anual, "Ahorra 37%").
- Mecanismo bautizado: **"La Autopista de 3 Minutos"** (cita de Carlo Acutis). **AMPLIADO en Sesión 3** (pedido del usuario): el mecanismo ya no es solo "Carlo Acutis" — cada día entrega (a) el pensamiento de UN santo devoto de la Eucaristía (Carlo Acutis, San Pío de Pietrelcina, Santo Tomás de Aquino, San Agustín, Santa Teresita, etc.), (b) la historia de un milagro eucarístico real del mundo (ej. Lanciano), (c) la micro-preparación de 3 min para la comunión. Novenas + diario + comunidad quedan como el "sistema de hábitos y soporte" (peso menor, no eliminado). Distribución de peso pedida por el usuario: Eucaristía/santos/milagros ~75% · diario ~15% · novenas/comunidad ~10%.

## Gamificación y retención (sin cambios respecto a Sesión 1)
- Loop Hooked: notificación diaria → abrir y vivir el reto de 3 min → racha +1 + novena → diario privado como ancla.
- Primera victoria del onboarding (<5 min): ver su primer pensamiento+milagro del día.

## Secuencia maestra de construcción
- Landing: **CONSTRUIDA** (Next.js 16 + kit canónico de `plantillas-codigo/landing/`, tematizado). Gate visual del revisor: NO LISTA todavía (ver Problemas conocidos) — no mandar tráfico pagado hasta cerrarlo o decidir avanzar igual.
- Onboarding / Paywall / Login-Auth / App interna / Servicios externos: pendientes (Sesiones 4-6).
- Ruta aprobada: `/` → `/onboarding` → `/paywall` → `/login` → `/app`.

## Puertas de etapa (aprobación antes de avanzar)
- Landing: **construida, NO APROBADA** — evidencia: `docs/revisiones/landing-375.png` + `docs/revisiones/landing-veredicto.md` (5 pasadas, última: 28/40 usabilidad, 15/20 craft, 16/20 copy — gate doble exige ≥36/40 y ≥16/20).
- Onboarding / Paywall / Login-Auth / App interna: no iniciadas. Servicios externos: bloqueados.

## Decisiones técnicas (NO re-discutir sin pedirlo el usuario)
- Framework: Next.js 16 (App Router, Turbopack) — scaffold en la raíz del proyecto (no en subcarpeta). React 19.
- Landing: `app/page.tsx` compone las 10 secciones canónicas desde `components/landing/` (copiado de `plantillas-codigo/landing/`, tematizado en `components/landing/tokens.css`). Copy marcado fuente de verdad: `docs/copy/landing.md`.
- Auth: magic link/OTP por email, Hotmart-first. Passkey tras D7. Sin contraseñas.
- Modelo de IA: NINGUNA generación en vivo para el contenido central — biblioteca curada de ~365 días (pensamiento del santo + milagro eucarístico + preparación), revisada doctrinalmente antes de publicar.
- Modelo de datos: `profiles` · `daily_content` (ahora con 2 piezas por día: santo Y milagro) · `user_progress` · `diary_entries` (RLS por `auth.uid()`) · `novenas` · `novena_participation` (RLS individual + vista agregada pública) · `subscriptions`.
- Idioma de UI: mono-idioma, español latino neutro.
- Rutas creadas como stubs honestos (no dead-links): `/onboarding` (pendiente Sesión 4, con salida "Volver al inicio") · `/entrar` (pendiente Sesión 6) · `/privacidad`, `/terminos` (mensaje de "en construcción" con salida — pendientes de datos del responsable) · `/reembolsos` (contenido REAL: plazo de 15 días + cómo pedirlo).

## Sesiones completadas ✅
- Sesión 1 — Validación, FICHA-MODELO, FICHA-AVATAR, FICHA-MERCADO, monetización, mecanismo bautizado.
- Sesión 2 — Identidad visual: FICHA-ARTE aprobada (paleta día/noche del usuario + Zodiak/DM Sans).

## Sesión en progreso 🔧
- Sesión 3 — Landing construida y con 5 rondas de revisión real; NO LISTA por el gate visual (usabilidad/craft). Copy ya aprobado (16/20). Pendiente: decidir con el usuario cómo cerrar el gate (seguir iterando vs. avanzar con lo documentado).

## Próximas sesiones 📋
- Cerrar Sesión 3 (gate visual de la landing) o documentarlo y avanzar.
- Sesión 4: Onboarding, paywall y login — construye el primer paso real de `/onboarding` (hoy es un stub).
- Sesión 5: App interna — monta los screenshots reales del carrusel "La app por dentro" (hoy son placeholders).
- Sesión 6: Integraciones reales y seguridad (Supabase, Hotmart, dominio, Resend) — ahí se resuelve `/entrar`.
- Sesión 7: Testing, pulido y rigor de entrega.
- Sesión 8: Adquisición, lanzamiento y backoffice.

## Problemas conocidos ⚠️
- **Veredicto de landing (docs/revisiones/landing-veredicto.md): NO LISTA.** Usabilidad 28/40 (falta ≥36) y Craft 15/20 (falta ≥16); Copy 16/20 SÍ pasa. Los defectos que quedan tras 5 rondas son en su mayoría estructurales para este TIPO de pantalla (heurísticas de Nielsen como "control/deshacer" o "atajos de experto" no aplican bien a una landing estática) o de identidad visual profunda (el mundo del sujeto de FICHA-ARTE — rayos de custodia, textura de trigo, sello de hostia — no se llevó a un tratamiento visual concreto, solo queda el hairline dorado). Antes de mandar tráfico pagado, decidir con el usuario: seguir puliendo, o aceptar y avanzar.
- Carrusel "La app por dentro" con PLACEHOLDERS rotulados — se resuelve montando screenshots reales en la Sesión 5.
- `/onboarding` es un stub sin flujo real — los 7 CTA de la landing no completan la acción hasta la Sesión 4.
- `/privacidad` y `/terminos` muestran "en construcción" — PENDIENTE de que el usuario dé sus DATOS DEL RESPONSABLE (nombre/razón social, país desde el que opera) para redactarlas con 47-LEGAL-FISCAL-Y-PRIVACIDAD.md.
- Correo de soporte `hola@eucaristiaviva.com` es un PLACEHOLDER plausible (mismo patrón que usa el propio kit del SO) — PENDIENTE de que el usuario confirme su dominio/correo real antes de publicar. Aparece en el footer y en `/reembolsos`.
- Contenido doctrinal ampliado: ahora la biblioteca diaria incluye, además del pensamiento del santo, la historia de un milagro eucarístico real (ej. Lanciano) — la precisión histórica/doctrinal de esos ~365×2 textos necesita la misma revisión cuidadosa ya anotada, y ahora cubre también el catálogo de milagros (el propio Carlo Acutis documentó esto en vida — hay fuentes reales que usar como base, no inventar).
- FICHA-AVATAR.md no refleja aún por escrito el dolor ampliado ("inercia espiritual") que ya vive en el copy — sincronizar en la próxima sesión.

## Pendientes del usuario (acciones que el usuario debe hacer)
- [ ] Dar sus DATOS DEL RESPONSABLE (nombre o razón social, país desde el que opera, y el correo real de soporte) para terminar `/privacidad`, `/terminos` y confirmar el correo del footer/`/reembolsos`.
- [ ] Decidir si seguimos puliendo el gate visual de la landing ahora, o avanzamos documentándolo como pendiente.

## Notas para la próxima sesión
- El mecanismo bautizado "La Autopista de 3 Minutos" ahora entrega 2 piezas de contenido por día (santo + milagro eucarístico), no solo 1 — esto afecta el modelo de datos de `daily_content` (dos columnas o dos tablas relacionadas) y el diseño de la pantalla principal cuando se construya la app interna (Sesión 5): debe caber sin sentirse apretada (revisar el gate cognitivo de "≤4-5 ítems visibles").
- El copy de venta se deriva de FICHA-AVATAR.md — al sincronizar la ficha con el dolor ampliado, revisar que ninguna pieza de copy quede sin traza a un campo de la ficha.
