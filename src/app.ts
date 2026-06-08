import 'dotenv/config';
import express, { Request, Response } from 'express';
import swaggerUi from 'swagger-ui-express';

import { errorHandler } from './middlewares/errorHandler';
import { swaggerDocs } from './config/swagger.config';

import { usuarioRoutes } from './routes/usuario.routes';
import { tipoCampanhaRoutes } from './routes/tipoCampanha.routes';
import { campanhaRoutes } from './routes/campanha.routes';
import { opcaoRoutes } from './routes/campanhaOpcao.routes';

const app = express();

app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(usuarioRoutes);
app.use(tipoCampanhaRoutes);
app.use(campanhaRoutes);
app.use(opcaoRoutes);

app.get('/ping', (req: Request, res: Response) => {
  res.json({ message: 'Pong! Servidor do Bolão está online ⚽' });
});

app.use(errorHandler);

export { app };