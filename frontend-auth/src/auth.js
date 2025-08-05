// src/auth.js

// Sauvegarde le token JWT dans le localStorage
export const login = (token) => {
  localStorage.setItem('token', token);
};

// Récupère le token JWT
export const getToken = () => {
  return localStorage.getItem('token');
};

// Vérifie si l'utilisateur est authentifié (présence d'un token)
export const isAuthenticated = () => {
  return !!getToken();
};

// Supprime le token (déconnexion)
export const logout = () => {
  localStorage.removeItem('token');
};
