# Proyecto Semana 08 — API segura con RBAC y capas de seguridad

## 🎯 Dominio y recurso principal

**Dominio:** Fundaciones / ONG (continúa el dominio de la semana 07)
**Recurso principal:** **Proyectos solidarios** (`/api/v1/proyectos`)

---

## 👥 Roles y permisos

| Rol | Puede | Restricciones |
|-----|-------|---------------|
| **Público** (sin token) | Ver catálogo y detalle de proyectos | — |
| **user** (autenticado) | Ver proyectos, crear proyectos, editar **sus propios** proyectos | No puede editar proyectos ajenos (403), no puede eliminar (403) |
| **admin** | Todo lo anterior + editar cualquier proyecto + eliminar proyectos + listar usuarios y estadísticas | — |

## 📍 Endpoints

| Método | Ruta | Acceso | Middleware |
|--------|------|--------|-----------|
| POST | `/api/v1/auth/register` | Público | `authLimiter` (5/15 min) |
| POST | `/api/v1/auth/login` | Público | `authLimiter` (5/15 min) |
| POST | `/api/v1/auth/refresh` | Público (cookie) | — |
| GET | `/api/v1/auth/me` | Autenticado | `authMiddleware` |
| POST | `/api/v1/auth/logout` | Autenticado | `authMiddleware` |
| GET | `/api/v1/users/dashboard` | Autenticado | `authMiddleware` |
| GET | `/api/v1/proyectos` | Público | — |
| GET | `/api/v1/proyectos/:id` | Público | — |
| POST | `/api/v1/proyectos` | Autenticado | `authMiddleware` |
| PATCH | `/api/v1/proyectos/:id` | Autenticado (dueño o admin) | `authMiddleware` + verificación en service |
| DELETE | `/api/v1/proyectos/:id` | Solo admin | `authMiddleware` + `requireRole('admin')` |

## 🛡️ Capas de seguridad aplicadas

1. **Helmet** — 12 cabeceras (`X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`,
   `Strict-Transport-Security`, `Content-Security-Policy`, …).
2. **Rate limiting** — global 100 req/15 min por IP; específico de auth 5 req/15 min (anti fuerza bruta).
   Se exponen `RateLimit` / `RateLimit-Policy` en todas las respuestas (`standardHeaders: 'draft-7'`).
3. **CORS con whitelist** — solo orígenes de `ALLOWED_ORIGINS` (por defecto `http://localhost:5173`,
   `http://localhost:3001`); `credentials: true` para las cookies. Nunca `Access-Control-Allow-Origin: *`.
   Un origen desconocido recibe **403 Origin not allowed by CORS policy**.
4. **Sanitización** — `express-mongo-sanitize` elimina operadores (`$gt`, `$where`, …) del `body` y `params`,
   así un login con `{"email":{"$gt":""}}` no puede bypassear la autenticación.
5. **RBAC** — `authMiddleware` (401 sin token) + `requireRole('admin')` (403 con rol insuficiente);
   el rol viaja firmado dentro del JWT.
6. **Errores seguros** — handler global: nunca devuelve stack trace; 400 para validación,
   403 para CORS, 409 para duplicados, 500 genérico. Sin secretos en el código: todo en `.env`.

## 🚀 Puesta en marcha

```bash
npm install
cp .env.example .env            # completar JWT secrets y ALLOWED_ORIGINS
docker compose up -d            # MongoDB
npm run dev                     # http://localhost:3000 (al arrancar crea los usuarios de prueba)
```

**Credenciales de prueba (creadas al arrancar el server):** `user@test.com / User1234!` (role user) · `admin@test.com / Admin1234!` (role admin)

## ✅ Pruebas realizadas (verificadas end-to-end)

| Caso | Resultado |
|------|-----------|
| `GET /proyectos` sin token | 200 (público) |
| `POST /proyectos` sin token | 401 |
| `POST /proyectos` como user | 201 |
| `PATCH` proyecto propio / ajeno | 200 / 403 |
| `DELETE` como user / como admin | 403 / 200 |
| Body inválido (Zod) | 400 sin detalles internos |
| Cabeceras Helmet | `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, CSP, HSTS |
| `RateLimit: limit=100` | presente en todas las respuestas |
| Origen `http://evil.com` | 403 (CORS bloquea, sin `Access-Control-Allow-Origin`) |
| Origen `http://localhost:5173` | `Access-Control-Allow-Origin: http://localhost:5173` |
