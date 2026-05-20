"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Redsys } from "@/components/app/Redsys";

function parseRedsysKoMessage(searchParams: URLSearchParams): string | null {
  const direct =
    searchParams.get("Ds_Response") ??
    searchParams.get("Ds_ErrorCode") ??
    searchParams.get("errorCode");
  if (direct) return `Código / respuesta Redsys: ${direct}`;

  const enc = searchParams.get("Ds_MerchantParameters");
  if (!enc) return null;
  try {
    const decoded = JSON.parse(
      atob(decodeURIComponent(enc))
    ) as Record<string, string>;
    const msg =
      decoded.Ds_Response ??
      decoded.Ds_ResponseDescription ??
      decoded.Ds_ErrorCode ??
      decoded.errorCode;
    return msg ? String(msg) : null;
  } catch {
    return null;
  }
}

function PaymentFailedContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const amount = searchParams.get("amount");
  const customerId = searchParams.get("customerId");
  const redsysDetail = parseRedsysKoMessage(searchParams);

  const canRetry = Boolean(orderId && amount && customerId);

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full max-w-md mx-auto border-destructive/50">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-red-600">
            Pago rechazado o cancelado
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            El banco no ha completado el cobro. La orden sigue registrada: puedes
            reintentar el pago con Redsys sin volver a crear el pedido.
          </p>

          {redsysDetail && (
            <Alert variant="destructive">
              <AlertTitle>Detalle del TPV</AlertTitle>
              <AlertDescription>{redsysDetail}</AlertDescription>
            </Alert>
          )}

          {amount && (
            <p>
              <span className="font-semibold">Importe del pedido:</span>{" "}
              {parseFloat(amount) / 100} €
            </p>
          )}

          {orderId && customerId && (
            <p>
              <span className="font-semibold">Pedido:</span>{" "}
              <Link
                className="text-primary underline"
                href={`/dashboard/${customerId}/orders/${orderId}`}
              >
                #{orderId}
              </Link>
            </p>
          )}

          {canRetry ? (
            <div className="space-y-2 pt-2 border-t">
              <p className="text-sm font-medium">Reintento de pago</p>
              <Redsys
                amount={amount as string}
                orderId={orderId as string}
                customerId={customerId as string}
                label="Reintentar pago con Redsys"
              />
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Faltan datos en la URL para volver a abrir la pasarela. Abre el
              pedido desde tu panel y usa el botón de pago allí.
            </p>
          )}

          <p className="text-sm text-muted-foreground">
            Si el problema continúa, contacta con atención al cliente.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default function PaymentFailed() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto p-4">Cargando resultado del pago…</div>
      }
    >
      <PaymentFailedContent />
    </Suspense>
  );
}
