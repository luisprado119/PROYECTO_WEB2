"use server";

import { buildRedsysCheckout } from "@/lib/redsys/buildCheckout";

function createRedsysOrderId(): string {
  // Redsys exige un pedido único por intento y de 4 a 12 caracteres; usamos 12 dígitos.
  return `${Date.now()}${Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0")}`.slice(-12);
}

export async function getRedsysCheckout(customerId: string, origin: string, amount: string, orderId: string) {
  return buildRedsysCheckout({
    customerId,
    origin,
    amount,
    orderId,
    redsysOrderId: createRedsysOrderId(),
    merchantSecretB64: process.env.NEXT_PUBLIC_REDSYS_SECRET as string,
    tpvUrl: process.env.NEXT_PUBLIC_REDSYS_URL,
  });
}
