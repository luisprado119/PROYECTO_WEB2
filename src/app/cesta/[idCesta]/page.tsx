"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/app/AuthContext";
import { getCesta, removeFromCesta } from "@/lib/db/actions/cesta-actions";
import { createOrder } from "@/lib/db/actions/order-actions";
import Link from "next/link";
import { useParams } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { dispatchCartUpdated } from "@/lib/cart-events";
import { useCurrency } from "@/components/app/CurrencyContext";
import ProductPrice from "@/components/app/ProductPrice";

interface CestaItem {
  productId: number;
  ProductName: string;
  cantidad: number;
  UnitPrice?: number;
}

const EMOJIS = ["🛒","📦","🥃","🧂","🧀","🌾","🍖","🐟","🫙","🥬"];

export default function Cesta() {
  const params = useParams();
  const idCesta = params.idCesta as string;
  const { isLoggedIn, username, loading, token } = useAuth();
  const { formatPrice } = useCurrency();
  const [cestaItems, setCestaItems] = useState<CestaItem[]>([]);
  const [cestaLoading, setCestaLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<{ orderId: number; totalAmount: number } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [removingProductId, setRemovingProductId] = useState<number | null>(null);

  const totalEstimado = cestaItems.reduce((sum, item) => sum + (item.UnitPrice ?? 0) * item.cantidad, 0);

  const refreshCestaItems = async () => {
    const items = await getCesta(idCesta.toString());
    setCestaItems(items as CestaItem[]);
  };

  const handleRemoveLine = async (productId: number, productLabel: string) => {
    setRemovingProductId(productId);
    try {
      await removeFromCesta(String(productId), idCesta.toString());
      await refreshCestaItems();
      dispatchCartUpdated();
      toast({
        title: "Producto quitado",
        description: `"${productLabel}" ya no está en la cesta.`,
      });
    } catch {
      toast({
        variant: "destructive",
        title: "No se pudo eliminar",
        description: "Inténtalo de nuevo.",
      });
    } finally {
      setRemovingProductId(null);
    }
  };

  useEffect(() => {
    let cancelled = false;
    async function fetchCesta() {
      setCestaLoading(true);
      setError(null);
      try {
        const items = await getCesta(idCesta.toString());
        if (!cancelled) setCestaItems(items as CestaItem[]);
      } catch (err) {
        if (!cancelled) setError("Error al cargar la cesta");
      } finally {
        if (!cancelled) setCestaLoading(false);
      }
    }
    void fetchCesta();
    return () => { cancelled = true; };
  }, [idCesta]);

  const handleConfirmOrder = async () => {
    if (!isLoggedIn || !token) {
      toast({
        variant: "destructive",
        title: "Sesión requerida",
        description: "Inicia sesión o regístrate para confirmar el pedido.",
      });
      return;
    }
    if (submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const { orderId, totalAmount } = await createOrder(token, username, idCesta.toString());
      setOrder({ orderId, totalAmount });
      setCestaItems([]);
      toast({ title: "Pedido creado", description: `Pedido #${orderId} por ${formatPrice(totalAmount)}.` });
      dispatchCartUpdated();
    } catch (err) {
      const message = err instanceof Error ? err.message : "No se pudo crear el pedido.";
      setError(message);
      toast({ variant: "destructive", title: "Error al crear el pedido", description: message });
    } finally {
      setSubmitting(false);
    }
  };

  // Loading skeleton
  if (loading || cestaLoading) {
    return (
      <div className="bg-surface-container-low min-h-screen py-2xl">
        <div className="max-w-container-max mx-auto px-gutter">
          <div className="grid md:grid-cols-[1fr_360px] gap-xl">
            <div className="space-y-md">
              {[1,2,3].map(i => (
                <div key={i} className="bg-white border border-outline-variant rounded-lg p-md animate-pulse h-24" />
              ))}
            </div>
            <div className="bg-white border border-outline-variant rounded-lg p-lg h-64 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  // Cesta vacía
  if (!cestaLoading && cestaItems.length === 0 && !order) {
    return (
      <div className="bg-surface-container-low min-h-screen flex items-center justify-center">
        <div className="text-center py-2xl">
          <div className="text-8xl mb-lg">🛒</div>
          <h1 className="text-headline-lg font-bold text-on-surface mb-md">Tu cesta está vacía</h1>
          <p className="text-body-lg text-on-surface-variant mb-xl">
            Parece que aún no has añadido ningún producto.
          </p>
          <Link
            href="/products"
            className="px-2xl py-md bg-md-primary text-white font-bold rounded-lg hover:brightness-110 active:scale-95 transition-all text-button-text inline-block"
          >
            Ir al catálogo →
          </Link>
        </div>
      </div>
    );
  }

  // Pedido confirmado
  if (order) {
    return (
      <div className="bg-surface-container-low min-h-screen flex items-center justify-center">
        <div className="text-center py-2xl">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-lg">
            <svg className="w-10 h-10 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-headline-lg font-bold text-on-surface mb-md">¡Pedido registrado! 🎉</h1>
          <p className="text-body-lg text-on-surface-variant mb-xl">
            Pedido <strong>#{order.orderId}</strong> por <strong><ProductPrice eurAmount={order.totalAmount} /></strong>
          </p>
          <Link
            href={`/dashboard/${username}/orders/${order.orderId}`}
            className="px-2xl py-md bg-md-primary-container text-md-on-primary-container font-bold rounded-lg hover:brightness-110 active:scale-95 transition-all text-button-text inline-block"
          >
            Ver pedido y pagar con Redsys →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface-container-low min-h-screen py-2xl">
      <div className="max-w-container-max mx-auto px-gutter">

        {/* Título */}
        <div className="mb-lg">
          <h1 className="text-headline-lg font-bold text-on-surface">Tu cesta</h1>
          <p className="text-body-md text-on-surface-variant mt-1">
            {cestaItems.length} producto{cestaItems.length !== 1 ? "s" : ""} en tu cesta
          </p>
        </div>

        <div className="grid md:grid-cols-[1fr_360px] gap-xl items-start">

          {/* ── Lista de productos ────────────────────────────────── */}
          <div className="space-y-md">
            {cestaItems.map((item, i) => (
              <div
                key={item.productId}
                className="bg-white border border-outline-variant rounded-lg p-md flex items-center gap-md hover:shadow-sm transition-all"
              >
                {/* Imagen placeholder */}
                <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center text-2xl flex-shrink-0">
                  {EMOJIS[i % EMOJIS.length]}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/product/${item.productId}?cantidad=${item.cantidad}`}
                    className="text-body-md font-bold text-on-surface hover:text-md-primary transition-colors line-clamp-1"
                  >
                    {item.ProductName}
                  </Link>
                  <p className="text-label-md text-on-surface-variant mt-1">
                    ID: #{item.productId}
                  </p>
                </div>

                {/* Cantidad */}
                <div className="flex items-center gap-sm flex-shrink-0">
                  <span className="text-label-md text-on-surface-variant">Cant:</span>
                  <span className="w-10 h-10 flex items-center justify-center border border-outline-variant rounded-lg bg-surface-container-low font-bold text-on-surface text-label-md">
                    {item.cantidad}
                  </span>
                </div>

                {/* Subtotal por item */}
                <div className="text-right flex-shrink-0 min-w-[90px] ml-md">
                  <p className="text-body-md font-bold text-on-surface">
                    <ProductPrice eurAmount={(item.UnitPrice ?? 0) * item.cantidad} />
                  </p>
                  {item.cantidad > 1 && (
                    <p className="text-[11px] text-on-surface-variant mt-0.5">
                      <ProductPrice eurAmount={item.UnitPrice ?? 0} /> c/u
                    </p>
                  )}
                </div>

                {/* Acciones */}
                <div className="flex flex-col sm:flex-row items-end sm:items-center gap-xs flex-shrink-0 ml-sm">
                  <Link
                    href={`/product/${item.productId}?cantidad=${item.cantidad}`}
                    className="text-label-md text-md-primary hover:underline"
                  >
                    Editar
                  </Link>
                  <button
                    type="button"
                    disabled={removingProductId === item.productId}
                    onClick={() => void handleRemoveLine(item.productId, item.ProductName)}
                    className="text-label-md text-red-600 hover:text-red-700 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label={`Eliminar ${item.ProductName} de la cesta`}
                  >
                    {removingProductId === item.productId ? "Quitando…" : "Eliminar"}
                  </button>
                </div>
              </div>
            ))}

            {/* Seguir comprando */}
            <Link
              href="/products"
              className="flex items-center gap-2 text-label-md text-md-primary hover:underline font-medium mt-md"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Seguir comprando
            </Link>
          </div>

          {/* ── Resumen del pedido (sticky) ──────────────────────── */}
          <div className="bg-white border border-outline-variant rounded-xl p-lg sticky top-[88px] shadow-sm">
            <h2 className="text-headline-md font-bold text-on-surface mb-lg">Resumen</h2>

            {/* Desglose */}
            <div className="space-y-sm mb-lg">
              <div className="flex justify-between text-body-md text-on-surface-variant">
                <span>{cestaItems.length} producto{cestaItems.length !== 1 ? "s" : ""}</span>
                <span className="font-medium text-on-surface">
                  <ProductPrice eurAmount={totalEstimado} />
                </span>
              </div>
              <div className="flex justify-between text-body-md text-on-surface-variant">
                <span>Envío</span>
                <span className="text-emerald-600 font-medium">Gratis</span>
              </div>
              <div className="border-t border-outline-variant pt-sm flex justify-between text-headline-md font-bold text-on-surface">
                <span>Total estimado</span>
                <span>
                  <ProductPrice eurAmount={totalEstimado} />
                </span>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-md p-sm bg-md-error-container text-md-on-error-container rounded-lg text-label-md">
                ⚠️ {error}
              </div>
            )}

            {/* CTA */}
            {!isLoggedIn ? (
              <div className="space-y-md">
                <div className="p-md bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-label-md font-bold text-amber-800">Debes iniciar sesión</p>
                  <p className="text-[12px] text-amber-700 mt-1">
                    Para confirmar el pedido y pagar necesitas estar registrado e iniciar sesión (según especificación del proyecto).
                  </p>
                </div>
                <div className="flex flex-col gap-sm">
                  <Link
                    href="/login"
                    className="w-full py-md bg-md-primary text-white font-bold rounded-lg hover:brightness-110 active:scale-95 transition-all text-button-text flex items-center justify-center gap-sm"
                  >
                    Iniciar sesión →
                  </Link>
                  <Link
                    href="/signup"
                    className="w-full py-md border border-outline-variant text-on-surface font-bold rounded-lg hover:bg-surface-container-low active:scale-95 transition-all text-button-text flex items-center justify-center gap-sm"
                  >
                    Crear cuenta →
                  </Link>
                </div>
              </div>
            ) : (
              <button
                onClick={() => void handleConfirmOrder()}
                disabled={submitting}
                className="w-full py-md bg-md-secondary-container text-white font-bold rounded-lg hover:brightness-110 active:scale-95 transition-all text-button-text flex items-center justify-center gap-sm disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    Confirmando pedido…
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m5-9v9m4-9v9m4-9l2 9" />
                    </svg>
                    Confirmar pedido
                  </>
                )}
              </button>
            )}

            {/* Trust badges */}
            <div className="mt-lg flex justify-center gap-lg opacity-50">
              <span title="Pago seguro">🔒</span>
              <span title="Redsys">💳</span>
              <span title="Devoluciones">↩️</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
