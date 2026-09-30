# Ejercicio 01 — RBAC: Roles y Autorización (completo)

## ✅ Pasos implementados

| Paso | Archivo | Qué se hizo |
|------|---------|-------------|
| 1 | `src/middlewares/requireRole.ts` | `requireRole(...roles)` como higher-order function: 401 si no hay `req.user`, 403 si el rol no está permitido, `next()` si todo OK |
| 2 | `src/utils/jwt.ts` | El tipo `JwtPayload` incluye **`role: string`** |
| 3 | `src/services/auth.service.ts` | `signAccessToken({ sub, email, role })` en `login` **y** en `refreshTokens` |
| 4 | `src/routes/admin.routes.ts` | `router.use(authMiddleware)` + `router.use(requireRole('admin'))` |
| extra | `src/middlewares/errorHandler.ts` | `ZodError` → 400 (antes caía en 500) |
| — | `src/server.ts` (ya venía así en el starter) | Al arrancar crea `user@test.com` / `User1234!` y `admin@test.com` / `Admin1234!` |

## 🔑 Cómo funciona

1. `POST /auth/login` firma el access token con el **rol dentro del payload** (no se consulta la DB en cada request).
2. `authMiddleware` valida el token (`Authorization: Bearer <token>`) y rellena `req.user`.
3. `requireRole('admin')` comprueba `req.user.role` → `403` con token válido pero rol insuficiente.

## 🚀 Puesta en marcha

```bash
npm install
cp .env.example .env
docker compose up -d
npm run dev      # al arrancar crea user@test.com / User1234! y admin@test.com / Admin1234!
```

## 🧪 Casos de prueba verificados

| # | Request | Esperado | Resultado |
|---|---------|----------|-----------|
| 1 | `POST /api/v1/auth/login` (user) | 200 + `accessToken` con `role: "user"` | ✅ |
| 2 | `GET /api/v1/users/dashboard` con token user | 200 | ✅ |
| 3 | `GET /api/v1/admin/users` con token user | **403** | ✅ |
| 4 | `POST /api/v1/auth/login` (admin) | 200 + `role: "admin"` | ✅ |
| 5 | `GET /api/v1/admin/users` con token admin | 200 + lista de usuarios | ✅ |
| 6 | `GET /api/v1/admin/stats` con token admin | 200 + conteo por rol | ✅ |
| 7 | `GET /api/v1/users/dashboard` sin token | **401** | ✅ |
| 8 | Request con token inválido | **401** | ✅ |

### Payload verificado del token

```json
{ "sub": "6abc…", "email": "user@test.com", "role": "user", "iat": …, "exp": … }
```
