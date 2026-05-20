# Plan de Trabajo — Proyecto Final WEB 2

> Documento de planificación que detalla, en base al estado actual del repositorio y a las exigencias del `README.md`, los pasos, archivos a crear/editar, funciones a implementar y orden recomendado para completar el proyecto al 100 %.

---

## 1. Análisis del estado actual del proyecto

### 1.1 Stack ya configurado

- **Framework**: Next.js 14 (App Router, `src/app`).
- **Lenguaje**: TypeScript.
- **DB**: SQLite (`northwind.db`) usando `sqlite` + `sqlite3`.
- **UI**: shadcn/ui + Tailwind CSS.
- **Auth**: JWT con `jsonwebtoken`, hash de password con `crypto` + `crypto-js`.
- **Pagos**: Redsys (TripleDES + HMAC SHA256).
- **Formularios**: `react-hook-form` + `zod`.

### 1.2 Funcionalidades YA implementadas

| Área | Estado | Archivos clave |
|------|--------|----------------|
| Registro (SignUp) con validación Zod | Hecho | `src/app/signup/page.tsx` |
| Login con JWT + localStorage | Hecho | `src/app/login/page.tsx`, `src/lib/db/db.ts` (`getUser`) |
| Hashing de password (SHA-256) | Hecho | `src/lib/utils.ts` (`hashPassword`) |
| Verificación de token JWT | Hecho | `src/lib/serverUtils.ts` (`verifyToken`) |
| Context global de auth | Hecho | `src/components/app/AuthContext.tsx` |
| Header con login/logout | Hecho | `src/components/app/Header.tsx` |
| Protección de rutas | Hecho | `src/components/app/ProtectedRoute.tsx` |
| Listado de productos | Hecho | `src/app/products/page.tsx` |
| Página de producto individual | Hecho | `src/app/product/[productId]/page.tsx` |
| Cesta (alta, edición, borrado cantidad=0) | Hecho | `src/app/cesta/[idCesta]/page.tsx`, `cesta()` |
| Asociar cestaId al loguearse | Hecho | `associateCestaIdWithUsername()` |
| Creación de pedidos | Hecho | `createOrder()` |
| Listado de pedidos del cliente | Hecho | `src/app/dashboard/[customerId]/orders/page.tsx` |
| Detalle de un pedido | Hecho | `src/app/dashboard/[customerId]/orders/[orderId]/page.tsx` |
| Edición del perfil del cliente | Hecho | `src/app/dashboard/[customerId]/profile/edit/page.tsx` |
| Cambio de contraseña | Hecho | `src/app/dashboard/[customerId]/change-password/page.tsx` |
| Integración Redsys (firma + checkout) | Hecho | `src/lib/redsys.ts`, `src/components/app/Redsys.tsx` |
| Páginas OK/KO de pago | Hecho | `src/app/ok/page.tsx`, `src/app/ko/page.tsx` |
| Guardado de cobro en BD | Hecho | `saveCobro()` |

### 1.3 Puntos débiles / pendientes detectados

1. **`/dashboard/[customerId]/page.tsx`** está prácticamente vacío (solo muestra "Dashboard"). El `README` pide redirigir al dashboard tras login y mostrar info útil.
2. **No existe `.env`** documentado en el repositorio (necesario para `JWT_SECRET`, `NEXT_PUBLIC_REDSYS_SECRET`, `NEXT_PUBLIC_REDSYS_URL`).
3. **`/ko`** no implementa reintento de pago (especificación 5.3).
4. **Eliminar carrito si el usuario no se autentica**: la lógica no contempla limpieza cuando el invitado abandona la sesión sin loguearse.
5. **Catálogo (Nivel 2)**:
   - Sin sidenav de categorías.
   - Sin paginación 10×10.
6. **Perfil Comercio (Nivel 2)** completo sin implementar:
   - Permiso de "gestor" / rol.
   - Vista de clientes.
   - Vista de últimas compras.
   - Compras por cliente.
   - Marcar pedido como "enviado".
   - Analítica de ventas por tiempo.
   - Analítica por categoría + tiempo.
   - Log de actividad del usuario.
