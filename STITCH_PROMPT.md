# 🎨 Google Stitch — Prompt Diseño SuperShop eCommerce

## Contexto del proyecto

Rediseña completamente la interfaz visual de **SuperShop**, un eCommerce construido con **Next.js 14 + Tailwind CSS + shadcn/ui**. El diseño actual es minimalista blanco/negro. Queremos un cambio ABRUPTO y DRAMÁTICO: dark-mode por defecto, glassmorphism, gradientes vibrantes y microanimaciones. Debe sentirse como una app de lujo de 2025.

---

## Identidad Visual Nueva

- **Nombre de la app:** SuperShop
- **Paleta de color:**
  - Fondo base: `#0a0a0f` (negro profundo casi morado)
  - Primario acento: gradiente `#7c3aed → #a855f7` (violeta a púrpura)
  - Secundario acento: `#06b6d4` (cian eléctrico)
  - Texto principal: `#f1f5f9`
  - Texto secundario: `#94a3b8`
  - Cards: `rgba(255,255,255,0.04)` con `backdrop-blur` (glassmorphism)
  - Bordes sutiles: `rgba(255,255,255,0.08)`
- **Tipografía:** Inter (Google Fonts) — bold 700 para títulos, regular 400 para texto
- **Bordes redondeados:** `1rem` (16px) en cards, `0.5rem` en botones
- **Efectos:** Glassmorphism, gradientes lineales, glow en hover, sombras de color

---

## Páginas a diseñar (total: 15 pantallas)

---

### PÁGINA 1 — Home / Landing (`/`)

**Ruta:** `/`
**Tipo:** Server component, página pública

**Contenido actual:**
- Hero section con gradiente oscuro, título "Tu tienda Northwind, lista para comprar", subtítulo y 2 botones (Ver productos / Iniciar sesión)
- Sección "Destacados" con 4 product cards (nombre, precio, stock, botón Ver detalle)

**Diseño nuevo esperado:**
- Hero con fondo de partículas o malla de puntos animada + gradiente `#0a0a0f → #1a0533`
- Título grande con gradient text (violeta → cian) animado con shimmer effect
- Botón primario: pill violeta con glow, hover escala 1.05
- Botón secundario: outline glassmorphism transparente
- Cards de productos destacados con glassmorphism, precio con badge vibrante, imagen placeholder con gradiente, hover con card lift + glow violeta
- Separador decorativo con línea de gradiente

---

### PÁGINA 2 — Catálogo de Productos (`/products`)

**Ruta:** `/products?category=X&page=N`
**Tipo:** Server component, página pública

**Contenido actual:**
- Sidenav lateral izquierdo con lista de categorías (clickable)
- Grid 3 columnas de productos (nombre, ID, precio, stock) como cards simples
- Paginación inferior (anterior / siguiente / páginas)
- Contador "Mostrando X de Y productos"

**Diseño nuevo esperado:**
- Sidenav como panel glassmorphism lateral con categorías como pills/chips activas (violeta cuando seleccionada, gris glass cuando no)
- Grid de productos: cards glassmorphism con imagen placeholder de gradiente según categoría, nombre en blanco bold, precio en cian vibrante, stock como badge verde/amarillo/rojo según cantidad
- Botón "Ver detalle" en cada card con animación de flecha
- Paginación como dots o pills numeradas con glow en activo
- Header del catálogo con breadcrumb y total de resultados

---

### PÁGINA 3 — Detalle de Producto (`/product/[productId]`)

**Ruta:** `/product/[productId]`
**Tipo:** Server/Client component, página pública

**Contenido actual:**
- Nombre del producto como h1
- Precio, categoría, proveedor, stock, unidades en pedido
- Selector de cantidad (input numérico con +/- buttons)
- Botón "Añadir a la cesta"
- Breadcrumb de vuelta al catálogo

**Diseño nuevo esperado:**
- Layout 2 columnas: izquierda imagen placeholder con gradiente animado + badge de categoría; derecha info del producto
- Nombre con tipografía grande bold white
- Precio destacado en tamaño grande con color cian/violeta
- Stock como indicador visual (barra de progreso o pills de colores)
- Selector de cantidad con botones +/- estilizados, borderless glassmorphism
- Botón principal "Añadir a la cesta" full-width con gradiente violeta, animación de check al clic
- Tags de categoría, proveedor como chips glassmorphism

---

### PÁGINA 4 — Carrito / Cesta (`/cesta/[idCesta]`)

**Ruta:** `/cesta/[idCesta]`
**Tipo:** Client component, página semipública

