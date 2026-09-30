# Semana 08 — Autorización y Seguridad

## 🎯 Objetivos de Aprendizaje

Al finalizar esta semana, el estudiante será capaz de:

- Implementar **RBAC** (Role-Based Access Control) con middleware `requireRole()`
- Aplicar **Helmet** para configurar cabeceras HTTP de seguridad
- Implementar **rate limiting** con `express-rate-limit` en endpoints públicos y de autenticación
- Configurar **CORS** correctamente para ambientes de desarrollo y producción
- Sanitizar inputs para prevenir **NoSQL injection** y **XSS**
- Entender la diferencia entre **autenticación** y **autorización**
- Identificar y mitigar al menos 5 vulnerabilidades del **OWASP Top 10**

---

## 📚 Requisitos Previos

- ✅ Semana 07 completa: `authMiddleware`, JWT, cookies HttpOnly
- ✅ Familiaridad con `req.user.role` desde el token decodificado
- ✅ Manejo de `AppError` y middleware global de errores

---

## 🗂️ Estructura de la Semana

```
week-08-autorizacion_seguridad/
├── README.md
├── rubrica-evaluacion.md
├── 0-assets/
│   ├── 01-rbac-flow.svg
│   ├── 02-security-layers.svg
│   └── 03-owasp-top10.svg
├── 1-teoria/
│   ├── 01-rbac-autorizacion.md
│   ├── 02-helmet-headers.md
│   ├── 03-rate-limiting-cors.md
│   └── 04-sanitizacion-owasp.md
├── 2-practicas/
│   ├── ejercicio-01-rbac-roles/
│   └── ejercicio-02-helmet-cors-ratelimit/
├── 3-proyecto/
├── 4-recursos/
│   ├── ebooks-free/
│   ├── videografia/
│   └── webgrafia/
└── 5-glosario/
```

---

## 📝 Contenidos

### Teoría

| Archivo | Tema | Descripción |
|---------|------|-------------|
| [01-rbac-autorizacion.md](1-teoria/01-rbac-autorizacion.md) | RBAC | Roles, permisos, `requireRole()`, diferencia auth/authz |
| [02-helmet-headers.md](1-teoria/02-helmet-headers.md) | Helmet | Cabeceras HTTP de seguridad: CSP, HSTS, X-Frame-Options |
| [03-rate-limiting-cors.md](1-teoria/03-rate-limiting-cors.md) | Rate Limiting y CORS | Throttling, opciones de CORS, whitelist de orígenes |
| [04-sanitizacion-owasp.md](1-teoria/04-sanitizacion-owasp.md) | Sanitización y OWASP | NoSQL injection, XSS, OWASP Top 10 en APIs REST |

### Prácticas

| Ejercicio | Tema | Descripción |
|-----------|------|-------------|
| [ejercicio-01-rbac-roles](2-practicas/ejercicio-01-rbac-roles/) | RBAC | Implementar `requireRole()` y proteger rutas por rol |
| [ejercicio-02-helmet-cors-ratelimit](2-practicas/ejercicio-02-helmet-cors-ratelimit/) | Seguridad HTTP | Helmet + CORS + rate limiting en una API existente |

---

## ⏱️ Distribución del Tiempo (8 horas)

| Actividad | Tiempo |
|-----------|--------|
| Teoría (4 archivos) | 2h |
| Ejercicio 01: RBAC | 2h |
| Ejercicio 02: Helmet + CORS + Rate Limit | 2h |
| Proyecto semanal | 2h |

---

## 📌 Entregables

1. Ejercicio 01 funcionando: API con roles `user` y `admin`, rutas diferenciadas
2. Ejercicio 02 funcionando: cabeceras de seguridad, CORS configurado, rate limiting activo
3. Proyecto semanal: dominio asignado con autenticación + autorización + capas de seguridad

---

## 🔗 Navegación

← [Semana 07: Autenticación JWT](../week-07-autenticacion_jwt/README.md) | [Semana 09: Testing →](../week-09-testing/README.md)
