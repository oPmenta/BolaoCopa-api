import 'dotenv/config';
import express, { Request, Response } from 'express';
import swaggerUi from 'swagger-ui-express';
import cors from 'cors'; // <-- adicionado
import path from 'path';

import { errorHandler } from './middlewares/errorHandler';
import { swaggerDocs } from './config/swagger.config';

import { usuarioRoutes } from './routes/usuario.routes';
import { tipoCampanhaRoutes } from './routes/tipoCampanha.routes';
import { campanhaRoutes } from './routes/campanha.routes';
import { opcaoRoutes } from './routes/campanhaOpcao.routes';
import { meioPagamentoRoutes } from './routes/meioPagamento.routes';
import { apostaRoutes } from './routes/aposta.routes';

const app = express();

// ===== CONFIGURAÇÃO CORS =====
// Em desenvolvimento, permita todas as origens (ou especifique a do frontend)
app.use(cors({
  origin: 'http://localhost:5173', // URL do frontend
  credentials: true,
}));
// Se quiser permitir qualquer origem (mais permissivo, não recomendado em produção):
// app.use(cors());
// ==============================

app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(usuarioRoutes);
app.use(tipoCampanhaRoutes);
app.use(campanhaRoutes);
app.use(opcaoRoutes);
app.use(meioPagamentoRoutes);
app.use(apostaRoutes);

app.get('/ping', (req: Request, res: Response) => {
  res.json({ message: 'Servidor do Bolão está online!' });
});

app.use(errorHandler);

export { app };