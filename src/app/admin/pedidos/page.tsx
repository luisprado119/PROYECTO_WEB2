"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/app/AuthContext";
import { getRecentOrders } from "@/lib/db/actions/order-actions";
import type { RecentOrderRow } from "@/lib/db/db-types";

const STATUS_COLOR: Record<string, string> = {
  shipped: "bg-emerald-100 text-emerald-700",
  pending: "bg-amber-100 text-amber-700",
  default: "bg-surface-container text-on-surface-variant",
};

export default function AdminPedidosPage() {
  const { token, loading: authLoading } = useAuth();
  const [rows, setRows] = useState<RecentOrderRow[]>([]);
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
        const data = await getRecentOrders(token, 50);
        if (!cancelled) setRows(data);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "No se pudieron cargar los pedidos.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [token, authLoading]);

  const filtered = rows.filter(r =>
    !search ||
    String(r.OrderID).includes(search) ||
    r.CustomerID?.toLowerCase().includes(search.toLowerCase())
  );

  // KPIs
  const totalImporte = rows.reduce((acc, r) => acc + (r.TotalImporte ? Number(r.TotalImporte) : 0), 0);
  const shipped = rows.filter(r => r.ShippedDate).length;

  return (
    <div className="space-y-lg">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-md">
        <div>
          <h1 className="text-headline-lg font-bold text-on-surface">Últimos pedidos</h1>
          <p className="text-body-md text-on-surface-variant mt-1">
            {loading ? "Cargando…" : `${filtered.length} de ${rows.length} pedidos mostrados`}
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
            placeholder="Buscar pedido o cliente..."
            className="w-full h-10 pl-9 pr-md border border-outline-variant rounded-lg bg-white text-body-md text-on-surface placeholder:text-on-surface-variant focus:ring-2 focus:ring-md-primary focus:outline-none"
          />
        </div>
      </div>

      {/* KPI cards */}
      {!loading && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-md">
          {[
            { label: "Total pedidos", value: rows.length, color: "text-md-primary", bg: "bg-md-primary-fixed" },
            { label: "Enviados", value: shipped, color: "text-emerald-700", bg: "bg-emerald-50" },
            { label: "Importe total", value: `${totalImporte.toFixed(2)} €`, color: "text-md-secondary", bg: "bg-orange-50" },
          ].map(k => (
            <div key={k.label} className={`${k.bg} border border-outline-variant rounded-xl p-md`}>
              <p className="text-label-md text-on-surface-variant">{k.label}</p>
              <p className={`text-headline-md font-bold mt-1 ${k.color}`}>{k.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="p-md bg-md-error-container text-md-on-error-container rounded-lg text-label-md">⚠️ {error}</div>
      )}

      {/* Tabla */}
      <div className="bg-white border border-outline-variant rounded-xl overflow-hidden">
        {loading || authLoading ? (
          <div className="p-xl text-center">
            <div className="inline-block animate-spin h-8 w-8 border-4 border-md-primary border-t-transparent rounded-full" />
            <p className="text-on-surface-variant mt-md text-body-md">Cargando pedidos…</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant">
                {["Pedido #", "Fecha", "Cliente", "Importe", "Estado", "Acción"].map(h => (
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
                    No se encontraron pedidos.
                  </td>
                </tr>
              ) : (
                filtered.map((r) => {
                  const statusKey = r.ShippedDate ? "shipped" : "pending";
                  const badgeClass = STATUS_COLOR[statusKey] ?? STATUS_COLOR.default;
                  return (
                    <tr key={r.OrderID} className="border-b border-outline-variant hover:bg-surface-container-low transition-colors">
                      <td className="px-lg py-md">
                        <span className="text-body-md font-bold text-on-surface">#{r.OrderID}</span>
                      </td>
                      <td className="px-md py-md text-label-md text-on-surface-variant">
                        {new Date(r.OrderDate).toLocaleDateString("es-ES")}
                      </td>
                      <td className="px-md py-md">
                        <Link href={`/admin/clientes/${r.CustomerID}`} className="text-md-primary text-label-md font-bold hover:underline">
                          {r.CustomerID}
                        </Link>
                      </td>
                      <td className="px-md py-md">
                        <span className="text-body-md font-bold text-on-surface">
                          {r.TotalImporte != null ? `${Number(r.TotalImporte).toFixed(2)} €` : "—"}
                        </span>
                      </td>
                      <td className="px-md py-md">
                        <span className={`px-sm py-xs text-[11px] font-bold rounded-full ${badgeClass}`}>
                          {r.ShippedDate ? "Enviado" : "Pendiente"}
                        </span>
                      </td>
                      <td className="px-md py-md pr-lg">
                        <Link
                          href={`/admin/pedidos/${r.OrderID}`}
                          className="text-md-primary text-label-md font-bold hover:underline flex items-center gap-1"
                        >
                          Ver
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
