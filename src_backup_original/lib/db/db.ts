/**
 * Fachada pública de acceso a datos (FASE 6). Delega en repositorios y acciones modulares.
 * No usar `"use server"` aquí: Next solo permite exportar async actions en ese caso;
 * Las acciones llevan su propia directiva en `actions/*.ts`.
 * `getDb` no se reexporta aquí: evita que componentes cliente resuelvan `sqlite` vía este barrel.
 * En código server, importa `getDb` desde `@/lib/db/connection`.
 *
 * @see src/lib/db/repositories/*
 * @see src/lib/db/actions/*
 */
export * from "./db-types";
export { logActivity, getActivityLog } from "./actions/activity-actions";
export {
  getAllProducts,
  getCategories,
  getProductsPaginated,
  getFeaturedProducts,
  getProduct,
} from "./actions/catalog-actions";
export { insertUser, getUser, setPassword } from "./actions/auth-actions";
export { getCustomer, saveCustomer, getAllCustomers, getCustomerAdmin } from "./actions/customer-actions";
export {
  associateCestaIdWithUsername,
  cesta,
  getCesta,
  getCestaItemCount,
  deleteCestaByCestaId,
} from "./actions/cesta-actions";
export {
  getCustomerOrders,
  getCustomerOrdersAdmin,
  getOrder,
  createOrder,
  getRecentOrders,
  getOrderAdmin,
  markOrderShipped,
} from "./actions/order-actions";
export { saveCobro } from "./actions/payment-actions";
export { getSalesByPeriod, getSalesByCategoryAndPeriod } from "./actions/admin-sales-actions";
