import { z } from 'zod';

// ============================================
// Schemas Zod — Proyecto solidario (Fundaciones / ONG)
// ============================================
// Zod valida y sanitiza (previene XSS al rechazar HTML).

const noHtml = /^[^<>]*$/;

const ubicacionSchema = z.object({
  pais: z.string().min(1, 'El país es requerido').max(100).regex(noHtml, 'No se permite HTML'),
  region: z.string().min(1, 'La región es requerida').max(100).regex(noHtml, 'No se permite HTML'),
  ciudad: z.string().min(1, 'La ciudad es requerida').max(100).regex(noHtml, 'No se permite HTML'),
});

export const createProyectoSchema = z.object({
  body: z
    .object({
      titulo: z
        .string()
        .min(5, 'El título debe tener al menos 5 caracteres')
        .max(200)
        .regex(noHtml, 'El título no puede contener HTML'),
      descripcion: z.string().max(1000).regex(noHtml, 'No se permite HTML').optional(),
      categoria: z.enum(
        ['educacion', 'salud', 'medio-ambiente', 'comunidad', 'emergencia', 'cultura'],
        { message: 'Categoría no válida' }
      ),
      estado: z.enum(['borrador', 'activo', 'completado'], { message: 'Estado no válido' }).optional(),
      fechaInicio: z.string().datetime({ message: 'Formato de fecha inválido (ISO 8601)' }),
      fechaFinEstimada: z.string().datetime({ message: 'Formato de fecha inválido (ISO 8601)' }),
      presupuesto: z.number().min(0, 'El presupuesto debe ser positivo'),
      moneda: z.enum(['USD', 'EUR', 'COP', 'MXN', 'BRL', 'ARS', 'CLP', 'PEN']).optional(),
      ubicacion: ubicacionSchema,
      beneficiarios: z.number().int().min(1, 'Debe haber al menos 1 beneficiario'),
      organizacion: z.string().max(200).regex(noHtml, 'No se permite HTML').optional(),
    })
    .refine((data) => new Date(data.fechaFinEstimada) > new Date(data.fechaInicio), {
      message: 'La fecha de fin estimada debe ser posterior a la fecha de inicio',
      path: ['fechaFinEstimada'],
    }),
});

export const updateProyectoSchema = z.object({
  body: z
    .object({
      titulo: z.string().min(5).max(200).regex(noHtml).optional(),
      descripcion: z.string().max(1000).regex(noHtml).optional(),
      categoria: z
        .enum(['educacion', 'salud', 'medio-ambiente', 'comunidad', 'emergencia', 'cultura'])
        .optional(),
      estado: z.enum(['borrador', 'activo', 'completado']).optional(),
      fechaInicio: z.string().datetime({ message: 'Formato de fecha inválido (ISO 8601)' }).optional(),
      fechaFinEstimada: z.string().datetime({ message: 'Formato de fecha inválido (ISO 8601)' }).optional(),
      presupuesto: z.number().min(0).optional(),
      moneda: z.enum(['USD', 'EUR', 'COP', 'MXN', 'BRL', 'ARS', 'CLP', 'PEN']).optional(),
      ubicacion: ubicacionSchema.optional(),
      beneficiarios: z.number().int().min(1).optional(),
      organizacion: z.string().max(200).regex(noHtml).optional(),
      active: z.boolean().optional(),
    })
    .refine(
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
    ),
});

export type CreateProyectoDto = z.infer<typeof createProyectoSchema>['body'];
export type UpdateProyectoDto = z.infer<typeof updateProyectoSchema>['body'];
