// src/LocaliteCreate.jsx
import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box, MenuItem, Alert } from '@mui/material';
import Header from './components/Header';
import Footer from './components/Footer';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const siteOptions = [
  { value: 'agence', label: 'Agence' },
  { value: 'immeuble', label: 'Immeuble' },
  { value: 'siege', label: 'Siège' },
];

export default function LocaliteCreate() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    site: 'agence',
    superficie: '',
    ville: '',
    code_postal: '',
    adresse: '',
    latitude: '',
    longitude: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const validate = () => {
    if (!form.site) return 'Choisir le type de site.';
    if (!form.ville) return 'La ville est requise.';
    if (!form.adresse) return 'L\'adresse est requise.';
    // code_postal, superficie, lat/lon facultatifs
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const v = validate();
    if (v) { setError(v); return; }

    // Préparer payload et convertir les nombres
    const payload = {
      site: form.site,
      superficie: form.superficie ? parseFloat(form.superficie) : undefined,
      ville: form.ville,
      code_postal: form.code_postal ? parseInt(form.code_postal, 10) : undefined,
      adresse: form.adresse,
      latitude: form.latitude ? parseFloat(form.latitude) : undefined,
      longitude: form.longitude ? parseFloat(form.longitude) : undefined,
    };

    setLoading(true);
    try {
      await axios.post('http://localhost:3000/localites', payload);
      // redirection vers la liste après création
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
          <TextField
            select
            label="Site"
            name="site"
            value={form.site}
            onChange={handleChange}
            fullWidth
          >
            {siteOptions.map((o) => (
              <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
            ))}
          </TextField>

          <TextField
            label="Superficie (m²)"
            name="superficie"
            value={form.superficie}
            onChange={handleChange}
            type="number"
            inputProps={{ step: '0.01' }}
            fullWidth
          />

          <TextField
            label="Ville"
            name="ville"
            value={form.ville}
            onChange={handleChange}
            fullWidth
            required
          />

          <TextField
            label="Code postal"
            name="code_postal"
            value={form.code_postal}
            onChange={handleChange}
            type="number"
            fullWidth
          />

          <TextField
            label="Adresse"
            name="adresse"
            value={form.adresse}
            onChange={handleChange}
            fullWidth
            required
          />

          <TextField
            label="Latitude"
            name="latitude"
            value={form.latitude}
            onChange={handleChange}
            type="number"
            inputProps={{ step: '0.000001' }}
            fullWidth
          />

          <TextField
            label="Longitude"
            name="longitude"
            value={form.longitude}
            onChange={handleChange}
            type="number"
            inputProps={{ step: '0.000001' }}
            fullWidth
          />

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
