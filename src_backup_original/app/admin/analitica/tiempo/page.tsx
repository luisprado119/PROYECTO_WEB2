"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/app/AuthContext";
import { getSalesByPeriod } from "@/lib/db/actions/admin-sales-actions";
import type { SalesByPeriodRow, SalesGranularity } from "@/lib/db/db-types";
import { SalesLineChart } from "@/components/app/charts/SalesLineChart";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";

const options: { value: SalesGranularity; label: string }[] = [
  { value: "day", label: "Día" },
  { value: "month", label: "Mes" },
  { value: "quarter", label: "Trimestre" },
  { value: "semester", label: "Semestre" },
  { value: "year", label: "Año" },
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
    if (!token) {
      setError("Sesión no disponible.");
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    void (async () => {
      try {
        const rows = await getSalesByPeriod(token, granularity);
        if (!cancelled) setData(rows);
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "No se pudieron cargar las ventas.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [token, authLoading, granularity]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Ventas en el tiempo</h1>

      <div className="flex max-w-xs flex-col gap-2">
        <Label htmlFor="granularity">Agrupar por</Label>
        <select
          id="granularity"
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          value={granularity}
          onChange={(e) => setGranularity(e.target.value as SalesGranularity)}
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      {authLoading || loading ? (
        <p className="text-slate-600">Cargando datos…</p>
      ) : error ? (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : (
        <SalesLineChart data={data} />
      )}
    </div>
  );
}
