/**
 * DDL centralizado para extensiones sobre Northwind (users, cesta, cobro).
 * Se ejecuta al abrir la BD vía ensureSchema() en getDb().
 */

export const INIT_SCHEMA_QUERIES = `
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    acceptPolicy BOOLEAN NOT NULL,
    acceptMarketing BOOLEAN NOT NULL,
    role TEXT NOT NULL DEFAULT 'customer'
);

CREATE TABLE IF NOT EXISTS cesta (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    productId INTEGER NOT NULL,
    cestaId TEXT NOT NULL,
    username TEXT NULL,
    cantidad INTEGER NOT NULL,
    UNIQUE(productId, cestaId)
);

CREATE TABLE IF NOT EXISTS cobro (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    orderId INTEGER NOT NULL,
    customerId TEXT NOT NULL,
    amount REAL NOT NULL,
    authorizationCode TEXT NOT NULL UNIQUE,
    fecha TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS activity_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    action TEXT NOT NULL,
    target TEXT NULL,
    fecha TEXT NOT NULL
);
`;

type SqliteDb = {
    exec: (sql: string) => Promise<void>;
    run: (sql: string, params?: unknown[]) => Promise<unknown>;
};

/**
 * Garantiza tablas ampliadas y migra users antiguos sin columna role (Fase 5).
 */
export async function ensureSchema(database: SqliteDb): Promise<void> {
    await database.exec(INIT_SCHEMA_QUERIES);
    try {
        await database.run(
            `ALTER TABLE users ADD COLUMN role TEXT NOT NULL DEFAULT 'customer'`
        );
    } catch {
        /* columna role ya existía */
    }
}
