import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { login as saveToken, getToken, isTokenExpired } from './auth';

export default function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [feedback, setFeedback] = useState('');

  // Si un token valide existe déjà → on va direct sur /main
  useEffect(() => {
    const token = getToken();
    if (token && !isTokenExpired()) {
      // s'assurer aussi que axios a bien le header (au refresh)
      axios.defaults.baseURL = axios.defaults.baseURL || 'http://localhost:3000';
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      navigate('/main', { replace: true });
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // on utilise baseURL d'axios (défini dans App.js)
      const { data } = await axios.post('/auth/login', { email, password });

      if (!data || !data.access_token) {
        // Réponse inattendue du serveur
        console.error('LOGIN: réponse inattendue', data);
        setFeedback('Réponse inattendue du serveur');
        return;
      }

      // Sauvegarde du token JWT dans le localStorage (auth.js)
      saveToken(data.access_token);

      // Ajoute le token dans Axios pour les futures requêtes (immédiat)
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.access_token}`;

      setFeedback('Connexion réussie !');
      // petit délai pour afficher le message, puis redirection
      setTimeout(() => navigate('/main'), 400);
    } catch (err) {
      console.error('LOGIN ERROR full:', err);
      // affiche message serveur si présent (utile pour debug)
      const server = err.response ? err.response.data : null;
      if (server?.message) {
        setFeedback(`Échec : ${server.message}`);
      } else if (server) {
        setFeedback(`Échec : ${JSON.stringify(server)}`);
      } else {
        setFeedback('Erreur de connexion');
      }
    }
  };

  // Efface le message après 4 sec
  useEffect(() => {
    if (feedback) {
      const timer = setTimeout(() => setFeedback(''), 4000);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'background.default',
      }}
    >
      <Container maxWidth="sm">
        <Typography variant="h4" gutterBottom>
          Connexion
        </Typography>

        {feedback && (
          <Alert severity={feedback.startsWith('Échec') ? 'error' : 'success'} sx={{ mb: 2 }}>
            {feedback}
          </Alert>
        )}

        <Box
          component="form"
          onSubmit={handleLogin}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
            mt: 4,
          }}
        >
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <TextField
            label="Mot de passe"
            type="password"
            variant="outlined"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
          >
            Se connecter
          </Button>

          <Button
            variant="outlined"
            fullWidth
            onClick={() => navigate('/register')}
          >
            S'inscrire
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
