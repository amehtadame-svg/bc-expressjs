import { Request, Response, NextFunction } from 'express';
import * as proyectoService from '../services/proyecto.service';
import { createProyectoSchema, updateProyectoSchema } from '../schemas/proyecto.schema';
import { AppError } from '../errors/AppError';

function getIdParam(req: Request): string {
  return String(req.params['id']);
}

export async function getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const proyectos = await proyectoService.getAll();
    res.status(200).json(proyectos);
  } catch (err) {
    next(err);
  }
}

export async function getById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const proyecto = await proyectoService.getById(getIdParam(req));
    res.status(200).json(proyecto);
  } catch (err) {
    next(err);
  }
}

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const dto = createProyectoSchema.parse(req.body);
    const userId = req.user!.sub;
    const proyecto = await proyectoService.create(dto, userId);
    res.status(201).json(proyecto);
  } catch (err) {
    next(err);
  }
}

export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const dto = updateProyectoSchema.parse(req.body);
    const proyecto = await proyectoService.update(getIdParam(req), dto);
    res.status(200).json(proyecto);
  } catch (err) {
    next(err);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await proyectoService.remove(getIdParam(req));
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

export async function addTeamMember(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { userId } = req.body as { userId?: string };
    if (!userId) throw new AppError(400, 'userId es requerido');
    const proyecto = await proyectoService.addTeamMember(getIdParam(req), userId);
    res.status(200).json(proyecto);
  } catch (err) {
    next(err);
  }
}

export async function removeTeamMember(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { userId } = req.body as { userId?: string };
    if (!userId) throw new AppError(400, 'userId es requerido');
    const proyecto = await proyectoService.removeTeamMember(getIdParam(req), userId);
    res.status(200).json(proyecto);
  } catch (err) {
    next(err);
  }
}
