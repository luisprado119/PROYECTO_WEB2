import type { SqliteConnection } from "@/lib/db/connection";
import type { SalesGranularity, SalesByPeriodRow, SalesByCategoryRow } from "@/lib/db/db-types";

function salesPeriodSql(granularity: SalesGranularity): string {
  switch (granularity) {
    case "day":
      return `strftime('%Y-%m-%d', o.OrderDate)`;
    case "month":
      return `strftime('%Y-%m', o.OrderDate)`;
    case "year":
      return `strftime('%Y', o.OrderDate)`;
    case "quarter":
      return `strftime('%Y', o.OrderDate) || '-Q' || ((CAST(strftime('%m', o.OrderDate) AS INTEGER) + 2) / 3)`;
    case "semester":
      return `strftime('%Y', o.OrderDate) || '-S' || CASE WHEN CAST(strftime('%m', o.OrderDate) AS INTEGER) <= 6 THEN 1 ELSE 2 END`;
    default:
      return `strftime('%Y-%m', o.OrderDate)`;
  }
}

export class SalesRepository {
  constructor(private readonly db: SqliteConnection) {}

  async salesByPeriod(granularity: SalesGranularity): Promise<SalesByPeriodRow[]> {
    const periodExpr = salesPeriodSql(granularity);
    return this.db.all(
      `SELECT ${periodExpr} AS period,
            SUM(od.UnitPrice * od.Quantity * (1 - od.Discount)) AS total
         FROM Orders o
         JOIN "Order Details" od ON od.OrderID = o.OrderID
         GROUP BY period
         ORDER BY period`
    );
  }

  async salesByCategoryAndPeriod(granularity: SalesGranularity): Promise<SalesByCategoryRow[]> {
    const periodExpr = salesPeriodSql(granularity);
    return this.db.all(
      `SELECT ${periodExpr} AS period,
            c.CategoryName AS categoryName,
            SUM(od.UnitPrice * od.Quantity * (1 - od.Discount)) AS total
         FROM Orders o
         JOIN "Order Details" od ON od.OrderID = o.OrderID
         JOIN Products p ON p.ProductID = od.ProductID
         LEFT JOIN Categories c ON c.CategoryID = p.CategoryID
         GROUP BY period, c.CategoryID
         ORDER BY period, total DESC`
    );
  }
}
