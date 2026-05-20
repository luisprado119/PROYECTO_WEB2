/**
 * Formatea fechas desde SQLite / ISO evitando mostrar 1970-01-01 cuando el valor es null o inválido.
 */
export function formatSqliteDate(
  value: string | number | null | undefined,
  style: "date" | "datetime" = "date"
): string {
  if (value == null || value === "") return "—";
  if (value === 0 || value === "0") return "—";
  const d = new Date(value as string);
  if (Number.isNaN(d.getTime())) return "—";
  if (d.getUTCFullYear() <= 1970 && d.getUTCMonth() === 0 && d.getUTCDate() <= 1) {
    return "—";
  }
  if (style === "datetime") {
    return d.toLocaleString("es-ES", { dateStyle: "short", timeStyle: "short" });
  }
  return d.toLocaleDateString("es-ES");
}
