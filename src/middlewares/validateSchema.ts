import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { AppError } from '../utils/AppError';

export const validateRequest = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const dados = req.body;
      const resultado = schema.safeParse(dados);

      if (!resultado.success) {
        const erros = resultado.error.issues.map(err => ({
          campo: err.path.map(String).join('.'),
          mensagem: err.message
        }));
        
        throw new AppError(`Erro de validação: ${JSON.stringify(erros)}`, 400);
      }

      req.body = resultado.data;
      next();
    } catch (error: any) {
      const statusCode = error.statusCode || 400;
      return res.status(statusCode).json({
        success: false,
        message: error.message
      });
    }
  };
};
