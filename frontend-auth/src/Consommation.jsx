// src/Consommation.jsx
import React, { useEffect, useState } from 'react';
import {
  Container, TextField, Button, Typography, Box, MenuItem, Alert, CircularProgress
} from '@mui/material';
import Header from './components/Header';
import Footer from './components/Footer';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { getToken, isTokenExpired, clearToken } from './auth';

/**
 * Helper : format number with fixed 3 decimals and thousand separators
 * We'll use 3 decimals because 1 TND = 1000 millimes -> precision millimes -> 3 decimals in TND.
 */
const formatDinars = (value) => {
  if (value === null || value === undefined || isNaN(Number(value))) return '';
  return new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 3, maximumFractionDigits: 3 }).format(Number(value));
};

export default function ConsommationCreate() {
  const navigate = useNavigate();
  const [localites, setLocalites] = useState([]);
  const [mesures, setMesures] = useState([]);
  const [form, setForm] = useState({ localiteId: '', mesureId: '', releve: '' });
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  // selected mesure (object) based on mesureId
  const selectedMesure = mesures.find(m => String(m.id) === String(form.mesureId));

  // prix unit (millimes) from mesure
  const prixUnitMillimes = selectedMesure ? Number(selectedMesure.prixunit) : NaN;

  // montant in millimes (client-side calculation)
  const montantMillimes =
    form.releve !== '' && !isNaN(Number(form.releve)) && !isNaN(prixUnitMillimes)
      ? Number(form.releve) * prixUnitMillimes
      : null;

  // convert to dinars for display: 1 TND = 1000 millimes
  const montantDinars = montantMillimes !== null ? Number(montantMillimes) / 1000 : null;

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        axios.defaults.baseURL = axios.defaults.baseURL || 'http://localhost:3000';
        const token = getToken();
        if (!token || isTokenExpired()) { clearToken(); navigate('/', { replace: true }); return; }
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        const [lRes, mRes] = await Promise.all([
          axios.get('/localites'),
          axios.get('/mesures'),
        ]);
        if (!mounted) return;
        setLocalites(lRes.data || []);
        setMesures(mRes.data || []);
      } catch (err) {
        console.error('Erreur chargement options', err);
        setError('Impossible de charger les listes (localités / mesures).');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, [navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.localiteId || !form.mesureId) { setError('Sélectionnez la localité et la mesure.'); return; }
    if (form.releve === '' || isNaN(Number(form.releve))) { setError('Saisissez un relevé numérique valide.'); return; }

    const payload = {
      localiteId: parseInt(form.localiteId, 10),
      mesureId: parseInt(form.mesureId, 10),
      releve: parseFloat(form.releve),
    };

    try {
      setSending(true);
      await axios.post('/consommations', payload);
      // redirige vers la liste des consommations si tu l'as, sinon main
      navigate('/consommations');
    } catch (err) {
      console.error('Erreur création consommation', err);
      setError(err.response?.data?.message || 'Erreur lors de la création');
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <Container sx={{ mt: 6, mb: 6, textAlign: 'center' }}>
          <CircularProgress />
        </Container>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>Nouvelle consommation</Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'grid', gap: 2 }}>
          <TextField
            select
            label="Localité"
            name="localiteId"
            value={form.localiteId}
            onChange={handleChange}
            required
          >
            {localites.map(l => (
              <MenuItem key={l.id} value={l.id}>{l.local}</MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Mesure"
            name="mesureId"
            value={form.mesureId}
            onChange={handleChange}
            required
          >
            {mesures.map(m => (
              <MenuItem key={m.id} value={m.id}>
                {m.designation}{m.unite ? ` (${m.unite})` : ''}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Relevé"
            name="releve"
            value={form.releve}
            onChange={handleChange}
            type="number"
            inputProps={{ step: '0.0001' }}
            required
            helperText="Saisir la valeur mesurée"
          />

          {/* Montant affiché en dinars (conversion à partir des millimes) */}
          <TextField
            label="Montant"
            name="montant"
            value={
              montantDinars !== null
                ? `TND ${formatDinars(montantDinars)}`
                : ''
            }
            InputProps={{ readOnly: true }}
            helperText={
              selectedMesure
                ? `Prix unitaire: ${isNaN(prixUnitMillimes) ? '-' : `${prixUnitMillimes} millimes (${formatDinars(prixUnitMillimes/1000)} TND)`}`
                : 'Sélectionnez une mesure pour voir l’unité et le prix unitaire'
            }
          />

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button type="submit" variant="contained" disabled={sending}>{sending ? 'Envoi...' : 'Calculer'}</Button>
            <Button variant="outlined" onClick={() => navigate('/main')}>Annuler</Button>
          </Box>
        </Box>
      </Container>
      <Footer />
    </>
  );
}
