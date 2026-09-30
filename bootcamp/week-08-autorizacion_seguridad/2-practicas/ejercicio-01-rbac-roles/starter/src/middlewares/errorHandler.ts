import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../errors/AppError.js';

// Global error handler — always 4 arguments for Express to recognize it
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

  // Zod validation errors (thrown by .parse()) → 400
  if (err instanceof ZodError) {
    res.status(400).json({ error: 'Invalid request data', details: err.flatten() });
    return;
  }

  // Unexpected errors — never expose stack traces to clients
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
}
