import type { SqliteConnection } from "@/lib/db/connection";

export type LoginUserRow = {
  id: number;
  username: string;
  role: string;
};

export class UserRepository {
  constructor(private readonly db: SqliteConnection) {}

  async insertWithCustomer(
    username: string,
    password: string,
    acceptPolicy: boolean,
    acceptMarketing: boolean
  ): Promise<number | undefined> {
    try {
      const existingUser = await this.db.get("SELECT * FROM users WHERE username = ?", [username]);
      if (existingUser) {
        throw new Error("Username already exists");
      }
      const existingCustomer = await this.db.get("SELECT CustomerID FROM Customers WHERE CustomerID = ?", [
        username,
      ]);
      if (existingCustomer) {
        throw new Error("Customer  exist");
      }
      const result = await this.db.run(
        "INSERT INTO users (username, password, acceptPolicy, acceptMarketing) VALUES (?, ?, ?, ?)",
        [username, password, acceptPolicy, acceptMarketing]
      );
      await this.db.run("INSERT INTO Customers (CustomerID) VALUES (?)", [username]);
      return result.lastID;
    } catch (error) {
      console.error("Error inserting user:", error);
      throw error;
    }
  }

  async findByCredentials(username: string, password: string): Promise<LoginUserRow | null> {
    try {
      const user = (await this.db.get(
        `SELECT id, username, COALESCE(role, 'customer') AS role
         FROM users WHERE username = ? AND password = ?`,
        [username, password]
      )) as LoginUserRow | undefined;
      return user ?? null;
    } catch (error) {
      console.error("Error fetching user:", error);
      throw error;
    }
  }

  async updatePassword(customerId: string, newPassword: string): Promise<void> {
    await this.db.run("UPDATE users SET password = ? WHERE username = ?", [newPassword, customerId]);
  }

  async verifyPassword(customerId: string, currentPassword: string): Promise<boolean> {
    const user = await this.db.get("SELECT * FROM users WHERE username = ? AND password = ?", [
      customerId,
      currentPassword,
    ]);
    return !!user;
  }
}