7. **Refactoring (Nivel 3)**:
   - El acceso a datos está como funciones sueltas en `db.ts`. Falta orientación a objetos.
   - No hay tests.
8. **Diseño**: la home y varias páginas son funcionales pero poco cuidadas (objetivo 6).
9. **Validación de seguridad**: el token se verifica en `AuthContext`, pero las server actions (ej. `setPassword`, `createOrder`, `cesta`) no validan token del servidor → riesgo. Hay que centralizar `requireAuth(token)`.

---

## 2. Mapa de carpetas objetivo (post-implementación)

```
src/
├── app/
│   ├── page.tsx                        (home con catálogo destacado)
│   ├── layout.tsx
│   ├── globals.css
│   ├── signup/page.tsx
│   ├── login/page.tsx
│   ├── products/
│   │   └── page.tsx                    (con sidenav categorías + paginación)
│   ├── product/[productId]/page.tsx
│   ├── cesta/[idCesta]/page.tsx
│   ├── ok/page.tsx
│   ├── ko/page.tsx                     (+ botón reintentar)
│   ├── dashboard/[customerId]/
│   │   ├── layout.tsx
│   │   ├── page.tsx                    (resumen: nº pedidos, gasto, último pedido)
│   │   ├── orders/...
│   │   ├── profile/...
│   │   └── change-password/page.tsx
│   └── admin/                          ← NUEVO (Nivel 2 — Comercio)
│       ├── layout.tsx                  (sidebar + ProtectedAdminRoute)
│       ├── page.tsx                    (dashboard admin: KPIs)
│       ├── clientes/
│       │   ├── page.tsx                (lista de clientes)
│       │   └── [customerId]/page.tsx   (compras del cliente)
│       ├── pedidos/
│       │   ├── page.tsx                (últimas compras + marcar enviado)
│       │   └── [orderId]/page.tsx
│       ├── analitica/
│       │   ├── tiempo/page.tsx         (ventas por dia/mes/...)
│       │   └── categoria/page.tsx      (ventas por categoría + tiempo)
│       └── log/page.tsx                (log de actividad)
├── components/
│   ├── ui/...
│   └── app/
│       ├── AuthContext.tsx
│       ├── Header.tsx
│       ├── ProtectedRoute.tsx
│       ├── ProtectedAdminRoute.tsx     ← NUEVO
│       ├── Cantidad.tsx
│       ├── Redsys.tsx
│       ├── Orders.tsx
│       ├── CategoriesSidenav.tsx       ← NUEVO
│       ├── Pagination.tsx              ← NUEVO
│       └── charts/                     ← NUEVO (gráficos analítica)
├── lib/
│   ├── utils.ts
│   ├── serverUtils.ts                  (+ requireAuth, requireAdmin)
│   ├── redsys.ts
│   └── db/
│       ├── db.ts                       (refactor → fachada delgada)
│       ├── schema.ts                   ← NUEVO (DDL centralizado)
│       └── repositories/               ← NUEVO (Nivel 3 — OOP)
│           ├── UserRepository.ts
│           ├── CustomerRepository.ts
│           ├── ProductRepository.ts
│           ├── CategoryRepository.ts
│           ├── CestaRepository.ts
│           ├── OrderRepository.ts
│           ├── CobroRepository.ts
│           └── ActivityLogRepository.ts
├── hooks/use-toast.ts
└── domain/                              ← NUEVO (Nivel 3 — modelos OO)
    ├── User.ts
    ├── Customer.ts
    ├── Product.ts
    ├── Cesta.ts
    ├── Order.ts
    └── Cobro.ts

tests/                                   ← NUEVO (Nivel 3)
├── unit/
│   ├── hashPassword.test.ts
│   ├── redsys.test.ts
│   └── repositories/...
└── integration/
    └── checkout-flow.test.ts
```

---

## 3. Plan por fases

> Cada fase incluye: objetivo, tareas concretas, archivos a tocar, **funciones a crear** y criterio de "hecho".

