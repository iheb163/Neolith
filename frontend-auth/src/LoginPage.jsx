// src/LoginPage.jsx
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
import { login as saveToken } from './auth';

export default function LoginPage() {
  const navigate = useNavigate();

  // State pour email, password et message d'erreur / succès
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [feedback, setFeedback] = useState('');

  // Fonction de soumission du formulaire
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        'http://localhost:3000/auth/login',
        { email, password }
      );
      // Sauvegarde du token JWT et redirection
      saveToken(data.access_token);
      setFeedback('Connexion réussie !'); 
      navigate('/main');
    } catch (err) {
      setFeedback(
        err.response?.data?.message
          ? `Échec : ${err.response.data.message}`
          : 'Erreur de connexion'
      );
    }
  };

  // Affiche le feedback quelques secondes
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
        backgroundColor: '#d0f0c0',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Container maxWidth="sm">
        <Typography variant="h4" gutterBottom>
          Connexion
        </Typography>

        {feedback && (
          <Alert severity={feedback.startsWith('Échec') ? 'error' : 'success'} 
                 sx={{ mb: 2 }}>
            {feedback}
          </Alert>
        )}

        <Box
          component="form"
          onSubmit={handleLogin}           // <-- soumission
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
            value={email}                   // <-- bind value
            onChange={e => setEmail(e.target.value)} // <-- onChange
            InputProps={{
              sx: {
                backgroundColor: '#A9A9A9',
                boxShadow: '3px 3px 8px rgba(0,0,0,0.2)',
                borderRadius: 2,
              },
            }}
          />

          <TextField
            label="Mot de passe"
            type="password"
            variant="outlined"
            fullWidth
            value={password}                // <-- bind value
            onChange={e => setPassword(e.target.value)} // <-- onChange
            InputProps={{
              sx: {
                backgroundColor: '#A9A9A9',
                boxShadow: '3px 3px 8px rgba(0,0,0,0.2)',
                borderRadius: 2,
              },
            }}
          />

          <Button
            type="submit"                   // <-- bouton submit
            variant="contained"
            fullWidth
            sx={{
              backgroundColor: '#87CEEB',
              color: '#000',
              boxShadow: '4px 4px 10px rgba(0,0,0,0.3)',
              borderRadius: 2,
              py: 1.2,
              '&:hover': {
                backgroundColor: '#6dbfd6',
              },
            }}
          >
            Se connecter
          </Button>

          <Button
            variant="outlined"
            fullWidth
            onClick={() => navigate('/register')}
            sx={{
              borderColor: '#87CEEB',
              color: '#000',
              boxShadow: '2px 2px 5px rgba(0,0,0,0.2)',
              borderRadius: 2,
              py: 1.2,
              '&:hover': {
                backgroundColor: '#e0f0ff',
              },
            }}
          >
            S'inscrire
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
