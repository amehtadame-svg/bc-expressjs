import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import mongoose from 'mongoose';
import { AppError } from '../errors/AppError';

// Error handler global:
//  - AppError → status + mensaje controlado
//  - ZodError → 400 con detalle de validación
//  - CastError (ObjectId inválido) → 400
//  - ValidationError de Mongoose → 400
//  - Duplicate key (11000) → 409
//  - Cualquier otro error → 500 genérico (sin stack trace al cliente)
export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ error: err.message });
    return;
  }

  if (err instanceof ZodError) {
    res.status(400).json({ error: 'Datos inválidos', details: err.flatten() });
    return;
  }

  if (err instanceof mongoose.Error.CastError) {
    res.status(400).json({ error: 'Identificador inválido' });
    return;
  }

  if (err instanceof mongoose.Error.ValidationError) {
    res.status(400).json({ error: 'Datos inválidos', details: err.errors });
    return;
  }

  if (typeof err === 'object' && err !== null && (err as { code?: number }).code === 11000) {
    res.status(409).json({ error: 'El recurso ya existe (valor duplicado)' });
    return;
  }

  if (process.env.NODE_ENV !== 'production') {
    console.error(err);
  }
  res.status(500).json({ error: 'Error interno del servidor' });
}
