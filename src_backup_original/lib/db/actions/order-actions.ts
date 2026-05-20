"use server";

import { getDb } from "../connection";
import { requireAuth, requireAdmin } from "@/lib/serverUtils";
import { requireCustomerSession } from "../guards";
import { OrderRepository } from "../repositories/OrderRepository";
import { ActivityLogRepository } from "../repositories/ActivityLogRepository";

export async function getCustomerOrders(token: string, customerId: string) {
  await requireCustomerSession(token, customerId);
  return new OrderRepository(await getDb()).listForCustomer(customerId);
}

export async function getCustomerOrdersAdmin(token: string, customerId: string) {
  await requireAdmin(token);
  return new OrderRepository(await getDb()).listForCustomerAdmin(customerId);
}

export async function getOrder(token: string, customerId: string, orderId: string) {
  await requireCustomerSession(token, customerId);
  return new OrderRepository(await getDb()).findWithDetailsForCustomer(orderId, customerId);
}

export async function createOrder(token: string, username: string, cestaSessionId?: string | null) {
  const session = await requireAuth(token);
  if (session.username !== username) {
    throw new Error("No autorizado: el pedido no coincide con la sesión actual.");
  }
  const db = await getDb();
  const cid = typeof cestaSessionId === "string" ? cestaSessionId.trim() : "";
  const result = await new OrderRepository(db).createFromUsername(username, cid.length > 0 ? cid : undefined);
  await new ActivityLogRepository(db).insert(session.username, "order_created", String(result.orderId));
  return result;
}

export async function getRecentOrders(token: string, limit: number) {
  await requireAdmin(token);
  return new OrderRepository(await getDb()).listRecent(limit);
}

export async function getOrderAdmin(token: string, orderId: string) {
  await requireAdmin(token);
  return new OrderRepository(await getDb()).findWithDetailsAdmin(orderId);
}

export async function markOrderShipped(token: string, orderId: number) {
  const admin = await requireAdmin(token);
  const db = await getDb();
  const { updated } = await new OrderRepository(db).markShippedIfPending(orderId);
  if (updated) {
    await new ActivityLogRepository(db).insert(admin.username, "order_shipped", String(orderId));
  }
}
