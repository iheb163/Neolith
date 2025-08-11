import React, { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import axios from 'axios';

import LoginPage from './LoginPage';
import MainPage from './MainPage';
import RegisterForm from './RegisterForm';
import PrivateRoute from './PrivateRoute';

import { getToken, isTokenExpired, clearToken } from './auth';

export default function App() {
  const navigate = useNavigate();

  useEffect(() => {
    // Mettre le token dans l'entête Authorization si présent
    const token = getToken();
    if (token && !isTokenExpired()) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
      // si token expiré on le nettoie
      if (token && isTokenExpired()) {
        clearToken();
      }
    }

    // Intercepteur global pour gérer les 401 (token invalide / expiré)
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Supprime token et renvoie à la page de login
          clearToken();
          // useNavigate ne marche pas ici (hors composant), on utilise location
          window.location.href = '/';
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, [navigate]);

  return (
    <Routes>
      {/* page de connexion publique */}
      <Route path="/" element={<LoginPage />} />

      {/* route protégée : /main */}
      <Route
        path="/main"
        element={
          <PrivateRoute>
            <MainPage />
          </PrivateRoute>
        }
      />

      {/* page d'inscription publique */}
      <Route path="/register" element={<RegisterForm />} />
    </Routes>
  );
}