**Contenido actual:**
- Lista de productos en el carrito (nombre, cantidad, precio unitario, subtotal)
- Botones para modificar cantidad o eliminar producto
- Total del carrito
- Botón "Confirmar pedido" (requiere login)
- Botón "Vaciar cesta"

**Diseño nuevo esperado:**
- Layout tipo checkout moderno: lista de items a la izquierda (70%), resumen a la derecha (30%) sticky
- Cada item: glassmorphism row con imagen placeholder del producto, nombre, cantidad editable inline, subtotal calculado en tiempo real
- Botón eliminar: icono trash con hover rojo
- Panel resumen pegado con total grande, desglose (subtotal, IVA indicativo), botón CTA "Proceder al pago" con gradiente + shimmer
- Si carrito vacío: ilustración minimalista vacía con CTA hacia catálogo

---

### PÁGINA 5 — Login (`/login`)

**Ruta:** `/login`
**Tipo:** Client component, página pública

**Contenido actual:**
- Formulario: campo usuario, campo contraseña (hasheada antes de enviar), botón Entrar
- Link a registro

**Diseño nuevo esperado:**
- Página centrada (split layout): izquierda con ilustración/gradiente con el nombre SuperShop y tagline; derecha formulario
- Card glassmorphism flotando con blur
- Inputs con fondo transparente, borde violeta en focus con glow
- Botón submit con gradiente violeta → púrpura, animación de carga
- Link "¿No tienes cuenta? Regístrate" con hover underline cian
- Animación de entrada del card con fade + slide up

---

### PÁGINA 6 — Registro (`/signup`)

**Ruta:** `/signup`
**Tipo:** Client component, página pública

**Contenido actual:**
- Formulario: usuario, contraseña, aceptar política, aceptar marketing
- Checkbox de políticas y marketing
- Botón Registrarse

**Diseño nuevo esperado:**
- Misma estética que Login (split layout o card centrado glassmorphism)
- Pasos visuales o card único con todos los campos
- Checkboxes estilizados (custom glassmorphism con check violeta)
- Validación en tiempo real con iconos de check/error
- Botón submit con gradiente

---

### PÁGINA 7 — Dashboard del Cliente (`/dashboard/[customerId]`)

**Ruta:** `/dashboard/[customerId]`
**Tipo:** Client/Server component, página protegida (solo usuarios autenticados)

**Contenido actual:**
- Saludo personalizado con nombre del usuario
- Sección de pedidos del cliente (tabla/lista con orderId, fecha, total, estado)
- Botones editar perfil, cambiar contraseña
- Link para volver a ir de compras

**Diseño nuevo esperado:**
- Header de bienvenida con avatar placeholder (iniciales del usuario), nombre y rol
- Stats cards horizontales: total pedidos, total gastado, último pedido
- Tabla de pedidos glassmorphism con columnas: ID, Fecha, Total, Estado (badge enviado/pendiente), Acción ver detalle
- Botones de acción (editar perfil, cambiar contraseña) como pills outline
- Sección rápida de "Seguir comprando" con CTA

---

### PÁGINA 8 — Pago Redsys (`/redsys`)

**Ruta:** `/redsys`
**Tipo:** Client component, página protegida

**Contenido actual:**
- Formulario oculto (POST automático hacia TPV Redsys)
- Pantalla de "Redirigiendo al pago..." mientras se hace submit

**Diseño nuevo esperado:**
- Pantalla de transición/loading: fondo oscuro con logo SuperShop centrado
- Spinner animado circular con gradiente violeta
- Texto "Conectando con la pasarela de pago seguro..." con puntos animados
- Ícono de candado/seguridad debajo
- Indicadores de seguridad: badges de Redsys, SSL

---

### PÁGINA 9 — Pago Exitoso (`/ok`)

**Ruta:** `/ok`
**Tipo:** Server component, página pública (callback de Redsys)

**Contenido actual:**
- Mensaje de "¡Pago realizado con éxito!"
- Detalles del pedido (orderId, importe, fecha)
- Link para volver al dashboard o catálogo

**Diseño nuevo esperado:**
- Pantalla de éxito fullscreen con animación de check grande (círculo verde → check blanco con confetti o partículas)
- Título "¡Compra completada! 🎉" con gradiente
- Card con resumen del pedido (número, importe, fecha) en glassmorphism
- 2 botones: "Ver mis pedidos" (primario violeta) y "Seguir comprando" (secundario glass)

---

### PÁGINA 10 — Pago Fallido / Cancelado (`/ko`)

**Ruta:** `/ko`
**Tipo:** Server component, página pública (callback de Redsys KO)

