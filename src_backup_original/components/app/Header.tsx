"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/components/app/AuthContext";
import { getCestaItemCount } from "@/lib/db/actions/cesta-actions";
import { CART_UPDATED_EVENT } from "@/lib/cart-events";
import { ThemeToggle } from "@/components/app/ThemeToggle";

const Header = () => {
  const { isLoggedIn, loading, username, role, logout, idCesta } = useAuth();
  const [cestaCount, setCestaCount] = useState<number | null>(null);

  const refreshCestaCount = useCallback(async () => {
    if (idCesta <= 0) {
      setCestaCount(0);
      return;
    }
    try {
      const n = await getCestaItemCount(String(idCesta));
      setCestaCount(n);
    } catch {
      setCestaCount(0);
    }
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

  if (loading) {
    return (
      <header className="flex items-center justify-between border-b bg-card px-4 py-3 shadow-sm sm:px-6">
        <Skeleton className="h-8 w-24" />
        <div className="flex items-center gap-3">
          <Skeleton className="h-9 w-9 rounded-md" />
          <Skeleton className="h-9 w-20" />
          <Skeleton className="h-9 w-20" />
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 flex flex-wrap items-center justify-between gap-3 border-b bg-card/95 px-4 py-3 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-card/80 sm:px-6">
      <div className="flex items-center gap-2">
        <Link href="/" className="text-xl font-bold tracking-tight text-foreground hover:opacity-90">
          SuperShop
        </Link>
      </div>
      <nav>
        <div className="flex flex-wrap items-center gap-1 sm:gap-2">
          <ThemeToggle />
          <Button asChild variant="ghost" size="sm" className="relative">
            <Link href={`/cesta/${idCesta}`}>
              <span className="inline-flex items-center gap-2">
                Cesta
                {cestaCount != null && cestaCount > 0 && (
                  <Badge variant="secondary" className="h-5 min-w-[1.25rem] justify-center px-1.5 text-xs tabular-nums">
                    {cestaCount > 99 ? "99+" : cestaCount}
                  </Badge>
                )}
              </span>
            </Link>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link href="/products">Productos</Link>
          </Button>

          {isLoggedIn ? (
            <>
              {role === "admin" && (
                <Button asChild variant="ghost" size="sm">
                  <Link href="/admin">Comercio</Link>
                </Button>
              )}
              <span className="hidden text-sm font-medium sm:inline">
                <Link href={`/dashboard/${username}`} className="hover:underline">
                  {username}
                </Link>
              </span>
              <Button onClick={() => logout()} variant="outline" size="sm">
                Salir
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link href="/signup">Registro</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/login">Entrar</Link>
              </Button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
