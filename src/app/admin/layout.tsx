"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ProtectedAdminRoute from "@/components/app/ProtectedAdminRoute";

const nav = [
  {
    href: "/admin/clientes",
    label: "Clientes",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    href: "/admin/pedidos",
    label: "Pedidos",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
  },
  {
    href: "/admin/analitica/tiempo",
    label: "Analítica — Tiempo",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    href: "/admin/analitica/categoria",
    label: "Analítica — Categoría",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
      </svg>
    ),
  },
  {
    href: "/admin/log",
    label: "Log de actividad",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <ProtectedAdminRoute>
      <div className="flex min-h-screen" style={{ background: "#f1f5f9" }}>

        {/* ── Sidebar estilo Stitch Admin ───────────────────────────── */}
        <aside className="flex w-[260px] shrink-0 flex-col sticky top-0 h-screen overflow-y-auto" style={{ background: "#1e293b" }}>

          {/* Cabecera sidebar */}
          <div className="p-lg border-b border-slate-700">
            <Link href="/" className="text-headline-md font-bold text-white hover:opacity-80 transition-opacity block">
              KimiShop
            </Link>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mt-1">
              Panel de gestión
            </p>
          </div>

          {/* Navegación */}
          <nav className="flex flex-col gap-1 p-md flex-1">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 px-sm mb-sm mt-sm">
              Comercio
            </p>
            {nav.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-sm px-sm py-sm rounded-lg text-label-md transition-all ${
                    active
                      ? "bg-md-primary text-white font-bold shadow-sm"
                      : "text-slate-300 hover:bg-slate-700 hover:text-white"
                  }`}
                >
                  <span className={active ? "text-white" : "text-slate-400"}>
                    {item.icon}
                  </span>
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Footer sidebar */}
          <div className="p-md border-t border-slate-700">
            <Link
              href="/"
              className="flex items-center gap-sm text-label-md text-slate-400 hover:text-white transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Volver a la tienda
            </Link>
          </div>
        </aside>

        {/* ── Contenido principal ───────────────────────────────────── */}
        <main className="flex-1 overflow-auto p-xl">
          {children}
        </main>
      </div>
    </ProtectedAdminRoute>
  );
}
