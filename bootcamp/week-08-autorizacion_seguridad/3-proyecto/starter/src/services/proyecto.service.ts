import { Proyecto, IProyecto } from '../models/proyecto.model.js';
import type { CreateProyectoDto, UpdateProyectoDto } from '../schemas/proyecto.schema.js';

// ============================================
// Lógica de negocio — Proyectos solidarios
// ============================================

export interface ProyectoFiltros {
  categoria?: string;
  estado?: string;
}

export async function findAll(filters: ProyectoFiltros = {}): Promise<IProyecto[]> {
  const query: Record<string, unknown> = { active: true };
  if (filters.categoria) query.categoria = filters.categoria;
  if (filters.estado) query.estado = filters.estado;

  return Proyecto.find(query).sort({ createdAt: -1 });
}

export async function findById(id: string): Promise<IProyecto | null> {
  return Proyecto.findById(id);
}

export async function create(data: CreateProyectoDto, userId: string): Promise<IProyecto> {
  // createdBy guarda quién creó el recurso (para autorización posterior)
  return Proyecto.create({ ...data, createdBy: userId });
}

export async function update(
  id: string,
  data: UpdateProyectoDto,
  requesterId: string,
  requesterRole: string
): Promise<IProyecto | null> {
  const proyecto = await Proyecto.findById(id);
  if (!proyecto) return null;

  // Un usuario solo puede editar SU proyecto; admin puede editar cualquiera
  if (requesterRole !== 'admin' && proyecto.createdBy !== requesterId) {
    throw new Error('FORBIDDEN'); // capturado en el controller → 403
  }

  return Proyecto.findByIdAndUpdate(id, data, { new: true, runValidators: true });
}

export async function remove(id: string): Promise<IProyecto | null> {
  // Solo admin — enforced en la ruta (authMiddleware + requireRole('admin'))
  return Proyecto.findByIdAndDelete(id);
}
