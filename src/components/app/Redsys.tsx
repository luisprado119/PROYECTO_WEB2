"use client";

import { useState, useEffect, useMemo } from "react";
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

  /**
   * Origen que Redsys usará para DS_MERCHANT_URLOK / URLKO (debe poder abrir el navegador).
   * Opcional `.env.local`: NEXT_PUBLIC_APP_ORIGIN=https://tu-subdominio.ngrok-free.app — útil cuando
   * pruebas el retorno HTTPS→HTTP desde otra máquina o antivirus bloquea localhost.
   */
  const merchantOrigin = useMemo(() => {
    const fromEnv =
      typeof process.env.NEXT_PUBLIC_APP_ORIGIN === "string"
        ? process.env.NEXT_PUBLIC_APP_ORIGIN.trim().replace(/\/+$/, "")
        : "";
    if (fromEnv) return fromEnv;
    if (typeof window !== "undefined") return window.location.origin;
    return "";
  }, []);

  useEffect(() => {
    if (!customerId || !merchantOrigin) return;

    setLoadError(null);
    getRedsysCheckout(customerId, merchantOrigin, amount, orderId)
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
  }, [merchantOrigin, amount, orderId, customerId]);

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
    <form action={redsys.url} method="POST" name="from" target="_top">
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
