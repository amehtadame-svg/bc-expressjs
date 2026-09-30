import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import mongoose from 'mongoose';
import { AppError } from '../errors/AppError.js';

// Error handler global:
//  - AppError → status + mensaje controlado (sin detalles internos)
//  - ZodError → 400 (validación de inputs)
//  - CastError / ValidationError de Mongoose → 400
//  - Duplicate key (11000) → 409
//  - CORS bloqueado → 403
//  - Cualquier otro error → 500 genérico (nunca se expone el stack)
export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ error: err.message });
    return;
  }

  if (err instanceof ZodError) {
    res.status(400).json({ error: 'Invalid request data' });
    return;
  }

  if (err instanceof mongoose.Error.CastError) {
    res.status(400).json({ error: 'Invalid identifier' });
    return;
  }

  if (err instanceof mongoose.Error.ValidationError) {
    res.status(400).json({ error: 'Invalid request data' });
    return;
  }

  if (typeof err === 'object' && err !== null && (err as { code?: number }).code === 11000) {
    res.status(409).json({ error: 'Resource already exists' });
    return;
  }

  // CORS whitelist rechaza orígenes desconocidos
  if (err.message?.startsWith('CORS blocked')) {
    res.status(403).json({ error: 'Origin not allowed by CORS policy' });
    return;
  }

  // Únicamente en desarrollo se registra el error completo en consola.
  // El cliente NUNCA recibe stack traces ni detalles internos.
  if (process.env.NODE_ENV !== 'production') {
    console.error(err);
  }

  res.status(500).json({ error: 'Internal server error' });
}
