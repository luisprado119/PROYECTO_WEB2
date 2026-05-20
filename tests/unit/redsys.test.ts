import { describe, it, expect } from "vitest";
import { buildRedsysCheckout } from "@/lib/redsys/buildCheckout";

/** Clave de prueba 24 bytes en Base64 (entorno TPV de desarrollo). */
const TEST_SECRET_B64 = "Mk9m98Ifw7ODoGx2vrSOHQ==";

describe("buildRedsysCheckout (pasarela Redsys)", () => {
  const base = {
    customerId: "ALFKI",
    origin: "https://ejemplo.test",
    amount: "1234",
    orderId: "9999111024",
    merchantSecretB64: TEST_SECRET_B64,
    tpvUrl: "https://sis-t.redsys.es:25443/sis/realizarPago",
  };

  it("expone los cuatro campos esperados por el formulario de pago", () => {
    const r = buildRedsysCheckout(base);
    expect(r).toMatchObject({
      signatureVersion: "HMAC_SHA256_V1",
      merchantParameters: expect.any(String),
      signature: expect.any(String),
      url: base.tpvUrl,
    });
  });

  it("merchantParameters es Base64 de un JSON con el pedido y el importe", () => {
    const r = buildRedsysCheckout(base);
    const decoded = JSON.parse(Buffer.from(r.merchantParameters, "base64").toString("utf8"));
    expect(decoded.DS_MERCHANT_ORDER).toBe(base.orderId);
    expect(decoded.DS_MERCHANT_AMOUNT).toBe(base.amount);
    expect(decoded.DS_MERCHANT_MERCHANTCODE).toBe("999008881");
  });

  it("la firma HMAC-SHA256 sobre los parámetros es estable (mismas entradas → misma firma)", () => {
    const a = buildRedsysCheckout(base);
    const b = buildRedsysCheckout(base);
    expect(a.signature).toBe(b.signature);
    expect(a.merchantParameters).toBe(b.merchantParameters);
  });

  it("cambia la firma si cambia el número de pedido (TripleDES depende de DS_MERCHANT_ORDER)", () => {
    const r1 = buildRedsysCheckout(base);
    const r2 = buildRedsysCheckout({ ...base, orderId: "9999111025" });
    expect(r1.signature).not.toBe(r2.signature);
  });
});
