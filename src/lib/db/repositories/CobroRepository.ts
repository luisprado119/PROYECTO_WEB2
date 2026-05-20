import type { SqliteConnection } from "@/lib/db/connection";

export class CobroRepository {
  constructor(private readonly db: SqliteConnection) {}

  async insert(
    orderId: number,
    customerId: string,
    amount: number,
    authorizationCode: string
  ): Promise<number | undefined> {
    try {
      const fecha = new Date().toISOString();
      const result = await this.db.run(
        "INSERT INTO cobro (orderId, customerId, amount, fecha, authorizationCode) VALUES (?, ?, ?, ?, ?)",
        [orderId, customerId, amount, fecha, authorizationCode]
      );
      return result.lastID;
    } catch (error) {
      console.error("Error saving cobro:", error);
      throw error;
    }
  }
}
