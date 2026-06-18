export const jwtConfig = {
  secret: process.env.JWT_SECRET || 'sua_chave_secreta_super_segura_aqui',
  expiresIn: process.env.JWT_EXPIRES_IN || '24h'
};
