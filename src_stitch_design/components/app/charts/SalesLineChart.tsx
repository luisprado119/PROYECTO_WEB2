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

/**
 * Decide cuántos ticks mostrar y a qué ángulo según la cantidad de puntos.
 * - ≤ 12 puntos  → todos los labels, horizontal
 * - ≤ 36 puntos  → cada 3, -30°
 * - ≤ 100 puntos → cada 7, -45°
 * - > 100 puntos → cada 14, -60°
 */
function getXAxisConfig(count: number): {
  interval: number;
  angle: number;
  height: number;
  fontSize: number;
} {
  if (count <= 12) return { interval: 0,  angle: 0,   height: 40, fontSize: 12 };
  if (count <= 36) return { interval: 2,  angle: -30, height: 56, fontSize: 11 };
  if (count <= 100)return { interval: 6,  angle: -45, height: 64, fontSize: 10 };
  return               { interval: 13, angle: -60, height: 72, fontSize: 9 };
}

export function SalesLineChart({ data }: { data: Point[] }) {
  const normalized = data.map((d) => ({
    period: d.period,
    total: Number(d.total),
  }));

  const { interval, angle, height, fontSize } = getXAxisConfig(normalized.length);

  return (
    <div className="h-[420px] w-full min-h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={normalized}
          margin={{ top: 8, right: 24, left: 8, bottom: height }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e7ff" />
          <XAxis
            dataKey="period"
            angle={angle}
            textAnchor={angle < 0 ? "end" : "middle"}
            height={height}
            interval={interval}
            tick={{ fontSize, fill: "#434655" }}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#434655" }}
            tickFormatter={(v) =>
              v >= 1_000_000
                ? `${(v / 1_000_000).toFixed(1)}M`
                : v >= 1_000
                ? `${(v / 1_000).toFixed(0)}k`
                : String(v)
            }
            width={56}
          />
          <Tooltip
            contentStyle={{
              background: "#ffffff",
              border: "1px solid #c3c6d7",
              borderRadius: "8px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              fontSize: 13,
            }}
            formatter={(v) =>
              v != null && v !== ""
                ? [`${Number(v).toLocaleString("es-ES", { minimumFractionDigits: 2 })} €`, "Ventas"]
                : ["", "Ventas"]
            }
            labelStyle={{ fontWeight: 700, color: "#131b2e", marginBottom: 4 }}
          />
          <Line
            type="monotone"
            dataKey="total"
            stroke="#004ac6"
            strokeWidth={2}
            dot={normalized.length <= 36}
            activeDot={{ r: 5, fill: "#004ac6", stroke: "#fff", strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
