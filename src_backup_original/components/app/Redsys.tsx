"use client";

import { useState, useEffect } from "react";
import { getRedsysCheckout } from "@/lib/redsys";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";

interface RedsysProps {
  amount: string;
  orderId: string;
  /** En rutas sin [customerId] (p. ej. /ko) hay que pasarlo explícitamente. */
  customerId?: string;
  /** Texto del botón que envía el formulario a Redsys. */
  label?: string;
}

export function Redsys({
  amount,
  orderId,
  customerId: customerIdProp,
  label = "Pasarela de pago",
}: RedsysProps) {
  const params = useParams();
  const customerId = customerIdProp ?? (params?.customerId as string | undefined);
  const [redsys, setRedsys] = useState<{
    url: string;
    signatureVersion: string;
    merchantParameters: string;
    signature: string;
  } | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const origin =
    typeof window !== "undefined" ? window.location.origin : "";

  useEffect(() => {
    if (!customerId || !origin) return;

    setLoadError(null);
    getRedsysCheckout(customerId, origin, amount, orderId)
      .then((data) => {
        if (data?.url) {
          setRedsys({
            url: data.url,
            signatureVersion: data.signatureVersion,
            merchantParameters: data.merchantParameters,
            signature: data.signature,
          });
        } else {
          setLoadError(
            "Falta configurar la URL de Redsys (NEXT_PUBLIC_REDSYS_URL)."
          );
        }
      })
      .catch((err: unknown) => {
        console.error("Error fetching Redsys data:", err);
        setLoadError(
          err instanceof Error ? err.message : "No se pudo preparar el pago."
        );
      });
  }, [origin, amount, orderId, customerId]);

  if (!customerId) {
    return (
      <p className="text-sm text-destructive">
        No se pudo identificar el cliente del pedido.
      </p>
    );
  }

  if (loadError) {
    return <p className="text-sm text-destructive">{loadError}</p>;
  }

  if (!redsys) {
    return (
      <p className="text-sm text-muted-foreground">Preparando la pasarela…</p>
    );
  }

  return (
    <form action={redsys.url} method="POST" name="from">
      <input
        type="hidden"
        name="Ds_SignatureVersion"
        value={redsys.signatureVersion}
      />
      <input
        type="hidden"
        name="Ds_MerchantParameters"
        value={redsys.merchantParameters}
      />
      <input type="hidden" name="Ds_Signature" value={redsys.signature} />

      <Button
        variant="outline"
        className="bg-green-500 hover:bg-green-600 text-white"
        type="submit"
      >
        <span>{label}</span>
      </Button>
    </form>
  );
}
