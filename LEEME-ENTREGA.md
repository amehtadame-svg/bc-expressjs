# 📦 Entrega Semana 08 — Autorización y Seguridad

Esta carpeta replica **exactamente la estructura del repositorio** `bc-expressjs`, con los
TODOs de la semana 08 completados en su sitio (dentro de cada `starter/`).

---

## 🧭 Cómo aplicar la entrega

1. Descarga y descomprime el zip.
2. **Reemplaza la carpeta de la semana en tu repositorio** (no fusiones archivo por archivo: hay
   archivos renombrados, ver la tabla de diferencias):

   ```bash
   cd bc-expressjs                       # tu repositorio clonado
   rm -rf bootcamp/week-08-autorizacion_seguridad
   cp -r /ruta/descomprimida/bootcamp/week-08-autorizacion_seguridad bootcamp/
   ```

   La ruta final queda `bc-expressjs/bootcamp/week-08-autorizacion_seguridad/`.

3. Sube los cambios:

   ```bash
   git add .
   git commit -m "feat(semana-08): RBAC + helmet + CORS + rate limiting + sanitización"
   git push
   ```

> 💡 `LEEME-ENTREGA.md` es solo una guía para ti: no hace falta subirlo al repositorio.

---

## 🗂️ Estructura incluida (idéntica a la del repositorio)

```
bootcamp/week-08-autorizacion_seguridad/
├── README.md                              ← igual al repo
├── rubrica-evaluacion.md                  ← igual al repo
├── 0-assets/                              ← igual al repo (3 SVG)
├── 1-teoria/                              ← igual al repo (4 MD)
├── 2-practicas/
│   ├── ejercicio-01-rbac-roles/
│   │   ├── README.md                      ← igual al repo
│   │   └── starter/                       ← ✅ TODOs completados (pasos 1–4) + README de evidencias
│   └── ejercicio-02-helmet-cors-ratelimit/
│       ├── README.md                      ← igual al repo
│       └── starter/                       ← ✅ TODOs completados (pasos 1–5) + README de evidencias
├── 3-proyecto/
│   ├── README.md                          ← igual al repo
│   └── starter/                           ← ✅ dominio Fundaciones/ONG + README de seguridad
├── 4-recursos/                            ← igual al repo
└── 5-glosario/                            ← igual al repo
```

---

## ✅ Qué se completó

### Ejercicio 01 — RBAC (`2-practicas/ejercicio-01-rbac-roles/starter`)

| Paso del README | Archivo | Implementado |
|-----------------|---------|--------------|
| 1 | `src/middlewares/requireRole.ts` | `requireRole(...roles)`: 401 si no hay `req.user`, **403** si el rol no está permitido, `next()` si todo OK |
| 2 | `src/utils/jwt.ts` | `JwtPayload` incluye **`role`** |
| 3 | `src/services/auth.service.ts` | El access token se firma con `role` (en `login` y en `refreshTokens`) |
| 4 | `src/routes/admin.routes.ts` | `authMiddleware` + `requireRole('admin')` en todas las rutas admin |
| extra | `src/middlewares/errorHandler.ts` | `ZodError` → 400 (antes caía en 500) |

### Ejercicio 02 — Helmet + CORS + Rate Limiting + Sanitización (`.../ejercicio-02-helmet-cors-ratelimit/starter`)

| Paso del README | Archivo | Implementado |
|-----------------|---------|--------------|
| 1 | `src/app.ts` | `helmet()` antes de las rutas (headers en todas las respuestas) |
| 2 | `src/config/security.ts` + `app.ts` | `globalLimiter`: **100 req / 15 min** (`standardHeaders: 'draft-7'`) |
| 3 | `src/config/security.ts` + `routes/auth.routes.ts` | `authLimiter`: **5 req / 15 min** en `/login` y `/register` |
| 4 | `src/config/security.ts` + `app.ts` | `corsOptions` con **whitelist** + preflight (rechaza orígenes desconocidos) |
| 5 | `src/app.ts` | `express-mongo-sanitize` sobre `body` y `params` (NoSQL injection) |
| extra | `src/middlewares/errorHandler.ts` | `ZodError` → 400 y error de CORS → **403** (antes ambos caían en 500) |

Notas de compatibilidad con **Express 5**:

- `app.options('*', …)` ya no es válido (path-to-regexp v8) → se usa `app.options(/.*/, cors(corsOptions))`.
- `express-mongo-sanitize@2` escribe en `req.query`, que en Express 5 es de solo lectura y tiraría el
  servidor: se aplica su función `sanitize()` directamente sobre `body` y `params`.

### Proyecto — Dominio Fundaciones / ONG (`3-proyecto/starter`)

- Recurso principal: **Proyecto solidario** → `/api/v1/proyectos`.
- **RBAC**: `GET /proyectos` y `GET /proyectos/:id` públicos; `POST` autenticado;
  `PATCH` solo dueño o admin; `DELETE` solo admin (`requireRole('admin')`).
