# Guía completa del proyecto — SuperShop (WEB 2)

Este documento describe la **instalación**, la **revisión de funcionalidades** y la **interfaz de administración**, asumiendo el cierre del trabajo planificado en `PLAN_DE_TRABAJO.md` (higiene, seguridad, catálogo, cliente, pasarela, panel comercio, refactor OOP, pruebas automatizadas y pulido de UX).

---

## 1. Referencia al plan de trabajo

El archivo `PLAN_DE_TRABAJO.md` define fases 0–8 y el checklist frente al `README.md`. Tras la última iteración del proyecto:

- **Nivel 3 — OOP (Fase 6):** repositorios, dominio (`src/domain/`), acciones server modulares y fachada `src/lib/db/db.ts`.
- **Nivel 3 — Tests (Fase 7):** Vitest (`npm test`, `npm run test:coverage`) con pruebas de `hashPassword`, lógica Redsys (`buildCheckout`) y modelos de dominio.

Para el detalle histórico de cada fase, conviene seguir leyendo el propio `PLAN_DE_TRABAJO.md`.

---

## 2. Requisitos previos

| Requisito | Notas |
|-----------|--------|
| **Node.js** | LTS reciente (p. ej. 20.x). |
| **npm** | Incluido con Node. |
| **SQLite** | La app usa `northwind.db` en la raíz del repo. |
| **Entorno único** | Instalar y ejecutar siempre en **el mismo sistema** (recomendado **WSL** en Windows para evitar conflictos del binario nativo `sqlite3`). |

---

## 3. Instalación

### 3.1 Clonar y entrar al directorio

```bash
git clone <url-del-repositorio>
cd web2-proyecto-luis-prado
```

### 3.2 Variables de entorno

Crear **`.env.local`** en la raíz (no versionar; ya debe estar en `.gitignore`):

```env
JWT_SECRET=<cadena-larga-aleatoria>
NEXT_PUBLIC_REDSYS_SECRET=<clave-base64-del-entorno-de-pruebas-Redsys>
NEXT_PUBLIC_REDSYS_URL=<URL-del-TPV-de-pruebas>
```

Los valores concretos de Redsys los indica el material del curso o la documentación de entornos de prueba.

### 3.3 Dependencias y base nativa de SQLite

```bash
npm install
```

Si el módulo `sqlite3` se compiló en **otro sistema** (p. ej. Windows vs Linux), puede fallar al arrancar. En ese caso, en el entorno donde vayas a desarrollar:

```bash
npm rebuild sqlite3
```

**Lanzamiento correcto en WSL (Windows):** conviene clonar y trabajar **solo** dentro de Linux (p. ej. `~/proyectos/web2-proyecto-luis-prado`), no mezclar `npm install` en Windows y ejecutar en WSL con los mismos `node_modules`. Pasos de comprobación:

1. Abrir la distro (Ubuntu) en WSL, ir al directorio del proyecto.
2. `rm -rf node_modules .next && npm install && npm rebuild sqlite3`.
3. `npm run dev` y comprobar en consola el mensaje de **Next.js** indicando que escucha en el puerto **3000**.
4. En Windows, abrir `http://127.0.0.1:3000`. Si la página carga y la API responde, el proyecto está bien levantado.
5. Si aparece `ERR_DLOPEN_FAILED`, `not a valid Win32 application` (u otro error al cargar `node_sqlite3.node`), los módulos nativos no coinciden con el SO: borrar `node_modules`, reinstalar y ejecutar `npm rebuild sqlite3` **en el mismo entorno** donde corres `npm run dev`.

**Secuencia para copiar y pegar en WSL** (ajusta la primera línea a la ruta real del proyecto; lo más estable es tener el clone en tu home Linux, no solo en `/mnt/c/...`):

```bash
cd ~/proyectos/web2-proyecto-luis-prado   # o: cd /mnt/c/Users/TU_USUARIO/Desktop/web2-proyecto-luis-prado
rm -rf node_modules .next
npm install
npm rebuild sqlite3
npm run dev
```

Cuando en la terminal aparezca algo equivalente a **“Ready”** / **“Local: http://127.0.0.1:3000”**, abre esa URL en el navegador de Windows. Si algo falla, copia **desde la primera línea en rojo** hasta el final del traceback y revisa el mensaje (casi siempre apunta a `sqlite3`, puerto ocupado o falta de `.env.local`).

O, si hay mezcla previa de `node_modules`:

```bash
rm -rf node_modules .next
npm install
npm rebuild sqlite3
```

### 3.4 Comandos útiles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo en `http://127.0.0.1:3000`. |
| `npm run build` | Compilación de producción. |
| `npm start` | Servidor tras `npm run build`. |
| `npm run lint` | ESLint (Next). |
| `npm test` | Vitest, una pasada. |
| `npm run test:coverage` | Tests con informe de cobertura (carpeta `coverage/`). |
| `npm run seed-admin -- <usuario>` | Promociona a **admin** un usuario ya registrado (ver §5). |

---

## 4. Cómo revisar las funcionalidades (mapa rápido)

### 4.1 Zona pública y cliente

