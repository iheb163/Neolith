// src/RegisterForm.jsx
import React, { useState } from 'react';
import axios from 'axios';
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function RegisterForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    password: '',
    tel: '',
    date_naissance: '',
  });

  const [feedback, setFeedback] = useState(''); // message à afficher
  const [severity, setSeverity] = useState('success'); // 'success' | 'error'
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((s) => ({ ...s, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('http://localhost:3000/user', formData);
      setSeverity('success');
      setFeedback("Utilisateur créé avec succès ✅");
      // rediriger vers la page de connexion après un court délai
      setTimeout(() => {
        navigate('/login');
      }, 1200);
    } catch (error) {
      console.error(error);
      setSeverity('error');
      // si l'API retourne un message, essaie de le montrer
      const apiMsg = error.response?.data?.message;
      setFeedback(apiMsg ? `Erreur : ${apiMsg}` : "Erreur lors de la création de l'utilisateur ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'background.default', // utilise theme.palette.background.default
        py: 6,
      }}
    >
      <Container maxWidth="sm">
        <Typography variant="h4" gutterBottom>
          Inscription
        </Typography>

        {feedback && (
          <Alert severity={severity} sx={{ mb: 2 }}>
            {feedback}
          </Alert>
        )}

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2.5,
            mt: 2,
          }}
        >
          <TextField
            label="Nom"
            name="nom"
            value={formData.nom}
            onChange={handleChange}
            variant="outlined"
            fullWidth
            required
          />

          <TextField
            label="Prénom"
            name="prenom"
            value={formData.prenom}
            onChange={handleChange}
            variant="outlined"
            fullWidth
            required
          />

          <TextField
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            variant="outlined"
            fullWidth
            required
          />

          <TextField
            label="Mot de passe"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            variant="outlined"
            fullWidth
            required
          />

          <TextField
            label="Téléphone"
            name="tel"
            value={formData.tel}
            onChange={handleChange}
            variant="outlined"
            fullWidth
          />

          <TextField
            label="Date de naissance"
            name="date_naissance"
            type="date"
            value={formData.date_naissance}
            onChange={handleChange}
            variant="outlined"
            fullWidth
            InputLabelProps={{ shrink: true }}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}
            size="large"
          >
            {loading ? 'Enregistrement...' : "S'inscrire"}
          </Button>

          <Button
            variant="outlined"
            fullWidth
            onClick={() => navigate('/')}
          >
            Annuler / Aller à la connexion
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
