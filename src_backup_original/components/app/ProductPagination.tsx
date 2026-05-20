import Link from "next/link";
import { cn } from "@/lib/utils";

type ProductPaginationProps = {
  page: number;
  totalPages: number;
  categoryId: string | null;
};

function queryFor(targetPage: number, categoryId: string | null) {
  const q = new URLSearchParams();
  q.set("page", String(targetPage));
  if (categoryId != null) q.set("category", categoryId);
  return `/products?${q.toString()}`;
}

export function ProductPagination({
  page,
  totalPages,
  categoryId,
}: ProductPaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const windowStart = Math.max(1, page - 2);
  const windowEnd = Math.min(totalPages, page + 2);
  const showPages = pages.filter((p) => p >= windowStart && p <= windowEnd);

  return (
    <nav
      className="mt-8 flex flex-wrap items-center justify-center gap-2"
      aria-label="Paginación de productos"
    >
      <Link
        href={queryFor(page - 1, categoryId)}
        className={cn(
          "rounded-md border px-3 py-1.5 text-sm hover:bg-muted",
          page <= 1 && "pointer-events-none opacity-40"
        )}
        aria-disabled={page <= 1}
      >
        Anterior
      </Link>

      {showPages.map((p) => (
        <Link
          key={p}
          href={queryFor(p, categoryId)}
          className={cn(
            "rounded-md border px-3 py-1.5 text-sm hover:bg-muted",
            p === page && "border-primary bg-primary/10 font-semibold"
          )}
        >
          {p}
        </Link>
      ))}

      <Link
        href={queryFor(page + 1, categoryId)}
        className={cn(
          "rounded-md border px-3 py-1.5 text-sm hover:bg-muted",
          page >= totalPages && "pointer-events-none opacity-40"
        )}
        aria-disabled={page >= totalPages}
      >
        Siguiente
      </Link>

      <span className="ml-2 text-sm text-muted-foreground">
        Página {page} de {totalPages}
      </span>
    </nav>
  );
}
