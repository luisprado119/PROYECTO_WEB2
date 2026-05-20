"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/app/AuthContext";
import { getActivityLog } from "@/lib/db/actions/activity-actions";
import type { ActivityLogRow } from "@/lib/db/db-types";

const ACTION_BADGE: Record<string, string> = {
  login:    "bg-blue-100 text-blue-700",
  logout:   "bg-slate-100 text-slate-600",
  signup:   "bg-emerald-100 text-emerald-700",
  purchase: "bg-orange-100 text-orange-700",
  view:     "bg-violet-100 text-violet-700",
  add_cart: "bg-amber-100 text-amber-700",
  error:    "bg-red-100 text-red-700",
};

function getActionBadge(action: string) {
  const key = Object.keys(ACTION_BADGE).find(k => action?.toLowerCase().includes(k));
  return key ? ACTION_BADGE[key] : "bg-surface-container text-on-surface-variant";
}

export default function AdminLogPage() {
  const { token, loading: authLoading } = useAuth();
  const [filterUser, setFilterUser]     = useState("");
  const [filterAction, setFilterAction] = useState("");
  const [rows, setRows]   = useState<ActivityLogRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getActivityLog(token, {
        limit: 150,
        username: filterUser.trim() || undefined,
        action:   filterAction.trim() || undefined,
      });
      setRows(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo cargar el log.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authLoading || !token) {
      if (!authLoading && !token) { setError("Sesión no disponible."); setLoading(false); }
      return;
    }
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, authLoading]);

  return (
    <div className="space-y-lg">
      {/* Header */}
      <div>
        <h1 className="text-headline-lg font-bold text-on-surface">Log de actividad</h1>
        <p className="text-body-md text-on-surface-variant mt-1">
          Registro de acciones de usuario en tiempo real — máximo 150 entradas
        </p>
      </div>

      {/* Filtros */}
      <div className="bg-white border border-outline-variant rounded-xl p-lg">
        <p className="text-label-md font-bold text-on-surface-variant uppercase tracking-wide mb-md">Filtros</p>
        <div className="flex flex-wrap items-end gap-md">
          {/* Usuario */}
          <div className="flex flex-col gap-xs flex-1 min-w-[180px]">
            <label className="text-label-md font-medium text-on-surface" htmlFor="log-user">Usuario</label>
            <div className="relative">
              <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-on-surface-variant" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <input
                id="log-user"
                value={filterUser}
                onChange={e => setFilterUser(e.target.value)}
                placeholder="Nombre de usuario…"
                className="w-full h-10 pl-9 pr-md border border-outline-variant rounded-lg bg-surface-container-lowest text-body-md text-on-surface placeholder:text-on-surface-variant focus:ring-2 focus:ring-md-primary focus:outline-none"
              />
            </div>
          </div>

          {/* Acción */}
          <div className="flex flex-col gap-xs flex-1 min-w-[180px]">
            <label className="text-label-md font-medium text-on-surface" htmlFor="log-action">Acción</label>
            <div className="relative">
              <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-on-surface-variant" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <input
                id="log-action"
                value={filterAction}
                onChange={e => setFilterAction(e.target.value)}
                placeholder="login, signup, purchase…"
                className="w-full h-10 pl-9 pr-md border border-outline-variant rounded-lg bg-surface-container-lowest text-body-md text-on-surface placeholder:text-on-surface-variant focus:ring-2 focus:ring-md-primary focus:outline-none"
              />
            </div>
          </div>

          {/* Botón aplicar */}
          <button
            type="button"
            onClick={() => void load()}
            disabled={loading || !token}
            className="h-10 px-lg bg-md-primary-container text-md-on-primary-container font-bold text-label-md rounded-lg hover:brightness-95 active:scale-95 transition-all disabled:opacity-50 flex items-center gap-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
            </svg>
            Aplicar filtros
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="p-md bg-md-error-container text-md-on-error-container rounded-lg text-label-md">⚠️ {error}</div>
      )}

      {/* Tabla */}
      <div className="bg-white border border-outline-variant rounded-xl overflow-hidden">
        {loading || authLoading ? (
          <div className="flex flex-col items-center justify-center h-48 gap-md">
            <div className="animate-spin h-8 w-8 border-4 border-md-primary border-t-transparent rounded-full" />
            <p className="text-on-surface-variant text-body-md">Cargando log…</p>
          </div>
        ) : rows.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48">
            <div className="text-5xl mb-md">📋</div>
            <p className="text-on-surface-variant text-body-md">No hay entradas con los filtros actuales.</p>
          </div>
        ) : (
          <>
            {/* Counter */}
            <div className="px-lg py-sm border-b border-outline-variant bg-surface-container-low">
              <p className="text-label-md text-on-surface-variant">
                <span className="font-bold text-on-surface">{rows.length}</span> entradas encontradas
              </p>
            </div>
            <table className="w-full">
              <thead>
                <tr className="border-b border-outline-variant">
                  {["Fecha", "Usuario", "Acción", "Objetivo"].map(h => (
                    <th key={h} className="px-md py-sm text-left text-[11px] font-bold uppercase tracking-wider text-on-surface-variant first:pl-lg last:pr-lg bg-surface-container-low">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} className="border-b border-outline-variant hover:bg-surface-container-low transition-colors">
                    <td className="px-lg py-sm">
                      <span className="text-[11px] text-on-surface-variant whitespace-nowrap font-mono">
                        {r.fecha}
                      </span>
                    </td>
                    <td className="px-md py-sm">
                      <span className="text-label-md font-bold text-md-primary">{r.username}</span>
                    </td>
                    <td className="px-md py-sm">
                      <span className={`px-sm py-xs text-[11px] font-bold rounded-full ${getActionBadge(r.action)}`}>
                        {r.action}
                      </span>
                    </td>
                    <td className="px-md py-sm pr-lg text-label-md text-on-surface-variant">
                      {r.target ?? "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
}
