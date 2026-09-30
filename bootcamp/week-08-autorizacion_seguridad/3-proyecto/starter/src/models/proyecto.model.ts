import { Schema, model, Document } from 'mongoose';

// ============================================
// Modelo del recurso principal — Proyecto solidario (Fundaciones / ONG)
// ============================================
//
// El campo createdBy guarda el ID del usuario que creó el recurso:
// permite que el dueño pueda editar SU proyecto y que solo un admin
// pueda eliminarlo.

export type CategoriaProyecto =
  | 'educacion'
  | 'salud'
  | 'medio-ambiente'
  | 'comunidad'
  | 'emergencia'
  | 'cultura';

export type EstadoProyecto = 'borrador' | 'activo' | 'completado';

export interface IProyecto extends Document {
  titulo: string;
  descripcion?: string;
  categoria: CategoriaProyecto;
  estado: EstadoProyecto;
  fechaInicio: Date;
  fechaFinEstimada: Date;
  presupuesto: number;
  moneda: string;
  ubicacion: {
    pais: string;
    region: string;
    ciudad: string;
  };
  beneficiarios: number;
  organizacion?: string;
  active: boolean;
  createdBy: string; // user ID — do NOT remove
  createdAt: Date;
  updatedAt: Date;
}

const proyectoSchema = new Schema<IProyecto>(
  {
    titulo: {
      type: String,
      required: [true, 'El título del proyecto es requerido'],
      trim: true,
      maxlength: [200, 'El título no puede exceder 200 caracteres'],
    },
    descripcion: {
      type: String,
      trim: true,
      maxlength: [1000, 'Máximo 1000 caracteres'],
    },
    categoria: {
      type: String,
      required: [true, 'La categoría es requerida'],
      enum: {
        values: ['educacion', 'salud', 'medio-ambiente', 'comunidad', 'emergencia', 'cultura'],
        message: 'Categoría no válida',
      },
    },
    estado: {
      type: String,
      enum: ['borrador', 'activo', 'completado'],
      default: 'borrador',
    },
    fechaInicio: {
      type: Date,
      required: [true, 'La fecha de inicio es requerida'],
    },
    fechaFinEstimada: {
      type: Date,
      required: [true, 'La fecha de fin estimada es requerida'],
    },
    presupuesto: {
      type: Number,
      required: [true, 'El presupuesto es requerido'],
      min: [0, 'El presupuesto debe ser positivo'],
    },
    moneda: {
      type: String,
      default: 'USD',
      enum: ['USD', 'EUR', 'COP', 'MXN', 'BRL', 'ARS', 'CLP', 'PEN'],
    },
    ubicacion: {
      pais: { type: String, required: true, trim: true },
      region: { type: String, required: true, trim: true },
      ciudad: { type: String, required: true, trim: true },
    },
    beneficiarios: {
      type: Number,
      required: [true, 'La cantidad de beneficiarios es requerida'],
      min: [1, 'Debe haber al menos 1 beneficiario'],
    },
    organizacion: {
      type: String,
      trim: true,
      maxlength: [200, 'Máximo 200 caracteres'],
    },
    active: { type: Boolean, default: true },
    createdBy: { type: String, required: true }, // user ID
  },
  { timestamps: true }
);

proyectoSchema.index({ categoria: 1, estado: 1 });
proyectoSchema.index({ createdBy: 1 });

export const Proyecto = model<IProyecto>('Proyecto', proyectoSchema);