### FASE 0 — Higiene y configuración base

**Objetivo**: dejar el entorno listo y seguro.

1. Crear `.env.local` con:
   - `JWT_SECRET=...`
   - `NEXT_PUBLIC_REDSYS_SECRET=sq7HjrUOBfKmC576ILgskD5srU870gJ7`
   - `NEXT_PUBLIC_REDSYS_URL=https://sis-t.redsys.es:25443/sis/realizarPago`
2. Verificar que `.env*.local` está en `.gitignore` (ya lo está, OK).
3. Añadir un `README` de arranque (`npm install`, `npm run dev`, etc.).
4. Crear `src/lib/db/schema.ts` exportando todas las sentencias `CREATE TABLE IF NOT EXISTS` (users, cesta, cobro) y llamarlas una sola vez al arrancar la app (helper `ensureSchema()` invocado desde `getDb()`).

**Criterio**: la app arranca sin errores de `JWT_SECRET`/Redsys y todas las tablas existen.

---

### FASE 1 — Robustez de Autenticación

**Objetivo**: cumplir el punto 1 del README sin dejar agujeros de seguridad.

1. En `src/lib/serverUtils.ts` añadir:
   ```ts
   export async function requireAuth(token: string): Promise<{ username: string; id: number }>
   export async function requireAdmin(token: string): Promise<{ username: string; id: number }>
   ```
   Lanzan `Error("Unauthorized")` si no hay token válido o no es admin.
2. Adaptar todas las server actions críticas (`createOrder`, `saveCobro`, `setPassword`, `saveCustomer`, `getCustomerOrders`, `getOrder`) para que reciban el `token` y llamen a `requireAuth(token)` **antes** de leer/escribir.
3. En el cliente, propagar `token` desde `AuthContext` a cada llamada (lectura de `localStorage.user.token`).
4. Completar `/dashboard/[customerId]/page.tsx` con un resumen:
   - Nº de pedidos, importe total acumulado, fecha del último pedido, link a "Mis Pedidos".
   - Datos vía `getCustomerOrders` + función nueva `getCustomerStats(customerId, token)`.

**Criterio**: ninguna server action sensible se ejecuta sin token válido. Dashboard muestra info real.

---

### FASE 2 — Gestión del Carrito al cerrar sesión / no autenticarse

**Objetivo**: cumplir 3.1 "Eliminar carrito si el usuario no se autentica".

1. En `src/lib/db/db.ts` añadir:
   ```ts
   export async function deleteCestaByCestaId(cestaId: string): Promise<void>
   ```
2. En `AuthContext.logout()` llamar a `deleteCestaByCestaId(oldCestaId)` antes de generar uno nuevo.
3. Si tras `verifyToken` resulta inválido (sesión caducada), también borrar la cesta del invitado.
4. (Opcional) Añadir un job sencillo de limpieza: cestas sin `username` con más de 24 h se eliminan al iniciar `getDb()`.

**Criterio**: al hacer logout o expirar el token, las filas en `cesta` asociadas a ese `cestaId` se borran.

---

### FASE 3 — Reintento de pago (Redsys KO)

**Objetivo**: cubrir 5.3.

1. En `src/app/ko/page.tsx`:
   - Añadir un `<Button>` "Reintentar pago" que renderice `<Redsys amount={...} orderId={...} />` con los valores recuperados del `searchParams`.
   - Mostrar el mensaje de error que devuelva Redsys (si llega como query string).
2. (Opcional) En `Redsys.tsx`, exponer prop `label` para personalizar el botón.

**Criterio**: tras un KO el usuario puede reintentar sin volver al carrito.

---

### FASE 4 — Catálogo mejorado (Nivel 2: cliente)

**Objetivo**: cumplir Nivel 2 puntos 1 y 2.

1. Crear repositorio/función `getCategories()` y `getProductsByCategory(categoryId, page, pageSize)` en `db.ts`.
2. Nuevo componente `src/components/app/CategoriesSidenav.tsx`:
   - Renderiza `<ul>` con todas las categorías (`CategoryName`).
   - Al clic, navega a `/products?category=<id>&page=1`.
