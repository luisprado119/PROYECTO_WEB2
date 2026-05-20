"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getOrder } from "@/lib/db/actions/order-actions";
import { Redsys } from "@/components/app/Redsys";
import { useAuth } from "@/components/app/AuthContext";
import { formatSqliteDate } from "@/lib/formatSqliteDate";
import { toRedsysEURMinorUnits } from "@/lib/redsys/amountMinorUnitsEUR";

interface OrderDetail {
  ProductID: number;
  ProductName: string;
  UnitPrice: number;
  Quantity: number;
  Discount: number;
}

interface Order {
  OrderID: number;
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
  Details: OrderDetail[];
  TotalAmount: number;
}

export default function OrderPage() {
  const { orderId, customerId } = useParams();
  const { token, loading: authLoading } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingOrder, setLoadingOrder] = useState(true);

  useEffect(() => {
    setError(null);
    if (authLoading) return;
    if (!token) {
      setLoadingOrder(false);
      return;
    }

    let cancelled = false;
    setLoadingOrder(true);
    (async () => {
      try {
        const orderData = (await getOrder(
          token,
          customerId as string,
          orderId as string
        )) as Order;
        if (!cancelled) setOrder(orderData);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "No se pudieron cargar los datos del pedido."
          );
        }
        console.error(err);
      } finally {
        if (!cancelled) setLoadingOrder(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [orderId, customerId, token, authLoading]);

  if (authLoading) {
    return <div className="p-4">Cargando…</div>;
  }

  if (!token) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Sesión requerida</AlertTitle>
        <AlertDescription>
          Debes iniciar sesión para ver el detalle del pedido.
        </AlertDescription>
      </Alert>
    );
  }

  if (loadingOrder) {
    return <div className="p-4">Cargando pedido…</div>;
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!order) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Sin datos</AlertTitle>
        <AlertDescription>No se encontró el pedido.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Detalle del pedido</h1>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Información del pedido</h2>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">N.º pedido</TableCell>
              <TableCell>{order.OrderID}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Fecha del pedido</TableCell>
              <TableCell>{formatSqliteDate(order.OrderDate, "datetime")}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Fecha requerida de entrega</TableCell>
              <TableCell>{formatSqliteDate(order.RequiredDate)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Fecha de envío</TableCell>
              <TableCell>
                {order.ShippedDate ? formatSqliteDate(order.ShippedDate) : "Aún no enviado"}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Líneas del pedido</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID producto</TableHead>
              <TableHead>Producto</TableHead>
              <TableHead>Precio unitario</TableHead>
              <TableHead>Cantidad</TableHead>
              <TableHead>Descuento</TableHead>
              <TableHead>Subtotal</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {order.Details.map((detail) => (
              <TableRow key={detail.ProductID}>
                <TableCell>{detail.ProductID}</TableCell>
                <TableCell>{detail.ProductName}</TableCell>
                <TableCell>${detail.UnitPrice.toFixed(2)}</TableCell>
                <TableCell>{detail.Quantity}</TableCell>
                <TableCell>{(detail.Discount * 100).toFixed(0)}%</TableCell>
                <TableCell>${(detail.UnitPrice * detail.Quantity * (1 - detail.Discount)).toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <h3 className="text-lg font-semibold">
          Importe total: {order.TotalAmount.toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
        </h3>
        <p className="text-sm text-muted-foreground">
          (Catálogo Northwind usa precios en dólares; el TPV está configurado para cobrar ese importe en EUR, modo pruebas.)
        </p>
        <Redsys amount={toRedsysEURMinorUnits(order.TotalAmount)} orderId={order.OrderID.toString()} />
      </div>
    </div>
  );
}
