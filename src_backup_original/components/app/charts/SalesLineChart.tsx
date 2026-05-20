"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Point = { period: string; total: number };

export function SalesLineChart({ data }: { data: Point[] }) {
  const normalized = data.map((d) => ({
    period: d.period,
    total: Number(d.total),
  }));

  return (
    <div className="h-[400px] w-full min-h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={normalized} margin={{ top: 8, right: 16, left: 0, bottom: 48 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis dataKey="period" angle={-40} textAnchor="end" height={72} interval={0} tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip
            formatter={(v) =>
              v != null && v !== "" ? [Number(v).toFixed(2), "Ventas"] : ["", "Ventas"]
            }
          />
          <Line type="monotone" dataKey="total" stroke="#2563eb" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