3. Modificar `src/app/products/page.tsx`:
   - Convertir a server component que lee `searchParams.category` y `searchParams.page`.
   - Calcular `totalPages = Math.ceil(total / 10)`.
   - Renderizar `<CategoriesSidenav />` + grid + `<Pagination />`.
4. Nuevo componente `src/components/app/Pagination.tsx` (links a `page-1`, `page+1`, números).

**Criterio**: el usuario puede filtrar por categoría y navegar de 10 en 10 productos.

---

### FASE 5 — Perfil Comercio / Admin (Nivel 2: gestor)

**Objetivo**: implementar las 7 capacidades del gestor.

#### 5.1 Esquema y permisos

1. Ampliar tabla `users` añadiendo columna `role TEXT NOT NULL DEFAULT 'customer'` (valores: `customer`, `admin`).
   - Migración: `ALTER TABLE users ADD COLUMN role TEXT NOT NULL DEFAULT 'customer'` en `schema.ts`.
2. Marcar manualmente algún usuario como admin con un script `scripts/seedAdmin.ts` (opcional) o vía consola SQL.
3. En `getUser()` incluir `role` en el payload del JWT.
4. Añadir `requireAdmin(token)` en `serverUtils.ts`.
5. Crear `src/components/app/ProtectedAdminRoute.tsx` (similar a `ProtectedRoute` pero comprueba `role === 'admin'`).

#### 5.2 Layout admin

- `src/app/admin/layout.tsx`:
  - Envoltura con `ProtectedAdminRoute`.
  - Sidebar con links: Clientes, Pedidos, Analítica/Tiempo, Analítica/Categoría, Log.

#### 5.3 Funcionalidades

| Funcionalidad | Página | Función servidor a crear |
|---|---|---|
| 1. Ver lista de clientes | `admin/clientes/page.tsx` | `getAllCustomers(token)` |
| 2. Ver últimas compras | `admin/pedidos/page.tsx` | `getRecentOrders(limit, token)` |
| 3. Compras por cliente | `admin/clientes/[customerId]/page.tsx` | `getCustomerOrders(customerId, token)` (ya existe, añadir guard admin) |
| 4. Cambiar estado a "enviado" | botón en `admin/pedidos/[orderId]/page.tsx` | `markOrderShipped(orderId, token)` → `UPDATE Orders SET ShippedDate = date('now') WHERE OrderID = ?` |
| 5. Ventas por tiempo | `admin/analitica/tiempo/page.tsx` | `getSalesByPeriod(granularity, token)` con granularidad = `day` \| `month` \| `quarter` \| `semester` \| `year` |
| 6. Ventas por categoría + tiempo | `admin/analitica/categoria/page.tsx` | `getSalesByCategoryAndPeriod(granularity, token)` |
| 7. Log de actividad | `admin/log/page.tsx` | `getActivityLog(filters, token)` |

#### 5.4 Log de actividad

1. Nueva tabla:
   ```sql
   CREATE TABLE IF NOT EXISTS activity_log (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     username TEXT NOT NULL,
     action TEXT NOT NULL,
     target TEXT NULL,
     fecha TEXT NOT NULL
   );
   ```
2. Función `logActivity(username, action, target?)` invocada desde:
   - `getUser` (login) → `'login'`
   - `insertUser` → `'signup'`
   - `createOrder` → `'order_created'`
   - `saveCobro` → `'payment_ok'`
   - `markOrderShipped` → `'order_shipped'`
   - `setPassword` → `'password_changed'`

#### 5.5 Gráficos

- Para los gráficos de analítica usar **Recharts** (`npm install recharts`).
- Componentes en `src/components/app/charts/`: `SalesLineChart.tsx`, `SalesByCategoryChart.tsx`.

**Criterio**: un usuario con `role='admin'` puede acceder a `/admin/*` y operar; un customer es redirigido.

---

