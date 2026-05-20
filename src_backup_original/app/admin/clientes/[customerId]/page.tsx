"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useAuth } from "@/components/app/AuthContext";
import { getCustomerAdmin } from "@/lib/db/actions/customer-actions";
import { getCustomerOrdersAdmin } from "@/lib/db/actions/order-actions";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { CustomerOrderRow } from "@/components/app/Orders";

export default function AdminClienteDetallePage() {
  const { customerId } = useParams();
  const id = customerId as string;
  const { token, loading: authLoading } = useAuth();
  const [customer, setCustomer] = useState<Record<string, unknown> | null>(null);
  const [orders, setOrders] = useState<CustomerOrderRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setError(null);
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
        const [c, o] = await Promise.all([getCustomerAdmin(token, id), getCustomerOrdersAdmin(token, id)]);
        if (!cancelled) {
          setCustomer(c as Record<string, unknown>);
          setOrders(o as CustomerOrderRow[]);
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "No se pudo cargar el cliente.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [token, authLoading, id]);

  if (authLoading || loading) {
    return <p className="text-slate-600">Cargando…</p>;
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!customer) {
    return (
      <Alert>
        <AlertTitle>Sin datos</AlertTitle>
        <AlertDescription>Cliente no encontrado.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm text-slate-500">
          <Link href="/admin/clientes" className="text-blue-600 hover:underline">
            ← Clientes
          </Link>
        </p>
        <h1 className="text-2xl font-bold text-slate-900">Cliente {id}</h1>
        <p className="mt-2 text-slate-600">
          {(customer.CompanyName as string) || "Sin empresa"} — {(customer.ContactName as string) || "—"}
        </p>
      </div>

      <div>
        <h2 className="mb-3 text-lg font-semibold">Pedidos</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Pedido</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Importe</TableHead>
              <TableHead>Cobrado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.OrderID}>
                <TableCell>
                  <Link className="text-blue-600 hover:underline" href={`/admin/pedidos/${order.OrderID}`}>
                    {order.OrderID}
                  </Link>
                </TableCell>
                <TableCell>{new Date(order.OrderDate).toLocaleDateString()}</TableCell>
                <TableCell>{order.TotalImporte ?? "—"}</TableCell>
                <TableCell>{order.Cobrado ? "Sí" : "No"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
