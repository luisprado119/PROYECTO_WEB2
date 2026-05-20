import type { SqliteConnection } from "@/lib/db/connection";

export class CestaRepository {
  constructor(private readonly db: SqliteConnection) {}

  async associateCestaIdWithUsername(cestaId: string, username: string): Promise<void> {
    try {
      /** Suma líneas repetidas tras una fusión cliente + invitado (antes era GROUP BY/distinct incorrecto). */
      const existingProducts = await this.db.all(
        `
            SELECT productId, SUM(cantidad) AS cantidad
            FROM cesta
            WHERE username = ? OR cestaId = ?
            GROUP BY productId
            HAVING SUM(cantidad) > 0
        `,
        [username, cestaId]
      );

      await this.db.run(
        `
            DELETE FROM cesta
            WHERE username = ? OR cestaId = ?
        `,
        [username, cestaId]
      );

      for (const product of existingProducts as { productId: number; cantidad: number }[]) {
        await this.db.run(
          `
                    INSERT OR REPLACE INTO cesta (productId, cestaId, username, cantidad)
                    VALUES (?, ?, ?, ?)
                `,
          [product.productId, cestaId, username, product.cantidad]
        );
      }
    } catch (error) {
      console.error("Error associating cestaId with username:", error);
      throw error;
    }
  }

  async incrementLine(productId: string, cestaId: string, username: string, delta: number): Promise<void> {
    try {
      if (delta <= 0) return;
      await this.db.run(
        `
            INSERT INTO cesta (productId, cestaId, cantidad, username)
            VALUES (:productId, :cestaId, :delta, :username)
            ON CONFLICT(productId, cestaId) DO UPDATE SET
              cantidad = cantidad + excluded.cantidad,
              username = COALESCE(NULLIF(TRIM(IFNULL(excluded.username,'')), ''), username)
        `,
        {
          ":productId": productId,
          ":username": username,
          ":delta": delta,
          ":cestaId": cestaId,
        }
      );

      await this.db.run(
        `
            DELETE FROM cesta
            WHERE cestaId = :cestaId and cantidad = 0
        `,
        {
          ":cestaId": cestaId,
        }
      );
    } catch (error) {
      console.error("Error incrementing cesta line:", error);
      throw error;
    }
  }

  async deleteLine(productId: string, cestaId: string): Promise<void> {
    await this.db.run(`DELETE FROM cesta WHERE productId = ? AND cestaId = ?`, [
      productId,
      cestaId,
    ]);
  }

  async upsertLine(productId: string, cestaId: string, username: string, cantidad: number): Promise<void> {
    try {
      await this.db.run(
        `
            INSERT INTO cesta (productId, cestaId, cantidad, username)
            VALUES (:productId, :cestaId, :cantidad, :username)
            ON CONFLICT(productId, cestaId) DO UPDATE SET
            cantidad =  :cantidad
        `,
        {
          ":productId": productId,
          ":username": username,
          ":cantidad": cantidad,
          ":cestaId": cestaId,
        }
      );

      await this.db.run(
        `
            DELETE FROM cesta
            WHERE cestaId = :cestaId and cantidad = 0
        `,
        {
          ":cestaId": cestaId,
        }
      );
    } catch (error) {
      console.error("Error updating cesta:", error);
      throw error;
    }
  }

  async getLines(idCesta: string): Promise<unknown[]> {
    try {
      return this.db.all(
        `
            SELECT c.productId, p.productName, c.cantidad, p.UnitPrice
            FROM cesta c
            JOIN Products p ON c.productId = p.ProductID
            WHERE c.cestaId = ?
        `,
        [idCesta]
      );
    } catch (error) {
      console.error("Error fetching cesta:", error);
      throw error;
    }
  }

  async sumQuantities(cestaId: string): Promise<number> {
    const row = (await this.db.get(
      `SELECT COALESCE(SUM(cantidad), 0) AS n FROM cesta WHERE cestaId = ?`,
      [cestaId]
    )) as { n: number };
    return Number(row?.n ?? 0);
  }

  async deleteByCestaId(cestaId: string): Promise<void> {
    await this.db.run("DELETE FROM cesta WHERE cestaId = ?", [cestaId]);
  }

  async clearByUsername(username: string): Promise<void> {
    await this.db.run("DELETE FROM cesta WHERE username = ?", [username]);
  }

  async linesForUsername(username: string): Promise<{ productId: number; cantidad: number; UnitPrice: number }[]> {
    return this.db.all(
      `
            SELECT c.productId, c.cantidad, p.UnitPrice
            FROM cesta c
            JOIN Products p ON c.productId = p.ProductID
            WHERE c.username = ?
        `,
      [username]
    );
  }
}
