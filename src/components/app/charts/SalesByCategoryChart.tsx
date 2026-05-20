"use client";

import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { SalesByCategoryRow } from "@/lib/db/db-types";

const COLORS = ["#2563eb", "#7c3aed", "#db2777", "#ea580c", "#16a34a", "#0891b2", "#ca8a04"];

function pivotForStacked(rows: SalesByCategoryRow[]) {
  if (!rows.length) return { chartData: [] as Record<string, string | number>[], keys: [] as string[] };

  const periods = Array.from(new Set(rows.map((r) => r.period))).sort();
  const keys = Array.from(new Set(rows.map((r) => r.categoryName || "Sin categoría")));

  const chartData = periods.map((period) => {
    const row: Record<string, string | number> = { period };
    for (const k of keys) row[k] = 0;
    for (const r of rows) {
      if (r.period !== period) continue;
      const name = r.categoryName || "Sin categoría";
      row[name] = Number(r.total) + Number(row[name]);
    }
    return row;
  });

  return { chartData, keys };
}

export function SalesByCategoryChart({ data }: { data: SalesByCategoryRow[] }) {
  const { chartData, keys } = useMemo(() => pivotForStacked(data), [data]);

  if (!chartData.length) {
    return <p className="text-muted-foreground text-sm">No hay datos para el período seleccionado.</p>;
  }

  return (
    <div className="h-[480px] w-full min-h-[320px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 8, right: 16, left: 8, bottom: 48 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis dataKey="period" angle={-35} textAnchor="end" height={70} tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip
            formatter={(v) =>
              v != null && v !== "" ? Number(v).toFixed(2) : ""
            }
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          {keys.map((k, i) => (
            <Bar key={k} dataKey={k} stackId="ventas" fill={COLORS[i % COLORS.length]} maxBarSize={56} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
