export type CustomerSavePayload = {
  CompanyName: string;
  ContactName: string;
  ContactTitle: string;
  Address: string;
  City: string;
  Region: string | null;
  PostalCode: string;
  Country: string;
  Phone: string;
  Fax: string | null;
};

/** Fila `Customers` al completo para perfil / edición */
export type CustomerProfileRow = CustomerSavePayload & { CustomerID: string };

export type SalesGranularity = "day" | "month" | "quarter" | "semester" | "year";

export type CategoryRow = {
  CategoryID: number;
  CategoryName: string;
};

export type ProductListRow = {
  ProductID: number;
  ProductName: string;
  UnitPrice: number;
  UnitsInStock: number;
  CategoryID: number | null;
};

export type AdminCustomerRow = {
  CustomerID: string;
  CompanyName: string | null;
  ContactName: string | null;
  City: string | null;
  Country: string | null;
};

export type RecentOrderRow = {
  OrderID: number;
  OrderDate: string;
  CustomerID: string;
  TotalImporte: number | null;
  ShippedDate: string | null;
};

export type SalesByPeriodRow = { period: string; total: number };

export type SalesByCategoryRow = {
  period: string;
  categoryName: string | null;
  total: number;
};

export type ActivityLogRow = {
  id: number;
  username: string;
  action: string;
  target: string | null;
  fecha: string;
};

export type ActivityLogFilters = {
  limit?: number;
  username?: string;
  action?: string;
};

/** Línea de pedido con nombre de producto (JOIN) */
export type OrderDetailLineRow = {
  ProductID: number;
  ProductName: string;
  UnitPrice: number;
  Quantity: number;
  Discount: number;
};

/** Cabecera `Orders` (Northwind) */
export type OrderHeaderRow = {
  OrderID: number;
  CustomerID: string;
  EmployeeID: number;
  OrderDate: string;
  RequiredDate: string | null;
  ShippedDate: string | null;
  ShipVia: number;
  Freight: number;
  ShipName: string;
  ShipAddress: string;
  ShipCity: string;
  ShipRegion: string | null;
  ShipPostalCode: string;
  ShipCountry: string;
};

/** Cabecera + líneas y total calculado (dashboard / admin) */
export type OrderWithDetailsRow = OrderHeaderRow & {
  Details: OrderDetailLineRow[];
  TotalAmount: number;
};
