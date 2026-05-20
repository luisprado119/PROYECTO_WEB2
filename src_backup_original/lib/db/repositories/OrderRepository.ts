import type { SqliteConnection } from "@/lib/db/connection";
import type { RecentOrderRow, OrderHeaderRow, OrderWithDetailsRow, OrderDetailLineRow } from "@/lib/db/db-types";
import { OrderDetailLine } from "@/domain/OrderDetailLine";

export class OrderRepository {
  constructor(private readonly db: SqliteConnection) {}

  private totalsFromDetailRows(details: OrderDetailLineRow[]): number {
    return details.reduce(
      (sum, d) => sum + new OrderDetailLine(d.UnitPrice, d.Quantity, d.Discount).subtotal,
      0
    );
  }

  async listForCustomer(customerId: string): Promise<unknown[]> {
    try {
      return this.db.all(
        `SELECT OrderID, OrderDate,
            (SELECT SUM(UnitPrice * Quantity * (1 - Discount))
            FROM "Order Details" WHERE OrderID = Orders.OrderID) AS TotalImporte,
            (SELECT CASE WHEN COUNT(*) > 0 THEN 1 ELSE 0 END
            FROM cobro WHERE orderId = Orders.OrderID) AS Cobrado
            FROM Orders WHERE CustomerID = ?
            ORDER BY datetime(OrderDate) DESC, OrderID DESC`,
        [customerId]
      );
    } catch (error) {
      console.error("Error fetching customer orders:", error);
      throw error;
    }
  }

  async listForCustomerAdmin(customerId: string): Promise<unknown[]> {
    return this.db.all(
      `SELECT OrderID, OrderDate,
            (SELECT SUM(UnitPrice * Quantity * (1 - Discount))
            FROM "Order Details" WHERE OrderID = Orders.OrderID) AS TotalImporte,
            (SELECT CASE WHEN COUNT(*) > 0 THEN 1 ELSE 0 END
            FROM cobro WHERE orderId = Orders.OrderID) AS Cobrado
            FROM Orders WHERE CustomerID = ?
            ORDER BY datetime(OrderDate) DESC, OrderID DESC`,
      [customerId]
    );
  }

  async findWithDetailsForCustomer(orderId: string, customerId: string): Promise<OrderWithDetailsRow> {
    const order = (await this.db.get('SELECT * FROM Orders WHERE OrderID = ? AND CustomerID = ?', [
      orderId,
      customerId,
    ])) as OrderHeaderRow | undefined;
    if (!order) {
      throw new Error("Pedido no encontrado o no pertenece a tu cuenta.");
    }
    const details = (await this.db.all(
      `
        SELECT od.*, p.ProductName 
        FROM "Order Details" od
        JOIN Products p ON od.ProductID = p.ProductID
        WHERE od.OrderID = ?
    `,
      [orderId]
    )) as OrderDetailLineRow[];
    const totalAmount = this.totalsFromDetailRows(details);
    return {
      ...order,
      Details: details,
      TotalAmount: parseFloat(totalAmount.toFixed(2)),
    };
  }

  async findWithDetailsAdmin(orderId: string): Promise<OrderWithDetailsRow> {
    const order = (await this.db.get("SELECT * FROM Orders WHERE OrderID = ?", [orderId])) as OrderHeaderRow | undefined;
    if (!order) {
      throw new Error("Pedido no encontrado.");
    }
    const details = (await this.db.all(
      `
        SELECT od.*, p.ProductName
        FROM "Order Details" od
        JOIN Products p ON od.ProductID = p.ProductID
        WHERE od.OrderID = ?
    `,
      [orderId]
    )) as OrderDetailLineRow[];
    const totalAmount = this.totalsFromDetailRows(details);
    return {
      ...order,
      Details: details,
      TotalAmount: parseFloat(totalAmount.toFixed(2)),
    };
  }

