'use client';

import { Suspense, useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { saveCobro } from "@/lib/db/actions/payment-actions";
import { useAuth } from '@/components/app/AuthContext';
import { toast } from '@/hooks/use-toast';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const { token, loading: authLoading } = useAuth();
  const amount = searchParams.get('amount');
  const orderId = searchParams.get('orderId');
  const customerId = searchParams.get('customerId');
  const dsEncoded = searchParams.get('Ds_MerchantParameters');
  let dsMerchantParameters: { Ds_AuthorisationCode?: string } = {};
  try {
    if (dsEncoded) {
      dsMerchantParameters = JSON.parse(
        atob(decodeURIComponent(dsEncoded))
      ) as { Ds_AuthorisationCode?: string };
    }
  } catch {
    dsMerchantParameters = {};
  }

  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const cobroIntentado = useRef(false);

  useEffect(() => {
    if (authLoading) return;

    const code = dsMerchantParameters.Ds_AuthorisationCode;

    if (!token) {
      if (amount && orderId && customerId && code) {
        setMessage({
          type: 'error',
          text: 'Inicia sesión con la misma cuenta del pedido para registrar el cobro en el sistema.',
        });
      }
      return;
    }

    if (!(amount && orderId && customerId && code)) return;
    if (cobroIntentado.current) return;
    cobroIntentado.current = true;

    let cancelled = false;
    saveCobro(token, customerId, parseInt(orderId, 10), parseFloat(amount) / 100, code)
      .then(() => {
        if (!cancelled) {
          setMessage({ type: 'success', text: 'Cobro guardado exitosamente' });
          toast({
            title: 'Pago registrado',
            description: 'El cobro se guardó en el sistema correctamente.',
          });
        }
      })
      .catch((error: unknown) => {
        cobroIntentado.current = false;
        if (!cancelled) {
          setMessage({
            type: 'error',
            text: `Error al guardar el cobro: ${error instanceof Error ? error.message : 'Desconocido'}`,
          });
          toast({
            variant: 'destructive',
            title: 'No se pudo registrar el cobro',
            description: error instanceof Error ? error.message : 'Desconocido',
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [amount, orderId, customerId, dsMerchantParameters.Ds_AuthorisationCode, token, authLoading]);

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-green-600">¡Pago Exitoso!.

            Autorizaacion: {dsMerchantParameters.Ds_AuthorisationCode}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">Tu pago se ha procesado correctamente.</p>
          {message && <p className={`mb-4 ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>{message.text}</p>}
          {amount && (
            <p className="mb-2">
              <span className="font-semibold">Cantidad pagada:</span> {parseFloat(amount) / 100} €
            </p>
          )}
          {orderId && (
            <p className="mb-2">
              <span className="font-semibold">ID de la cesta:</span>
              <Link href={`/dashboard/${customerId}/orders/${orderId}`}>
                {orderId}
              </Link>
            </p>
          )}
          <p className="mt-4 text-sm text-gray-600">
            Gracias por tu compra. Recibirás un correo electrónico con los detalles de tu pedido.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default function PaymentSuccess() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto max-w-md space-y-3 p-4">
          <Skeleton className="h-40 w-full rounded-lg" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}
