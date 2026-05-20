import Link from "next/link";
import type { CategoryRow } from "@/lib/db/db-types";
import { cn } from "@/lib/utils";

type CategoriesSidenavProps = {
  categories: CategoryRow[];
  selectedCategoryId: string | null;
};

export function CategoriesSidenav({
  categories,
  selectedCategoryId,
}: CategoriesSidenavProps) {
  return (
    <aside className="w-full shrink-0 md:w-56">
      <div className="rounded-lg border bg-card p-3 text-card-foreground shadow-sm">
        <h2 className="mb-3 border-b pb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Categorías
        </h2>
        <nav aria-label="Filtro por categoría">
          <ul className="space-y-1 text-sm">
            <li>
              <Link
                href="/products?page=1"
                className={cn(
                  "block rounded-md px-2 py-1.5 hover:bg-muted",
                  selectedCategoryId == null && "bg-muted font-medium"
                )}
              >
                Todas
              </Link>
            </li>
            {categories.map((c) => {
              const idStr = String(c.CategoryID);
              const active = selectedCategoryId === idStr;
              return (
                <li key={c.CategoryID}>
                  <Link
                    href={`/products?category=${c.CategoryID}&page=1`}
                    className={cn(
                      "block rounded-md px-2 py-1.5 hover:bg-muted",
                      active && "bg-muted font-medium text-primary"
                    )}
                  >
                    {c.CategoryName}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </aside>
  );
}
