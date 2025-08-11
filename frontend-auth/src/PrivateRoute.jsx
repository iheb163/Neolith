// src/PrivateRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated, isTokenExpired } from './auth';

export default function PrivateRoute({ children }) {
  if (!isAuthenticated() || isTokenExpired()) {
    // supprime le token si expiré
    localStorage.removeItem('token');
    return <Navigate to="/" replace />;
  }
  return children;
}
