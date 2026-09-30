import { Request, Response, NextFunction } from 'express';
import * as proyectoService from '../services/proyecto.service.js';
import { createProyectoSchema, updateProyectoSchema } from '../schemas/proyecto.schema.js';
import { AppError } from '../errors/AppError.js';

// ============================================
// Handlers del recurso principal: Proyectos solidarios (Fundaciones / ONG)
// ============================================

// GET /api/v1/proyectos — público (catálogo de proyectos)
export async function listProyectos(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { categoria, estado } = req.query;
    const proyectos = await proyectoService.findAll({
      categoria: typeof categoria === 'string' ? categoria : undefined,
      estado: typeof estado === 'string' ? estado : undefined,
    });
    res.json({ data: proyectos, total: proyectos.length });
  } catch (err) {
    next(err);
  }
}

// GET /api/v1/proyectos/:id — público (detalle)
export async function getProyectoById(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const proyecto = await proyectoService.findById(String(req.params.id));
    if (!proyecto) throw new AppError(404, 'Proyecto no encontrado');
    res.json({ data: proyecto });
  } catch (err) {
    next(err);
  }
}

// POST /api/v1/proyectos — autenticado
export async function createProyecto(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) throw new AppError(401, 'No autenticado');

    const { body } = createProyectoSchema.parse({ body: req.body });
    const proyecto = await proyectoService.create(body, req.user.sub);
    res.status(201).json({ message: 'Proyecto creado', data: proyecto });
  } catch (err) {
    next(err);
  }
}

// PATCH /api/v1/proyectos/:id — autenticado (dueño O admin)
export async function updateProyecto(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) throw new AppError(401, 'No autenticado');

    const { body } = updateProyectoSchema.parse({ body: req.body });
    const proyecto = await proyectoService.update(
      String(req.params.id),
      body,
      req.user.sub,
      req.user.role
    );

    if (!proyecto) throw new AppError(404, 'Proyecto no encontrado');
    res.json({ message: 'Proyecto actualizado', data: proyecto });
  } catch (err) {
    if (err instanceof Error && err.message === 'FORBIDDEN') {
      return next(new AppError(403, 'Solo puedes actualizar tus propios proyectos'));
    }
    next(err);
  }
}

// DELETE /api/v1/proyectos/:id — solo admin (enforced en la ruta)
export async function deleteProyecto(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const proyecto = await proyectoService.remove(String(req.params.id));
    if (!proyecto) throw new AppError(404, 'Proyecto no encontrado');
    res.json({ message: 'Proyecto eliminado' });
  } catch (err) {
    next(err);
  }
}
