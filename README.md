---

# Boxful Web (MVP)

UI web del MVP de Boxful. Implementa el flujo end-to-end mínimo:

* Autenticación (**Login / Register**).
* **Crear orden** en 2 pasos (Cliente → Paquetes).
* **Historial** con paginación y filtros básicos.
* Diseño lo más fiel posible al Figma provisto.

> **Stack:** Next.js (App Router) + Ant Design v5 + TypeScript + Dayjs.

---

## 1) Requisitos

* **Node.js** ≥ 18 (recomendado 20.x).
* **npm** (o pnpm/yarn si prefieres).
* **API** en ejecución (ver “Backend esperado”).

---

## 2) Variables de entorno

Crea tu `.env` a partir de `.env.example`:

```bash
cp .env.example .env
```

Edita:

```env
# URL base de la API (NestJS)
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
```

> El frontend (Next) corre por defecto en `http://localhost:3001`.

---

## 3) Scripts

```bash
# desarrollo (puerto 3001)
npm run dev

# build de producción
npm run build

# servidor de producción (sobre .next)
npm run start

# lint
npm run lint
```

---

## 4) Backend esperado (Boxful API)

Este frontend espera una API con JWT (Bearer) y los siguientes endpoints:

* `POST /auth/register` → body `{ email, password }` → **201** (sin passwordHash).
* `POST /auth/login` → body `{ email, password }` → **200** `{ accessToken, user }`.
* `POST /orders` (protegido) → body:

  ```json
  {
    "customerName": "Nombre Apellido",
    "customerPhone": "50377777777",
    "address": "Dirección del destinatario",
    "department": "San Salvador",
    "municipality": "San Salvador",
    "status": "PENDING",
    "packages": [
      { "description": "iPhone", "weight": 3, "dimensions": { "l": 15, "w": 15, "h": 15 } }
    ]
  }
  ```
* `GET /orders?search=&status=&page=&limit=` (protegido) → **200**

  ```json
  {
    "items": [ /* órdenes */ ],
    "total": 42
  }
  ```

> **CORS**: habilita `http://localhost:3001` en tu API.
> **Seeder (API)**: `SEED_ADMIN_EMAIL`/`SEED_ADMIN_PASSWORD` para crear un usuario inicial.

---

## 5) Uso rápido

1. **Levanta la API** (NestJS) en `http://localhost:3000`.
2. En este repo:

   ```bash
   npm i
   npm run dev
   ```
3. Abre `http://localhost:3001`.
4. **/login** es la página por defecto.

   * Inicia sesión con el usuario seed de la API o regístrate en **/register**.
5. Crea una orden en **/orders/new**:

   * Paso 1: completa **Departamento** y **Municipio** (requeridos por el backend).
   * Paso 2: agrega ≥ 1 paquete y **Enviar**.
6. Ve tu orden en **/orders** (Historial). Filtra y pagina.

---

## 6) Estructura relevante

```
app/
  page.tsx                 # redirect → /login (homepage)
  login/page.tsx           # Login
  register/page.tsx        # Registro (Card v5: styles/variant)
  orders/page.tsx          # Historial (Mis envíos)
  orders/HistoryFilters.tsx
  orders/HistoryTable.tsx
  orders/new/page.tsx      # Crear orden: orquestador de pasos
  orders/new/StepClient.tsx
  orders/new/StepPackages.tsx
components/
  AppShell.tsx             # Sidebar + Header
  RouteShell.tsx           # Aplica AppShell salvo en /login y /register
  Protected.tsx            # Redirección a /login si no hay token
lib/
  api.ts                   # apiFetch (injecta Authorization si existe)
  auth.ts                  # manejo de token/user en localStorage
public/
  boxful-mark.svg          # icono/branding (opcional)
  favicon.ico              # favicon
```

---

---

## 7) Seguridad (MVP)

* **Access Token** en `localStorage`. No hay refresh token.
* **CORS** mínimo habilitado en API.

---

## 8) Comandos útiles

```bash
# Cambiar puerto de dev
npm run dev -- -p 4000

# Revisar lint (eslint v9)
npm run lint
---

## 14) Licencia

MVP de uso interno para la prueba técnica de Boxful.

