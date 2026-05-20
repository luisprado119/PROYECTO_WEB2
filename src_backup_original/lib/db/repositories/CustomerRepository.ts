import type { SqliteConnection } from "@/lib/db/connection";
import type { CustomerSavePayload, AdminCustomerRow, CustomerProfileRow } from "@/lib/db/db-types";

export class CustomerRepository {
  constructor(private readonly db: SqliteConnection) {}

  async findById(customerId: string): Promise<CustomerProfileRow | undefined> {
    const row = await this.db.get("SELECT * FROM Customers WHERE CustomerID = ?", [customerId]);
    return row ? (row as CustomerProfileRow) : undefined;
  }

  async updateProfile(customerId: string, values: CustomerSavePayload): Promise<void> {
    const updateQuery = `
        UPDATE Customers SET 
        CompanyName = ?,
        ContactName = ?,
        ContactTitle = ?,
        Address = ?,
        City = ?,
        Region = ?,
        PostalCode = ?,
        Country = ?,
        Phone = ?,
        Fax = ?
        WHERE CustomerID = ?
    `;
    const {
      CompanyName,
      ContactName,
      ContactTitle,
      Address,
      City,
      Region,
      PostalCode,
      Country,
      Phone,
      Fax,
    } = values;
    await this.db.run(updateQuery, [
      CompanyName,
      ContactName,
      ContactTitle,
      Address,
      City,
      Region,
      PostalCode,
      Country,
      Phone,
      Fax,
      customerId,
    ]);
  }

  async listForAdmin(): Promise<AdminCustomerRow[]> {
    return this.db.all(
      `SELECT CustomerID, CompanyName, ContactName, City, Country
       FROM Customers
       ORDER BY CustomerID COLLATE NOCASE`
    );
  }
}
