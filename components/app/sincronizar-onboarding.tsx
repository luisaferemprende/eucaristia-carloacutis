'use client';

// Aplica, UNA sola vez, las respuestas que el onboarding anónimo guardó en
// localStorage (el usuario todavía no tenía cuenta en ese momento — Modelo 2).
// No pinta nada: corre en segundo plano en el primer `/app` real y refresca
// la página server-side para que ya se vea el perfil personalizado.

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

const CLAVE = 'ev_onboarding_respuestas';

export function SincronizarOnboarding({ tieneNovenaActiva }: { tieneNovenaActiva: boolean }) {
  const router = useRouter();

  useEffect(() => {
    let crudo: string | null = null;
    try {
      crudo = window.localStorage.getItem(CLAVE);
    } catch {
      return;
    }
    if (!crudo) return;

    (async () => {
      try {
        const respuestas = JSON.parse(crudo!) as {
          motivo?: string;
          momento?: string;
          santo?: string;
        };
        const supabase = createClient();
        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user) return;

        if (respuestas.momento || respuestas.santo) {
          await supabase
            .from('profiles')
            .update({
              ...(respuestas.momento ? { momento_dia: respuestas.momento } : {}),
              ...(respuestas.santo && respuestas.santo !== 'sorpresa'
                ? { santo_preferido: respuestas.santo }
                : {}),
            })
            .eq('id', userData.user.id);
        }

        if (!tieneNovenaActiva && respuestas.santo) {
          let novenaId: string | null = null;
          if (respuestas.santo !== 'sorpresa') {
            const { data: novena } = await supabase
              .from('novenas')
              .select('id')
              .eq('santo_nombre', respuestas.santo)
              .limit(1)
              .maybeSingle();
            novenaId = novena?.id ?? null;
          } else {
            // "Sorpréndeme cada día": en vez de dejarla sin novena (una pantalla
            // vacía que contradice la palabra "sorpresa"), le asignamos una al azar.
            const { data: novenas } = await supabase.from('novenas').select('id');
            if (novenas && novenas.length > 0) {
              novenaId = novenas[Math.floor(Math.random() * novenas.length)].id;
            }
          }
          if (novenaId) {
            await supabase
              .from('novena_participation')
              .insert({ user_id: userData.user.id, novena_id: novenaId });
          }
        }

        window.localStorage.removeItem(CLAVE);
        router.refresh();
      } catch {
        // Si algo falla, la clave queda en localStorage y se reintenta en el
        // próximo load — nunca rompe la pantalla ni bloquea al usuario.
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
