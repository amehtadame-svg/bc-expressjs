# Ejercicio 02 — Helmet + CORS + Rate Limiting + Sanitización (completo)

## ✅ Pasos implementados

| Paso | Archivo | Qué se hizo |
|------|---------|-------------|
| 1 | `src/app.ts` | `app.use(helmet())` antes de todas las rutas |
| 2 | `src/config/security.ts` + `app.ts` | `globalLimiter`: **100 req / 15 min** por IP con `standardHeaders: 'draft-7'` |
| 3 | `src/config/security.ts` + `routes/auth.routes.ts` | `authLimiter`: **5 req / 15 min** solo en `/register` y `/login` |
| 4 | `src/config/security.ts` + `app.ts` | `corsOptions` con **whitelist** (`ALLOWED_ORIGINS`) + preflight |
| 5 | `src/app.ts` | `express-mongo-sanitize` sobre `body` y `params` |
| extra | `src/middlewares/errorHandler.ts` | `ZodError` → 400 y error de CORS → **403** (antes ambos caían en 500) |

### Notas de compatibilidad (Express 5)

- `app.options('*', ...)` ya no es válido en Express 5 (path-to-regexp v8) → se usa `app.options(/.*/, cors(corsOptions))`.
- `express-mongo-sanitize@2` escribe en `req.query`, que en Express 5 es un getter de solo lectura y rompería
  el servidor: se aplica su función `sanitize()` directamente sobre `body` y `params` (que es donde llegan
  los inputs del login: `{"email": {"$gt": ""}}`).

## ❓ ¿Qué pasa si un browser hace un request desde `http://evil.com`?

`corsOptions.origin` recibe ese origen, no está en la whitelist y ejecuta `callback(new Error('CORS blocked…'))`.
El error llega al handler global → **403 `Origin not allowed by CORS policy`**, y la respuesta **no** incluye
la cabecera `Access-Control-Allow-Origin`, por lo que el navegador descarta la respuesta. Con `cors()` a secas
(o `origin: '*'`) el navegador habría permitido a `evil.com` leer las respuestas de la API con las cookies del
usuario (`credentials: true` + `*` es además una combinación inválida y peligrosa).

## 🧪 Casos de prueba verificados

| # | Request | Esperado | Resultado |
|---|---------|----------|-----------|
| 1 | `GET /api/v1/health` | 200 + cabeceras Helmet | ✅ `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `Strict-Transport-Security`, CSP |
| 2 | Cabeceras de rate limit | `RateLimit: limit=100, remaining=…` | ✅ (y `RateLimit-Policy: 100;w=900`) |
| 3 | 6 `POST /api/v1/auth/login` seguidos | 6.º → **429** | ✅ “Too many login attempts, please try again later” |
| 4 | `POST /login` con `{"email":{"$gt":""},"password":{"$gt":""}}` | No bypassea el login | ✅ 400 `Invalid request data` (operadores eliminados por el sanitizer) |
| 5 | `POST /login` con credenciales válidas | 200 + `accessToken` | ✅ |
| 6 | Request con `Origin: http://evil.com` | Bloqueado | ✅ 403, sin `Access-Control-Allow-Origin` |
| 7 | Request con `Origin: http://localhost:5173` | Permitido | ✅ `Access-Control-Allow-Origin: http://localhost:5173` |
| 8 | `POST /auth/refresh` con cookie | 200 + token nuevo | ✅ |

## 🚀 Puesta en marcha

```bash
npm install
cp .env.example .env      # opcional: ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3001
docker compose up -d
npm run dev               # el arranque crea user@test.com / User1234! y admin@test.com / Admin1234!
```
