import express from 'express';
import cookieParser from 'cookie-parser';
import { authRouter } from './routes/auth.routes';
import { proyectoRouter } from './routes/proyecto.routes';
import { errorHandler } from './middlewares/errorHandler';
import { notFound } from './middlewares/notFound';

export const app = express();

app.use(express.json());
app.use(cookieParser());

// Rutas de autenticación
app.use('/api/v1/auth', authRouter);

// Rutas de proyectos de la fundación
app.use('/api/v1/proyectos', proyectoRouter);

app.use(notFound);
app.use(errorHandler);