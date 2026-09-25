// Contenido real de la política (plazos verificados en FICHA-MERCADO.md §4 contra
// Hotmart). El nombre del responsable y el correo de soporte quedan pendientes de
// que el dueño los confirme — ver ESTADO.md → Pendientes del usuario.
export default function Reembolsos() {
  return (
    <main className="min-h-dvh bg-[var(--bg)] text-[var(--text-primary)] px-6 py-16 [font-family:var(--font-body)]">
      <div className="mx-auto max-w-[640px]">
        <h1 className="text-[32px] font-bold [font-family:var(--font-display)]">Política de Reembolso</h1>
        <p className="mt-6 text-[16px] leading-relaxed text-[var(--text-secondary)]">
          EucaristíaViva ofrece 7 días de prueba gratis en ambos planes (mensual y anual). Durante
          la prueba puedes cancelar sin que se te cobre nada.
        </p>
        <p className="mt-4 text-[16px] leading-relaxed text-[var(--text-secondary)]">
          Además, contamos con <strong className="font-semibold text-[var(--text-primary)]">la Garantía de tu Primera Novena Completa</strong>:
          si dentro de tus primeros 15 días no sientes que por primera vez vas a terminar una
          novena completa, escríbenos y te devolvemos el 100% de tu pago. Sin preguntas, sin
          formularios.
        </p>
        <p className="mt-4 text-[16px] leading-relaxed text-[var(--text-secondary)]">
          Cómo pedirlo: escríbenos a{' '}
          <a href="mailto:hola@eucaristiaviva.com" className="underline">hola@eucaristiaviva.com</a>{' '}
          con el correo que usaste para comprar. También puedes gestionar tu reembolso directamente
          desde el portal de compradores de Hotmart, la plataforma que procesa tu pago.
        </p>
        <p className="mt-4 text-[16px] leading-relaxed text-[var(--text-secondary)]">
          Este plazo de 15 días está configurado en nuestro producto de Hotmart y es el mismo que
          verás en tu comprobante de compra.
        </p>
        <a href="/" className="mt-8 inline-block text-[16px] font-semibold text-[var(--accent-2)] underline">
          Volver al inicio
        </a>
      </div>
    </main>
  );
}