**Contenido actual:**
- Mensaje de error de pago
- Botón para reintentar el pago
- Link para volver al carrito

**Diseño nuevo esperado:**
- Pantalla de error con animación de X (rojo/naranja) o ícono de alerta
- Mensaje claro "El pago no se completó"
- Explicación del motivo (si hay código de error de Redsys)
- 2 botones: "Reintentar pago" (primario rojo/naranja con glow) y "Volver al carrito" (glass)
- Tono visual más cálido (naranja-rojo sutil para el error, no todo rojo)

---

### PÁGINA 11 — Panel Admin: Clientes (`/admin/clientes`)

**Ruta:** `/admin/clientes`
**Tipo:** Server/Client component, protegido (solo role=admin)

**Contenido actual:**
- Tabla de clientes (CustomerID, nombre de empresa, contacto, ciudad, país)
- Cada fila clickable para ver pedidos de ese cliente

**Diseño nuevo esperado:**
- Layout admin: sidebar izquierdo con menú de navegación admin (Clientes, Pedidos, Analítica Tiempo, Analítica Categoría, Log)
- Tabla estilizada glassmorphism con hover rows, avatar placeholder con iniciales
- Búsqueda/filtro de clientes en header de tabla
- Badge de país con bandera emoji
- Botón "Ver pedidos" en cada fila como chip con flecha

---

### PÁGINA 12 — Admin: Pedidos de un Cliente (`/admin/clientes/[customerId]`)

**Ruta:** `/admin/clientes/[customerId]`
**Tipo:** Server component, protegido

**Contenido actual:**
- Nombre del cliente como header
- Lista de sus pedidos (orderId, fecha, total, enviado sí/no)
- Link a detalle de cada pedido

**Diseño nuevo esperado:**
- Header con breadcrumb (Admin → Clientes → Nombre)
- Card del cliente con info (nombre, ID, ciudad)
- Tabla de pedidos con badge de estado (Enviado/Pendiente) coloreados
- Cada fila con link a detalle del pedido

---

### PÁGINA 13 — Admin: Listado de Pedidos (`/admin/pedidos`)

**Ruta:** `/admin/pedidos`
**Tipo:** Server component, protegido

**Contenido actual:**
- Lista de las últimas órdenes (orderId, customerId, fecha, total)
- Link a detalle de cada pedido

**Diseño nuevo esperado:**
- Tabla glassmorphism con las últimas N órdenes
- Columnas: #Pedido, Cliente, Fecha, Total, Estado, Acciones
- Filtro de fecha o estado
- Badge de estado con colores (violeta=nuevo, amarillo=en proceso, verde=enviado)

---

### PÁGINA 14 — Admin: Detalle de Pedido (`/admin/pedidos/[orderId]`)

**Ruta:** `/admin/pedidos/[orderId]`
**Tipo:** Server/Client component, protegido

**Contenido actual:**
- Header con orderId y customerId
- Tabla de líneas del pedido (producto, precio, cantidad, descuento, subtotal)
- Total del pedido
- Fecha de pedido y fecha de envío (si existe)
- Botón "Marcar como enviado" (si no está enviado aún)

**Diseño nuevo esperado:**
- Header card con datos del pedido (número, cliente, fechas, estado grande)
- Tabla de líneas glassmorphism con subtotales
- Footer card con total destacado en grande
- Botón "Marcar como enviado" con animación de carga → check de éxito
- Breadcrumb de vuelta

---

### PÁGINA 15a — Admin: Analítica por Tiempo (`/admin/analitica/tiempo`)

**Ruta:** `/admin/analitica/tiempo`
**Tipo:** Client component con Recharts, protegido

**Contenido actual:**
- Selector de granularidad (día, mes, trimestre, semestre, año)
- Gráfico de barras/línea con ventas agregadas por tiempo
- Tabla de datos debajo

**Diseño nuevo esperado:**
- Header con selector de granularidad como toggle pills
- Gráfico con tema oscuro (fondo transparente, líneas/barras en gradiente violeta-cian)
- Tooltip glassmorphism en hover del gráfico
- KPI cards arriba del gráfico (total vendido, ticket medio, período)
- Animación de entrada del gráfico (barras creciendo desde 0)

---

### PÁGINA 15b — Admin: Analítica por Categoría (`/admin/analitica/categoria`)

**Ruta:** `/admin/analitica/categoria`
**Tipo:** Client component con Recharts, protegido

**Contenido actual:**
- Selector de granularidad + selector de categoría
- Gráfico de barras apiladas o líneas por categoría
- Tabla comparativa