| Ruta | Qué comprobar |
|------|----------------|
| `/` | Home con hero, productos destacados (stock alto). |
| `/products` | Catálogo con **sidenav de categorías** y **paginación**. |
| `/product/[id]` | Detalle, cantidad y añadir a la cesta. |
| `/cesta/[idCesta]` | Líneas de cesta, confirmar pedido (requiere sesión). |
| `/signup`, `/login` | Registro (alta en `users` + customer) y login con JWT en `localStorage`. |
| `/dashboard/[customerId]` | Área cliente (perfil, pedidos, cambio de contraseña según enlaces del layout). |
| `/ok`, `/ko` | Resultado del pago Redsys; revisar flujo según especificación del curso. |

**Cabecera global:** enlace a **Cesta** con **badge** de cantidad acumulada, **tema claro/oscuro**, acceso a **Productos** y bloque sesión (usuario / Comercio si es admin / Entrar / Salir).

### 4.2 Pagos (Redsys)

- Desde el **detalle de un pedido** autenticado se lanza el formulario Redsys (`Redsys.tsx`).
- Tras el pago, el servidor registra el cobro (`saveCobro`) y el log de actividad cuando aplica.

Comprobar con las **tarjetas y URLs de prueba** indicadas en el `README.md`.

### 4.3 Automatización de pruebas (Fase 7)

```bash
npm test
```

Incluye comprobación de **hash de contraseña**, **firma merchant** (TripleDES + HMAC-SHA256) y **lógica de dominio** (totales de pedido, stock). Ver `tests/unit/`.

---

## 5. Perfil administrador (gestor del comercio)

### 5.1 Obtener rol `admin`

1. Registrarse como usuario normal (`/signup`) o usar un usuario existente en `northwind.db`.
2. En la raíz del proyecto:

   ```bash
   npm run seed-admin -- nombre_de_usuario
   ```

   Esto ejecuta `scripts/seed-admin.cjs`, que hace `UPDATE users SET role = 'admin'` para ese `username`.

3. **Cerrar sesión y volver a iniciar sesión** para que el JWT incluya `role: admin`.

### 5.2 Acceso al panel

- Con sesión **admin**, en la cabecera aparece **«Comercio»** → `/admin`.
- La raíz `/admin` **redirige** a `/admin/clientes`.

Todas las rutas bajo `/admin` van envueltas en **`ProtectedAdminRoute`**: si el token no es válido o el rol no es admin, se bloquea el acceso.

### 5.3 Descripción de la interfaz del admin

El layout (`src/app/admin/layout.tsx`) es una aplicación en **dos columnas**:

| Zona | Contenido |
|------|-----------|
| **Barra lateral izquierda** | Fondo oscuro (`slate-900`). Título «Gestión comercio» y enlaces de navegación con estado **activo** resaltado según la URL. |
| **Área principal** | Fondo claro, contenido con padding; aquí se renderiza cada página hija. |

**Ítems del menú lateral:**

| Enlace | Ruta | Función resumida |
|--------|------|-------------------|
| **Clientes** | `/admin/clientes` | Tabla de clientes (Northwind); acceso al detalle por cliente. |
| **Pedidos** | `/admin/pedidos` | Listado de pedidos recientes; enlace al detalle de cada uno. |
| **Analítica — tiempo** | `/admin/analitica/tiempo` | Gráfico de ventas agregadas por granularidad temporal (día, mes, etc.). |
| **Analítica — categoría** | `/admin/analitica/categoria` | Ventas cruzadas por categoría y tiempo. |
| **Log de actividad** | `/admin/log` | Registros de `activity_log` (login, altas de pedido, pagos, envíos…). |

**Páginas de detalle (subrutas):**

- `/admin/clientes/[customerId]` — datos del cliente y sus pedidos.
- `/admin/pedidos/[orderId]` — líneas del pedido, total y acción de **marcar como enviado** si procede.

Los gráficos usan **Recharts**; los datos llegan vía **server actions** protegidas (`requireAdmin`).

---

## 6. Arquitectura de datos (resumen académico)

- **SQLite** `northwind.db`: tablas Northwind más extensiones (`users`, `cesta`, `cobro`, `activity_log`, etc.) definidas/aseguradas en `src/lib/db/schema.ts`.
- **Capa de aplicación:** repositorios en `src/lib/db/repositories/`, acciones en `src/lib/db/actions/`, fachada `src/lib/db/db.ts` para imports legados.
- **Dominio:** `src/domain/` (p. ej. `Order`, `OrderDetailLine`, `Product`) con lógica comprobable por tests.

---

## 7. Problemas habituales

- **`invalid ELF header` / `not a valid Win32 application` en `sqlite3`:** mezcla de sistemas; reinstalar/recompilar `sqlite3` en el entorno activo (§3.4).
- **Puerto 3000 ocupado:** un solo `npm run dev`; liberar puerto o cambiar el script si el profesorado lo permite.
- **Admin no ve el menú aunque exista en BD:** hace falta **nuevo login** tras `seed-admin` para renovar el JWT.

---

## 8. Documentos relacionados

| Archivo | Uso |
|---------|-----|
| `README.md` | Objetivos del curso, especificaciones y datos de prueba Redsys. |
| `PLAN_DE_TRABAJO.md` | Fases, checklist y decisiones técnicas. |
| `GUIA_COMPLETA_PROYECTO.md` | Este manual de instalación, revisión funcional y panel admin. |

---

*Última revisión alineada con el cierre del plan de trabajo y la entrega del proyecto SuperShop.*
