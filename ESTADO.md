# ESTADO — EucaristíaViva
Última actualización: 2026-10-07 | Sesión actual: 6

⏸️ CHECKPOINT — Última acción completada (2026-10-07): producción en Vercel
(`https://eucaristia-carloacutis.vercel.app`, repo `luisaferemprende/eucaristia-carloacutis`, rama
`main`, auto-deploy activo) responde bien. Supabase (`rcbkiuccypqtvupkyvxq`) conectado con esquema,
RLS y datos semilla; `/app/*` lee datos reales; `proxy.ts` (Next 16) reemplazó a `middleware.ts`;
la clave pública usada es la `anon` clásica (la `sb_publishable_` rompía `@supabase/ssr` 0.12.7).
Hecho en esta tanda: carrusel de la landing con capturas reales (`public/app/*.png`); Santo Rosario
"La Corona de María" como extra opcional (`lib/rosario.ts`, `/app/rosario`, tarjeta en Hoy; 4
conjuntos × 5 misterios, SOLO la Anunciación tiene meditación — faltan 19, y las imágenes están sin
licencia por verificar); la página de ventas ahora incluye copy del Rosario sin tocar la oferta ($3.99/mes · $29.99/año,
"$70" de referencia, sin "$105"); `/auth/callback` (cambia el código del correo por sesión).
**LOGIN POR CORREO BLOQUEADO (diagnosticado):** los logs de Supabase Auth muestran
`429 over_email_send_rate_limit` — el correo integrado de Supabase permite muy pocos envíos por
hora y las pruebas lo agotaron. `/entrar` ya muestra un mensaje distinto para ese caso (commit
f9087c5). Pendientes del usuario: (1) esperar ~1 h y pedir UN solo enlace; (2) en Supabase →
Authentication → URL Configuration poner Site URL `https://eucaristia-carloacutis.vercel.app` y
Redirect URL `https://eucaristia-carloacutis.vercel.app/**` (hoy el enlace del correo cae en
localhost); (3) crear cuenta en Resend para conectar SMTP propio (solución definitiva).
Google OAuth NO está configurado (requiere cliente OAuth creado por el usuario en Google Cloud).
/ Siguiente acción exacta: conectar Resend como SMTP de Supabase (sin dominio propio solo envía al
correo dueño de la cuenta, suficiente para probar); luego Hotmart (webhook con hottok, escribe
`subscriptions` con service_role) + dominio propio + desactivar la protección SSO de Vercel antes de
lanzar. Considerar login con código de 6 dígitos para evitar el prefetch de Gmail (otp_expired).

**ACTUALIZACIÓN 2026-10-08 (feedback de la usuaria ya dentro de la app):** el login ya funcionó.
Plan en 5 bloques aprobado ("en etapas"): (1) 3 minutos guiados — HECHO y publicado (`/app/vivir`,
`components/app/vivir-cliente.tsx`, `lib/contenido-hoy.ts`; el RPC `marcar_hoy_hecho(p_fecha)` tenía un
error de tipos que lo hacía fallar en silencio — reescrito y probado con rollback; ahora usa la fecha
LOCAL); columnas nuevas en `daily_content` (pregunta_dia, milagro_historia/fuente, preparacion,
santo_imagen_*); texto de Lanciano y preparación PENDIENTES de revisión doctrinal. (2) milagro con
página propia, (3) novena San Pío (+ "por qué" + 9 días + botón terminar día + TARJETA-PREMIO
coleccionable al día 9, idea de la usuaria), (4) 19 meditaciones del Rosario + imágenes, (5) imagen del
santo en el pensamiento de hoy. Imágenes: solo con licencia verificada (Wikimedia Commons) + crédito.
Bloque 2 HECHO (`/app/milagro`). Bloque 3 HECHO: tablas `novena_dias` + columnas nuevas en `novenas`
(por_que, santo_datos, imagen_*, frase_tarjeta) y `novena_participation` (dias_hechos, ultimo_dia_marcado);
RPC `marcar_dia_novena(p_fecha)` (un día por día, probado con rollback); `components/app/novena-cliente.tsx`
+ `tarjeta-novena.tsx` (tarjeta-premio al día 9, descargable/compartible vía canvas, colección en "Elegir").
Solo San Pío tiene los 9 días escritos; las otras 3 novenas salen "Próximamente". Retrato:
`public/santos/san-pio.jpg` (dominio público, Wikimedia Commons "Padre Pio portraitFXD.jpg"). Riesgo
conocido: la política `update_own` de `novena_participation` deja al usuario editar sus propias filas
(solo se perjudica a sí mismo; endurecer antes de lanzar si el premio tuviera valor). Textos de los 9
días PENDIENTES de revisión doctrinal. Gate visual de `/app/vivir` y Hoy: capturado a 375px con datos reales en navegador de pruebas, SIN
revisor-visual todavía (pantalla secundaria nueva; Hoy sigue con gate PENDIENTE).

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

