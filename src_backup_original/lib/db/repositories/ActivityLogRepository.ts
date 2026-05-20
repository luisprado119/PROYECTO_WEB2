import type { SqliteConnection } from "@/lib/db/connection";
import type { ActivityLogFilters, ActivityLogRow } from "@/lib/db/db-types";

export class ActivityLogRepository {
  constructor(private readonly db: SqliteConnection) {}

  async insert(username: string, action: string, target: string | null = null): Promise<void> {
    try {
      await this.db.run(
        `INSERT INTO activity_log (username, action, target, fecha) VALUES (?, ?, ?, ?)`,
        [username, action, target, new Date().toISOString()]
      );
    } catch (e) {
      console.error("logActivity:", e);
    }
  }

  async findFiltered(filters: ActivityLogFilters = {}): Promise<ActivityLogRow[]> {
    const limit = Math.min(500, Math.max(1, Math.floor(filters.limit ?? 100)));
    const where: string[] = [];
    const params: (string | number)[] = [];
    if (filters.username?.trim()) {
      where.push("username = ?");
      params.push(filters.username.trim());
    }
    if (filters.action?.trim()) {
      where.push("action = ?");
      params.push(filters.action.trim());
    }
    const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";
    return this.db.all(
      `SELECT id, username, action, target, fecha
       FROM activity_log
       ${whereSql}
       ORDER BY datetime(fecha) DESC, id DESC
       LIMIT ?`,
      [...params, limit]
    );
  }
}
