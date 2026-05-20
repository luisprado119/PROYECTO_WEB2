"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ProtectedAdminRoute from "@/components/app/ProtectedAdminRoute";

const nav = [
  { href: "/admin/clientes", label: "Clientes" },
  { href: "/admin/pedidos", label: "Pedidos" },
  { href: "/admin/analitica/tiempo", label: "Analítica — tiempo" },
  { href: "/admin/analitica/categoria", label: "Analítica — categoría" },
  { href: "/admin/log", label: "Log de actividad" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <ProtectedAdminRoute>
      <div className="flex min-h-screen bg-slate-50">
        <aside className="flex w-56 shrink-0 flex-col border-r border-slate-200 bg-slate-900 text-slate-100">
          <div className="border-b border-slate-800 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Gestión comercio</p>
          </div>
          <nav className="flex flex-col gap-0.5 p-2">
            {nav.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-md px-3 py-2 text-sm transition-colors hover:bg-slate-800 ${
                    active ? "bg-slate-800 font-medium text-white" : "text-slate-300"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </ProtectedAdminRoute>
  );
}
