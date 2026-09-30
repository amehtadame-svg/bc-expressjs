import * as proyectoRepository from '../repositories/proyecto.repository';
import { CreateProyectoDto, UpdateProyectoDto } from '../schemas/proyecto.schema';
import { AppError } from '../errors/AppError';
import type { IProyecto } from '../models/proyecto.model';

export async function getAll(): Promise<IProyecto[]> {
  return proyectoRepository.findAll();
}

export async function getById(id: string): Promise<IProyecto> {
  const proyecto = await proyectoRepository.findById(id);
  if (!proyecto) throw new AppError(404, 'Proyecto no encontrado');
  return proyecto;
}

export async function create(dto: CreateProyectoDto, userId: string): Promise<IProyecto> {
  const proyecto = await proyectoRepository.create({ ...dto, creadoPor: userId });
  return proyecto;
}

export async function update(id: string, dto: UpdateProyectoDto): Promise<IProyecto> {
  const existing = await proyectoRepository.findById(id);
  if (!existing) throw new AppError(404, 'Proyecto no encontrado');
  const updated = await proyectoRepository.updateById(id, dto);
  if (!updated) throw new AppError(404, 'Proyecto no encontrado tras actualizar');
  return updated;
}

export async function remove(id: string): Promise<void> {
  const deleted = await proyectoRepository.deleteById(id);
  if (!deleted) throw new AppError(404, 'Proyecto no encontrado');
}

export async function addTeamMember(id: string, userId: string): Promise<IProyecto> {
  const proyecto = await proyectoRepository.addToEquipo(id, userId);
  if (!proyecto) throw new AppError(404, 'Proyecto no encontrado');
  return proyecto;
}

export async function removeTeamMember(id: string, userId: string): Promise<IProyecto> {
  const proyecto = await proyectoRepository.removeFromEquipo(id, userId);
  if (!proyecto) throw new AppError(404, 'Proyecto no encontrado');
  return proyecto;
}