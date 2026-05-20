import Link from "next/link";

/* ──────────────────────────────────────────────────────────
   Tipos locales
────────────────────────────────────────────────────────── */
type StatusBadge = "CUMPLIDO" | "NUEVO" | "MEJORADO";

interface Req {
  text: string;
  status: StatusBadge;
  detail?: string;
}

interface Section {
  level: string;
  levelColor: string;
  title: string;
  icon: string;
  items: Req[];
}

/* ──────────────────────────────────────────────────────────
   Datos
────────────────────────────────────────────────────────── */
const BADGE_STYLES: Record<StatusBadge, string> = {
  CUMPLIDO: "bg-emerald-100 text-emerald-700 border border-emerald-200",
  NUEVO:    "bg-blue-100   text-blue-700   border border-blue-200",
  MEJORADO: "bg-amber-100  text-amber-700  border border-amber-200",
};

const sections: Section[] = [
  {
    level: "Nivel 1",
    levelColor: "bg-violet-100 text-violet-700",
    title: "Autenticación, Catálogo, Carrito y Pagos",
    icon: "🛒",
    items: [
      { text: "Registro (SignUp) que da de alta Customers en la BD", status: "CUMPLIDO", detail: "src/app/signup/page.tsx + auth-actions.ts" },
      { text: "Login con JWT almacenado en localStorage", status: "CUMPLIDO", detail: "AuthContext.tsx — token decodificado con jsonwebtoken" },
      { text: "Validación del token en el servidor en cada petición", status: "CUMPLIDO", detail: "serverUtils.ts — verifyToken() en cada server action" },
      { text: "Hash de contraseña (SHA-256) antes de enviar al servidor", status: "CUMPLIDO", detail: "utils.ts — hashPassword() + test unitario" },
      { text: "Cambio de contraseña para usuarios autenticados", status: "CUMPLIDO", detail: "dashboard/[customerId]/change-password/page.tsx" },
      { text: "Redirección al dashboard tras login exitoso", status: "CUMPLIDO", detail: "login/page.tsx — router.push tras JWT válido" },
      { text: "Protección de rutas: redirigir si no autenticado", status: "CUMPLIDO", detail: "ProtectedRoute.tsx + ProtectedAdminRoute.tsx" },
      { text: "Edición del perfil del cliente autenticado", status: "CUMPLIDO", detail: "dashboard/[customerId]/profile/edit/page.tsx" },
      { text: "Listado de productos disponibles", status: "MEJORADO", detail: "Paginación + sidenav de categorías + búsqueda" },
      { text: "Página de producto individual con selector de cantidad", status: "CUMPLIDO", detail: "product/[productId]/page.tsx + Cantidad.tsx" },
      { text: "Carrito persistente para usuarios no autenticados", status: "CUMPLIDO", detail: "cesta UUID en cookie / localStorage" },
      { text: "Asociar carrito al usuario tras autenticación", status: "CUMPLIDO", detail: "CestaRepository.ts — linkCestaToUser()" },
      { text: "Modificar cantidades / eliminar producto con cantidad 0", status: "CUMPLIDO", detail: "cesta-actions.ts + cesta/[idCesta]/page.tsx" },
      { text: "Confirmación del pedido → registrar en Orders + OrderDetails", status: "CUMPLIDO", detail: "order-actions.ts — createOrderFromCesta()" },
      { text: "Visualización del pedido para usuario autenticado", status: "CUMPLIDO", detail: "dashboard/[customerId]/orders/[orderId]/page.tsx" },
      { text: "Integración pasarela Redsys (entorno pruebas)", status: "MEJORADO", detail: "src/lib/redsys/ refactorizado + route API src/app/redsys/route.ts" },
      { text: "Registro en tabla cobro tras pago exitoso", status: "CUMPLIDO", detail: "CobroRepository.ts + payment-actions.ts" },
      { text: "Reintentos si el pago falla o es cancelado", status: "CUMPLIDO", detail: "ko/page.tsx — botón 'Intentar de nuevo'" },
      { text: "Variables de entorno en .env excluidas del repositorio", status: "CUMPLIDO", detail: ".env.local incluido en .gitignore" },
    ],
  },
  {
    level: "Nivel 2",
    levelColor: "bg-orange-100 text-orange-700",
    title: "Mejoras del cliente + Panel de comercio",
    icon: "📊",
    items: [
      { text: "Sidenav con categorías en /products", status: "NUEVO", detail: "CategoriesSidenav.tsx — filtrado por query param ?category=N" },
      { text: "Paginación de productos de 10 en 10", status: "NUEVO", detail: "ProductPagination.tsx — ellipsis inteligente" },
      { text: "Panel admin — Ver lista de clientes", status: "NUEVO", detail: "admin/clientes/page.tsx — tabla con búsqueda en tiempo real" },
      { text: "Panel admin — Ver últimas compras", status: "NUEVO", detail: "admin/pedidos/page.tsx — KPIs: total, enviados, importe" },
      { text: "Panel admin — Compras por cliente", status: "NUEVO", detail: "admin/clientes/[customerId]/page.tsx" },
      { text: "Panel admin — Cambiar estado a 'enviado'", status: "NUEVO", detail: "admin/pedidos/[orderId]/page.tsx — markOrderShipped()" },
      { text: "Panel admin — Analítica ventas por tiempo (día/mes/trimestre/semestre/año)", status: "NUEVO", detail: "admin/analitica/tiempo/page.tsx + SalesLineChart (Recharts)" },
      { text: "Panel admin — Analítica ventas por categoría y tiempo", status: "NUEVO", detail: "admin/analitica/categoria/page.tsx + SalesByCategoryChart" },
      { text: "Panel admin — Log de actividad del usuario", status: "NUEVO", detail: "admin/log/page.tsx — ActivityLogRepository persiste login/logout/signup/purchase/view/add_cart" },
    ],
  },
  {
    level: "Nivel 3",
    levelColor: "bg-teal-100 text-teal-700",
    title: "Refactoring y Tests",
    icon: "🧪",
    items: [
      { text: "Clases de dominio orientadas a objetos: Product, Order, OrderDetailLine", status: "NUEVO", detail: "src/domain/ — métodos getTotal(), isShipped(), isInStock(), subtotal" },
      { text: "Patrón Repositorio: 7 repositorios especializados", status: "NUEVO", detail: "OrderRepository, CestaRepository, UserRepository, CustomerRepository, CatalogRepository, SalesRepository, CobroRepository, ActivityLogRepository" },
      { text: "Server Actions separados por dominio", status: "NUEVO", detail: "8 módulos en src/lib/db/actions/: auth, catalog, cesta, order, payment, customer, admin-sales, activity" },
      { text: "Tests unitarios con Vitest — hashPassword (4 casos)", status: "NUEVO", detail: "tests/unit/hashPassword.test.ts" },
      { text: "Tests unitarios con Vitest — Redsys buildCheckout (4 casos)", status: "NUEVO", detail: "tests/unit/redsys.test.ts" },
      { text: "Tests unitarios con Vitest — Dominio Order/Product (6 casos)", status: "NUEVO", detail: "tests/unit/domain.test.ts" },
    ],
  },
  {
    level: "Extra",
    levelColor: "bg-pink-100 text-pink-700",
    title: "Mejoras adicionales de UX y diseño",
    icon: "✨",
    items: [
      { text: "Tema oscuro / claro con next-themes", status: "NUEVO", detail: "ThemeToggle.tsx + NextThemesProvider en providers.tsx" },
      { text: "Selector de moneda EUR / USD", status: "NUEVO", detail: "CurrencyContext.tsx — conversión en tiempo real en ProductPrice.tsx" },
      { text: "Botón 'Añadir al carrito' desde el listado", status: "NUEVO", detail: "QuickAddToCart.tsx" },
      { text: "Hero CTA en la página de inicio", status: "NUEVO", detail: "HeroCTA.tsx — card flotante con total de productos" },
      { text: "Nuevos componentes UI: badge, skeleton", status: "NUEVO", detail: "src/components/ui/badge.tsx + skeleton.tsx" },
      { text: "Gráficos interactivos con Recharts", status: "NUEVO", detail: "SalesLineChart + SalesByCategoryChart en el panel admin" },
    ],
  },
];

