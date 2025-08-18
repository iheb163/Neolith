// src/auth/constants.ts
export const jwtConstants = {
  // lis dans process.env.JWT_SECRET si défini, sinon valeur par défaut
  secret: process.env.JWT_SECRET || 'jwt_secret_key',
};
