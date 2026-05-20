"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/app/AuthContext";
import { getCesta } from "@/lib/db/actions/cesta-actions";
import { createOrder } from "@/lib/db/actions/order-actions";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
import { dispatchCartUpdated } from "@/lib/cart-events";

interface CestaItem {
  productId: number;
  ProductName: string;
  cantidad: number;
}

export default function Cesta() {
  const params = useParams();
  const idCesta = params.idCesta as string;
  const { isLoggedIn, username, loading, token } = useAuth();
  const [cestaItems, setCestaItems] = useState<CestaItem[]>([]);
  const [cestaLoading, setCestaLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<{
    orderId: number;
    totalAmount: number;
  } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function fetchCesta() {
      setCestaLoading(true);
      setError(null);
      try {
        const items = await getCesta(idCesta.toString());
        if (!cancelled) setCestaItems(items as CestaItem[]);
      } catch (err) {
        if (!cancelled) {
          setError("Error al cargar la cesta");
          console.error(err);
        }
      } finally {
        if (!cancelled) setCestaLoading(false);
      }
    }

    void fetchCesta();
    return () => {
      cancelled = true;
    };
  }, [idCesta]);

  if (loading) {
    return (
      <div className="space-y-4 p-2">
        <Skeleton className="h-9 w-48" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-40 rounded-lg" />
          <Skeleton className="h-40 rounded-lg" />
        </div>
      </div>
    );
  }

  if (error && cestaItems.length === 0 && !cestaLoading) {
    return <div className="text-destructive">{error}</div>;
  }

  const handleConfirmOrder = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const { orderId, totalAmount } = await createOrder(token, username, idCesta.toString());
      setOrder({ orderId, totalAmount });
      setCestaItems([]);
      toast({
        title: "Pedido creado",
        description: `Pedido n.º ${orderId} por ${Number(totalAmount).toFixed(2)} €. Puedes pagarlo desde el detalle del pedido.`,
      });
      dispatchCartUpdated();
    } catch (err) {
      const message = err instanceof Error ? err.message : "No se pudo crear el pedido.";
      setError(message);
      toast({
        variant: "destructive",
        title: "Error al crear el pedido",
        description: message,
      });
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-2">
      <h1 className="text-2xl font-bold">Tu cesta</h1>

      {cestaLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-36 rounded-lg" />
          <Skeleton className="h-36 rounded-lg" />
          <Skeleton className="h-36 rounded-lg" />
        </div>
      ) : cestaItems.length === 0 ? (
        <p className="text-muted-foreground">Tu cesta está vacía.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {cestaItems.map((item) => (
            <Card key={item.productId}>
              <CardHeader>
                <CardTitle>
                  <Link href={`/product/${item.productId}?cantidad=${item.cantidad}`} className="hover:underline">
                    {item.ProductName}
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 text-sm text-muted-foreground">
                <p>Producto: {item.productId}</p>
                <p>Cantidad: {item.cantidad}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div>
        <Link href="/products" className="text-primary hover:underline">
          Seguir comprando
        </Link>
      </div>

      {!cestaLoading && cestaItems.length > 0 && (
        <div className="mt-6 space-y-4">
          {!isLoggedIn ? (
            <div
              className="rounded-md border border-amber-500/40 bg-amber-500/10 p-4 text-amber-950 dark:text-amber-100"
              role="alert"
            >
              <p className="font-semibold">Atención</p>
              <p className="text-sm">Para confirmar el pedido y pagar, inicia sesión.</p>
            </div>
          ) : (
            <>
              <Button onClick={() => void handleConfirmOrder()} className="mt-2" disabled={submitting}>
                {submitting ? "Creando pedido…" : "Confirmar pedido"}
              </Button>
              {order && (
                <div className="mt-4 rounded-lg border bg-muted/40 p-4">
                  <p className="mb-2 text-sm font-medium">Pedido registrado.</p>
                  <Link href={`/dashboard/${username}/orders/${order.orderId}`} className="text-primary font-medium hover:underline">
                    Ver pedido #{order.orderId} y pagar con Redsys
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
