import { NextResponse } from "next/server";

/**
 * Notificación servidor-a-servidor de Redsys (DS_MERCHANT_MERCHANTURL).
 * La demo solo usa URLOK/URLKO para el resultado en navegador; aquí respondemos OK
 * para no devolver 404 si el TPV intenta llamar a esta URL.
 */
export async function POST() {
  return new NextResponse("OK", {
    status: 200,
    headers: { "Content-Type": "text/plain;charset=utf-8" },
  });
}

export async function GET() {
  return new NextResponse("OK", {
    status: 200,
    headers: { "Content-Type": "text/plain;charset=utf-8" },
  });
}
