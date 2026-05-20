/**
 * Asigna role = 'admin' a un usuario existente en northwind.db.
 * Uso: node scripts/seed-admin.cjs <username>
 */
const path = require("path");
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");

async function main() {
  const username = process.argv[2];
  if (!username || !String(username).trim()) {
    console.error("Uso: node scripts/seed-admin.cjs <username>");
    process.exit(1);
  }

  const dbPath = path.join(__dirname, "..", "northwind.db");
  const db = await open({ filename: dbPath, driver: sqlite3.Database });
  const res = await db.run("UPDATE users SET role = ? WHERE username = ?", [
    "admin",
    username.trim(),
  ]);
  await db.close();

  if (!res.changes) {
    console.error(`No se encontró el usuario "${username.trim()}".`);
    process.exit(1);
  }
  console.log(`Usuario "${username.trim()}" ahora es admin. Cierra sesión y vuelve a entrar para renovar el JWT.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
