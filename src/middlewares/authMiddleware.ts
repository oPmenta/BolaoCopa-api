import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { jwtConfig } from '../config/jwt.config';
import { AppError } from '../utils/AppError';

export interface AuthenticatedRequest extends Request {
  usuarioId?: string;
}

export const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new AppError('Token não fornecido.', 401);
    }

    const parts = authHeader.split(' ');

    if (parts.length !== 2) {
      throw new AppError('Formato de token inválido.', 401);
    }

    const [scheme, token] = parts;

    if (!/^Bearer$/i.test(scheme)) {
      throw new AppError('Token malformado.', 401);
    }

    const decoded = jwt.verify(token, jwtConfig.secret) as { usuarioId: string };
    req.usuarioId = decoded.usuarioId;

    return next();
  } catch (error: any) {
    const statusCode = error.statusCode || 401;
    return res.status(statusCode).json({
      success: false,
      message: error.message || 'Token inválido ou expirado.'
    });
  }
};
