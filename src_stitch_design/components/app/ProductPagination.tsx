"use client";

import Link from "next/link";

type Props = {
  page: number;
  totalPages: number;
  categoryId: string | null;
};

export function ProductPagination({ page, totalPages, categoryId }: Props) {
  if (totalPages <= 1) return null;

  const categoryParam = categoryId ? `&category=${categoryId}` : "";

  const getPages = () => {
    const pages: (number | "...")[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (page > 3) pages.push("...");
      for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i);
      if (page < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="flex justify-center items-center gap-2 py-xl border-t border-outline-variant">
      {/* Anterior */}
      {page > 1 ? (
        <Link
          href={`/products?page=${page - 1}${categoryParam}`}
          className="w-10 h-10 flex items-center justify-center border border-outline-variant rounded-lg hover:bg-surface-container transition-all text-on-surface-variant"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
      ) : (
        <span className="w-10 h-10 flex items-center justify-center border border-outline-variant rounded-lg opacity-30 cursor-not-allowed text-on-surface-variant">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </span>
      )}

      {/* Páginas */}
      {getPages().map((p, i) =>
        p === "..." ? (
          <span key={`dots-${i}`} className="px-2 text-on-surface-variant">…</span>
        ) : (
          <Link
            key={p}
            href={`/products?page=${p}${categoryParam}`}
            className={`w-10 h-10 flex items-center justify-center border rounded-lg font-bold transition-all text-label-md ${
              p === page
                ? "border-md-primary bg-md-primary-container text-md-on-primary-container"
                : "border-outline-variant text-on-surface hover:bg-surface-container"
            }`}
          >
            {p}
          </Link>
        )
      )}

      {/* Siguiente */}
      {page < totalPages ? (
        <Link
          href={`/products?page=${page + 1}${categoryParam}`}
          className="w-10 h-10 flex items-center justify-center border border-outline-variant rounded-lg hover:bg-surface-container transition-all text-on-surface-variant"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      ) : (
        <span className="w-10 h-10 flex items-center justify-center border border-outline-variant rounded-lg opacity-30 cursor-not-allowed text-on-surface-variant">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </span>
      )}

      <span className="ml-4 text-label-md text-on-surface-variant">
        Página {page} de {totalPages}
      </span>
    </div>
  );
}
