# Proyecto Semana 08: API Segura con RBAC y Capas de Seguridad

## 🎯 Objetivo

Construir una API REST completamente segura que integre todas las capas de seguridad aprendidas en la semana: RBAC con roles, Helmet, CORS con whitelist, rate limiting diferenciado y sanitización de entradas — aplicadas a tu dominio asignado.

## 📋 Tu Dominio Asignado

**Dominio**: El instructor te asignará tu dominio al inicio del bootcamp.

La API base de autenticación (auth, users) ya está implementada en el starter. Tu trabajo es:
1. Adaptar el recurso principal a tu dominio
2. Configurar correctamente las capas de seguridad
3. Aplicar RBAC a las rutas que lo requieran

## 🏗️ Arquitectura Base (ya en el starter)

```
src/
├── config/
│   └── security.ts     ← Helmet, CORS, rate limiters YA CONFIGURADOS
├── models/
│   ├── user.model.ts   ← YA IMPLEMENTADO
│   └── item.model.ts   ← TODO: adaptar a tu dominio
├── routes/
│   ├── auth.routes.ts  ← YA IMPLEMENTADO
│   ├── user.routes.ts  ← YA IMPLEMENTADO
│   └── item.routes.ts  ← TODO: proteger con authMiddleware + requireRole
├── controllers/
│   ├── auth.controller.ts  ← YA IMPLEMENTADO
│   └── item.controller.ts  ← TODO: implementar CRUD
├── services/
│   ├── auth.service.ts     ← YA IMPLEMENTADO
│   └── item.service.ts     ← TODO: implementar lógica de negocio
└── app.ts              ← Seguridad YA APLICADA (no modificar)
```

## ✅ Requisitos Funcionales

### Recurso Principal (adaptar a tu dominio)

- [ ] `GET /api/v1/items` — Listar recursos (público o autenticado según dominio)
- [ ] `GET /api/v1/items/:id` — Ver detalle (público o autenticado)
- [ ] `POST /api/v1/items` — Crear recurso (autenticado)
- [ ] `PATCH /api/v1/items/:id` — Actualizar (autenticado + dueño O admin)
- [ ] `DELETE /api/v1/items/:id` — Eliminar (solo admin)

### RBAC

- [ ] Rutas públicas: sin middleware de auth
- [ ] Rutas de usuario: `authMiddleware` aplicado
- [ ] Rutas de admin: `authMiddleware` + `requireRole('admin')`

### Seguridad (YA configurada — verificar que funciona)

- [ ] Headers de Helmet visibles en todas las respuestas
- [ ] `RateLimit-Remaining` visibles en headers
- [ ] CORS configurado con whitelist (no `*`)
- [ ] NoSQL injection no afecta la API

## 💡 Ejemplos de Adaptación por Dominio

| Dominio | Recurso (`item`) | Campo único | Admin puede |
|---------|-----------------|-------------|-------------|
| Biblioteca | `book` | `isbn` | Agregar/eliminar libros |
| Farmacia | `medicine` | `sku` | Gestionar inventario |
| Gimnasio | `membership` | `memberCode` | Ver todos los miembros |
| Restaurante | `dish` | `code` | Gestionar menú completo |
| Hotel | `room` | `roomNumber` | Ver todas las reservas |

## 🛠️ Entregables

1. **API funcional** probada con Thunder Client / Postman
   - Screenshots de cada endpoint incluyendo headers de seguridad
   - Screenshot del header `X-Content-Type-Options: nosniff`
   - Screenshot del 429 al superar rate limit en auth

2. **README.md personalizado** con:
   - Descripción de tu dominio y recurso principal
   - Tabla de roles y permisos de tu API
   - Lista de endpoints con método, ruta y acceso requerido

3. **Código adaptado** al dominio:
   - `item.model.ts` renombrado y con campos del dominio
   - `item.controller.ts` con función descriptiva (ej. `getBooks`)
   - Rutas protegidas con `requireRole` donde corresponde

## 📊 Criterios de Evaluación

Ver [rubrica-evaluacion.md](../../rubrica-evaluacion.md) — sección Producto.

Puntos clave:
- Helmet aplicado y headers visibles (10 pts)
- RBAC funcional: 401 sin token, 403 con rol incorrecto, 200 con rol correcto (20 pts)
- Rate limiting con 429 al exceder límite (10 pts)
- CORS con whitelist, no `cors()` puro (10 pts)
- NoSQL injection mitigado (10 pts)
- Errores sin stack trace en producción (10 pts)
- Dominio coherente y originalidad (10 pts)
