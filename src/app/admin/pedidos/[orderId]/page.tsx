"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useAuth } from "@/components/app/AuthContext";
import { getOrderAdmin, markOrderShipped } from "@/lib/db/actions/order-actions";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type OrderDetailLine = {
  ProductID: number;
  ProductName: string;
  UnitPrice: number;
  Quantity: number;
  Discount: number;
};

type OrderView = {
  OrderID: number;
  OrderDate: string;
  RequiredDate: string;
  ShippedDate: string | null;
  CustomerID: string;
  Details: OrderDetailLine[];
  TotalAmount: number;
};

export default function AdminPedidoDetallePage() {
  const { orderId } = useParams();
  const oid = orderId as string;
  const { token, loading: authLoading } = useAuth();
  const [order, setOrder] = useState<OrderView | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [shipping, setShipping] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const reload = useCallback(async () => {
    if (!token) return;
    const data = (await getOrderAdmin(token, oid)) as OrderView;
    setOrder(data);
  }, [token, oid]);

  useEffect(() => {
    setError(null);
    setMsg(null);
    if (authLoading || !token) {
      if (!authLoading && !token) {
        setError("Sesión no disponible.");
        setLoading(false);
      }
      return;
    }

    let cancelled = false;
    setLoading(true);
    void (async () => {
      try {
        await reload();
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "No se pudo cargar el pedido.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [token, authLoading, reload]);

  async function onMarkShipped() {
    if (!token || !order) return;
    setShipping(true);
    setMsg(null);
    try {
      await markOrderShipped(token, order.OrderID);
      setMsg("Estado actualizado. Si ya estaba enviado, no se duplicó el registro de envío.");
      await reload();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "No se pudo marcar como enviado.");
    } finally {
      setShipping(false);
    }
  }

  if (authLoading || loading) {
    return <p className="text-slate-600">Cargando pedido…</p>;
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
      <Alert>
        <AlertTitle>Sin datos</AlertTitle>
        <AlertDescription>Pedido no encontrado.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-slate-500">
        <Link href="/admin/pedidos" className="text-blue-600 hover:underline">
          ← Pedidos
        </Link>
      </p>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Pedido {order.OrderID}</h1>
          <p className="mt-1 text-slate-600">
            Cliente:{" "}
            <Link className="text-blue-600 hover:underline" href={`/admin/clientes/${order.CustomerID}`}>
              {order.CustomerID}
            </Link>
          </p>
        </div>
        <Button type="button" onClick={() => void onMarkShipped()} disabled={shipping || !!order.ShippedDate}>
          {order.ShippedDate ? "Ya enviado" : shipping ? "Actualizando…" : "Marcar como enviado"}
        </Button>
      </div>
      {msg && (
        <Alert>
          <AlertDescription>{msg}</AlertDescription>
        </Alert>
      )}

      <Table>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">Fecha</TableCell>
            <TableCell>{new Date(order.OrderDate).toLocaleString()}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Enviado</TableCell>
            <TableCell>
              {order.ShippedDate ? new Date(order.ShippedDate).toLocaleDateString() : "Pendiente"}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <div>
        <h2 className="mb-3 text-lg font-semibold">Líneas</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Producto</TableHead>
              <TableHead>Precio</TableHead>
              <TableHead>Cant.</TableHead>
              <TableHead>Dto.</TableHead>
              <TableHead>Subtotal</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {order.Details.map((d) => (
              <TableRow key={`${d.ProductID}-${d.Quantity}`}>
                <TableCell>{d.ProductName}</TableCell>
                <TableCell>{d.UnitPrice.toFixed(2)}</TableCell>
                <TableCell>{d.Quantity}</TableCell>
                <TableCell>{(d.Discount * 100).toFixed(0)}%</TableCell>
                <TableCell>{(d.UnitPrice * d.Quantity * (1 - d.Discount)).toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <p className="mt-4 text-lg font-semibold">Total: {order.TotalAmount.toFixed(2)} €</p>
      </div>
    </div>
  );
}