### FASE 6 — Refactoring a OOP (Nivel 3)

**Objetivo**: punto 1 del Nivel 3.

1. Crear `src/domain/` con clases TypeScript (POJOs con métodos):
   ```ts
   // src/domain/Order.ts
   export class Order {
     constructor(
       public id: number,
       public customerId: string,
       public date: Date,
       public details: OrderDetail[]
     ) {}
     getTotal(): number { return this.details.reduce((s, d) => s + d.subtotal, 0); }
     isShipped(): boolean { return !!this.shippedDate; }
   }
   ```
2. Crear `src/lib/db/repositories/*Repository.ts`. Patrón:
   ```ts
   export class OrderRepository {
     constructor(private db: Database) {}
     async findByCustomer(customerId: string): Promise<Order[]> { ... }
     async create(customerId: string, cesta: Cesta): Promise<Order> { ... }
     async markShipped(id: number): Promise<void> { ... }
   }
   ```
3. Refactorizar `db.ts` para que sea una **fachada delgada** que delegue en los repositorios (manteniendo la API pública para no romper los componentes existentes).

**Criterio**: la lógica de acceso a datos queda encapsulada en clases. `db.ts` ≤ 100 líneas.

---

### FASE 7 — Tests (Nivel 3)

**Objetivo**: punto 2 del Nivel 3.

1. Instalar Vitest + supertest:
   ```bash
   npm install -D vitest @vitest/coverage-v8
   ```
2. Añadir script:
   ```json
   "test": "vitest run",
   "test:watch": "vitest"
   ```
3. Crear suites mínimas:
   - `tests/unit/hashPassword.test.ts` (función pura).
   - `tests/unit/redsys.test.ts` (verificar que `getRedsysCheckout` devuelve los 4 campos esperados).
   - `tests/unit/repositories/CestaRepository.test.ts` (con BD SQLite en memoria → `:memory:`).
   - `tests/integration/checkout-flow.test.ts` (signup → login → add to cart → createOrder → saveCobro).
4. Objetivo de cobertura: ≥ 60 % en `src/lib/`.

**Criterio**: `npm test` pasa en verde.

---

### FASE 8 — Pulido visual y UX

**Objetivo**: cubrir objetivo 6 del README.

1. Home (`/`): hero, productos destacados (`getFeaturedProducts()` → 4 con stock > 50).
2. Header: mostrar contador de items en la cesta (`badge` sobre el botón Cesta).
3. Toasts (ya existe `useToast`) para confirmaciones (añadido a cesta, pedido confirmado, etc.).
4. Estados de loading con `Skeleton` de shadcn.
5. Dark mode (opcional, `next-themes`).

---

## 4. Tabla resumen de funciones nuevas a implementar

| Capa | Función / Clase | Fase | Archivo |
|---|---|---|---|
| serverUtils | `requireAuth(token)` | 1 | `src/lib/serverUtils.ts` |
| serverUtils | `requireAdmin(token)` | 5 | `src/lib/serverUtils.ts` |
| db | `ensureSchema()` | 0 | `src/lib/db/schema.ts` |
| db | `getCategories()` | 4 | `src/lib/db/db.ts` |
| db | `getProductsByCategory(catId, page, size)` | 4 | `src/lib/db/db.ts` |
| db | `countProducts(catId?)` | 4 | `src/lib/db/db.ts` |
| db | `getCustomerStats(customerId)` | 1 | `src/lib/db/db.ts` |
| db | `deleteCestaByCestaId(cestaId)` | 2 | `src/lib/db/db.ts` |
| db | `getAllCustomers()` | 5 | `src/lib/db/db.ts` |
| db | `getRecentOrders(limit)` | 5 | `src/lib/db/db.ts` |
| db | `markOrderShipped(orderId)` | 5 | `src/lib/db/db.ts` |
| db | `getSalesByPeriod(granularity)` | 5 | `src/lib/db/db.ts` |
| db | `getSalesByCategoryAndPeriod(granularity)` | 5 | `src/lib/db/db.ts` |
| db | `logActivity(username, action, target?)` | 5 | `src/lib/db/db.ts` |
| db | `getActivityLog(filters)` | 5 | `src/lib/db/db.ts` |
| domain | `User`, `Customer`, `Product`, `Cesta`, `Order`, `Cobro` | 6 | `src/domain/*` |
| repos | `UserRepository`, `CustomerRepository`, `ProductRepository`, `CategoryRepository`, `CestaRepository`, `OrderRepository`, `CobroRepository`, `ActivityLogRepository` | 6 | `src/lib/db/repositories/*` |
| componentes | `CategoriesSidenav`, `Pagination`, `ProtectedAdminRoute`, `charts/SalesLineChart`, `charts/SalesByCategoryChart` | 4, 5 | `src/components/app/*` |

