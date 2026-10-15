'use client';

// Registro mínimo de uso real para el panel de administración (21-BACKOFFICE):
// activación y retención se calculan sobre esto, nunca inventadas. Dos eventos
// bastan para lo que el panel necesita hoy — no es un sistema de analítica
// completo (eso sería PostHog, que esta app no tiene instalado todavía).

import { createClient } from '@/lib/supabase/client';

export async function registrarEvento(tipo: string, userId: string, metadata: Record<string, unknown> = {}) {
  const supabase = createClient();
  await supabase.from('event_log').insert({ type: tipo, user_id: userId, metadata });
}

const CLAVE_SESION_DIARIA = 'ev_sesion_registrada_el';

// `sesion_iniciada`: una sola vez por día activo (deduplicado en este dispositivo)
// — es lo que permite calcular D1/D7/D30 sin contar el mismo día dos veces.
export async function registrarSesionDiaria(userId: string) {
  try {
    const hoy = new Date().toISOString().slice(0, 10);
    if (localStorage.getItem(CLAVE_SESION_DIARIA) === hoy) return;
    localStorage.setItem(CLAVE_SESION_DIARIA, hoy);
    await registrarEvento('sesion_iniciada', userId);
  } catch {
    // localStorage puede fallar (modo privado, storage bloqueado) — no es crítico, se omite.
  }
}

export async function registrarError(error: Error, contexto: string, userId?: string) {
  if (!userId) return; // la política de error_log solo acepta insertar la PROPIA fila.
  try {
    const supabase = createClient();
    await supabase.from('error_log').insert({ message: error.message, context: contexto, user_id: userId });
  } catch {
    // Si ni siquiera se puede loguear el error, no hay que romper la pantalla por eso.
  }
}
