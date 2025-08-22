// src/MesureCreate.jsx
import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box, MenuItem, Alert } from '@mui/material';
import Header from './components/Header';
import Footer from './components/Footer';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { getToken, isTokenExpired, clearToken } from './auth';

const typeOptions = [{ value: 'I', label: 'I' }, { value: 'R', label: 'R' }];
const uniteOptions = [{ value: 'kwh', label: 'kWh' }, { value: 'm3', label: 'm³' }];

export default function MesureCreate() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ designation: '', type: 'I', unite: 'kwh', prixunit: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // validations client
    if (!form.designation || !form.designation.trim()) {
      setError('La désignation est requise');
      return;
    }
    if (form.prixunit === '' || isNaN(Number(form.prixunit))) {
      setError('Le prix unitaire est requis et doit être un nombre');
      return;
    }

    const payload = {
      designation: form.designation.trim(),
      type: form.type,
      unite: form.unite,
      prixunit: parseFloat(form.prixunit),
    };

    try {
      setLoading(true);
      axios.defaults.baseURL = axios.defaults.baseURL || 'http://localhost:3000';
      const token = getToken();
      if (!token || isTokenExpired()) { clearToken(); navigate('/', { replace: true }); return; }
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      await axios.post('/mesures', payload);
      navigate('/mesures');
    } catch (err) {
      console.error('Erreur création mesure', err);
      setError(err.response?.data?.message || 'Erreur lors de la création');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>Nouvelle mesure</Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'grid', gap: 2 }}>
          <TextField
            label="Désignation"
            name="designation"
            value={form.designation}
            onChange={handleChange}
            required
          />

          <TextField select label="Type" name="type" value={form.type} onChange={handleChange}>
            {typeOptions.map(o => <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>)}
          </TextField>

          <TextField select label="Unité" name="unite" value={form.unite} onChange={handleChange}>
            {uniteOptions.map(o => <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>)}
          </TextField>

          <TextField
            label="Prix unitaire"
            name="prixunit"
            value={form.prixunit}
            onChange={handleChange}
            type="number"
            inputProps={{ step: '0.01' }}
            required
            helperText="Entrez le prix unitaire (ex: 12.50)"
          />

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? 'Envoi...' : 'Créer'}
            </Button>
            <Button variant="outlined" onClick={() => navigate('/mesures')}>
              Annuler
            </Button>
          </Box>
        </Box>
      </Container>
      <Footer />
    </>
  );
}
