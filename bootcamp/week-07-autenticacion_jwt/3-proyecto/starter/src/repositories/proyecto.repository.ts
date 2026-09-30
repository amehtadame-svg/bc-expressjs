import { ProyectoModel, IProyecto } from '../models/proyecto.model';
import { CreateProyectoDto, UpdateProyectoDto } from '../schemas/proyecto.schema';
import { AppError } from '../errors/AppError';

export async function findAll(): Promise<IProyecto[]> {
  return ProyectoModel.find({ activo: true }).sort({ createdAt: -1 }).lean();
}

export async function findById(id: string): Promise<IProyecto | null> {
  return ProyectoModel.findById(id).lean();
}

export async function findByFilters(filters: Partial<{
  categoria: string;
  estado: string;
  creadoPor: string;
}>): Promise<IProyecto[]> {
  const query: Record<string, unknown> = { activo: true };
  if (filters.categoria) query.categoria = filters.categoria;
  if (filters.estado) query.estado = filters.estado;
  if (filters.creadoPor) query.creadoPor = filters.creadoPor;
  return ProyectoModel.find(query).sort({ createdAt: -1 }).lean();
}

export async function create(data: CreateProyectoDto & { creadoPor: string }): Promise<IProyecto> {
  const proyecto = await ProyectoModel.create(data);
  return proyecto;
}

export async function updateById(id: string, data: UpdateProyectoDto): Promise<IProyecto | null> {
  const updated = await ProyectoModel.findByIdAndUpdate(id, data, { new: true, runValidators: true }).lean();
  return updated;
}

export async function deleteById(id: string): Promise<boolean> {
  const result = await ProyectoModel.findByIdAndUpdate(id, { activo: false }, { new: true });
  return !!result;
}

export async function addToEquipo(id: string, userId: string): Promise<IProyecto | null> {
  return ProyectoModel.findByIdAndUpdate(id, { $addToSet: { equipo: userId } }, { new: true }).lean();
}

export async function removeFromEquipo(id: string, userId: string): Promise<IProyecto | null> {
  return ProyectoModel.findByIdAndUpdate(id, { $pull: { equipo: userId } }, { new: true }).lean();
}