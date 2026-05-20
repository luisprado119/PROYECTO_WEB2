/**
 * Quita usuarios/clientes extra y cascada (Orders, líneas, cobro, cesta, log).
 * Por defecto: luisp119, ALFKI1, ALFKI2.
 * Opcionalmente pasa IDs extra: node scripts/remove-test-users.cjs "Val2 "
 */
const path = require("path");
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");

const DEFAULT_EXTRAS = ["luisp119", "ALFKI1", "ALFKI2"];

async function main() {
  const extraArgv = process.argv.slice(2).map((s) => String(s));
  const IDs = [...new Set([...DEFAULT_EXTRAS, ...extraArgv].filter(Boolean))];

  const dbPath = path.join(__dirname, "..", "northwind.db");
  const db = await open({ filename: dbPath, driver: sqlite3.Database });

  for (const cidRaw of IDs) {
    const cid = cidRaw;
    const row = await db.get(
      "SELECT CustomerID FROM Customers WHERE CustomerID = ?",
      [cid]
    );
    if (!row) {
      console.log(`Saltado (no existe en Customers): "${cid}"`);
      continue;
    }

    await db.run("BEGIN");
    try {
      const orders = await db.all(
        "SELECT OrderID FROM Orders WHERE CustomerID = ?",
        [cid]
      );
      const orderIds = orders.map((r) => r.OrderID);

      if (orderIds.length) {
        const ph = orderIds.map(() => "?").join(",");
        await db.run(`DELETE FROM cobro WHERE orderId IN (${ph})`, orderIds);
        await db.run(
          `DELETE FROM "Order Details" WHERE OrderID IN (${ph})`,
          orderIds
        );
      }
      await db.run("DELETE FROM Orders WHERE CustomerID = ?", [cid]);
      await db.run("DELETE FROM cesta WHERE username = ?", [cid]);
      await db.run("DELETE FROM activity_log WHERE username = ?", [cid]);
      await db.run("DELETE FROM users WHERE username = ?", [cid]);
      await db.run("DELETE FROM Customers WHERE CustomerID = ?", [cid]);

      await db.run("COMMIT");
      console.log(`Eliminado: "${cid}" (pedidos borrados: ${orderIds.length})`);
    } catch (e) {
      await db.run("ROLLBACK");
      throw e;
    }
  }

  const nu = await db.get("SELECT COUNT(*) AS n FROM users");
  console.log(`Usuarios en users ahora: ${nu.n}`);
  await db.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
