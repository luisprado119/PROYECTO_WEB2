import { Database } from "sqlite3";
import { open } from "sqlite";
import { ensureSchema } from "./schema";

export type SqliteConnection = Awaited<ReturnType<typeof open>>;

let db: SqliteConnection | null = null;
let schemaOkLogged = false;

export async function getDb(): Promise<SqliteConnection> {
  if (!db) {
    db = await open({
      filename: "./northwind.db",
      driver: Database,
    });
    try {
      await ensureSchema(db);
      if (!schemaOkLogged) {
        schemaOkLogged = true;
        console.log("Esquema de base de datos verificado (tablas extensiones OK).");
      }
    } catch (error) {
      console.error("Error crítico al inicializar el esquema de la base de datos:", error);
      throw error;
    }
  }
  return db;
}
