// src/App.js
import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import axios from 'axios';
import LoginPage from './LoginPage';
import MainPage from './MainPage';
import RegisterForm from './RegisterForm';
import LocalitesList from './LocalitesList';
import LocaliteCreate from './LocaliteCreate';
import MesuresList from './MesuresList';
import MesureCreate from './MesureCreate';
import ConsommationCreate from './Consommation'; // <-- import ajouté
import PrivateRoute from './PrivateRoute';
import { getToken, isTokenExpired, clearToken } from './auth';

export default function App() {
  useEffect(() => {
    // baseURL centralisé : évite d'écrire http://localhost:3000 partout
    axios.defaults.baseURL = 'http://localhost:3000';

    const applyTokenHeader = () => {
      const token = getToken();
      if (token && !isTokenExpired()) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        console.log('[App] Authorization header applied');
      } else {
        delete axios.defaults.headers.common['Authorization'];
        if (token && isTokenExpired()) {
          clearToken();
          console.log('[App] Token expired -> cleared');
        }
      }
    };

    applyTokenHeader();

    // Intercepteur global : si serveur renvoie 401, on purge le token et on redirige
    const interceptor = axios.interceptors.response.use(
      (res) => res,
      (err) => {
        if (err.response?.status === 401) {
          clearToken();
          // redirection forcée vers login
          window.location.href = '/';
        }
        return Promise.reject(err);
      }
    );

    // Ecoute les changements de localStorage (ex: token mis par un autre onglet)
    const onStorage = (ev) => {
      if (ev.key === 'token') {
        applyTokenHeader();
      }
    };
    window.addEventListener('storage', onStorage);

    return () => {
      axios.interceptors.response.eject(interceptor);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/register" element={<RegisterForm />} />

      <Route
        path="/main"
        element={
          <PrivateRoute>
            <MainPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/localites"
        element={
          <PrivateRoute>
            <LocalitesList />
          </PrivateRoute>
        }
      />

      <Route
        path="/localites/create"
        element={
          <PrivateRoute>
            <LocaliteCreate />
          </PrivateRoute>
        }
      />

      {/* Mesures */}
      <Route
        path="/mesures"
        element={
          <PrivateRoute>
            <MesuresList />
          </PrivateRoute>
        }
      />
      <Route
        path="/mesures/create"
        element={
          <PrivateRoute>
            <MesureCreate />
          </PrivateRoute>
        }
      />

      {/* Consommations - création */}
      <Route
        path="/consommations/create"
        element={
          <PrivateRoute>
            <ConsommationCreate />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}
