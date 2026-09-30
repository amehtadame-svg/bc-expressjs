import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import cors from 'cors';
import mongoSanitize from 'express-mongo-sanitize';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFound } from './middlewares/notFound.js';
import { globalLimiter, corsOptions } from './config/security.js';

const app = express();

// ============================================
// PASO 1: Helmet — security headers
// ============================================
// helmet() aplica 12 headers de seguridad HTTP por defecto.
// DEBE ir ANTES de cualquier ruta o middleware de negocio.
app.use(helmet());

// ============================================
// PASO 2 (continuación): Rate limiter global
// ============================================
app.use(globalLimiter);

// ============================================
// PASO 4 (continuación): CORS con whitelist
// ============================================
// Express 5 usa path-to-regexp v8: para preflight de todas las rutas
// se usa una expresión regular (el comodín '*' ya no es válido).
app.options(/.*/, cors(corsOptions)); // handle preflight for all routes
app.use(cors(corsOptions));

// Body parsing
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ============================================
// PASO 5: express-mongo-sanitize
// ============================================
// Elimina operadores MongoDB ($gt, $where, etc.) del body y params.
// express-mongo-sanitize v2 escribe directamente en req.query, que en
// Express 5 es un getter de solo lectura; por eso aquí se aplica la
// función `sanitize` sobre body y params (los inputs del login incluidos).
app.use((req: Request, _res: Response, next: NextFunction): void => {
  if (req.body && typeof req.body === 'object') {
    req.body = mongoSanitize.sanitize(req.body as Record<string, unknown>);
  }
  if (req.params && typeof req.params === 'object') {
    req.params = mongoSanitize.sanitize(req.params as Record<string, string>);
  }
  next();
});

// Health check — ruta pública sin auth
app.get('/api/v1/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);

// Error handling (always last)
app.use(notFound);
app.use(errorHandler);

export { app };
