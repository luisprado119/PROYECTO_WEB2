import React from 'react'
import Link from 'next/link';
import ProductPrice from "@/components/app/ProductPrice";

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
      <div className="text-center py-xl">
        <div className="text-5xl mb-md">📦</div>
        <h3 className="text-headline-md font-bold text-on-surface">No hay pedidos registrados</h3>
        <p className="text-body-md text-on-surface-variant mt-sm max-w-sm mx-auto">
          Aún no tienes pedidos. Cuando completes una compra en la cesta, aparecerán aquí para realizar el pago o ver su estado.
        </p>
        <Link
          href="/products"
          className="mt-md inline-block px-lg py-sm bg-md-primary text-white rounded-lg text-label-md font-bold hover:brightness-110 active:scale-95 transition-all shadow-sm"
        >
          Explorar Catálogo →
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-md">
      <div className="flex justify-between items-center mb-md">
        <h2 className="text-headline-md font-bold text-on-surface">Historial de Pedidos</h2>
        <span className="text-label-md bg-surface-container px-md py-xs rounded-full font-bold text-on-surface-variant">
          {orders.length} pedido{orders.length !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="overflow-x-auto border border-outline-variant rounded-xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-low border-b border-outline-variant text-label-md font-bold text-on-surface-variant">
              <th className="px-lg py-md">N.º Pedido</th>
              <th className="px-lg py-md">Fecha de Creación</th>
              <th className="px-lg py-md text-right">Importe Total</th>
              <th className="px-lg py-md text-center">Estado del Pago</th>
              <th className="px-lg py-md text-right">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant text-body-md text-on-surface">
            {orders.map((order) => (
              <tr key={order.OrderID} className="hover:bg-surface-container-lowest transition-colors">
                <td className="px-lg py-md font-bold text-md-primary">
                  <Link href={`/dashboard/${customerId}/orders/${order.OrderID}`} className="hover:underline">
                    #{order.OrderID}
                  </Link>
                </td>
                <td className="px-lg py-md text-on-surface-variant">
                  {new Date(order.OrderDate).toLocaleString("es-ES", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </td>
                <td className="px-lg py-md text-right font-bold text-on-surface text-nowrap">
                  <ProductPrice eurAmount={order.TotalImporte} />
                </td>
                <td className="px-lg py-md text-center">
                  {order.Cobrado ? (
                    <span className="inline-flex items-center gap-1 px-md py-xs rounded-full text-label-sm font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      Pagado
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-md py-xs rounded-full text-label-sm font-bold bg-amber-100 text-amber-800 border border-amber-200">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Pendiente de Pago
                    </span>
                  )}
                </td>
                <td className="px-lg py-md text-right">
                  <Link
                    href={`/dashboard/${customerId}/orders/${order.OrderID}`}
                    className="inline-flex items-center gap-1 text-label-md font-bold text-md-primary hover:underline"
                  >
                    <span>Ver detalles</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Orders;