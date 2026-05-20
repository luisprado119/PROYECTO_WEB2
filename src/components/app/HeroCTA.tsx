"use client";

import Link from "next/link";
import { useAuth } from "@/components/app/AuthContext";

/**
 * Botones CTA del hero — se adaptan al estado de autenticación:
 * - No logueado: "Ver productos" + "Iniciar sesión"
 * - Logueado:    "Ver productos" + "Mi cuenta"
 */
export function HeroCTA() {
  const { isLoggedIn, loading, username } = useAuth();

  return (
    <div className="flex flex-wrap gap-md">
      <Link
        href="/products"
        className="px-2xl py-md bg-md-secondary-container text-white font-bold rounded-lg hover:brightness-110 active:scale-95 transition-all shadow-md text-button-text"
      >
        Ver productos
      </Link>

      {/* Solo mostrar si no está cargando y no está logueado */}
      {!loading && !isLoggedIn && (
        <Link
          href="/login"
          className="px-2xl py-md border-2 border-md-primary text-md-primary font-bold rounded-lg hover:bg-md-primary-fixed transition-all text-button-text"
        >
          Iniciar sesión
        </Link>
      )}

      {/* Si está logueado, mostrar acceso rápido a su cuenta */}
      {!loading && isLoggedIn && (
        <Link
          href={`/dashboard/${username}`}
          className="px-2xl py-md border-2 border-md-primary text-md-primary font-bold rounded-lg hover:bg-md-primary-fixed transition-all text-button-text flex items-center gap-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          Mi cuenta
        </Link>
      )}

      {/* Skeleton mientras carga el estado auth */}
      {loading && (
        <div className="px-2xl py-md rounded-lg bg-surface-container-high animate-pulse w-36 h-12" />
      )}
    </div>
  );
}
