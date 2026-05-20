"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ProtectedRoute from "@/components/app/ProtectedRoute";

export default function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { customerId: string };
}) {
  const pathname = usePathname();

  const navItems = [
    {
      name: "Mis Pedidos",
      href: `/dashboard/${params.customerId}/orders`,
      isActive: pathname.includes("/orders"),
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      ),
    },
    {
      name: "Mi Perfil",
      href: `/dashboard/${params.customerId}/profile`,
      isActive: pathname.includes("/profile"),
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
    {
      name: "Seguridad",
      href: `/dashboard/${params.customerId}/change-password`,
      isActive: pathname.includes("/change-password"),
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
    },
  ];

  return (
    <ProtectedRoute>
      <div className="bg-surface-container-low min-h-screen">
        <div className="max-w-container-max mx-auto px-gutter py-xl">
          {/* Header del Dashboard */}
          <div className="mb-lg">
            <span className="text-label-md font-bold uppercase tracking-wider text-md-primary">Área de Clientes</span>
            <h1 className="text-headline-lg font-bold text-on-surface mt-1">Mi Cuenta</h1>
            <p className="text-body-md text-on-surface-variant">
              Gestiona tus compras, edita tus datos de envío y actualiza tus credenciales.
            </p>
          </div>

          <div className="grid md:grid-cols-[240px_1fr] gap-lg items-start">
            {/* Navegación lateral estilo Stitch Navigation Drawer/Tabs */}
            <aside className="bg-white border border-outline-variant rounded-xl p-md shadow-sm space-y-xs">
              <nav className="flex flex-row md:flex-col overflow-x-auto md:overflow-visible gap-sm">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex-1 md:flex-initial flex items-center justify-center md:justify-start gap-md px-md py-sm rounded-lg text-label-md font-bold transition-all whitespace-nowrap active:scale-95 ${
                      item.isActive
                        ? "bg-md-primary text-white shadow-sm"
                        : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
                    }`}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </Link>
                ))}
              </nav>
            </aside>

            {/* Contenido principal */}
            <main className="bg-white border border-outline-variant rounded-xl p-lg shadow-sm min-h-[400px]">
              {children}
            </main>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
