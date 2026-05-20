"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/app/AuthContext";
import { getRecentOrders } from "@/lib/db/actions/order-actions";
import type { RecentOrderRow } from "@/lib/db/db-types";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function AdminPedidosPage() {
  const { token, loading: authLoading } = useAuth();
  const [rows, setRows] = useState<RecentOrderRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setError(null);
    if (authLoading) return;
    if (!token) {
      setError("Sesión no disponible.");
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    void (async () => {
      try {
        const data = await getRecentOrders(token, 50);
        if (!cancelled) setRows(data);
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "No se pudieron cargar los pedidos.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [token, authLoading]);

  if (authLoading || loading) {
    return <p className="text-slate-600">Cargando pedidos…</p>;
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-slate-900">Últimos pedidos</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Pedido</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Importe</TableHead>
            <TableHead>Enviado</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((r) => (
            <TableRow key={r.OrderID}>
              <TableCell>
                <Link className="text-blue-600 hover:underline" href={`/admin/pedidos/${r.OrderID}`}>
                  {r.OrderID}
                </Link>
              </TableCell>
              <TableCell>{new Date(r.OrderDate).toLocaleString()}</TableCell>
              <TableCell>
                <Link className="text-blue-600 hover:underline" href={`/admin/clientes/${r.CustomerID}`}>
                  {r.CustomerID}
                </Link>
              </TableCell>
              <TableCell>{r.TotalImporte != null ? Number(r.TotalImporte).toFixed(2) : "—"}</TableCell>
              <TableCell>{r.ShippedDate ? new Date(r.ShippedDate).toLocaleDateString() : "—"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
