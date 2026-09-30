import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import * as proyectoController from '../controllers/proyecto.controller';

const router = Router();

router.get('/', authMiddleware, proyectoController.getAll);
router.get('/:id', authMiddleware, proyectoController.getById);
router.post('/', authMiddleware, proyectoController.create);
router.patch('/:id', authMiddleware, proyectoController.update);
router.delete('/:id', authMiddleware, proyectoController.remove);
router.post('/:id/equipo', authMiddleware, proyectoController.addTeamMember);
router.delete('/:id/equipo', authMiddleware, proyectoController.removeTeamMember);

export { router as proyectoRouter };