## Avatar y venta (Sesión 1 — cosa juzgada; el DOLOR se amplió en Sesión 3)
- FICHA-AVATAR.md: existe y APROBADA (12 frases VoC con fuente). **Sincronizada** con el dolor
  ampliado de Sesión 3 ("inercia espiritual" — comulga por costumbre y siente que nada cambió,
  la raíz de la que nace el abandono de novenas) — ya no queda pendiente.
- Resumen: avatar Carmen Rosa, 38 años. Dolor #1 (ampliado): inercia espiritual. Deseo #1:
  terminar una novena/vivir su fe sin fallar.

## Estrategia de monetización (Sesión 1 — cosa juzgada, sin cambios)
- Modelo 2 (onboarding-first, variante anónima) · Trial 7 días ambos planes · Garantía 15 días (>7, pasa la regla dura) · Pricing $3.99/mes o $29.99/año ($2.50/mes anual, "Ahorra 37%").
- Mecanismo bautizado: **"La Autopista de 3 Minutos"** (cita de Carlo Acutis). **AMPLIADO en Sesión 3** (pedido del usuario): el mecanismo ya no es solo "Carlo Acutis" — cada día entrega (a) el pensamiento de UN santo devoto de la Eucaristía (Carlo Acutis, San Pío de Pietrelcina, Santo Tomás de Aquino, San Agustín, Santa Teresita, etc.), (b) la historia de un milagro eucarístico real del mundo (ej. Lanciano), (c) la micro-preparación de 3 min para la comunión. Novenas + diario + comunidad quedan como el "sistema de hábitos y soporte" (peso menor, no eliminado). Distribución de peso pedida por el usuario: Eucaristía/santos/milagros ~75% · diario ~15% · novenas/comunidad ~10%.

## Gamificación y retención (sin cambios respecto a Sesión 1)
- Loop Hooked: notificación diaria → abrir y vivir el reto de 3 min → racha +1 + novena → diario privado como ancla.
- Primera victoria del onboarding (<5 min): ver su primer pensamiento+milagro del día.

## Secuencia maestra de construcción
- Landing: construida y elevada, gate visual del revisor PENDIENTE (veredicto NO LISTA, ver Problemas conocidos) (Next.js 16 + kit canónico, tematizado; auditoría de escaneabilidad mobile pasada en Sesión 4-5 con 1 corrección real). Gate visual del revisor: NO LISTA con datos viejos (ver Problemas conocidos) — el usuario decidió avanzar con esto documentado.
- Onboarding + Paywall + Login: implementados, gate visual del revisor PENDIENTE de re-correr (veredictos NO LISTA, ver Problemas conocidos) — flujo cliente en `/onboarding` (6 preguntas → loading → paywall de 3 pantallas, con lista de beneficios ya corregida → confirmación simulada) que entrega a `/entrar` (login real).
- App interna: implementada (Sesión 5), pantalla principal con gate visual PENDIENTE (veredicto NO LISTA, ver Problemas conocidos) — `/app` (Hoy/M0), `/app/novena`, `/app/diario`, `/app/perfil`, con datos semilla realistas (`lib/demo-data.ts`) y nav inferior de 4 destinos (`components/app/ui.tsx`). Modo día/noche responde a la hora real del dispositivo.
- Servicios externos — **EN CURSO (Sesión 6):** Supabase conectado (esquema+RLS+seed, ver Decisiones
  técnicas) y `/entrar` ya usa Auth real. Hotmart/dominio/Resend: no iniciados todavía. Vercel:
  repo de GitHub listo, conexión del proyecto bloqueada por un permiso de la GitHub App (pendiente
  del usuario). La app interna (`/app/*`) AÚN lee datos locales (`lib/demo-data.ts`), no los reales.
