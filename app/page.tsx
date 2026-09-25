'use client';

import { useEffect, useState } from 'react';
import { CalendarX, HeartCrack, Repeat, UserX } from 'lucide-react';
import { Hero } from '@/components/landing/Hero';
import { Problema } from '@/components/landing/Problema';
import { Agitacion } from '@/components/landing/Agitacion';
import { Solucion } from '@/components/landing/Solucion';
import { AppPorDentro } from '@/components/landing/AppPorDentro';
import { Oferta } from '@/components/landing/Oferta';
import { Garantia } from '@/components/landing/Garantia';
import { Faq } from '@/components/landing/Faq';
import { CtaFinal } from '@/components/landing/CtaFinal';
import { FooterLegal } from '@/components/landing/FooterLegal';
import { StickyCtaMobile } from '@/components/landing/ui';

// Modelo 2 (onboarding-first, variante anónima — 02C/ESTADO.md): el CTA lleva
// a /onboarding, nunca al checkout desde el hero.
const CTA_HREF = '/onboarding';
const CTA_LABEL = 'Empezar mi primer día gratis';

// Conteo animado del número héroe (baseline obligatoria de movimiento, 32/14) —
// nunca un número estático. Respeta prefers-reduced-motion (salta al valor final).
function useCountUp(target: number, durationMs = 900) {
  const [n, setN] = useState(0);
  useEffect(() => {
    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      setN(target);
      return;
    }
    let start: number | null = null;
    let raf = 0;
    const step = (t: number) => {
      if (start === null) start = t;
      const progress = Math.min((t - start) / durationMs, 1);
      setN(Math.round(progress * target));
      if (progress < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, durationMs]);
  return n;
}

// Mini-demo honesto del mecanismo real (jerarquía de mockups honestos, 19 §5 —
// la app interna todavía no existe, se construye en la Sesión 5). No es un
// screenshot: es HTML/CSS con contenido real del dominio, no una ilustración.
function HeroVisualMock() {
  const racha = useCountUp(7);
  return (
    <div className="bg-[var(--surface)] p-6 text-left">
      <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[var(--text-tertiary)]">
        Tu racha viva
      </p>
      <p className="mt-1 [font-family:var(--font-display)] text-[32px] font-bold leading-none tabular-nums text-[var(--text-primary)]">
        {racha} <span className="text-[12px] text-[var(--text-secondary)]">días</span>
      </p>
      <p className="mt-1 text-[12px] font-semibold text-[var(--accent-2)]">
        ↑ vas por tu segunda novena completa
      </p>
      <div className="mt-4 rounded-[calc(var(--radius-card)-4px)] border border-[color-mix(in_oklab,var(--text-tertiary)_22%,transparent)] bg-[var(--bg)] p-4">
        <p className="text-[16px] font-semibold text-[var(--text-primary)]">Pensamiento de hoy · Carlo Acutis</p>
        <p className="mt-1 text-[16px] leading-snug text-[var(--text-secondary)]">
          &ldquo;La Eucaristía es mi autopista al cielo.&rdquo;
        </p>
      </div>
      <div className="mt-3 rounded-[calc(var(--radius-card)-4px)] border border-[color-mix(in_oklab,var(--text-tertiary)_22%,transparent)] bg-[var(--bg)] p-4">
        <p className="text-[16px] font-semibold text-[var(--text-primary)]">Milagro eucarístico de hoy</p>
        <p className="mt-1 text-[16px] leading-snug text-[var(--text-secondary)]">
          Lanciano, Italia — el pan y el vino que aún hoy se conservan.
        </p>
      </div>
    </div>
  );
}

export default function LandingEucaristiaViva() {
  return (
    <div className="min-h-dvh bg-[var(--bg)] text-[var(--text-primary)] [font-family:var(--font-body)]">
      {/* 1. HERO */}
      <Hero
        appName="EucaristíaViva"
        loginHref="/entrar"
        h1Marked="Vive la Eucaristía [acento]a fondo[/acento], en 3 minutos al día"
        subtitleMarked="La Autopista de 3 Minutos: los santos y un milagro eucarístico, cada día."
        ctaLabel={CTA_LABEL}
        ctaHref={CTA_HREF}
        socialProof={<span>7 días gratis · cancela cuando quieras</span>}
        visual={<HeroVisualMock />}
      />

      {/* 2. PROBLEMA */}
      <Problema
        titulo="¿Te suena?"
        preguntas={[
          { icon: Repeat, textoMarked: '¿Comulgas y a los 5 minutos ya sientes que nada cambió?' },
          { icon: CalendarX, textoMarked: '¿Empiezas una novena y al cuarto día ya se te olvida?' },
          { icon: HeartCrack, textoMarked: '¿Sientes que le das a Dios las obras cansadas del día?' },
          { icon: UserX, textoMarked: '¿Sientes que rezas sola, sin nadie que entienda por qué te importa?' },
        ]}
      />

      {/* 3. AGITACIÓN */}
      <Agitacion
        frases={[
          'Ir a misa por costumbre no te acerca a Dios — [b]te acostumbra[/b] a sentir cada vez menos.',
          'Cada novena que dejas a la mitad se acumula, junto con [acento]la culpa[/acento] de siempre.',
          'Sin un método diario, hasta el milagro más grande del mundo se vuelve invisible para ti.',
        ]}
        contraste={{
          labelHoy: 'Hoy',
          hoy: 'Comulgas por inercia y sigues igual de vacía.',
          labelFuturo: 'En 6 meses, si nada cambia',
          futuro: 'El mismo vacío — con 6 meses menos.',
        }}
      />

      {/* 4. SOLUCIÓN — La Autopista de 3 Minutos */}
      <Solucion
        tituloMarked="Tu Eucaristía, [acento]con vida otra vez[/acento]"
        mecanismo="La Autopista de 3 Minutos"
        bigIdeaMarked="No te falta fe. Te faltaba un método diario que te lleve de vuelta al centro: la Eucaristía. [b]La Autopista de 3 Minutos[/b] te acompaña cada día."
        pasos={[
          { titulo: 'Recibes', detalle: 'El pensamiento de un santo y la historia de un milagro eucarístico.' },
          { titulo: 'Vives', detalle: 'Tu micro-preparación de 3 minutos antes de tu próxima comunión.' },
          { titulo: 'Guardas', detalle: 'Tu avance en la novena y tu intención en el diario, con la comunidad.' },
        ]}
        antesDespues={{
          labelAntes: 'Antes',
          antes: 'Comulgo por inercia y abandono mis novenas con culpa.',
          labelDespues: 'Después',
          despues: 'Vivo la Eucaristía a fondo, cada día, sin fallar.',
        }}
      />

      {/* 5. LA APP POR DENTRO — placeholders honestos hasta tener screenshots reales (pendiente en ESTADO.md) */}
      <AppPorDentro
        tituloMarked="Tu Eucaristía, [acento]día por día[/acento]"
        frames={[
          { label: 'El santo y el milagro eucarístico de hoy', nombrePantalla: 'Inicio' },
          { label: 'Tu novena, sin perder la cuenta', nombrePantalla: 'Novena' },
          { label: 'Tu prueba gratis de 7 días', nombrePantalla: 'Planes' },
          { label: 'Tu diario privado, para siempre', nombrePantalla: 'Diario' },
        ]}
        ctaLabel={CTA_LABEL}
        ctaHref={CTA_HREF}
      />

      {/* 6. OFERTA — anual primero, trial en ambos planes (7 días, FICHA-MERCADO §4) */}
      <Oferta
        tituloMarked="Empieza gratis. Sigue por [acento]$0.08 al día[/acento]"
        trialDias={7}
        stack={{
          lineas: [
            { resultado: 'Todo el método guiado de La Autopista de 3 Minutos (12 meses) — lo que cuesta hoy la alternativa líder', valor: '$70' },
            { resultado: 'Tu diario espiritual privado, que nunca se pierde', valor: 'Incluido' },
            { resultado: 'Tus retos de novenas, acompañada por la comunidad', valor: 'Incluido' },
          ],
          totalTachado: '$70',
          nota: 'Hoy: $2.50/mes (se cobra $29.99/año)',
        }}
        anual={{
          nombre: 'Anual',
          badge: 'AHORRA 37%',
          precioMes: '$2.50',
          totalAnual: 'Se cobra $29.99/año',
          ahorro: 'Ahorra 37% vs. mensual',
          descomposicionDia: 'menos de $0.08 al día',
          ctaLabel: CTA_LABEL,
          ctaHref: CTA_HREF,
          features: [
            'El pensamiento diario de los santos y los milagros eucarísticos',
            'Tu micro-preparación de 3 minutos antes de cada comunión',
            'Diario espiritual privado, para siempre',
            'Tu novena, acompañada por la comunidad',
          ],
        }}
        mensual={{
          nombre: 'Mensual',
          precioMes: '$3.99',
          ctaLabel: 'Elegir mi plan mensual',
          ctaHref: CTA_HREF,
          features: [
            'El pensamiento diario de los santos y los milagros eucarísticos',
            'Tu micro-preparación de 3 minutos antes de cada comunión',
            'Diario espiritual privado, para siempre',
            'Cancelas cuando quieras',
          ],
        }}
      />

      {/* 7. GARANTÍA — nombre propio + condición + piso Hotmart (FICHA-MERCADO §4: 15 > 7) */}
      <Garantia
        nombre="la Garantía de tu Primera Novena Completa"
        condicionMarked="Si en tus primeros 15 días no sientes que por primera vez vas a [b]terminar una novena completa[/b], escríbenos y te devolvemos todo. Sin preguntas."
        pisoLegal="Respaldada por la garantía de Hotmart de 15 días"
      />

      {/* 8. FAQ — objeciones reales de FICHA-AVATAR.md */}
      <Faq
        items={[
          {
            pregunta: '¿No tengo tiempo para otra app más?',
            respuestaMarked:
              'Son 3 minutos, menos de lo que ya pierdes decidiendo qué rezar. Puedes hacerlo antes de dormir o antes de misa.',
          },
          {
            pregunta: '¿Y si la abandono como las demás?',
            respuestaMarked:
              'Tu racha y tu novena quedan siempre a la vista en tu pantalla de inicio, [b]como ves arriba[/b] — no tienes que recordar en qué día vas.',
          },
          {
            pregunta: '¿Para qué pagar si puedo rezar gratis?',
            respuestaMarked:
              'Gratis no te trae la sabiduría de los santos ni el milagro de hoy, ordenados y a tiempo. Pagas por la constancia.',
          },
          {
            pregunta: '¿Es otra suscripción cara?',
            respuestaMarked:
              '$3.99 al mes o $29.99 al año — mucho menos que Hallow ($70/año) — y ves el precio exacto antes de pagar.',
          },
          {
            pregunta: '¿Es seguro pagar con mi tarjeta?',
            respuestaMarked:
              'Pagas por Hotmart — tarjeta, PIX o el método de tu país. [b]Nunca vemos tus datos[/b] y cancelas con un correo.',
          },
          {
            pregunta: '¿Y si se ve abandonada o mal hecha?',
            respuestaMarked:
              'El cuidado que ves en esta página es el mismo que vas a encontrar adentro — [b]nada de plantillas genéricas[/b].',
          },
        ]}
      />

      {/* 9. CTA FINAL — mismo verbo del hero, PS al cierre */}
      <CtaFinal
        h2Marked="Por fin, [acento]tu Eucaristía cobra vida[/acento]"
        futurePacingMarked="Imagina abrir los ojos mañana y tener el pensamiento del santo y el milagro del día esperándote — sin buscar, sin decidir, solo vivirlo."
        ctaLabel={CTA_LABEL}
        ctaHref={CTA_HREF}
        recap="la Garantía de tu Primera Novena Completa · 7 días gratis"
        psMarked="PD: La Autopista de 3 Minutos te acompaña cada día con el pensamiento de los santos, la historia de un milagro eucarístico, tu diario privado y tu novena con la comunidad. Hoy entras con 7 días gratis y la Garantía de tu Primera Novena Completa (15 días)."
      />

      {/* 10. FOOTER LEGAL */}
      <FooterLegal
        appName="EucaristíaViva"
        soporteEmail="hola@eucaristiaviva.com"
        enlaces={[
          { label: 'Privacidad', href: '/privacidad' },
          { label: 'Términos y Condiciones', href: '/terminos' },
          { label: 'Reembolsos', href: '/reembolsos' },
        ]}
      />

      <StickyCtaMobile labelComercial={CTA_LABEL} href={CTA_HREF} />
    </div>
  );
}
