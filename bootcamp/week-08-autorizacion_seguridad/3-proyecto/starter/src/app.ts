import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import cors from 'cors';
import mongoSanitize from 'express-mongo-sanitize';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import proyectoRoutes from './routes/proyecto.routes.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFound } from './middlewares/notFound.js';
import { globalLimiter, corsOptions } from './config/security.js';

const app = express();

// Security layers — order matters
app.use(helmet());
app.use(globalLimiter);
// Express 5 (path-to-regexp v8): el comodín '*' ya no es válido → regex
app.options(/.*/, cors(corsOptions)); // preflight
app.use(cors(corsOptions));

// Body parsing
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Sanitize inputs AFTER parsing, BEFORE routes
// express-mongo-sanitize v2 escribe en req.query (solo-lectura en Express 5);
// se aplica su función `sanitize` sobre body y params.
app.use((req: Request, _res: Response, next: NextFunction): void => {
  if (req.body && typeof req.body === 'object') {
    req.body = mongoSanitize.sanitize(req.body as Record<string, unknown>);
  }
  if (req.params && typeof req.params === 'object') {
    req.params = mongoSanitize.sanitize(req.params as Record<string, string>);
  }
  next();
});

// Health check
app.get('/api/v1/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
// Recurso principal del dominio: proyectos solidarios (Fundaciones / ONG)
app.use('/api/v1/proyectos', proyectoRoutes);

// Error handling (always last)
app.use(notFound);
app.use(errorHandler);

export { app };
