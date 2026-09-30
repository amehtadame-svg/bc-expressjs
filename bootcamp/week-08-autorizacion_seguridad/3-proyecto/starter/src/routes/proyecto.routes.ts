import { Router } from 'express';
import {
  listProyectos,
  getProyectoById,
  createProyecto,
  updateProyecto,
  deleteProyecto,
} from '../controllers/proyecto.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { requireRole } from '../middlewares/requireRole.js';

const router = Router();

// ============================================
// Políticas de acceso — Proyectos solidarios (Fundaciones / ONG)
// ============================================
//
//   GET    /            → Público  (catálogo visible sin cuenta)
//   GET    /:id         → Público  (detalle visible sin cuenta)
//   POST   /            → Autenticado
//   PATCH  /:id         → Autenticado (dueño O admin — verificado en el service)
//   DELETE /:id         → Solo admin
//
// IMPORTANTE: requireRole SIEMPRE después de authMiddleware

// GET all — público
router.get('/', listProyectos);

// GET by ID — público
router.get('/:id', getProyectoById);

// POST — crear proyecto requiere autenticación
router.post('/', authMiddleware, createProyecto);

// PATCH — actualizar: autenticado (service verifica si es dueño o admin)
router.patch('/:id', authMiddleware, updateProyecto);

// DELETE — eliminar: solo admin
router.delete('/:id', authMiddleware, requireRole('admin'), deleteProyecto);

export default router;