/* ──────────────────────────────────────────────────────────
   Stats rápidas
────────────────────────────────────────────────────────── */
const allItems = sections.flatMap(s => s.items);
const counts = {
  CUMPLIDO: allItems.filter(i => i.status === "CUMPLIDO").length,
  NUEVO:    allItems.filter(i => i.status === "NUEVO").length,
  MEJORADO: allItems.filter(i => i.status === "MEJORADO").length,
};

/* ──────────────────────────────────────────────────────────
   Página
────────────────────────────────────────────────────────── */
export default function ChangelogPage() {
  return (
    <div className="min-h-screen bg-surface-container-lowest">

      {/* ── Hero ── */}
      <section className="bg-gradient-to-br from-md-primary/10 via-white to-md-secondary/10 border-b border-outline-variant py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-md-primary text-white mb-4">
            Proyecto Final WEB 2
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-on-surface mb-4 leading-tight">
            Antes <span className="text-on-surface-variant">vs</span> Después
          </h1>
          <p className="text-body-lg text-on-surface-variant max-w-2xl mx-auto mb-8">
            Comparativa completa entre el repositorio original del diplomado
            y la versión implementada, con todos los requisitos cumplidos.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-3 bg-md-primary text-white font-bold rounded-xl hover:brightness-110 active:scale-95 transition-all text-label-md"
          >
            Ver la tienda
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>

      {/* ── Before / After en números ── */}
      <section className="max-w-5xl mx-auto px-4 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[
            { label: "Archivos originales (src/)", value: "42", icon: "📁", color: "bg-slate-100 text-slate-700" },
            { label: "Archivos en versión final", value: "94", icon: "📂", color: "bg-md-primary-fixed text-md-primary" },
            { label: "Requisitos cumplidos", value: `${counts.CUMPLIDO + counts.MEJORADO}`, icon: "✅", color: "bg-emerald-50 text-emerald-700" },
            { label: "Funcionalidades nuevas", value: `${counts.NUEVO}`, icon: "🆕", color: "bg-blue-50 text-blue-700" },
          ].map(s => (
            <div key={s.label} className={`${s.color} rounded-2xl p-5 border border-outline-variant/50 flex flex-col gap-1`}>
              <span className="text-2xl">{s.icon}</span>
              <span className="text-3xl font-black">{s.value}</span>
              <span className="text-[12px] font-medium opacity-80 leading-tight">{s.label}</span>
            </div>
          ))}
        </div>

        {/* ── Leyenda de badges ── */}
        <div className="flex flex-wrap gap-3 mb-8">
          <span className="text-label-md font-bold text-on-surface-variant">Leyenda:</span>
          {(Object.keys(BADGE_STYLES) as StatusBadge[]).map(k => (
            <span key={k} className={`px-3 py-1 rounded-full text-[11px] font-bold ${BADGE_STYLES[k]}`}>
              {k === "CUMPLIDO" && "✅ "}
              {k === "NUEVO"    && "🆕 "}
              {k === "MEJORADO" && "⬆️ "}
              {k}
            </span>
          ))}
        </div>

        {/* ── Comparativa original / final ── */}
        <div className="grid md:grid-cols-2 gap-6 mb-14">
          {/* Original */}
          <div className="rounded-2xl border border-outline-variant bg-white overflow-hidden">
            <div className="px-6 py-4 bg-slate-50 border-b border-outline-variant flex items-center gap-3">
              <span className="text-2xl">📦</span>
              <div>
                <p className="font-bold text-on-surface">Repositorio original</p>
                <p className="text-[12px] text-on-surface-variant">codecrypto-academy/web2-proyecto</p>
              </div>
            </div>
            <ul className="divide-y divide-outline-variant/50">
              {[
                "42 archivos TypeScript/TSX",
                "Sin panel de administración",
                "Sin tests unitarios",
                "Sin paginación en productos",
                "Sin sidenav de categorías",
                "Código monolítico en db.ts",
                "Sin log de actividad",
                "Sin gráficas de analítica",
                "Sin tema oscuro",
                "Un solo archivo redsys.ts",
              ].map(t => (
                <li key={t} className="px-6 py-3 text-body-md text-on-surface-variant flex items-start gap-2">
                  <span className="text-slate-400 mt-0.5">—</span> {t}
                </li>
              ))}
            </ul>
          </div>

          {/* Final */}
          <div className="rounded-2xl border border-md-primary/30 bg-white overflow-hidden shadow-sm">
            <div className="px-6 py-4 bg-md-primary-fixed border-b border-md-primary/20 flex items-center gap-3">
              <span className="text-2xl">🚀</span>
              <div>
                <p className="font-bold text-on-surface">Versión implementada</p>
                <p className="text-[12px] text-on-surface-variant">Luis Prado — WEB 2 Final</p>
              </div>
            </div>
            <ul className="divide-y divide-outline-variant/50">
              {[
                "94 archivos TypeScript/TSX (+124%)",
                "Panel admin completo (7 pantallas)",
                "14 tests unitarios con Vitest",
                "Paginación inteligente con ellipsis",
                "Sidenav con categorías y filtros",
                "8 repositorios + 8 módulos de actions",
                "Log de actividad filtrable en tiempo real",
                "Gráficas interactivas con Recharts",
                "Tema oscuro/claro con next-themes",
                "Módulo redsys/ refactorizado + route API",
              ].map(t => (
                <li key={t} className="px-6 py-3 text-body-md text-on-surface flex items-start gap-2">
                  <span className="text-emerald-500 mt-0.5">✓</span> {t}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Secciones por nivel ── */}
        {sections.map(section => (
          <div key={section.level} className="mb-10">
            <div className="flex items-center gap-3 mb-5">
              <span className="text-2xl">{section.icon}</span>
              <div>
                <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold uppercase ${section.levelColor} mr-2`}>
                  {section.level}
                </span>
                <span className="text-headline-sm font-bold text-on-surface">{section.title}</span>
              </div>
            </div>

            <div className="rounded-2xl border border-outline-variant bg-white overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-surface-container-low border-b border-outline-variant">
                    <th className="text-left px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-on-surface-variant w-1/2">Requisito</th>
                    <th className="text-left px-3 py-3 text-[11px] font-bold uppercase tracking-wider text-on-surface-variant w-24">Estado</th>
                    <th className="text-left px-3 py-3 text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">Implementación</th>
                  </tr>
                </thead>
                <tbody>
                  {section.items.map((item, idx) => (
                    <tr
                      key={idx}
                      className="border-b border-outline-variant/60 last:border-0 hover:bg-surface-container-lowest/80 transition-colors"
                    >
                      <td className="px-5 py-3 text-body-md text-on-surface">{item.text}</td>
                      <td className="px-3 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap ${BADGE_STYLES[item.status]}`}>
                          {item.status === "CUMPLIDO" && "✅ "}
                          {item.status === "NUEVO"    && "🆕 "}
                          {item.status === "MEJORADO" && "⬆️ "}
                          {item.status}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-[12px] text-on-surface-variant font-mono leading-tight">
                        {item.detail ?? "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}

        {/* ── Tecnologías añadidas ── */}
        <div className="rounded-2xl border border-outline-variant bg-white p-6 mb-8">
          <h2 className="text-headline-sm font-bold text-on-surface mb-5 flex items-center gap-2">
            <span>📦</span> Dependencias añadidas al proyecto
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { name: "recharts ^3.8.1", use: "Gráficas interactivas en panel admin", icon: "📈" },
              { name: "next-themes ^0.4.6", use: "Soporte de tema oscuro/claro", icon: "🌙" },
              { name: "vitest ^4.1.6", use: "Framework de tests unitarios", icon: "🧪" },
              { name: "@vitest/coverage-v8", use: "Reporte de cobertura de tests", icon: "📋" },
              { name: "@rolldown/binding-linux-x64-gnu", use: "Bundler de producción", icon: "⚙️" },
              { name: "sqlite / sqlite3", use: "Persistencia BD (ya en original, refactorizado)", icon: "🗄️" },
            ].map(d => (
              <div key={d.name} className="flex items-start gap-3 p-3 rounded-xl bg-surface-container-lowest border border-outline-variant/50">
                <span className="text-xl">{d.icon}</span>
                <div>
                  <p className="text-label-md font-bold text-on-surface font-mono">{d.name}</p>
                  <p className="text-[12px] text-on-surface-variant mt-0.5">{d.use}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Estructura de archivos ── */}
        <div className="rounded-2xl border border-outline-variant bg-white p-6">
          <h2 className="text-headline-sm font-bold text-on-surface mb-4 flex items-center gap-2">
            <span>🗂️</span> Estructura de carpetas añadidas
          </h2>
          <div className="grid md:grid-cols-2 gap-4 text-[13px] font-mono">
            {[
              { path: "src/app/admin/", desc: "Panel de comercio (9 páginas)", badge: "NUEVO" as StatusBadge },
              { path: "src/app/redsys/route.ts", desc: "Route handler Redsys callback", badge: "NUEVO" as StatusBadge },
              { path: "src/domain/", desc: "Clases OOP: Product, Order, OrderDetailLine", badge: "NUEVO" as StatusBadge },
              { path: "src/lib/db/repositories/", desc: "8 repositorios de acceso a datos", badge: "NUEVO" as StatusBadge },
              { path: "src/lib/db/actions/", desc: "8 módulos de server actions", badge: "NUEVO" as StatusBadge },
              { path: "src/lib/redsys/", desc: "Módulo Redsys refactorizado", badge: "MEJORADO" as StatusBadge },
              { path: "src/components/app/charts/", desc: "SalesLineChart + SalesByCategoryChart", badge: "NUEVO" as StatusBadge },
              { path: "tests/unit/", desc: "14 tests unitarios (Vitest)", badge: "NUEVO" as StatusBadge },
            ].map(f => (
              <div key={f.path} className="flex items-start justify-between gap-2 p-3 rounded-lg bg-surface-container-lowest border border-outline-variant/50">
                <div>
                  <p className="text-on-surface font-bold">{f.path}</p>
                  <p className="text-[11px] text-on-surface-variant mt-0.5 font-sans">{f.desc}</p>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold whitespace-nowrap self-start ${BADGE_STYLES[f.badge]}`}>
                  {f.badge}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
