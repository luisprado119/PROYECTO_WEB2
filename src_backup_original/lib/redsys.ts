"use server";

import { buildRedsysCheckout } from "@/lib/redsys/buildCheckout";

export async function getRedsysCheckout(customerId: string, origin: string, amount: string, orderId: string) {
  return buildRedsysCheckout({
    customerId,
    origin,
    amount,
    orderId,
    merchantSecretB64: process.env.NEXT_PUBLIC_REDSYS_SECRET as string,
    tpvUrl: process.env.NEXT_PUBLIC_REDSYS_URL,
  });
}
