"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useCurrency } from "@/components/app/CurrencyContext";

type Category = {
  CategoryID: number;
  CategoryName: string;
};

type Props = {
  categories: Category[];
  selectedCategoryId: string | null;
};

function SidenavInner({ categories, selectedCategoryId }: Props) {
  const pathname = usePathname();
  const { currency } = useCurrency();

  return (
    <aside className="w-[260px] hidden md:flex flex-col border-r border-outline-variant bg-white p-gutter sticky top-[72px] h-[calc(100vh-72px)] overflow-y-auto">

      {/* Header filtros */}
      <div className="mb-lg">
        <h3 className="text-label-md font-bold text-on-surface mb-md flex items-center gap-2 uppercase tracking-wide">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
          </svg>
          Filtros
        </h3>

        {/* Categorías */}
        <p className="text-label-md font-bold text-on-surface-variant mb-sm uppercase tracking-wider text-[11px]">
          Categorías
        </p>
        <ul className="space-y-1">
          {/* Todas */}
          <li>
            <Link
              href="/products"
              className={`block w-full text-left px-3 py-2 rounded-lg text-body-md transition-colors ${
                selectedCategoryId === null
                  ? "text-md-primary font-bold bg-md-primary-fixed"
                  : "text-on-surface-variant hover:text-md-primary hover:bg-surface-container-low"
              }`}
            >
              Todas las categorías
            </Link>
          </li>
          {categories.map((cat) => {
            const isActive = selectedCategoryId === String(cat.CategoryID);
            return (
              <li key={cat.CategoryID}>
                <Link
                  href={`/products?category=${cat.CategoryID}`}
                  className={`block w-full text-left px-3 py-2 rounded-lg text-body-md transition-colors ${
                    isActive
                      ? "text-md-primary font-bold bg-md-primary-fixed"
                      : "text-on-surface-variant hover:text-md-primary hover:bg-surface-container-low"
                  }`}
                >
                  {cat.CategoryName}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Separador */}
      <div className="border-t border-outline-variant pt-md mb-lg">
        <p className="text-label-md font-bold text-on-surface-variant mb-sm uppercase tracking-wider text-[11px]">
          Precio
        </p>
        <div className="flex items-center gap-2 mb-sm">
          <div className="relative flex-1">
            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-on-surface-variant text-[12px]">
              {currency === "EUR" ? "€" : "$"}
            </span>
            <input className="w-full pl-5 pr-2 py-2 border border-outline-variant rounded-lg bg-surface-container-lowest text-label-md focus:ring-1 focus:ring-md-primary focus:outline-none text-on-surface" placeholder="Min" type="number" />
          </div>
          <span className="text-on-surface-variant">–</span>
          <div className="relative flex-1">
            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-on-surface-variant text-[12px]">
              {currency === "EUR" ? "€" : "$"}
            </span>
            <input className="w-full pl-5 pr-2 py-2 border border-outline-variant rounded-lg bg-surface-container-lowest text-label-md focus:ring-1 focus:ring-md-primary focus:outline-none text-on-surface" placeholder="Max" type="number" />
          </div>
        </div>
        <button className="w-full py-2 bg-surface-container-high text-on-surface-variant font-bold rounded-lg hover:bg-surface-variant transition-all text-label-md">
          Aplicar
        </button>
      </div>

      {/* Valoración decorativa */}
      <div className="border-t border-outline-variant pt-md">
        <p className="text-label-md font-bold text-on-surface-variant mb-sm uppercase tracking-wider text-[11px]">
          Valoración
        </p>
        {[5, 4, 3].map((stars) => (
          <button key={stars} className="flex items-center gap-2 hover:text-md-primary text-body-md text-on-surface-variant w-full py-1 transition-colors">
            <div className="flex">
              {[1,2,3,4,5].map((s) => (
                <svg key={s} className={`w-4 h-4 ${s <= stars ? "text-amber-400" : "text-outline-variant"}`} fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118L10 14.347l-3.95 2.878c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.065 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69L9.05 2.927z" />
                </svg>
              ))}
            </div>
            <span className="text-[12px]">y más</span>
          </button>
        ))}
      </div>
    </aside>
  );
}

export function CategoriesSidenav({ categories, selectedCategoryId }: Props) {
  return (
    <Suspense fallback={null}>
      <SidenavInner categories={categories} selectedCategoryId={selectedCategoryId} />
    </Suspense>
  );
}
