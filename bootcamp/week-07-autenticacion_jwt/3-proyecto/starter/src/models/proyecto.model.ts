import mongoose, { Document, Schema } from 'mongoose';

export interface IProyecto extends Document {
  titulo: string;
  descripcion: string;
  descripcionCorta: string;
  categoria: 'educacion' | 'salud' | 'medio-ambiente' | 'comunidad' | 'emergencia' | 'cultura' | 'investigacion';
  estado: 'borrador' | 'activo' | 'en-progreso' | 'completado' | 'cancelado' | 'pausado';
  fechaInicio: Date;
  fechaFinEstimada: Date;
  fechaFinReal?: Date;
  presupuestoTotal: number;
  presupuestoEjecutado: number;
  moneda: string;
  ubicacion: {
    pais: string;
    region: string;
    ciudad: string;
    coordenadas?: {
      lat: number;
      lng: number;
    };
  };
  beneficiarios: {
    cantidad: number;
    descripcion: string;
    gruposObjetivo: string[];
  };
  objetivos: string[];
  indicadores: {
    indicador: string;
    meta: number;
    unidad: string;
    valorActual: number;
  }[];
  socios: string[];
  financiadoPor: string[];
  documentos: {
    nombre: string;
    url: string;
    tipo: 'informe' | 'presupuesto' | 'informe-tecnico' | 'foto' | 'video' | 'otro';
  }[];
  creadoPor: mongoose.Types.ObjectId;
  equipo: mongoose.Types.ObjectId[];
  activo: boolean;
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
      required: [true, 'La descripción es requerida'],
      trim: true,
      maxlength: [5000, 'Máximo 5000 caracteres'],
    },
    descripcionCorta: {
      type: String,
      required: [true, 'La descripción corta es requerida'],
      maxlength: [500, 'Máximo 500 caracteres'],
    },
    categoria: {
      type: String,
      required: [true, 'La categoría es requerida'],
      enum: {
        values: ['educacion', 'salud', 'medio-ambiente', 'comunidad', 'emergencia', 'cultura', 'investigacion'],
        message: 'Categoría no válida',
      },
    },
    estado: {
      type: String,
      enum: ['borrador', 'activo', 'en-progreso', 'completado', 'cancelado', 'pausado'],
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
    fechaFinReal: {
      type: Date,
    },
    presupuestoTotal: {
      type: Number,
      required: [true, 'El presupuesto total es requerido'],
      min: [0, 'El presupuesto debe ser positivo'],
    },
    presupuestoEjecutado: {
      type: Number,
      default: 0,
      min: [0, 'El presupuesto ejecutado no puede ser negativo'],
    },
    moneda: {
      type: String,
      default: 'USD',
      enum: ['USD', 'EUR', 'COP', 'MXN', 'BRL', 'ARS', 'CLP', 'PEN'],
    },
    ubicacion: {
      pais: { type: String, required: [true, 'El país es requerido'], trim: true },
      region: { type: String, required: [true, 'La región es requerida'], trim: true },
      ciudad: { type: String, required: [true, 'La ciudad es requerida'], trim: true },
      coordenadas: {
        lat: { type: Number, min: -90, max: 90 },
        lng: { type: Number, min: -180, max: 180 },
      },
    },
    beneficiarios: {
      cantidad: { type: Number, required: [true, 'La cantidad de beneficiarios es requerida'], min: [1, 'Debe haber al menos 1 beneficiario'] },
      descripcion: { type: String, required: [true, 'La descripción de beneficiarios es requerida'] },
      gruposObjetivo: [{ type: String, trim: true }],
    },
    objetivos: [{
      type: String,
      required: true,
      trim: true,
    }],
    indicadores: [{
      indicador: { type: String, required: true, trim: true },
      meta: { type: Number, required: true, min: [1, 'La meta debe ser mayor a 0'] },
      unidad: { type: String, required: true, trim: true },
      valorActual: { type: Number, default: 0, min: 0 },
    }],
    socios: [{
      type: String,
      trim: true,
    }],
    financiadoPor: [{
      type: String,
      trim: true,
    }],
    documentos: [{
      nombre: { type: String, required: true, trim: true },
      url: { type: String, required: true, trim: true },
      tipo: { type: String, enum: ['informe', 'presupuesto', 'informe-tecnico', 'foto', 'video', 'otro'], required: true },
    }],
    creadoPor: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    equipo: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
    }],
    activo: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

proyectoSchema.index({ estado: 1, createdAt: -1 });
proyectoSchema.index({ creadoPor: 1 });
proyectoSchema.index({ categoria: 1, estado: 1 });
proyectoSchema.index({ 'ubicacion.pais': 1, 'ubicacion.region': 1 });
proyectoSchema.index({ 'beneficiarios.gruposObjetivo': 1 });

export const ProyectoModel = mongoose.model<IProyecto>('Proyecto', proyectoSchema);