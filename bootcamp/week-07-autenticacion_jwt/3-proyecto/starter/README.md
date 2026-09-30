# Proyecto Semana 07 — API de Fundaciones/ONG con Autenticación JWT

## 🎯 Dominio y recurso principal

**Dominio:** Fundaciones / ONG
**Recurso principal:** **Proyectos solidarios** (`/api/v1/proyectos`)

Una fundación gestiona proyectos sociales (educación, salud, medio ambiente, comunidad, emergencia, cultura).
Cada proyecto tiene presupuesto, ubicación, beneficiarios, objetivos, indicadores, socios, documentos y equipo.

---

## 🔐 Sistema de autenticación (desarrollado)

| Endpoint | Método | Acceso | Descripción |
|----------|--------|--------|-------------|
| `/api/v1/auth/register` | POST | Público | Registra usuario. Contraseña hasheada con **bcrypt (salt rounds 10)** |
| `/api/v1/auth/login` | POST | Público | Verifica con `bcrypt.compare` y emite **access token (15 min)** + **refresh token (7 días)** en cookies `httpOnly` |
| `/api/v1/auth/me` | GET | Protegido | Perfil del usuario autenticado (sin password) |
| `/api/v1/auth/refresh` | POST | Público (cookie) | **Rota** el refresh token: verifica el hash guardado y genera un par nuevo |
| `/api/v1/auth/logout` | POST | Protegido | Anula el refresh token en DB y limpia ambas cookies |

## 🗂️ CRUD del recurso principal (protegido)

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/api/v1/proyectos` | GET | Lista proyectos activos |
| `/api/v1/proyectos/:id` | GET | Detalle del proyecto (404 si no existe) |
| `/api/v1/proyectos` | POST | Crea proyecto (valida con Zod, devuelve 201) |
| `/api/v1/proyectos/:id` | PATCH | Actualización parcial del proyecto |
| `/api/v1/proyectos/:id` | DELETE | Baja lógica del proyecto (204) |
| `/api/v1/proyectos/:id/equipo` | POST / DELETE | Agrega / quita miembros del equipo |

---

## 🛡️ Decisiones de seguridad aplicadas

- **bcrypt rounds 10** en el hash de contraseñas; `bcrypt.hash()` asíncrono (nunca `hashSync`).
- Campo `password` con `select: false` → nunca se devuelve en queries por defecto.
- **Dos secretos JWT distintos** (`JWT_ACCESS_SECRET` ≠ `JWT_REFRESH_SECRET`), solo en `.env`.
- Access token: **15 minutos**; refresh token: **7 días** (mismo orden de magnitud que las cookies).
- Refresh token **nunca se guarda en claro**: se guarda `bcrypt(sha256(token))` del token.
  El digest SHA-256 previo es necesario porque bcrypt trunca la entrada a 72 bytes y todos los
  JWT comparten un prefijo muy largo (sin esto, un token rotado podría seguir siendo válido).
- **Rotación real**: cada `/refresh` invalida el anterior (el payload incluye `jti` único, así que
  dos tokens nunca son iguales) → reutilizar el token viejo devuelve `401`.
- Cookies: `httpOnly: true`, `secure` en producción, `sameSite: lax`, `path` restringido para el refresh.
- Login con **mensaje único “Credenciales inválidas”** para email inexistente y password incorrecta
  (previene *user enumeration*).
- Errores globales normalizados: `400` Zod / ObjectId inválido, `404`, `409` duplicados y `500` genérico
  sin stack trace.

---

## 🚀 Puesta en marcha

```bash
npm install
cp .env.example .env        # completar los secretos JWT (openssl rand -base64 64)
docker compose up -d        # MongoDB en localhost:27017
npm run dev                 # http://localhost:3000
# npm run build && npm start   # producción
```

## 📸 Flujo de prueba (Thunder Client / Postman)

1. `POST /api/v1/auth/register` → 201 (sin password en la respuesta)
2. `POST /api/v1/auth/login` → 200 + **2 cookies** (`accessToken`, `refreshToken` HttpOnly)
3. `GET /api/v1/auth/me` con cookie → 200; sin cookie → 401
4. `POST /api/v1/proyectos` con cookie → 201
5. `GET/PATCH/DELETE /api/v1/proyectos/:id` → 200/204
6. `POST /api/v1/auth/refresh` → 200 + cookies nuevas (probar reusar la vieja → 401)
7. `POST /api/v1/auth/logout` → 200 + cookies limpias; `/refresh` posterior → 401

## ✅ Pruebas realizadas (verificadas end-to-end con MongoDB real)

| Caso | Resultado |
|------|-----------|
| Register / login / me con y sin cookie | 201 / 200 / 401 correctos |
| Password guardado como hash bcrypt | `$2b$10$...` en la colección `users` |
| Duplicado de email | 409 |
| Validación Zod (fechaFin < fechaInicio, campos faltantes) | 400 con detalle |
| ObjectId inválido / id inexistente | 400 / 404 |
| Refresh + rotación + reuso del token viejo | 200 / 401 |
| Logout + refresh posterior | 200 / 401 (refreshToken = `null` en DB) |
| CRUD completo de proyectos | 201 / 200 / 200 / 204 |
