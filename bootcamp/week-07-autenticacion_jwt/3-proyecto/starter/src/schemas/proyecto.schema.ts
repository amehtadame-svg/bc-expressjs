import { z } from 'zod';

// ============================================
// Schemas Zod — Recurso principal: Proyecto (Fundaciones / ONG)
// ============================================

const ubicacionSchema = z.object({
  pais: z.string().min(1, 'El país es requerido').trim(),
  region: z.string().min(1, 'La región es requerida').trim(),
  ciudad: z.string().min(1, 'La ciudad es requerida').trim(),
  coordenadas: z
    .object({
      lat: z.number().min(-90, 'Latitud inválida').max(90, 'Latitud inválida'),
      lng: z.number().min(-180, 'Longitud inválida').max(180, 'Longitud inválida'),
    })
    .optional(),
});

const beneficiariosSchema = z.object({
  cantidad: z.number().int().min(1, 'Debe haber al menos 1 beneficiario'),
  descripcion: z.string().min(1, 'La descripción de beneficiarios es requerida').trim(),
  gruposObjetivo: z.array(z.string().trim().min(1)).min(1, 'Al menos un grupo objetivo'),
});

const indicadorSchema = z.object({
  indicador: z.string().min(1, 'Indicador requerido').trim(),
  meta: z.number().min(1, 'La meta debe ser mayor a 0'),
  unidad: z.string().min(1, 'Unidad requerida').trim(),
  valorActual: z.number().min(0, 'El valor actual no puede ser negativo').default(0),
});

const documentoSchema = z.object({
  nombre: z.string().min(1).trim(),
  url: z.string().url('URL inválida'),
  tipo: z.enum(['informe', 'presupuesto', 'informe-tecnico', 'foto', 'video', 'otro']),
});

const categorias = [
  'educacion',
  'salud',
  'medio-ambiente',
  'comunidad',
  'emergencia',
  'cultura',
  'investigacion',
] as const;

const estados = [
  'borrador',
  'activo',
  'en-progreso',
  'completado',
  'cancelado',
  'pausado',
] as const;

const monedas = ['USD', 'EUR', 'COP', 'MXN', 'BRL', 'ARS', 'CLP', 'PEN'] as const;

// ── Base compartida entre create y update ─────────────────────────────────────
const proyectoBaseSchema = z.object({
  titulo: z
    .string()
    .min(5, 'El título debe tener al menos 5 caracteres')
    .max(200, 'El título no puede exceder 200 caracteres')
    .trim(),
  descripcion: z
    .string()
    .min(10, 'La descripción debe tener al menos 10 caracteres')
    .max(5000, 'Máximo 5000 caracteres'),
  descripcionCorta: z
    .string()
    .min(10, 'La descripción corta debe tener al menos 10 caracteres')
    .max(500, 'Máximo 500 caracteres'),
  categoria: z.enum(categorias, { message: 'Categoría no válida' }),
  estado: z.enum(estados, { message: 'Estado no válido' }).default('borrador'),
  fechaInicio: z.string().datetime({ message: 'Formato de fecha inválido (ISO 8601)' }),
  fechaFinEstimada: z.string().datetime({ message: 'Formato de fecha inválido (ISO 8601)' }),
  fechaFinReal: z.string().datetime({ message: 'Formato de fecha inválido (ISO 8601)' }).optional(),
  presupuestoTotal: z.number().min(0, 'El presupuesto debe ser positivo'),
  presupuestoEjecutado: z.number().min(0, 'El presupuesto ejecutado no puede ser negativo').default(0),
  moneda: z.enum(monedas, { message: 'Moneda no válida' }).default('USD'),
  ubicacion: ubicacionSchema,
  beneficiarios: beneficiariosSchema,
  objetivos: z.array(z.string().min(1, 'Objetivo no puede estar vacío').trim()).min(1, 'Al menos un objetivo'),
  indicadores: z.array(indicadorSchema).optional(),
  socios: z.array(z.string().trim()).optional(),
  financiadoPor: z.array(z.string().trim()).optional(),
  documentos: z.array(documentoSchema).optional(),
  equipo: z.array(z.string()).optional(),
  activo: z.boolean().optional(),
});

// ── Create ────────────────────────────────────────────────────────────────────
export const createProyectoSchema = proyectoBaseSchema.refine(
  (data) => new Date(data.fechaFinEstimada) > new Date(data.fechaInicio),
  {
    message: 'La fecha de fin estimada debe ser posterior a la fecha de inicio',
    path: ['fechaFinEstimada'],
  }
);

// ── Update (todos los campos opcionales, actualización parcial) ───────────────
export const updateProyectoSchema = proyectoBaseSchema.partial().refine(
  (data) => {
    if (data.fechaInicio && data.fechaFinEstimada) {
      return new Date(data.fechaFinEstimada) > new Date(data.fechaInicio);
    }
    return true;
  },
  {
    message: 'La fecha de fin estimada debe ser posterior a la fecha de inicio',
    path: ['fechaFinEstimada'],
  }
);

export type CreateProyectoDto = z.infer<typeof createProyectoSchema>;
export type UpdateProyectoDto = z.infer<typeof updateProyectoSchema>;
