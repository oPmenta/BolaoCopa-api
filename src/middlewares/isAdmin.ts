import { Request, Response, NextFunction } from 'express';
import { prisma } from '../database/prismaClient';

export const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const usuarioId = (req as any).usuarioId;
    if (!usuarioId) throw new Error('Usuário não autenticado');

    const usuario = await prisma.usuario.findUnique({ where: { id: usuarioId } });
    if (!usuario || usuario.tipo_usuario !== 'ADMIN') {
      return res.status(403).json({ success: false, message: 'Acesso negado. Apenas administradores.' });
    }
    next();
  } catch (error: any) {
    return res.status(403).json({ success: false, message: error.message });
  }
};