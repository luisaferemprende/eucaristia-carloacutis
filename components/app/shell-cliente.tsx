'use client';

// Parte CLIENTE del shell de la app interna: el modo día/noche depende de la
// hora real del dispositivo (no se puede leer en el servidor) — separado del
// layout.tsx (Server Component) que exige sesión antes de llegar aquí.

import { useEffect, useState } from 'react';
import { BottomNav } from '@/components/app/ui';

export function AppShellCliente({ children }: { children: React.ReactNode }) {
  const [esNoche, setEsNoche] = useState(false);

  useEffect(() => {
    const h = new Date().getHours();
    setEsNoche(h < 6 || h >= 19);
  }, []);

  return (
    <div className={`${esNoche ? 'tema-noche' : ''} flex min-h-dvh flex-col bg-[var(--bg)] [font-family:var(--font-body)]`}>
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col">{children}</div>
      <BottomNav />
    </div>
  );
}
