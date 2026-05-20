import React from 'react'
import Link from 'next/link';
import { Table, TableHeader, TableBody, TableCell, TableRow, TableHead } from '@/components/ui/table';

export type CustomerOrderRow = {
  OrderID: number;
  OrderDate: string;
  TotalImporte: number;
  Cobrado: number;
};

function Orders({ orders, customerId }: { orders: CustomerOrderRow[]; customerId: string }) {
  const formatAmount = (n: number | null | undefined) => {
    const v = n == null || Number.isNaN(Number(n)) ? 0 : Number(n);
    return v.toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  if (orders.length === 0) {
    return (
      <div className="container mx-auto p-4 text-slate-600">
        <p>Aún no tienes pedidos. Cuando completes una compra, aparecerán aquí (más reciente primero).</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>N.º pedido</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead>Importe</TableHead>
            <TableHead>Pagado</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.OrderID}>
              <TableCell>
                <Link href={`/dashboard/${customerId}/orders/${order.OrderID}`}>
                  {order.OrderID}
                </Link>
              </TableCell>
              <TableCell>
                {new Date(order.OrderDate).toLocaleString("es-ES", {
                  dateStyle: "short",
                  timeStyle: "short",
                })}
              </TableCell>
              <TableCell>{formatAmount(order.TotalImporte)}</TableCell>
              <TableCell>{order.Cobrado ? "Sí" : "No"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default Orders