"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/app/AuthContext";
import { getAllCustomers } from "@/lib/db/actions/customer-actions";
import type { AdminCustomerRow } from "@/lib/db/db-types";

export default function AdminClientesPage() {
  const { token, loading: authLoading } = useAuth();
  const [rows, setRows] = useState<AdminCustomerRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setError(null);
    if (authLoading) return;
    if (!token) { setError("Sesión no disponible."); setLoading(false); return; }
    let cancelled = false;
    setLoading(true);
    void (async () => {
      try {
        const data = await getAllCustomers(token);
        if (!cancelled) setRows(data);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "No se pudieron cargar los clientes.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [token, authLoading]);

  const filtered = rows.filter(r =>
    !search ||
    r.CustomerID?.toLowerCase().includes(search.toLowerCase()) ||
    r.CompanyName?.toLowerCase().includes(search.toLowerCase()) ||
    r.ContactName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-lg">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-md">
        <div>
          <h1 className="text-headline-lg font-bold text-on-surface">Clientes</h1>
          <p className="text-body-md text-on-surface-variant mt-1">
            {loading ? "Cargando…" : `${filtered.length} de ${rows.length} clientes`}
          </p>
        </div>
        {/* Búsqueda */}
        <div className="relative w-full md:w-64">
          <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-on-surface-variant" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
          </svg>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar cliente..."
            className="w-full h-10 pl-9 pr-md border border-outline-variant rounded-lg bg-white text-body-md text-on-surface placeholder:text-on-surface-variant focus:ring-2 focus:ring-md-primary focus:outline-none"
          />
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="p-md bg-md-error-container text-md-on-error-container rounded-lg text-label-md">⚠️ {error}</div>
      )}

      {/* Tabla */}
      <div className="bg-white border border-outline-variant rounded-xl overflow-hidden">
        {loading || authLoading ? (
          <div className="p-xl text-center">
            <div className="inline-block animate-spin h-8 w-8 border-4 border-md-primary border-t-transparent rounded-full" />
            <p className="text-on-surface-variant mt-md text-body-md">Cargando clientes…</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant">
                {["ID", "Empresa", "Contacto", "Ciudad", "País", "Acción"].map(h => (
                  <th key={h} className="px-md py-sm text-left text-[11px] font-bold uppercase tracking-wider text-on-surface-variant first:pl-lg last:pr-lg">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-lg py-xl text-center text-on-surface-variant text-body-md">
                    No se encontraron clientes.
                  </td>
                </tr>
              ) : (
                filtered.map((r) => (
                  <tr key={r.CustomerID} className="border-b border-outline-variant hover:bg-surface-container-low transition-colors cursor-pointer">
                    <td className="px-lg py-md">
                      <span className="px-sm py-xs bg-md-primary-fixed text-md-primary text-[11px] font-bold rounded">
                        {r.CustomerID}
                      </span>
                    </td>
                    <td className="px-md py-md text-body-md font-medium text-on-surface">{r.CompanyName ?? "—"}</td>
                    <td className="px-md py-md text-body-md text-on-surface-variant">{r.ContactName ?? "—"}</td>
                    <td className="px-md py-md text-body-md text-on-surface-variant">{r.City ?? "—"}</td>
                    <td className="px-md py-md text-body-md text-on-surface-variant">{r.Country ?? "—"}</td>
                    <td className="px-md py-md pr-lg">
                      <Link
                        href={`/admin/clientes/${r.CustomerID}`}
                        className="text-md-primary text-label-md font-bold hover:underline flex items-center gap-1"
                      >
                        Ver
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
