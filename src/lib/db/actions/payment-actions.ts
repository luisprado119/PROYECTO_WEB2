"use server";

import { getDb } from "../connection";
import { requireCustomerSession } from "../guards";
import { CobroRepository } from "../repositories/CobroRepository";
import { ActivityLogRepository } from "../repositories/ActivityLogRepository";

export async function saveCobro(
  token: string,
  customerId: string,
  orderId: number,
  amount: number,
  authorizationCode: string
) {
  await requireCustomerSession(token, customerId);
  const db = await getDb();
  const lastId = await new CobroRepository(db).insert(orderId, customerId, amount, authorizationCode);
  await new ActivityLogRepository(db).insert(customerId, "payment_ok", String(orderId));
  return lastId;
}
