import Link from "next/link";
import {
  getCategories,
  getProductsPaginated,
} from "@/lib/db/actions/catalog-actions";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CategoriesSidenav } from "@/components/app/CategoriesSidenav";
import { ProductPagination } from "@/components/app/ProductPagination";

const PAGE_SIZE = 10;

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Record<string, string | string[] | undefined>;
};

export default async function ProductsPage({ searchParams }: Props) {
  const categoryRaw = searchParams.category;
  const categoryParam =
    typeof categoryRaw === "string" ? categoryRaw : undefined;
  const pageRaw = searchParams.page;
  const pageStr = typeof pageRaw === "string" ? pageRaw : "1";
  const parsedPage = parseInt(pageStr, 10);
  const page = Number.isFinite(parsedPage) ? Math.max(1, parsedPage) : 1;

  const categoryIdNum =
    categoryParam != null && categoryParam !== ""
      ? parseInt(categoryParam, 10)
      : NaN;
  const categoryFilter =
    categoryParam != null &&
    categoryParam !== "" &&
    Number.isFinite(categoryIdNum)
      ? categoryIdNum
      : null;

  const [categories, pack] = await Promise.all([
    getCategories(),
    getProductsPaginated(categoryFilter, page, PAGE_SIZE),
  ]);

  const { products, total, page: effectivePage, totalPages } = pack;

  const selectedCategoryId =
    categoryFilter != null ? String(categoryFilter) : null;

  return (
    <div className="flex flex-col gap-6 md:flex-row md:items-start">
      <CategoriesSidenav
        categories={categories}
        selectedCategoryId={selectedCategoryId}
      />

      <div className="min-w-0 flex-1">
        <h1 className="mb-6 text-center text-3xl font-bold">Catálogo</h1>
        <p className="mb-4 text-center text-sm text-muted-foreground">
          Mostrando {products.length} de {total} producto{total !== 1 ? "s" : ""}{" "}
          (10 por página)
        </p>

        {products.length === 0 ? (
          <p className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
            No hay productos en esta categoría.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <Card key={product.ProductID}>
                <CardHeader>
                  <CardTitle>
                    <Link
                      href={`/product/${product.ProductID}`}
                      className="hover:underline"
                    >
                      {product.ProductName}
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-1 text-sm">
                  <p>Id: {product.ProductID}</p>
                  <p>Precio: {Number(product.UnitPrice).toFixed(2)} €</p>
                  <p>Stock: {product.UnitsInStock}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <ProductPagination
          page={effectivePage}
          totalPages={totalPages}
          categoryId={selectedCategoryId}
        />
      </div>
    </div>
  );
}
