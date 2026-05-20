"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/components/app/AuthContext";
import { getCestaItemCount } from "@/lib/db/actions/cesta-actions";
import { CART_UPDATED_EVENT } from "@/lib/cart-events";
import { useCurrency } from "@/components/app/CurrencyContext";

const Header = () => {
  const { isLoggedIn, loading, username, role, logout, idCesta } = useAuth();
  const { currency, toggleCurrency } = useCurrency();
  const [cestaCount, setCestaCount] = useState<number | null>(null);

  const refreshCestaCount = useCallback(async () => {
    if (idCesta <= 0) { setCestaCount(0); return; }
    try {
      const n = await getCestaItemCount(String(idCesta));
      setCestaCount(n);
    } catch { setCestaCount(0); }
  }, [idCesta]);

  useEffect(() => {
    if (loading) return;
    void refreshCestaCount();
  }, [loading, refreshCestaCount]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handler = () => void refreshCestaCount();
    window.addEventListener(CART_UPDATED_EVENT, handler);
    return () => window.removeEventListener(CART_UPDATED_EVENT, handler);
  }, [refreshCestaCount]);

  return (
    <header className="bg-surface-container-lowest border-b border-outline-variant sticky top-0 z-50 shadow-sm">
      <div className="flex justify-between items-center w-full px-4 max-w-container-max mx-auto h-[72px]">

        {/* Logo */}
        <div className="flex items-center gap-8">
          <Link href="/" className="text-headline-md font-bold text-md-primary hover:opacity-90 transition-opacity">
            KimiShop
          </Link>
          <nav className="hidden lg:flex items-center gap-6">
            <Link href="/products" className="text-label-md font-label-md text-on-surface-variant hover:text-md-primary transition-colors">
              Catálogo
            </Link>
            <Link href="/changelog" className="text-label-md font-label-md text-on-surface-variant hover:text-md-primary transition-colors flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Cambios
            </Link>
            {isLoggedIn && role === "admin" && (
              <Link href="/admin" className="text-label-md font-label-md text-on-surface-variant hover:text-md-primary transition-colors">
                Comercio
              </Link>
            )}
          </nav>
        </div>

        {/* Search bar central */}
        <div className="hidden md:flex flex-1 max-w-[46%] mx-8 relative">
          <input
            className="w-full h-12 pl-4 pr-28 rounded-l-lg border border-outline-variant bg-white focus:ring-2 focus:ring-md-primary focus:outline-none transition-all text-body-md text-on-surface placeholder:text-on-surface-variant"
            placeholder="Buscar productos Northwind..."
            type="text"
            readOnly
            onClick={() => window.location.href = '/products'}
          />
          <Link
            href="/products"
            className="absolute right-0 top-0 h-12 px-5 bg-md-primary-container text-md-on-primary-container rounded-r-lg font-bold text-label-md hover:brightness-110 transition-all flex items-center gap-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
            Buscar
          </Link>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {/* Currency Switcher */}
          <button
            onClick={toggleCurrency}
            className="flex items-center gap-1.5 px-3 py-2 text-on-surface-variant hover:bg-surface-container-low rounded-lg transition-all text-label-md font-bold border border-outline-variant/60 mr-1 active:scale-95 duration-200 cursor-pointer"
            title="Cambiar moneda de la tienda"
          >
            <span className="text-[14px]">{currency === "EUR" ? "🇪🇸 €" : "🇺🇸 $"}</span>
            <span className="text-[12px] opacity-80">{currency}</span>
          </button>

          {/* Cart */}
          <Link
            href={`/cesta/${idCesta}`}
            className="relative flex items-center gap-2 px-3 py-2 text-on-surface-variant hover:bg-surface-container-low rounded-lg transition-all text-label-md"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m5-9v9m4-9v9m4-9l2 9" />
            </svg>
            <span className="hidden sm:inline">Cesta</span>
            {cestaCount != null && cestaCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-md-secondary-container text-white text-[10px] font-bold rounded-full h-5 min-w-[1.25rem] flex items-center justify-center px-1">
                {cestaCount > 99 ? "99+" : cestaCount}
              </span>
            )}
          </Link>

          {loading ? (
            <div className="h-9 w-24 bg-surface-container-high animate-pulse rounded-lg" />
          ) : isLoggedIn ? (
            <>
              <Link
                href={`/dashboard/${username}`}
                className="flex items-center gap-2 px-3 py-2 text-on-surface-variant hover:bg-surface-container-low rounded-lg transition-all text-label-md"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0zM12 14a7 7 0 0 0-7 7h14a7 7 0 0 0-7-7z" />
                </svg>
                <span className="hidden sm:inline">{username}</span>
              </Link>
              <button
                onClick={() => logout()}
                className="px-4 py-2 border border-outline-variant rounded-lg text-label-md text-on-surface-variant hover:bg-surface-container-low transition-all"
              >
                Salir
              </button>
            </>
          ) : (
            <>
              <Link
                href="/signup"
                className="px-4 py-2 text-label-md text-on-surface-variant hover:bg-surface-container-low rounded-lg transition-all"
              >
                Registro
              </Link>
              <Link
                href="/login"
                className="px-4 py-2 bg-md-primary text-white rounded-lg text-label-md font-bold hover:brightness-110 active:scale-95 transition-all"
              >
                Entrar
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
