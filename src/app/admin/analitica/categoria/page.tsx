"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/app/AuthContext";
import { getSalesByCategoryAndPeriod } from "@/lib/db/actions/admin-sales-actions";
import type { SalesByCategoryRow, SalesGranularity } from "@/lib/db/db-types";
import { SalesByCategoryChart } from "@/components/app/charts/SalesByCategoryChart";

const GRANULARITY_OPTIONS: { value: SalesGranularity; label: string }[] = [
  { value: "day",      label: "Día" },
  { value: "month",   label: "Mes" },
  { value: "quarter", label: "Trimestre" },
  { value: "semester",label: "Semestre" },
  { value: "year",    label: "Año" },
];

const CATEGORY_COLORS = [
  "bg-blue-100 text-blue-700",
  "bg-orange-100 text-orange-700",
  "bg-emerald-100 text-emerald-700",
  "bg-purple-100 text-purple-700",
  "bg-rose-100 text-rose-700",
  "bg-amber-100 text-amber-700",
  "bg-teal-100 text-teal-700",
  "bg-indigo-100 text-indigo-700",
];

export default function AdminAnaliticaCategoriaPage() {
  const { token, loading: authLoading } = useAuth();
  const [granularity, setGranularity] = useState<SalesGranularity>("month");
  const [data, setData] = useState<SalesByCategoryRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setError(null);
    if (authLoading) return;
    if (!token) { setError("Sesión no disponible."); setLoading(false); return; }
    let cancelled = false;
    setLoading(true);
    void (async () => {
      try {
        const rows = await getSalesByCategoryAndPeriod(token, granularity);
        if (!cancelled) setData(rows);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "No se pudieron cargar los datos.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [token, authLoading, granularity]);

  // Categorías únicas para los KPI badges
  const uniqueCategories = Array.from(new Set(data.map(r => r.categoryName).filter((c): c is string => c != null)));
  const totalImporte = data.reduce((acc, r) => acc + (Number(r.total) || 0), 0);

  return (
    <div className="space-y-lg">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-md">
        <div>
          <h1 className="text-headline-lg font-bold text-on-surface">Ventas por categoría</h1>
          <p className="text-body-md text-on-surface-variant mt-1">
            Distribución de ingresos agrupados por categoría y periodo
          </p>
        </div>

        {/* Selector de granularidad */}
        <div className="flex items-center gap-sm flex-wrap">
          <span className="text-label-md font-bold text-on-surface-variant">Agrupar por:</span>
          <div className="flex gap-1 bg-surface-container rounded-lg p-1">
            {GRANULARITY_OPTIONS.map(o => (
              <button
                key={o.value}
                onClick={() => setGranularity(o.value)}
                className={`px-md py-xs rounded-md text-label-md font-medium transition-all ${
                  granularity === o.value
                    ? "bg-md-primary text-white shadow-sm"
                    : "text-on-surface-variant hover:bg-surface-container-high"
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* KPI + categorías */}
      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
          <div className="bg-md-primary-fixed border border-outline-variant rounded-xl p-md">
            <p className="text-label-md text-on-surface-variant">Importe total</p>
            <p className="text-headline-md font-bold text-md-primary mt-1">{totalImporte.toFixed(2)} €</p>
          </div>
          <div className="bg-white border border-outline-variant rounded-xl p-md">
            <p className="text-label-md text-on-surface-variant mb-sm">Categorías con datos</p>
            <div className="flex flex-wrap gap-xs">
              {uniqueCategories.slice(0, 8).map((cat, i) => (
                <span key={cat} className={`px-sm py-xs text-[11px] font-bold rounded-full ${CATEGORY_COLORS[i % CATEGORY_COLORS.length]}`}>
                  {cat}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="p-md bg-md-error-container text-md-on-error-container rounded-lg text-label-md">⚠️ {error}</div>
      )}

      {/* Gráfico */}
      <div className="bg-white border border-outline-variant rounded-xl p-lg">
        {loading || authLoading ? (
          <div className="flex flex-col items-center justify-center h-64 gap-md">
            <div className="animate-spin h-8 w-8 border-4 border-md-primary border-t-transparent rounded-full" />
            <p className="text-on-surface-variant text-body-md">Cargando datos por categoría…</p>
          </div>
        ) : data.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64">
            <div className="text-5xl mb-md">🥧</div>
            <p className="text-on-surface-variant text-body-md">Sin datos para el periodo seleccionado.</p>
          </div>
        ) : (
          <SalesByCategoryChart data={data} />
        )}
      </div>
    </div>
  );
}