- Ruta real implementada: `/` → `/onboarding` (incluye el paywall) → `/entrar` (ya real) → `/app` (+ 3 pestañas, protegido por sesión real pero con datos locales todavía).

## Puertas de etapa (aprobación antes de avanzar)
- Landing: **construida, NO APROBADA con el veredicto viejo** — evidencia: `docs/revisiones/landing-375.png` (desactualizado, pre-elevación) + `docs/revisiones/landing-veredicto.md` (5 pasadas, última: 28/40 usabilidad, 15/20 craft, 16/20 copy). El usuario ya decidió avanzar con esto pendiente; no se ha re-lanzado el revisor tras la elevación de escaneabilidad.
- Onboarding / Paywall / Pantalla principal: **construidos y corregidos, gate visual PENDIENTE de re-verificar** — los 3 veredictos llegaron NO LISTA (ver Problemas conocidos con los puntajes exactos), se corrigieron TODOS los defectos que señalaron, se recapturó cada pantalla (`docs/revisiones/onboarding-375.png`, `paywall-375.png`, `app-hoy-375.png` vía Playwright) y se confirmó a ojo que cada corrección se aplicó — pero NO se volvió a correr el revisor-visual sobre la versión corregida (los veredictos en disco siguen siendo los de la versión ANTERIOR a las correcciones). No declarar estas 3 pantallas "100% listas" sin una segunda pasada.
- Novena / Diario / Perfil: pantallas secundarias del mismo tipo ya aprobado (app interna) — no requieren revisor-visual individual, basta checklist (anotado abajo).

