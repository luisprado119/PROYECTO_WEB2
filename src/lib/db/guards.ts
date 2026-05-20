import { requireAuth } from "@/lib/serverUtils";

export async function requireCustomerSession(token: string, customerId: string) {
  const session = await requireAuth(token);
  if (session.username !== customerId) {
    throw new Error("No autorizado: la operación no corresponde a tu cuenta.");
  }
  return session;
}
