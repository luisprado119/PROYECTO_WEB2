import Link from "next/link";
import { getFeaturedProducts } from "@/lib/db/actions/catalog-actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function Home() {
  const featured = await getFeaturedProducts(4);

  return (
    <div className="space-y-12">
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-6 py-14 text-white shadow-lg dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 sm:px-10 sm:py-16">
        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <p className="mb-2 text-sm font-medium uppercase tracking-widest text-slate-300">
            SuperShop
          </p>
          <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
            Tu tienda Northwind, lista para comprar
          </h1>
          <p className="mb-8 text-lg text-slate-300">
            Explora el catálogo, arma tu cesta y paga con Redsys en un entorno de pruebas seguro.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg" className="bg-white text-slate-900 hover:bg-slate-100">
              <Link href="/products">Ver productos</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/80 bg-transparent text-white shadow-none hover:bg-white/15 hover:text-white"
            >
              <Link href="/login">Iniciar sesión</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Destacados</h2>
            <p className="text-sm text-muted-foreground">
              Productos con buen stock (&gt; 50 unidades), ideal para probar el flujo de compra.
            </p>
          </div>
          <Button asChild variant="link" className="text-primary">
            <Link href="/products">Ir al catálogo completo →</Link>
          </Button>
        </div>

        {featured.length === 0 ? (
          <p className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
            No hay productos con stock suficiente para destacar.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((product) => (
              <Card key={product.ProductID} className="flex flex-col transition-shadow hover:shadow-md">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg leading-snug">
                    <Link href={`/product/${product.ProductID}`} className="hover:underline">
                      {product.ProductName}
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent className="mt-auto space-y-1 text-sm text-muted-foreground">
                  <p>
                    <span className="font-medium text-foreground">{Number(product.UnitPrice).toFixed(2)} €</span>
                  </p>
                  <p>En stock: {product.UnitsInStock}</p>
                  <Button asChild variant="secondary" size="sm" className="mt-3 w-full">
                    <Link href={`/product/${product.ProductID}`}>Ver detalle</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
