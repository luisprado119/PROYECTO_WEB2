import Link from "next/link";
import {
  getCategories,
  getProductsPaginated,
} from "@/lib/db/actions/catalog-actions";
import { CategoriesSidenav } from "@/components/app/CategoriesSidenav";
import { ProductPagination } from "@/components/app/ProductPagination";
import { QuickAddToCart } from "@/components/app/QuickAddToCart";
import ProductPrice from "@/components/app/ProductPrice";

const PAGE_SIZE = 10;
export const dynamic = "force-dynamic";

const GRADIENTS = [
  "from-blue-50 to-indigo-100",
  "from-amber-50 to-orange-100",
  "from-emerald-50 to-teal-100",
  "from-purple-50 to-violet-100",
  "from-pink-50 to-rose-100",
  "from-cyan-50 to-sky-100",
  "from-lime-50 to-green-100",
  "from-yellow-50 to-amber-100",
];

const EMOJIS = ["🥃", "🫙", "🧂", "🧀", "🌾", "🍖", "🥬", "🐟"];

type Props = {
  searchParams: Record<string, string | string[] | undefined>;
};

export default async function ProductsPage({ searchParams }: Props) {
  const categoryRaw = searchParams.category;
  const categoryParam = typeof categoryRaw === "string" ? categoryRaw : undefined;
  const pageRaw = searchParams.page;
  const pageStr = typeof pageRaw === "string" ? pageRaw : "1";
  const parsedPage = parseInt(pageStr, 10);
  const page = Number.isFinite(parsedPage) ? Math.max(1, parsedPage) : 1;

  const categoryIdNum =
    categoryParam != null && categoryParam !== ""
      ? parseInt(categoryParam, 10)
      : NaN;
  const categoryFilter =
    categoryParam != null && categoryParam !== "" && Number.isFinite(categoryIdNum)
      ? categoryIdNum
      : null;

  const [categories, pack] = await Promise.all([
    getCategories(),
    getProductsPaginated(categoryFilter, page, PAGE_SIZE),
  ]);

  const { products, total, page: effectivePage, totalPages } = pack;
  const selectedCategoryId = categoryFilter != null ? String(categoryFilter) : null;

  return (
    <div className="bg-md-background min-h-screen">
      <div className="max-w-container-max mx-auto flex min-h-screen">

        {/* ── Sidebar ─────────────────────────────────────────────────── */}
        <CategoriesSidenav
          categories={categories}
          selectedCategoryId={selectedCategoryId}
        />

        {/* ── Main content ────────────────────────────────────────────── */}
        <main className="flex-1 bg-white p-gutter min-w-0">

          {/* Header del catálogo */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-lg gap-4">
            <div>
              <h1 className="text-headline-md font-bold text-on-surface">
                {categoryFilter
                  ? categories.find(c => c.CategoryID === categoryFilter)?.CategoryName ?? "Catálogo"
                  : "Todos los productos"}
              </h1>
              <p className="text-body-md text-on-surface-variant mt-1">
                Mostrando {products.length} de {total} producto{total !== 1 ? "s" : ""} (10 por página)
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-label-md font-bold text-on-surface-variant">Ordenar por:</span>
              <select className="border border-outline-variant rounded-lg bg-surface-container-lowest px-4 py-2 text-label-md text-on-surface focus:ring-2 focus:ring-md-primary outline-none">
                <option>Recomendados</option>
                <option>Precio: menor a mayor</option>
                <option>Precio: mayor a menor</option>
              </select>
            </div>
          </div>

          {/* Grid de productos */}
          {products.length === 0 ? (
            <div className="rounded-lg border border-dashed border-outline-variant p-12 text-center">
              <p className="text-on-surface-variant text-body-md">No hay productos en esta categoría.</p>
              <Link href="/products" className="text-md-primary font-bold hover:underline mt-2 inline-block text-label-md">
                Ver todos los productos →
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-gutter mb-2xl">
              {products.map((product, i) => (
                <div
                  key={product.ProductID}
                  className="group bg-white border border-outline-variant rounded-lg overflow-hidden transition-all duration-300 hover:shadow-[0_4px_12px_rgba(0,0,0,0.10)] hover:-translate-y-1 flex flex-col"
                >
                  {/* Imagen placeholder */}
                  <div className={`aspect-square bg-gradient-to-br ${GRADIENTS[i % GRADIENTS.length]} relative overflow-hidden flex items-center justify-center p-md`}>
                    <span className="text-5xl select-none">{EMOJIS[i % EMOJIS.length]}</span>
                    {Number(product.UnitsInStock) > 80 && (
                      <span className="absolute top-3 left-3 bg-md-secondary-container text-white px-2 py-1 text-[10px] font-bold rounded uppercase">
                        Top Stock
                      </span>
                    )}
                    {Number(product.UnitsInStock) === 0 && (
                      <span className="absolute top-3 right-3 bg-md-error text-md-on-error px-2 py-1 text-[10px] font-bold rounded uppercase">
                        Agotado
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-md flex flex-col flex-1 border-t border-outline-variant">
                    <h2 className="text-body-md font-bold text-on-surface line-clamp-2 min-h-[3rem] mb-sm group-hover:text-md-primary transition-colors">
                      <Link href={`/product/${product.ProductID}`}>
                        {product.ProductName}
                      </Link>
                    </h2>

                    {/* Estrellas decorativas */}
                    <div className="flex items-center gap-1 mb-md">
                      {[1,2,3,4,5].map((s) => (
                        <svg key={s} className="w-3.5 h-3.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118L10 14.347l-3.95 2.878c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.065 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69L9.05 2.927z" />
                        </svg>
                      ))}
                      <span className="text-label-md text-md-primary ml-1">({product.ProductID * 7 % 900 + 100})</span>
                    </div>

                      {/* Precio */}
                      <div className="flex items-baseline gap-2 mb-md mt-auto">
                        <span className="text-price-lg font-bold text-on-surface">
                          <ProductPrice eurAmount={product.UnitPrice} />
                        </span>
                        {Number(product.UnitsInStock) > 0 ? (
                          <span className="text-[12px] text-emerald-600 font-medium">En stock</span>
                        ) : (
                          <span className="text-[12px] text-red-500 font-medium">Agotado</span>
                        )}
                      </div>

                      {/* 2 botones: Ver detalle + Añadir al carrito */}

                      <div className="grid grid-cols-2 gap-sm">
                        <Link
                          href={`/product/${product.ProductID}`}
                          className="py-3 border border-outline-variant text-on-surface rounded-lg font-bold flex items-center justify-center gap-1 hover:bg-surface-container-low active:scale-95 transition-all text-label-md"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          Detalle
                        </Link>
                        <QuickAddToCart
                          productId={product.ProductID}
                          productName={product.ProductName}
                          inStock={Number(product.UnitsInStock) > 0}
                        />
                      </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Paginación */}
          <ProductPagination
            page={effectivePage}
            totalPages={totalPages}
            categoryId={selectedCategoryId}
          />
        </main>
      </div>
    </div>
  );
}
