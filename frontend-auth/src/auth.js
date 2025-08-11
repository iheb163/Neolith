// src/auth.js

// Sauvegarde le token JWT dans le localStorage
export const login = (token) => {
  localStorage.setItem('token', token);
};

// alias plus explicite si tu préfères saveToken()
export const saveToken = (token) => login(token);

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

// alias clearToken()
export const clearToken = () => logout();

// --- utilitaires pour gérer l'expiration du token (optionnel mais utile) ---

// Décode le payload d'un JWT sans dépendance externe
export const parseJwt = (token) => {
  if (!token) return null;
  try {
    const base64 = token.split('.')[1];
    const jsonPayload = decodeURIComponent(
      atob(base64.replace(/-/g, '+').replace(/_/g, '/'))
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
};

// Retourne true si le token est expiré (ou invalide/absent)
export const isTokenExpired = () => {
  const token = getToken();
  if (!token) return true;
  const payload = parseJwt(token);
  if (!payload || !payload.exp) return true;
  const now = Math.floor(Date.now() / 1000);
  return payload.exp < now;
};
