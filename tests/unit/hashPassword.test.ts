import { describe, it, expect } from "vitest";
import { hashPassword } from "@/lib/utils";

describe("hashPassword (seguridad)", () => {
  it("produce salida hexadecimal de 64 caracteres (SHA-256)", async () => {
    const h = await hashPassword("secret123");
    expect(h).toMatch(/^[0-9a-f]{64}$/);
  });

  it("es determinista para la misma contraseña", async () => {
    const a = await hashPassword("misma_clave");
    const b = await hashPassword("misma_clave");
    expect(a).toBe(b);
  });

  it("cambia totalmente con una entrada distinta (avalancha)", async () => {
    const h1 = await hashPassword("a");
    const h2 = await hashPassword("b");
    expect(h1).not.toBe(h2);
  });

  it("no devuelve la contraseña en claro ni un substring reversible obvio", async () => {
    const plain = "MiPasswordLarga123!";
    const h = await hashPassword(plain);
    expect(h).not.toContain(plain);
    expect(h.length).toBe(64);
  });
});
