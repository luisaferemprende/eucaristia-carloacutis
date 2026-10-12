'use client';

// Última red de seguridad: si falla la RAÍZ misma de la app (muy raro — un
// error en el layout), esto reemplaza la pantalla en blanco de Next.js. Debe
// traer su propio <html>/<body> porque reemplaza TODO, incluido el layout.
// Sin tokens de app/globals.css (pudo ser justo eso lo que falló): colores
// fijos, deliberadamente.

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="es">
      <body style={{ margin: 0, fontFamily: 'Georgia, serif' }}>
        <main
          style={{
            display: 'flex',
            minHeight: '100dvh',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            textAlign: 'center',
            background: '#FDFBF7',
            color: '#111827',
          }}
        >
          <h1 style={{ fontSize: '22px', fontWeight: 700 }}>EucaristíaViva tuvo un tropiezo</h1>
          <p style={{ marginTop: '8px', maxWidth: '320px', color: '#667085' }}>
            Cierra y vuelve a abrir la app. Si sigue pasando, escríbenos.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: '24px',
              height: '48px',
              padding: '0 28px',
              borderRadius: '12px',
              background: '#D4AF37',
              color: '#14100A',
              fontWeight: 600,
              fontSize: '16px',
              border: 'none',
            }}
          >
            Reintentar
          </button>
        </main>
      </body>
    </html>
  );
}
