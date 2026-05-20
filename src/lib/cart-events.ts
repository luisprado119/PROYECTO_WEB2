/** Evento disparado al cambiar la cesta (badge en header). */
export const CART_UPDATED_EVENT = "supershop:cart-updated";

export function dispatchCartUpdated(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(CART_UPDATED_EVENT));
}
