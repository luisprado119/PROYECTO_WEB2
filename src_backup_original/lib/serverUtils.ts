"use server";

import jwt from "jsonwebtoken";

export interface TokenPayload {
  id: number;
  username: string;
  role: string;
}

/** Normaliza el payload del JWT (tokens antiguos sin `role`). */
function normalizePayload(decoded: jwt.JwtPayload): TokenPayload {
  const idRaw = decoded.id;
  const username = decoded.username;
  const id = typeof idRaw === "number" ? idRaw : Number(idRaw);
  if (!Number.isFinite(id) || typeof username !== "string" || username.length === 0) {
    throw new Error("Token con formato inválido.");
  }
  const role =
    typeof decoded.role === "string" && decoded.role.length > 0
      ? decoded.role
      : "customer";
  return { id, username, role };
}

/**
 * Verifica la validez de un token JWT en el servidor.
 * @throws Error si el token no existe, expiró o está corrupto.
 */
export async function requireAuth(token: string): Promise<TokenPayload> {
  if (!token || !String(token).trim()) {
    throw new Error("No autorizado: No se detectó ninguna sesión activa.");
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("Error de configuración interna: JWT_SECRET no definido.");
  }

  try {
    const cleanToken = token.startsWith("Bearer ") ? token.slice(7) : token;
    const decoded = jwt.verify(cleanToken, secret) as jwt.JwtPayload;
    return normalizePayload(decoded);
  } catch {
    throw new Error(
      "Sesión inválida o expirada. Por favor, inicie sesión nuevamente."
    );
  }
}

/**
 * Verifica el token y exige rol administrador (Nivel 2 — comercio).
 */
export async function requireAdmin(token: string): Promise<TokenPayload> {
  const user = await requireAuth(token);
  if (user.role !== "admin") {
    throw new Error(
      "Acceso denegado: Se requieren privilegios de Gestor Comercial."
    );
  }
  return user;
}

/**
 * Verificación no bloqueante para el cliente (AuthContext).
 */
export async function verifyToken(
  token: string
): Promise<{ valid: boolean; payload?: TokenPayload }> {
  try {
    const user = await requireAuth(token);
    return { valid: true, payload: user };
  } catch {
    return { valid: false };
  }
}
