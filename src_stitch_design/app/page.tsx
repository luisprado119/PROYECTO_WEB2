import Link from "next/link";
import { getFeaturedProducts } from "@/lib/db/actions/catalog-actions";
import { HeroCTA } from "@/components/app/HeroCTA";
import ProductPrice from "@/components/app/ProductPrice";

export const dynamic = "force-dynamic";

// Gradientes de placeholder por índice de producto
const GRADIENTS = [
  "from-blue-100 to-indigo-200",
  "from-amber-100 to-orange-200",
  "from-emerald-100 to-teal-200",
  "from-purple-100 to-violet-200",
];

export default async function Home() {
  const featured = await getFeaturedProducts(4);

  return (
    <div className="min-h-screen bg-md-background text-on-surface">

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section style={{ background: "linear-gradient(135deg, #ffffff 0%, #f2f3ff 100%)" }}
        className="overflow-hidden">
        <div className="max-w-container-max mx-auto px-gutter py-2xl grid md:grid-cols-2 items-center gap-xl">
          {/* Texto */}
          <div className="order-2 md:order-1">
            <span className="inline-block px-md py-xs text-label-md font-bold rounded-full mb-md"
              style={{ background: "#fff0e8", color: "#a73a00" }}>
              CATÁLOGO NORTHWIND 2026
            </span>
            <h1 className="text-display-lg text-on-surface mb-md">
              Tu tienda Northwind, lista para comprar.
            </h1>
            <p className="text-body-lg text-on-surface-variant mb-xl max-w-lg">
              Explora el catálogo, arma tu cesta y paga con Redsys en un entorno de pruebas seguro.
            </p>
            <HeroCTA />
          </div>

          {/* Imagen decorativa */}
          <div className="order-1 md:order-2 relative">
            <div className="w-full aspect-square bg-gradient-to-br from-indigo-100 to-blue-200 rounded-3xl overflow-hidden shadow-xl border border-outline-variant transform md:rotate-3 flex items-center justify-center">
              <div className="text-center p-8">
                <div className="text-7xl mb-4">🛍️</div>
                <p className="text-headline-md font-bold text-md-primary">KimiShop</p>
                <p className="text-body-md text-on-surface-variant mt-2">77 productos disponibles</p>
              </div>
            </div>
            <div className="absolute -bottom-xl -left-xl w-32 h-32 bg-md-primary-fixed rounded-full mix-blend-multiply filter blur-3xl opacity-30" />
          </div>
        </div>
      </section>

      {/* ── Barra de beneficios ───────────────────────────────────────── */}
      <section className="bg-surface-container-lowest border-y border-outline-variant py-xl">
        <div className="max-w-container-max mx-auto px-gutter flex flex-wrap justify-center md:justify-between gap-xl">
          {[
            { icon: "🚚", title: "Envío gratis 2026", sub: "En pedidos superiores a 50€" },
            { icon: "↩️", title: "Devoluciones 30 días", sub: "Sin preguntas ni demoras" },
            { icon: "🔒", title: "Pago Seguro Redsys", sub: "Certificación SSL avanzada" },
            { icon: "⭐", title: "Calidad garantizada", sub: "Productos certificados" },
          ].map((b) => (
            <div key={b.title} className="flex items-center gap-md">
              <div className="w-12 h-12 rounded-full bg-md-primary-fixed flex items-center justify-center text-2xl">
                {b.icon}
              </div>
              <div>
                <p className="text-label-md font-bold text-on-surface">{b.title}</p>
                <p className="text-body-md text-on-surface-variant">{b.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Productos destacados ──────────────────────────────────────── */}
      <section className="py-2xl bg-surface-container-low">
        <div className="max-w-container-max mx-auto px-gutter">
          <div className="flex justify-between items-end mb-xl">
            <div>
              <h2 className="text-headline-lg text-on-surface">Recomendados para ti</h2>
              <p className="text-body-md text-on-surface-variant mt-1">
                Productos con buen stock, ideal para probar el flujo de compra.
              </p>
            </div>
            <Link href="/products" className="text-md-primary font-bold hover:underline text-label-md">
              Ver todos →
            </Link>
          </div>

          {featured.length === 0 ? (
            <p className="rounded-lg border border-dashed border-outline-variant p-8 text-center text-on-surface-variant">
              No hay productos con stock suficiente para destacar.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-xl">
              {featured.map((product, i) => (
                <div
                  key={product.ProductID}
                  className="group bg-white border border-outline-variant rounded-lg overflow-hidden transition-all duration-300 hover:shadow-[0_4px_12px_rgba(0,0,0,0.10)] hover:-translate-y-1"
                >
                  {/* Imagen placeholder con gradiente */}
                  <div className={`aspect-square bg-gradient-to-br ${GRADIENTS[i % GRADIENTS.length]} relative overflow-hidden flex items-center justify-center p-md`}>
                    <span className="text-6xl select-none">🛒</span>
                    {Number(product.UnitsInStock) > 80 && (
                      <span className="absolute top-3 left-3 bg-md-secondary-container text-white px-2 py-1 text-[10px] font-bold rounded uppercase">
                        Top Stock
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-md flex flex-col border-t border-outline-variant">
                    <h3 className="text-body-md font-bold text-on-surface line-clamp-2 min-h-[3rem] mb-sm group-hover:text-md-primary transition-colors">
                      <Link href={`/product/${product.ProductID}`}>
                        {product.ProductName}
                      </Link>
                    </h3>

                    {/* Estrellas decorativas */}
                    <div className="flex items-center gap-1 mb-md">
                      {[1,2,3,4,5].map((s) => (
                        <svg key={s} className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118L10 14.347l-3.95 2.878c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.065 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69L9.05 2.927z" />
                        </svg>
                      ))}
                      <span className="text-label-md text-md-primary ml-1">(nuevo)</span>
                    </div>

                    <div className="mt-auto">
                      <div className="flex items-baseline gap-2 mb-md">
                        <span className="text-price-lg font-bold text-on-surface">
                          <ProductPrice eurAmount={product.UnitPrice} />
                        </span>
                        <span className="text-label-md text-on-surface-variant">
                          Stock: {product.UnitsInStock}
                        </span>
                      </div>
                      <Link
                        href={`/product/${product.ProductID}`}
                        className="w-full py-3 bg-md-primary-container text-md-on-primary-container rounded-lg font-bold flex items-center justify-center gap-2 hover:brightness-95 active:scale-95 transition-all text-label-md"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m5-9v9m4-9v9m4-9l2 9" />
                        </svg>
                        Ver detalle
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────── */}
      <footer className="bg-surface-container-low border-t border-outline-variant">
        <div className="flex flex-col md:flex-row justify-between items-center w-full px-gutter py-xl max-w-container-max mx-auto gap-xl">
          <div>
            <span className="text-headline-md font-bold text-on-surface">KimiShop</span>
            <p className="text-body-md text-on-surface-variant mt-1">Tu marketplace Northwind de confianza.</p>
          </div>
          <div className="flex gap-lg flex-wrap justify-center">
            {["Política de privacidad", "Términos", "Contacto", "Sobre nosotros"].map((l) => (
              <span key={l} className="text-label-md text-on-surface-variant hover:text-md-primary cursor-pointer transition-colors">{l}</span>
            ))}
          </div>
          <p className="text-body-md text-on-surface-variant opacity-80">© 2026 KimiShop. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