---

## 5. Cronograma sugerido (orden lógico de implementación)

1. **Fase 0** — Higiene (.env, schema centralizado) → ~30 min
2. **Fase 1** — Seguridad server-side + dashboard cliente → ~2 h
3. **Fase 2** — Limpieza de cesta al logout → ~30 min
4. **Fase 3** — Reintento KO → ~20 min
5. **Fase 4** — Sidenav + paginación → ~2 h
6. **Fase 5** — Admin completo (la mayor) → ~5-6 h
7. **Fase 8** — Pulido visual → ~2 h
8. **Fase 6** — Refactor a OOP → ~3 h
9. **Fase 7** — Tests → ~2 h

> Se recomienda hacer commit al final de cada fase con un mensaje claro (`feat(admin): listado de clientes`, `refactor(db): introducir OrderRepository`, etc.).

---

## 6. Checklist de cobertura del README

- [ ] 1.1 Registro y login con JWT en localStorage (ya), **validar token en cada server action** (Fase 1).
- [ ] 1.2 Hash de password (ya). Cambio de password (ya).
- [ ] 1.3 Redirigir a dashboard tras login (ya). Redirigir a login si no autenticado (ya).
- [ ] 1.4 Edición de cliente autenticado (ya).
- [ ] 2.1 Listado de productos (ya, **mejorar paginación** Fase 4).
- [ ] 2.2 Página individual con cantidad (ya).
- [ ] 3.1 Carrito invitado + asociación + persistencia (ya). **Borrar cesta si no autentica** (Fase 2).
- [ ] 3.2 Cambio de cantidades, borrado cuando 0 (ya).
- [ ] 4.1 Confirmación crea Orders + Order Details (ya).
- [ ] 4.2 Mostrar pedido confirmado (ya).
- [ ] 5.1 Redsys (ya).
- [ ] 5.2 Tabla cobro (ya).
- [ ] 5.3 Reintento de pago (Fase 3).
- [ ] 6.1 Variables de entorno (Fase 0).
- [ ] Nivel 2 — Sidenav + paginación (Fase 4).
- [ ] Nivel 2 — Perfil comercio completo (Fase 5).
- [x] Nivel 3 — OOP (Fase 6).
- [x] Nivel 3 — Tests (Fase 7).

---

## 7. Decisiones técnicas justificadas

- **Repositorios** (Fase 6) en vez de un ORM (Prisma): la BD es legacy (Northwind) y el esquema no lo controlamos al 100 %. Repositorios + SQL crudo son más predecibles.
- **Recharts** para los gráficos: muy ligero, integra bien con React Server Components (data del server, render en cliente).
- **Vitest** en lugar de Jest: arranque más rápido en proyectos Next.js + TypeScript, compatible con `import.meta`.
- **Granularidad temporal en SQL puro** usando `strftime('%Y-%m', OrderDate)` para mes, `strftime('%Y-%W', OrderDate)` para semana, etc. Evita lógica en JS y aprovecha índices.

---

## 8. Próximo paso inmediato

Si confirmas este plan, empezaremos por la **Fase 0** (higiene + `schema.ts`) y la **Fase 1** (`requireAuth` + dashboard cliente), porque sin esas dos cosas todas las siguientes fases son frágiles.
