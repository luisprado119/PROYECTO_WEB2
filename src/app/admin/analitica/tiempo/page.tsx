"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/app/AuthContext";
import { getSalesByPeriod } from "@/lib/db/actions/admin-sales-actions";
import type { SalesByPeriodRow, SalesGranularity } from "@/lib/db/db-types";
import { SalesLineChart } from "@/components/app/charts/SalesLineChart";

const GRANULARITY_OPTIONS: { value: SalesGranularity; label: string }[] = [
  { value: "day",      label: "Día" },
  { value: "month",   label: "Mes" },
  { value: "quarter", label: "Trimestre" },
  { value: "semester",label: "Semestre" },
  { value: "year",    label: "Año" },
];

export default function AdminAnaliticaTiempoPage() {
  const { token, loading: authLoading } = useAuth();
  const [granularity, setGranularity] = useState<SalesGranularity>("month");
  const [data, setData] = useState<SalesByPeriodRow[]>([]);
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
        const rows = await getSalesByPeriod(token, granularity);
        if (!cancelled) setData(rows);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "No se pudieron cargar las ventas.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [token, authLoading, granularity]);

  // Calcular KPIs del periodo seleccionado
  const totalVentas = data.reduce((acc, r) => acc + (Number(r.total) || 0), 0);
  const maxPeriodo = data.reduce((max, r) => (Number(r.total) > Number(max?.total ?? 0) ? r : max), data[0]);

  return (
    <div className="space-y-lg">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-md">
        <div>
          <h1 className="text-headline-lg font-bold text-on-surface">Ventas en el tiempo</h1>
          <p className="text-body-md text-on-surface-variant mt-1">
            Evolución de ingresos agrupados por periodo seleccionado
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

      {/* KPI cards */}
      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-md">
          <div className="bg-md-primary-fixed border border-outline-variant rounded-xl p-md">
            <p className="text-label-md text-on-surface-variant">Total acumulado</p>
            <p className="text-headline-md font-bold text-md-primary mt-1">
              {totalVentas.toFixed(2)} €
            </p>
          </div>
          <div className="bg-emerald-50 border border-outline-variant rounded-xl p-md">
            <p className="text-label-md text-on-surface-variant">Periodos con datos</p>
            <p className="text-headline-md font-bold text-emerald-700 mt-1">
              {data.length}
            </p>
          </div>
          <div className="bg-orange-50 border border-outline-variant rounded-xl p-md">
            <p className="text-label-md text-on-surface-variant">Mejor periodo</p>
            <p className="text-headline-md font-bold text-md-secondary mt-1">
              {maxPeriodo ? `${Number(maxPeriodo.total).toFixed(2)} €` : "—"}
            </p>
            <p className="text-[11px] text-on-surface-variant mt-1">{maxPeriodo?.period ?? ""}</p>
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
            <p className="text-on-surface-variant text-body-md">Cargando datos de ventas…</p>
          </div>
        ) : data.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64">
            <div className="text-5xl mb-md">📊</div>
            <p className="text-on-surface-variant text-body-md">Sin datos para el periodo seleccionado.</p>
          </div>
        ) : (
          <SalesLineChart data={data} />
        )}
      </div>
    </div>
  );
}
