import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../errors/AppError.js';

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ error: err.message });
    return;
  }

  // Zod validation errors (thrown by .parse()) → 400
  if (err instanceof ZodError) {
    res.status(400).json({ error: 'Invalid request data' });
    return;
  }

  // CORS whitelist rechaza orígenes desconocidos → 403
  if (err.message?.startsWith('CORS blocked')) {
    res.status(403).json({ error: 'Origin not allowed by CORS policy' });
    return;
  }

  // Nunca se expone el stack trace al cliente
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
}
