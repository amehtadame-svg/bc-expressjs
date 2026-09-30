# Semana 07 — Autenticación con JWT

## 🎯 Objetivos de Aprendizaje

Al finalizar esta semana, serás capaz de:

1. Hashear contraseñas de forma segura con bcrypt (salt rounds, hash, compare)
2. Comprender la estructura de un JWT (header.payload.signature, claims)
3. Generar y verificar access tokens (corta duración) y refresh tokens (larga duración)
4. Almacenar tokens en cookies HttpOnly, evitando vulnerabilidades XSS
5. Implementar flujos completos de registro, login, refresh y logout
6. Proteger rutas con middleware de autenticación que verifica el JWT
7. Aplicar buenas prácticas de seguridad: secretos distintos, user enumeration prevention

## 📋 Requisitos Previos

- Semanas 01–06 completadas
- Dominio de la arquitectura en capas con Express y TypeScript (semana 03)
- Manejo de errores con `AppError` y middleware global (semana 04)
- Mongoose + MongoDB básico (semana 06) — se usa en los starters de esta semana

## 🗂️ Estructura de la Semana

```
week-07-autenticacion_jwt/
├── 1-teoria/
│   ├── 01-hashing-bcrypt.md         # Por qué hashear, salt rounds, bcrypt API
│   ├── 02-jwt-fundamentos.md        # Estructura JWT, claims, access vs refresh
│   ├── 03-auth-flow.md              # Register/login/refresh/logout con cookies
│   └── 04-auth-middleware.md        # Middleware de autenticación, proteger rutas
├── 2-practicas/
│   ├── ejercicio-01-registro-login/ # Registro, login y ruta protegida básica
│   └── ejercicio-02-refresh-tokens/ # Rotación de refresh tokens + logout seguro
└── 3-proyecto/                      # Auth completa adaptada al dominio propio
```

## 📝 Contenidos

### Teoría

| Archivo | Tema | Duración |
|---------|------|----------|
| [01-hashing-bcrypt.md](1-teoria/01-hashing-bcrypt.md) | Hash de contraseñas con bcrypt, salt, salt rounds, compare | 30 min |
| [02-jwt-fundamentos.md](1-teoria/02-jwt-fundamentos.md) | JWT: estructura, claims, access token, refresh token, firma | 35 min |
| [03-auth-flow.md](1-teoria/03-auth-flow.md) | Flujos de registro, login, refresh, logout y cookies HttpOnly | 35 min |
| [04-auth-middleware.md](1-teoria/04-auth-middleware.md) | Middleware de auth, tipos extendidos de Express, rutas protegidas | 30 min |

### Prácticas

| Ejercicio | Descripción | Duración |
|-----------|-------------|----------|
| [ejercicio-01-registro-login](2-practicas/ejercicio-01-registro-login/) | Registro con hash bcrypt, login con JWT en cookie HttpOnly, ruta `/me` protegida | 80 min |
| [ejercicio-02-refresh-tokens](2-practicas/ejercicio-02-refresh-tokens/) | Refresh token con rotación, logout que invalida el token y limpia cookies | 60 min |

### Proyecto

| Entregable | Descripción |
|------------|-------------|
| [3-proyecto/](3-proyecto/) | Sistema de autenticación completo integrado al dominio asignado |

## ⏱️ Distribución del Tiempo (8 horas)

| Actividad | Tiempo |
|-----------|--------|
| Teoría (4 archivos) | 2h 10min |
| Ejercicio 01 | 1h 20min |
| Ejercicio 02 | 1h |
| Proyecto semanal | 2h 30min |
| Revisión y entrega | 1h |

## 📌 Entregables

1. Ejercicio 01 funcionando: `POST /auth/register`, `POST /auth/login`, `GET /auth/me` con cookie
2. Ejercicio 02 funcionando: `POST /auth/refresh` con rotación y `POST /auth/logout`
3. Proyecto con auth integrada al dominio asignado
4. Screenshots de Thunder Client/Postman mostrando cookies HttpOnly en las respuestas

## 🔗 Navegación

← [Semana 06 — MongoDB y Mongoose](../week-06-mongodb_mongoose/README.md)
→ [Semana 08 — Autorización y Seguridad](../week-08-autorizacion_seguridad/README.md)
