// src/App.js
import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import axios from 'axios';
import LoginPage from './LoginPage';
import MainPage from './MainPage';
import RegisterForm from './RegisterForm';
import LocalitesList from './LocalitesList';
import LocaliteCreate from './LocaliteCreate'; // <-- nouvel import
import PrivateRoute from './PrivateRoute';
import { getToken, isTokenExpired, clearToken } from './auth';

export default function App() {
  useEffect(() => {
    const token = getToken();
    if (token && !isTokenExpired()) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
      if (token && isTokenExpired()) clearToken();
    }

    const interceptor = axios.interceptors.response.use(
      res => res,
      err => {
        if (err.response?.status === 401) {
          clearToken();
          window.location.href = '/';
        }
        return Promise.reject(err);
      }
    );
    return () => axios.interceptors.response.eject(interceptor);
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

      {/* Route pour créer une nouvelle localité */}
      <Route
        path="/localites/create"
        element={
          <PrivateRoute>
            <LocaliteCreate />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}
