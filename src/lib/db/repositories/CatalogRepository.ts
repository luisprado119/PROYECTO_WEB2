import type { SqliteConnection } from "@/lib/db/connection";
import type { CategoryRow, ProductListRow } from "@/lib/db/db-types";

export class CatalogRepository {
  constructor(private readonly db: SqliteConnection) {}

  async getAllProducts(): Promise<unknown[]> {
    try {
      return this.db.all("SELECT * FROM Products");
    } catch (error) {
      console.error("Error fetching all products:", error);
      throw error;
    }
  }

  async getCategories(): Promise<CategoryRow[]> {
    return this.db.all(
      "SELECT CategoryID, CategoryName FROM Categories ORDER BY CategoryName COLLATE NOCASE"
    );
  }

  async getProductsPaginated(
    categoryId: number | null,
    page: number,
    pageSize: number
  ): Promise<{
    products: ProductListRow[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const safePage = Math.max(1, Math.floor(page));
    const safeSize = Math.max(1, Math.floor(pageSize));
    const whereSql =
      categoryId != null && !Number.isNaN(categoryId) ? "WHERE CategoryID = ?" : "";
    const baseParams: number[] =
      categoryId != null && !Number.isNaN(categoryId) ? [categoryId] : [];

    const countRow = (await this.db.get(
      `SELECT COUNT(*) AS cnt FROM Products ${whereSql}`,
      baseParams
    )) as { cnt: number };
    const total = Number(countRow.cnt);
    const totalPages = Math.max(1, Math.ceil(total / safeSize));
    const pageUsed = Math.min(safePage, totalPages);
    const offset = (pageUsed - 1) * safeSize;

    const products = (await this.db.all(
      `SELECT ProductID, ProductName, UnitPrice, UnitsInStock, CategoryID
       FROM Products ${whereSql}
       ORDER BY ProductID
       LIMIT ? OFFSET ?`,
      [...baseParams, safeSize, offset]
    )) as ProductListRow[];

    return { products, total, page: pageUsed, totalPages };
  }

  async getFeaturedProducts(limit = 4): Promise<ProductListRow[]> {
    const n = Math.min(12, Math.max(1, Math.floor(limit)));
    return this.db.all(
      `SELECT ProductID, ProductName, UnitPrice, UnitsInStock, CategoryID
       FROM Products
       WHERE UnitsInStock > 50
       ORDER BY UnitsInStock DESC, ProductID
       LIMIT ?`,
      [n]
    ) as Promise<ProductListRow[]>;
  }

  async getProductById(productId: string): Promise<ProductListRow | undefined> {
    const row = await this.db.get("SELECT * FROM Products WHERE ProductID = ?", [productId]);
    return row ? (row as ProductListRow) : undefined;
  }
}