- Capas de seguridad aplicadas: Helmet, `globalLimiter`, CORS con whitelist,
  sanitización y manejo de errores sin stack traces.

---

## 🔧 Diferencias respecto al repositorio (todo lo demás es idéntico)

| Archivo | Cambio | Por qué |
|---------|--------|---------|
| `.../ejercicio-02-.../starter/package.json` | `@types/express-mongo-sanitize` **2.1.4 → 2.1.2** | la versión 2.1.4 **no existe en npm** (el `install` del starter fallaba); 2.1.2 es la última publicada |
| `.../ejercicio-02-.../starter/.env.example` | se agregó `ALLOWED_ORIGINS=…` | documenta la whitelist de CORS (el código tiene el mismo valor por defecto si la variable no está) |
| `3-proyecto/starter/.env.example` | se agregó `ALLOWED_ORIGINS=…` | igual que arriba |
| `3-proyecto/starter/src/**/item.*` | renombrados a **`proyecto.*`** | adaptación al dominio que pide el propio TODO del starter (*“Renombrar 'Item' al nombre de tu recurso”*); importaciones ya actualizadas |
| `2-practicas/.../starter/README.md` (E1 y E2) y `3-proyecto/starter/README.md` | **nuevos** | documentan los pasos implementados y las evidencias; en E2 el enunciado pide anotar en tu README el caso de `evil.com`, y la rúbrica del proyecto pide *README con descripción de seguridad* (5 pts) |
| `*.ts` completados | código de los TODOs | — |

No se incluyen `node_modules/`, `dist/` ni `.env` (se generan con `npm install` / `cp .env.example .env`).
Los usuarios de prueba **ya los crea el propio `server.ts` del starter** al arrancar (no hace falta seed aparte).

---

## 🚀 Cómo ejecutar cada proyecto

```bash
cd bootcamp/week-08-autorizacion_seguridad/3-proyecto/starter
npm install          # o: pnpm install
cp .env.example .env
docker compose up -d # MongoDB en localhost:27017
npm run dev          # http://localhost:3000
```

**Credenciales creadas automáticamente al arrancar (si la DB está vacía):**

| Email | Password | Rol |
|-------|----------|-----|
| `user@test.com` | `User1234!` | user |
| `admin@test.com` | `Admin1234!` | admin |

> ⚠️ Los tres proyectos usan el puerto 3000: levántalos de a uno, o cambia `PORT` en el `.env`.

---

## 🧪 Casos de prueba (los del README de cada ejercicio)

### E1 — matriz RBAC

| # | Request | Esperado |
|---|---------|----------|
| 1 | `POST /api/v1/auth/login` con `user@test.com` | 200 + cookie `accessToken` (JWT con `role: "user"`) |
| 2 | `GET /api/v1/users/dashboard` con token de user | 200 |
| 3 | `GET /api/v1/admin/users` con token de user | **403** |
| 4 | `POST /api/v1/auth/login` con `admin@test.com` | 200 (JWT con `role: "admin"`) |
| 5 | `GET /api/v1/admin/users` con token de admin | 200 |
| 6 | `GET /api/v1/users/dashboard` sin cookie | **401** |

### E2 — seguridad HTTP

| # | Request | Esperado |
|---|---------|----------|
| 1 | `GET /api/v1/health` | 200 + `X-Content-Type-Options: nosniff`, `X-Frame-Options`, HSTS, CSP |
| 2 | cabeceras de rate limit | `RateLimit-Limit: 100` / `RateLimit-Remaining` |
| 3 | 6 × `POST /api/v1/auth/login` seguidos | 6.º → **429** |
| 4 | `POST /login` con `{"email":{"$gt":""},"password":{"$gt":""}}` | no bypassea el login (input sanitizado) |
| 5 | request con `Origin: http://evil.com` | **403**, sin `Access-Control-Allow-Origin` |

### Proyecto — CRUD con RBAC

| Request | Sin token | user | admin |
|---------|-----------|------|-------|
| `GET /api/v1/proyectos` | 200 (público) | 200 | 200 |
| `POST /api/v1/proyectos` | 401 | 201 | 201 |
| `PATCH /api/v1/proyectos/:id` | 401 | 200 (solo propio) / 403 (ajeno) | 200 |
| `DELETE /api/v1/proyectos/:id` | 401 | 403 | 200 |

---

## 📸 Capturas sugeridas para la rúbrica

- Login de `user` → 200 y **403** en `GET /admin/users`; login de `admin` → 200 en `GET /admin/users`.
- `GET /dashboard` (o `GET /users/dashboard`) sin token → **401**.
- `GET /api/v1/health` mostrando los **headers de Helmet** (`X-Content-Type-Options: nosniff`).
- Cabeceras `RateLimit-Limit` / `RateLimit-Remaining` y el **429** en el 6.º login.
- Login con `{"$gt": ""}` → no bypassea (input sanitizado).
- Proyecto: `GET` público, `POST` autenticado (201), `PATCH` de un proyecto ajeno (403) y `DELETE` como admin (200).