  /**
   * Líneas de cesta disponibles para el pedido del usuario logueado:
   * - filas con `username`
   * - opcionalmente filas anónimas (username vacío/null) ligadas al `cestaId` del navegador
   */
  async cartLinesForCustomerOrder(
    username: string,
    cestaSessionId?: string | null
  ): Promise<Array<{ productId: number; UnitPrice: number; cantidad: number }>> {
    const typed = username.trim();
    const byUser =
      typed.length === 0
        ? ([] as Array<{ productId: number; cantidad: number; UnitPrice: number }>)
        : ((await this.db.all(
            `
              SELECT c.productId, c.cantidad, p.UnitPrice
              FROM cesta c
              JOIN Products p ON c.productId = p.ProductID
              WHERE TRIM(IFNULL(c.username,'')) <> '' AND c.username = ?
            `,
            [typed]
          )) as Array<{ productId: number; UnitPrice: number; cantidad: number }>);

    const cid = (cestaSessionId ?? "").trim();
    let byBasket: typeof byUser = [];
    if (cid.length > 0) {
      byBasket = (await this.db.all(
        `
              SELECT c.productId, c.cantidad, p.UnitPrice
              FROM cesta c
              JOIN Products p ON c.productId = p.ProductID
              WHERE CAST(c.cestaId AS TEXT) = ?
                AND TRIM(IFNULL(c.username,'')) = ''
          `,
        [cid]
      )) as typeof byUser;
    }

    const merged = new Map<number, { productId: number; UnitPrice: number; cantidad: number }>();
    const addLines = (rows: typeof byUser) => {
      for (const row of rows) {
        const prev = merged.get(row.productId);
        if (!prev) {
          merged.set(row.productId, { ...row });
        } else {
          merged.set(row.productId, {
            ...prev,
            cantidad: prev.cantidad + row.cantidad,
          });
        }
      }
    };
    addLines(byUser);
    addLines(byBasket);

    return Array.from(merged.values()).filter((line) => line.cantidad > 0);
  }

  async createFromUsername(username: string, cestaSessionId?: string | null): Promise<{ orderId: number; totalAmount: number }> {
    try {
      await this.db.run("BEGIN TRANSACTION");

      const customer = await this.db.get("SELECT CustomerID FROM Customers WHERE CustomerID = ?", [username]);
      if (!customer) {
        throw new Error("Customer not found");
      }

      const orderDate = new Date().toISOString();
      const requiredDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString();
      const result = await this.db.run(
        `
            INSERT INTO Orders (CustomerID, OrderDate, RequiredDate)
            VALUES (?, ?, ?)
        `,
        [(customer as { CustomerID: string }).CustomerID, orderDate, requiredDate]
      );

      const orderId = result.lastID;
      if (orderId == null) {
        throw new Error("No se pudo crear el pedido.");
      }

      const cestaItems = await this.cartLinesForCustomerOrder(username, cestaSessionId);

      if (cestaItems.length === 0) {
        await this.db.run("ROLLBACK");
        throw new Error(
          "La cesta no tiene líneas para tu usuario. Actualiza la cesta o cierra sesión y vuelve a entrar."
        );
      }

      for (const item of cestaItems as { productId: number; UnitPrice: number; cantidad: number }[]) {
        await this.db.run(
          `
                INSERT INTO "Order Details" (OrderID, ProductID, UnitPrice, Quantity, Discount)
                VALUES (?, ?, ?, ?, 0)
            `,
          [orderId, item.productId, item.UnitPrice, item.cantidad]
        );
      }

      const totalResult = await this.db.get(
        `
            SELECT SUM(UnitPrice * Quantity) as TotalAmount
            FROM "Order Details"
            WHERE OrderID = ?
        `,
        [orderId]
      );

      const totalAmount = (totalResult as { TotalAmount?: number })?.TotalAmount ?? 0;
      await this.db.run("DELETE FROM cesta WHERE username = ?", [username]);
      const cidClean = (cestaSessionId ?? "").trim();
      if (cidClean.length > 0) {
        await this.db.run(`DELETE FROM cesta WHERE CAST(cestaId AS TEXT) = ?`, [cidClean]);
      }

      await this.db.run("COMMIT");

      return { orderId: Number(orderId), totalAmount: Number(totalAmount) };
    } catch (error) {
      await this.db.run("ROLLBACK");
      console.error("Error creating order:", error);
      throw error;
    }
  }

  async markShippedIfPending(orderId: number): Promise<{ updated: boolean }> {
    const exists = await this.db.get("SELECT OrderID, ShippedDate FROM Orders WHERE OrderID = ?", [orderId]);
    if (!exists) {
      throw new Error("Pedido no encontrado.");
    }
    const result = await this.db.run(
      `UPDATE Orders SET ShippedDate = date('now') WHERE OrderID = ? AND ShippedDate IS NULL`,
      [orderId]
    );
    return { updated: !!(result.changes && result.changes > 0) };
  }

  async listRecent(limit: number): Promise<RecentOrderRow[]> {
    const safeLimit = Math.min(200, Math.max(1, Math.floor(limit)));
    return this.db.all(
      `SELECT o.OrderID, o.OrderDate, o.CustomerID,
            (SELECT SUM(UnitPrice * Quantity * (1 - Discount))
             FROM "Order Details" od WHERE od.OrderID = o.OrderID) AS TotalImporte,
            o.ShippedDate
         FROM Orders o
         ORDER BY datetime(o.OrderDate) DESC
         LIMIT ?`,
      [safeLimit]
    );
  }
}
