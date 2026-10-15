'use client';

// Lista real de usuarios + buscador + agregar a mano (correo+nombre) + dar o
// quitar acceso manual (por si el webhook de Hotmart falla). Todo pasa por
// rutas de servidor que vuelven a verificar que quien llama es admin.

import { useMemo, useState } from 'react';
import { Search, UserPlus, X } from 'lucide-react';
import { TituloSeccion } from '@/components/admin/ui';

export interface UsuarioFila {
  id: string;
  nombre: string;
  email: string | null;
  role: string;
  rachaActual: number;
  creadoEn: string;
  plan: string | null;
  estado: string | null;
}

const sinAcentos = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

function fechaCorta(iso: string): string {
  return new Intl.DateTimeFormat('es', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(iso));
}

function Insignia({ estado }: { estado: string | null }) {
  if (!estado) {
    return <span className="rounded-full bg-[var(--surface-2)] px-2.5 py-1 text-[12px] font-medium text-[var(--text-tertiary)]">Sin plan</span>;
  }
  const activo = estado === 'activa' || estado === 'trial';
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-[12px] font-medium ${
        activo ? 'bg-[color-mix(in_oklab,var(--accent-2)_14%,transparent)] text-[var(--accent-2)]' : 'bg-[color-mix(in_oklab,var(--danger)_14%,transparent)] text-[var(--danger)]'
      }`}
    >
      {estado}
    </span>
  );
}

export function UsuariosCliente({ usuariosIniciales }: { usuariosIniciales: UsuarioFila[] }) {
  const [usuarios, setUsuarios] = useState(usuariosIniciales);
  const [busqueda, setBusqueda] = useState('');
  const [modalAbierto, setModalAbierto] = useState(false);
  const [email, setEmail] = useState('');
  const [nombre, setNombre] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exito, setExito] = useState<string | null>(null);
  const [actualizandoId, setActualizandoId] = useState<string | null>(null);

  const visibles = useMemo(() => {
    const texto = sinAcentos(busqueda.trim());
    if (!texto) return usuarios;
    return usuarios.filter((u) => sinAcentos(u.nombre).includes(texto) || sinAcentos(u.email ?? '').includes(texto));
  }, [usuarios, busqueda]);

  const invitar = async () => {
    setError(null);
    setExito(null);
    if (!email.trim() || !nombre.trim()) {
      setError('Completa el correo y el nombre.');
      return;
    }
    setEnviando(true);
    try {
      const res = await fetch('/api/admin/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), nombre: nombre.trim() }),
      });
      const datos = await res.json();
      if (!res.ok) throw new Error(datos.error ?? 'No se pudo enviar la invitación.');
      setExito(`Invitación enviada a ${email.trim()}.`);
      setEmail('');
      setNombre('');
      setModalAbierto(false);
      // La fila aparecerá en la lista real cuando la persona abra su correo y
      // entre por primera vez (ahí se crea su perfil) — no se simula antes.
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo enviar la invitación.');
    } finally {
      setEnviando(false);
    }
  };

  const cambiarAcceso = async (userId: string, darAcceso: boolean) => {
    setActualizandoId(userId);
    try {
      const res = await fetch(`/api/admin/usuarios/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: darAcceso ? 'activa' : 'cancelada' }),
      });
      const datos = await res.json();
      if (!res.ok) throw new Error(datos.error ?? 'No se pudo actualizar.');
      setUsuarios((prev) => prev.map((u) => (u.id === userId ? { ...u, estado: darAcceso ? 'activa' : 'cancelada', plan: u.plan ?? 'mensual' } : u)));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo actualizar el acceso.');
    } finally {
      setActualizandoId(null);
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-start justify-between gap-4">
        <TituloSeccion subtitulo={`${usuarios.length} ${usuarios.length === 1 ? 'persona registrada' : 'personas registradas'}.`}>Usuarios</TituloSeccion>
        <button
          type="button"
          onClick={() => {
            setModalAbierto(true);
            setError(null);
            setExito(null);
          }}
          className="flex h-11 shrink-0 items-center gap-2 rounded-[var(--radius-button)] bg-[var(--accent)] px-4 text-[14px] font-semibold text-[var(--on-accent-fill)] [touch-action:manipulation]"
        >
          <UserPlus size={16} aria-hidden="true" />
          Agregar usuario
        </button>
      </div>

      {exito && (
        <p className="mb-4 rounded-[var(--radius-button)] bg-[color-mix(in_oklab,var(--accent-2)_10%,transparent)] px-4 py-3 text-[14px] text-[var(--accent-2)]">
          {exito}
        </p>
      )}

      <div className="relative mb-4">
        <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" aria-hidden="true" />
        <input
          type="text"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar por nombre o correo…"
          className="h-11 w-full max-w-sm rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--text-tertiary)_20%,transparent)] bg-[var(--surface)] pl-10 pr-4 text-[14px] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)]"
        />
      </div>

      <div className="overflow-hidden rounded-[var(--radius-card)] border border-[color-mix(in_oklab,var(--text-tertiary)_16%,transparent)] bg-[var(--surface)]">
        <table className="w-full text-left text-[14px]">
          <thead>
            <tr className="border-b border-[color-mix(in_oklab,var(--text-tertiary)_14%,transparent)] text-[12px] font-semibold uppercase tracking-[0.04em] text-[var(--text-tertiary)]">
              <th className="px-5 py-3">Nombre</th>
              <th className="px-5 py-3">Correo</th>
              <th className="px-5 py-3">Plan</th>
              <th className="px-5 py-3">Racha</th>
              <th className="px-5 py-3">Alta</th>
              <th className="px-5 py-3">Acceso</th>
            </tr>
          </thead>
          <tbody>
            {visibles.map((u) => (
              <tr key={u.id} className="border-b border-[color-mix(in_oklab,var(--text-tertiary)_10%,transparent)] last:border-0">
                <td className="px-5 py-3 font-medium text-[var(--text-primary)]">
                  {u.nombre}
                  {u.role === 'admin' && <span className="ml-2 rounded-full bg-[var(--chip-bg)] px-2 py-0.5 text-[11px] font-semibold text-[var(--accent-text)]">admin</span>}
                </td>
                <td className="px-5 py-3 text-[var(--text-secondary)]">{u.email ?? '—'}</td>
                <td className="px-5 py-3">
                  <Insignia estado={u.estado} />
                </td>
                <td className="px-5 py-3 text-[var(--text-secondary)]">{u.rachaActual}</td>
                <td className="px-5 py-3 text-[var(--text-secondary)]">{fechaCorta(u.creadoEn)}</td>
                <td className="px-5 py-3">
                  <button
                    type="button"
                    disabled={actualizandoId === u.id}
                    onClick={() => cambiarAcceso(u.id, u.estado !== 'activa' && u.estado !== 'trial')}
                    className="text-[13px] font-semibold text-[var(--accent-text)] underline-offset-2 hover:underline disabled:opacity-50"
                  >
                    {actualizandoId === u.id ? 'Guardando…' : u.estado === 'activa' || u.estado === 'trial' ? 'Quitar acceso' : 'Dar acceso manual'}
                  </button>
                </td>
              </tr>
            ))}
            {visibles.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-[13px] text-[var(--text-tertiary)]">
                  No encontramos a nadie con ese nombre o correo.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modalAbierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" onClick={() => setModalAbierto(false)}>
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-[var(--radius-card)] bg-[var(--surface)] p-6 shadow-[var(--shadow-2)]"
          >
            <div className="flex items-start justify-between">
              <h2 className="text-[18px] font-bold text-[var(--text-primary)] [font-family:var(--font-display)]">Agregar usuario</h2>
              <button type="button" onClick={() => setModalAbierto(false)} aria-label="Cerrar" className="text-[var(--text-tertiary)]">
                <X size={18} aria-hidden="true" />
              </button>
            </div>
            <p className="mt-1 text-[13px] text-[var(--text-secondary)]">
              Le mandamos una invitación real por correo — nunca creamos una contraseña a su nombre.
            </p>
            <label className="mt-4 block text-[13px] font-medium text-[var(--text-secondary)]">
              Correo
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="persona@correo.com"
                className="mt-1 h-11 w-full rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--text-tertiary)_20%,transparent)] bg-[var(--bg)] px-3 text-[14px] text-[var(--text-primary)]"
              />
            </label>
            <label className="mt-3 block text-[13px] font-medium text-[var(--text-secondary)]">
              Nombre
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Carmen Rosa"
                className="mt-1 h-11 w-full rounded-[var(--radius-button)] border border-[color-mix(in_oklab,var(--text-tertiary)_20%,transparent)] bg-[var(--bg)] px-3 text-[14px] text-[var(--text-primary)]"
              />
            </label>
            {error && <p className="mt-3 text-[13px] text-[var(--danger)]">{error}</p>}
            <button
              type="button"
              disabled={enviando}
              onClick={invitar}
              className="mt-5 h-12 w-full rounded-[var(--radius-button)] bg-[var(--accent)] text-[14px] font-semibold text-[var(--on-accent-fill)] disabled:opacity-60"
            >
              {enviando ? 'Enviando…' : 'Enviar invitación'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
