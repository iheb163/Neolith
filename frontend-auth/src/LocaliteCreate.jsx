// src/LocaliteCreate.jsx
import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box, MenuItem, Alert } from '@mui/material';
import Header from './components/Header';
import Footer from './components/Footer';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { getToken, isTokenExpired, clearToken } from './auth';

const typeOptions = [
  { value: 'agence', label: 'Agence' },
  { value: 'immeuble', label: 'Immeuble' },
  { value: 'siege', label: 'Siège' },
  { value: 'appartement', label: 'Appartement' },
];

export default function LocaliteCreate() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    type: 'agence',
    superficie: '',
    city: '',
    adresse: '',
    code: '',
    nombre_employes: '',
    ref_steg: '',
    maps: '',
    region: '',
    local: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const validate = () => {
    if (!form.type) return 'Choisir le type.';
    if (!form.city) return 'La city est requise.';
    if (!form.adresse) return 'L\'adresse est requise.';
    if (!form.code) return 'Le code est requis et doit être un nombre.';
    if (!form.region) return 'La région est requise.';
    if (!form.local) return 'Le local est requis.';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const v = validate();
    if (v) { setError(v); return; }

    const payload = {
      type: form.type,
      superficie: form.superficie ? parseFloat(form.superficie) : undefined,
      city: form.city,
      adresse: form.adresse,
      code: parseInt(form.code, 10),
      nombre_employes: form.nombre_employes ? parseInt(form.nombre_employes, 10) : undefined,
      ref_steg: form.ref_steg ? parseInt(form.ref_steg, 10) : undefined,
      maps: form.maps || undefined,
      region: form.region,
      local: form.local,
    };

    const token = getToken();
    if (!token || isTokenExpired()) {
      clearToken();
      navigate('/', { replace: true });
      return;
    }
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    axios.defaults.baseURL = axios.defaults.baseURL || 'http://localhost:3000';

    setLoading(true);
    try {
      await axios.post('/localites', payload);
      navigate('/localites');
    } catch (err) {
      console.error('Erreur création localité', err);
      const serverMsg = err.response?.data?.message || err.message;
      setError('Erreur lors de la création : ' + serverMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>Créer une nouvelle localité</Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'grid', gap: 2 }}>
          <TextField select label="Type" name="type" value={form.type} onChange={handleChange} fullWidth>
            {typeOptions.map((o) => (<MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>))}
          </TextField>

          <TextField label="Superficie (m²)" name="superficie" value={form.superficie}
            onChange={handleChange} type="number" inputProps={{ step: '0.01' }} fullWidth />

          <TextField label="City" name="city" value={form.city}
            onChange={handleChange} fullWidth required />

          <TextField label="Adresse" name="adresse" value={form.adresse}
            onChange={handleChange} fullWidth required />

          <TextField label="Code (unique)" name="code" value={form.code}
            onChange={handleChange} type="number" fullWidth required />

          <TextField label="Nombre d'employés" name="nombre_employes" value={form.nombre_employes}
            onChange={handleChange} type="number" fullWidth />

          <TextField label="Ref STEG" name="ref_steg" value={form.ref_steg}
            onChange={handleChange} type="number" fullWidth />

          <TextField label="Maps (optionnel)" name="maps" value={form.maps}
            onChange={handleChange} fullWidth />

          <TextField label="Region" name="region" value={form.region}
            onChange={handleChange} fullWidth required />

          <TextField label="Local" name="local" value={form.local}
            onChange={handleChange} fullWidth required />

          <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? 'Envoi...' : 'Créer'}
            </Button>
            <Button variant="outlined" onClick={() => navigate('/localites')}>Annuler</Button>
          </Box>
        </Box>
      </Container>
      <Footer />
    </>
  );
}
