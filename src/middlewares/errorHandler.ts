import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction): any {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  console.error("❌ ERRO INTERNO:", err);

  return res.status(500).json({
    status: 'error',
    message: 'Erro interno do servidor.',
  });
}