## Decisiones técnicas (NO re-discutir sin pedirlo el usuario)
- Framework: Next.js 16 (App Router, Turbopack) — scaffold en la raíz del proyecto (no en subcarpeta). React 19.
- Landing: `app/page.tsx` compone las 10 secciones canónicas desde `components/landing/` (copiado de `plantillas-codigo/landing/`, tematizado en `components/landing/tokens.css`). Copy marcado fuente de verdad: `docs/copy/landing.md`.
- Auth: magic link/OTP por email, Hotmart-first. Passkey tras D7. Sin contraseñas.
- Modelo de IA: NINGUNA generación en vivo para el contenido central — biblioteca curada de ~365 días (pensamiento del santo + milagro eucarístico + preparación), revisada doctrinalmente antes de publicar.
- Modelo de datos: `profiles` · `daily_content` (ahora con 2 piezas por día: santo Y milagro) · `user_progress` · `diary_entries` (RLS por `auth.uid()`) · `novenas` · `novena_participation` (RLS individual + vista agregada pública) · `subscriptions`.
- Idioma de UI: mono-idioma, español latino neutro.
- `/onboarding`: componente cliente único (state machine de 10 pasos) en `app/onboarding/page.tsx`, usa primitivas compartidas en `components/funnel/ui.tsx` (BarraProgreso, OpcionChip, CtaFunnel, AnilloProgreso, PasoAnimado). Onboarding hereda el tema día (`:root`); las 3 pantallas de paywall se envuelven en la clase `.tema-noche` (definida en `app/globals.css`, mismo mapeo día/noche ya aprobado en el tour de Sesión 2). El CTA final del paywall NO simula un cobro real (C3ter de 50) — muestra una confirmación honesta y lleva a `/entrar`.
- `/entrar`: login real (spec E de 50) — magic link primario + Google secundario + 3 estados (enviando/enviado/error genérico anti-enumeración). Backend simulado con `setTimeout` hasta que Supabase Auth se conecte en la Sesión 6.
- Token semántico nuevo: `--danger` en `components/landing/tokens.css` (día: #B4231F) y su variante en `.tema-noche` (#F87171, más claro para contraste sobre fondo oscuro) — para estados de error de formulario.
- Rutas restantes como stubs honestos: `/privacidad`, `/terminos` (mensaje de "en construcción" con salida — pendientes de datos del responsable) · `/reembolsos` (contenido REAL: plazo de 15 días + cómo pedirlo).
- App interna (`/app/*`): 4 pestañas (Hoy, Novena, Diario, Perfil) vía `app/app/layout.tsx` (shell + `BottomNav`) — nav por rutas reales de Next.js, no tabs de estado (a diferencia del ejemplo canónico del 53, que usa un solo archivo). Datos 100% locales por ahora (`lib/demo-data.ts`) — el modelo de datos real con RLS (perfiles/racha/novena/diario) se conecta en la Sesión 6 sin rediseñar la UI, solo cambiando la fuente de datos. El botón "Vivir mis 3 minutos" de Hoy marca localmente el día como hecho (celebración con check) — el flujo interactivo completo de 3 minutos queda para una sesión futura, hoy es un compromiso de una sola pantalla.
- Herramienta de captura visual: el MCP de Playwright, que estuvo desconectado buena parte de la sesión, reconectó y SÍ funciona correctamente (`browser_navigate` + `browser_resize` + `browser_take_screenshot` con `fullPage: true` da capturas reales sin artefactos) — es el mecanismo a usar de ahora en adelante para evidencia visual en este proyecto.
- **Supabase (Sesión 6):** proyecto `EucaristiaViva` (`rcbkiuccypqtvupkyvxq`, región us-east-1,
  org `luisaferemprende's Org`) — SE CREÓ UNO NUEVO a propósito en vez de reusar un proyecto
  viejo sin relación ("SantoDiario", de otra app, se dejó intacto). Esquema real: `profiles` (1:1
  con `auth.users`, trigger `handle_new_user` lo crea solo al registrarse) · `daily_content` y
  `novenas` (catálogo, lectura pública) · `novena_participation` (RLS individual + la vista
  `novena_popularidad` expone SOLO el conteo agregado por novena, nunca filas individuales —
  responde la pregunta de "cómo sabemos cuántos están en cada novena" sin exponer privacidad) ·
  `diary_entries` y `user_progress` (RLS por `auth.uid()`) · `subscriptions` (solo SELECT para el
  cliente — el estado del plan lo escribe ÚNICAMENTE el webhook de Hotmart con la service_role,
  nunca el usuario). El check-in diario + cálculo de racha es un RPC `security_definer`
  transaccional (`public.marcar_hoy_hecho`, patrón canónico de 25-BASE-DE-DATOS.md) — el único
  warning de los advisors de seguridad es ESE RPC siendo ejecutable por `authenticated`, y es
  intencional (así es como el usuario lo llama desde el cliente). `.env.local`/`.env.example`
  tienen la URL y la publishable key — NUNCA la service_role (esa vive solo en el futuro webhook).
- **Vercel:** equipo existente del usuario = `DIARIOSANTO` (`team_aaUicrR8ome14FZrRD7WZvju`) — se
  usó ese equipo (no es ambiguo como el caso de Supabase: aquí solo es EL destino, no datos a
  reusar). Repo de GitHub del usuario: `luisaferemprende/eucaristia-carloacutis`. Intento de
  conectar vía API dio 403 — pendiente que el usuario apruebe el acceso de la GitHub App de Vercel
  a ese repo (vercel.com/new o github.com/settings/installations) antes de reintentar.
- **Sincronización onboarding→perfil real:** las respuestas (santo, momento del día) se guardan en
  `localStorage` (`ev_onboarding_respuestas`) al llegar al loading del onboarding, porque la cuenta
  todavía no existe en ese punto (Modelo 2: primero onboarding anónimo, login hasta el final). Falta
  escribir el componente que lea esa clave en el primer `/app` real, actualice `profiles` y cree la
  fila de `novena_participation` correspondiente, y borre la clave — anotado como siguiente paso.

## Sesiones completadas ✅
- Sesión 1 — Validación, FICHA-MODELO, FICHA-AVATAR, FICHA-MERCADO, monetización, mecanismo bautizado.
- Sesión 2 — Identidad visual: FICHA-ARTE aprobada (paleta día/noche del usuario + Zodiak/DM Sans).
- Sesión 3 — Landing construida (5 rondas de revisión real, copy 16/20 aprobado). El usuario decidió avanzar con el gate de usabilidad/craft documentado como pendiente, en vez de seguir puliendo.
- Sesión 4 — Onboarding + paywall de secuencia (3 pantallas) + login real, construidos y verificados por lógica/contenido.
- Sesión 5 — Auditoría de escaneabilidad de la landing (1 corrección) + App interna completa (Hoy/Novena/Diario/Perfil) con datos semilla + capturas reales de onboarding/paywall/pantalla principal vía Playwright + revisor-visual lanzado sobre las 3 (NO LISTA en los 3, defectos ya corregidos en código — ver Problemas conocidos).

## Sesión en progreso 🔧
- Sesión 6 — Supabase conectado (esquema+RLS+seed) y `/entrar` con Auth real. Pendiente: sincronizar
  perfil desde el onboarding, pasar `/app/*` a datos reales, resolver el permiso de Vercel↔GitHub,
  y luego Hotmart + Resend + dominio.

## Próximas sesiones 📋
- Sesión 7: Testing, pulido y rigor de entrega.
- Sesión 8: Adquisición, lanzamiento y backoffice.

## Problemas conocidos ⚠️
- **Veredicto de landing (docs/revisiones/landing-veredicto.md): NO LISTA (gate PENDIENTE).** Usabilidad 28/40 (falta ≥36) y Craft 15/20 (falta ≥16); Copy 16/20 SÍ pasa. Los defectos que quedan tras 5 rondas son en su mayoría estructurales para este TIPO de pantalla (heurísticas de Nielsen como "control/deshacer" o "atajos de experto" no aplican bien a una landing estática) o de identidad visual profunda (el mundo del sujeto de FICHA-ARTE — rayos de custodia, textura de trigo, sello de hostia — no se llevó a un tratamiento visual concreto, solo queda el hairline dorado). Antes de mandar tráfico pagado, decidir con el usuario: seguir puliendo, o aceptar y avanzar.
- Carrusel "La app por dentro" con PLACEHOLDERS rotulados — se resuelve montando screenshots reales en la Sesión 5.
- `/privacidad` y `/terminos` muestran "en construcción" — PENDIENTE de que el usuario dé sus DATOS DEL RESPONSABLE (nombre/razón social, país desde el que opera) para redactarlas con 47-LEGAL-FISCAL-Y-PRIVACIDAD.md.
- Correo de soporte `hola@eucaristiaviva.com` es un PLACEHOLDER plausible (mismo patrón que usa el propio kit del SO) — PENDIENTE de que el usuario confirme su dominio/correo real antes de publicar. Aparece en el footer y en `/reembolsos`.
- Contenido doctrinal ampliado: ahora la biblioteca diaria incluye, además del pensamiento del santo, la historia de un milagro eucarístico real (ej. Lanciano) — la precisión histórica/doctrinal de esos ~365×2 textos necesita la misma revisión cuidadosa ya anotada, y ahora cubre también el catálogo de milagros (el propio Carlo Acutis documentó esto en vida — hay fuentes reales que usar como base, no inventar).
- **Veredicto — onboarding: NO LISTA (30/40 usabilidad, 12/20 craft) — gate PENDIENTE** en `docs/revisiones/onboarding-veredicto.md`
  (veredicto de la versión SIN corregir). Defectos que señaló y ya se corrigieron: vacío muerto
  arriba/abajo del bloque de preguntas → `justify-start` + halo de profundidad; sin salida en la
  primera pregunta → botón "X" agregado; el chip seleccionado avanzaba antes de que se viera el
  check → delay de 280ms (`PreguntaOpciones`); sin stagger de entrada entre ícono/título/chips →
  ahora cada uno anima por separado; fondo plano → gradiente radial sutil arriba. PENDIENTE:
  re-correr el revisor-visual sobre la versión corregida para confirmar que sí pasa el gate.
- **Veredicto — paywall: NO LISTA (32/40 usabilidad, 8/20 craft, 15/20 copy) — gate PENDIENTE** en
  `docs/revisiones/paywall-veredicto.md` (versión sin corregir). Defectos ya corregidos: bug de
  contraste real (texto casi-blanco sobre botón/badge dorado en modo noche — nuevo token
  `--on-accent-fill` en `components/landing/tokens.css`, siempre oscuro en día Y noche); faltaba
  la hairline dorada que FICHA-ARTE prometía para pantallas nocturnas → agregada; los pasos 8-10
  aparecían sin animación de entrada → fade+slide agregado; H1 sin palabra en acento → corregido;
  tarjetas de plan sin feedback de selección (whileTap + check) → agregado; copy sin comparación
  de precio ni desglose diario → se agregó "menos de $0.08 al día" y la comparación vs. la app
  líder ($70/año). PENDIENTE: re-correr el revisor-visual.
- **Veredicto — pantalla principal: NO LISTA (29/40 usabilidad, 13/20 craft) — gate PENDIENTE** en
  `docs/revisiones/pantalla-principal-veredicto.md` (versión sin corregir). Defectos ya
  corregidos: indicador de desarrollo de Next.js tapaba el nav → `devIndicators: false` en
  `next.config.ts`; el botón "Vivir mis 3 minutos" no se podía deshacer → ahora es un toggle;
  la fecha capitalizaba mal la preposición "de" ("26 De Septiembre") → función `fechaCorta()`
  propia; el diario cortaba el texto a media palabra → `truncarPalabra()` corta en el último
  espacio; sin dispositivo ownable visible en esta pantalla → halo de custodia agregado detrás
  del pensamiento del día. Defecto NO corregido (se decide en Sesión 6, no ahora): sin estados de
  error/loading — hoy los datos son un import local sin fetch real, agregar el skeleton/error
  cuando se conecte Supabase, no antes (sería fingir una espera que no existe). PENDIENTE:
  re-correr el revisor-visual.

- **Rosario (Sesión 6):** 19 de 20 meditaciones sin escribir (requieren fuentes verificadas y revisión doctrinal); imágenes de misterios sin licencia verificada; traducción bíblica por definir (Torres Amat, dominio público).
- **Login por correo:** límite de envíos del correo integrado de Supabase (429) — solución definitiva = SMTP propio con Resend. URL Configuration de Supabase sin configurar.

- **Novenas — REGLA DE LA USUARIA (2026-10-08): las novenas NO se inventan; deben salir de una página católica verificable.** Los 9 días de San Pío hoy en la base de datos los escribí YO (texto propio) → hay que REEMPLAZARLOS. Fuentes halladas: ACI Prensa tiene la novena día por día de San Pío (aciprensa.com/recursos/822/novena-a-san-pio-de-pietrelcina), Santa Teresita (EWTN y ACI Prensa recurso 844-851) y Santo Tomás (aciprensa.com/recursos/1034); Carlo Acutis: no hay versión en español verificada (novenaprayer.com en inglés; Shalom/Messaggero en italiano). Esos textos tienen derechos de autor y no se halló permiso de reproducción → NO copiar sin autorización escrita; decisión de la usuaria pendiente (pedir permiso vs enlazar vs oraciones de dominio público).

## Pendientes del usuario (acciones que el usuario debe hacer)
- [ ] Supabase → Authentication → URL Configuration: Site URL `https://eucaristia-carloacutis.vercel.app` + Redirect URL `https://eucaristia-carloacutis.vercel.app/**`.
- [ ] Crear cuenta gratis en Resend para conectar el correo de acceso.
- [ ] Dar sus DATOS DEL RESPONSABLE (nombre o razón social, país desde el que opera, y el correo real de soporte) para terminar `/privacidad`, `/terminos` y confirmar el correo del footer/`/reembolsos`.
- [ ] Decidir si seguimos puliendo el gate visual de la landing ahora, o avanzamos documentándolo como pendiente.
- [ ] Darle permiso a la GitHub App de Vercel sobre el repo `eucaristia-carloacutis` (vercel.com/new
      o github.com/settings/installations) para poder conectar el proyecto y desplegar.

## Notas para la próxima sesión
- El mecanismo bautizado "La Autopista de 3 Minutos" ahora entrega 2 piezas de contenido por día (santo + milagro eucarístico), no solo 1 — esto afecta el modelo de datos de `daily_content` (dos columnas o dos tablas relacionadas) y el diseño de la pantalla principal cuando se construya la app interna (Sesión 5): debe caber sin sentirse apretada (revisar el gate cognitivo de "≤4-5 ítems visibles").
- El copy de venta se deriva de FICHA-AVATAR.md — al sincronizar la ficha con el dolor ampliado, revisar que ninguna pieza de copy quede sin traza a un campo de la ficha.