**Diseño nuevo esperado:**
- Mismo estilo que analítica/tiempo pero con leyenda de colores por categoría
- Colores de categorías en paleta de arco iris oscuro (cada categoría un color del espectro)
- Toggle para cambiar entre gráfico de barras y líneas
- Leyenda interactiva (click para mostrar/ocultar categoría)

---

### PÁGINA 16 — Admin: Log de Actividad (`/admin/log`)

**Ruta:** `/admin/log`
**Tipo:** Server/Client component, protegido

**Contenido actual:**
- Tabla de actividad (id, username, action, target, fecha)
- Filtros por usuario y por tipo de acción

**Diseño nuevo esperado:**
- Timeline vertical estilizado (línea central con puntos de colores según tipo de acción)
- O alternativamente: tabla glassmorphism con icono de acción (login=candado, pedido=caja, pago=tarjeta)
- Filtros como chips de búsqueda en header
- Badges de tipo de acción con colores: login=azul, pago=verde, error=rojo, pedido=violeta
- Timestamps relativos ("hace 2h") + absolutos en tooltip

---

## Componentes compartidos a rediseñar

### HEADER (global)

**Contenido:** Logo SuperShop | Nav: Cesta (badge con contador), Productos, [si admin: Comercio] | [si login: username + Salir] [si no: Registro + Entrar] | ThemeToggle

**Diseño nuevo:**
- Barra top sticky con glassmorphism y blur
- Logo con gradiente violeta-cian en el texto
- Nav items como ghost buttons con hover glow
- Badge del carrito: pill violeta vibrante con número
- Botón Entrar: gradiente violeta
- Botón Salir: outline glass
- ThemeToggle como pill redondeado

### LAYOUT ADMIN (sidebar)

**Contenido:** Logo + navegación admin vertical: Clientes, Pedidos, Analítica Tiempo, Analítica Categoría, Log | Link volver a tienda

**Diseño nuevo:**
- Sidebar fijo 240px con fondo glassmorphism
- Items de nav con icono + texto, hover con pill violeta
- Item activo resaltado con gradiente
- Separador sutil entre secciones

---

## Notas técnicas para el agente

- **Framework:** Next.js 14 App Router con TypeScript
- **CSS:** Tailwind CSS v3 + shadcn/ui (ya instalado)
- **NO cambiar** la lógica de negocio, solo los estilos y estructura visual
- **NO cambiar** los imports de server actions ni la lógica de datos
- **SÍ cambiar** `globals.css` (variables CSS del tema), los className de Tailwind en las pages y components
- **Iconos disponibles:** lucide-react (ya instalado)
- **Gráficos:** Recharts (ya instalado), personalizar solo los colores y tema
- El diseño original está respaldado en `src_backup_original/` — NO tocar esa carpeta
- Total de archivos a modificar: ~20 páginas + 2 layouts + Header + globals.css

---

## Resumen de pantallas

| # | Ruta | Tipo | Notas |
|---|------|------|-------|
| 1 | `/` | Home/Landing | Hero + destacados |
| 2 | `/products` | Catálogo | Sidenav + grid + paginación |
| 3 | `/product/[id]` | Detalle producto | 2 cols, cantidad, añadir cesta |
| 4 | `/cesta/[id]` | Carrito | Lista items + resumen pago |
| 5 | `/login` | Login | Form glassmorphism |
| 6 | `/signup` | Registro | Form con checkboxes |
| 7 | `/dashboard/[id]` | Dashboard cliente | Stats + pedidos propios |
| 8 | `/redsys` | Redirección pago | Loading screen |
| 9 | `/ok` | Pago exitoso | Animación check + resumen |
| 10 | `/ko` | Pago fallido | Error + reintentar |
| 11 | `/admin/clientes` | Admin: clientes | Tabla + sidebar admin |
| 12 | `/admin/clientes/[id]` | Admin: pedidos cliente | Tabla pedidos del cliente |
| 13 | `/admin/pedidos` | Admin: listado pedidos | Tabla órdenes recientes |
| 14 | `/admin/pedidos/[id]` | Admin: detalle pedido | Líneas + marcar enviado |
| 15a | `/admin/analitica/tiempo` | Admin: analítica tiempo | Recharts oscuro |
| 15b | `/admin/analitica/categoria` | Admin: analítica categoría | Recharts multicolor |
| 16 | `/admin/log` | Admin: log actividad | Timeline/tabla filtrable |

**Componentes compartidos:** Header, Admin Layout sidebar, globals.css (tema de color)
