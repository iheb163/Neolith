// src/MesuresList.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Typography, CircularProgress, Button, Box, Alert, IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Header from './components/Header';
import Footer from './components/Footer';
import { useNavigate } from 'react-router-dom';
import { getToken, isTokenExpired, clearToken } from './auth';

export default function MesuresList() {
  const [mesures, setMesures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionMessage, setActionMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    async function fetch() {
      setLoading(true);
      setError('');
      try {
        axios.defaults.baseURL = axios.defaults.baseURL || 'http://localhost:3000';
        const token = getToken();
        if (!token || isTokenExpired()) { clearToken(); navigate('/', { replace: true }); return; }
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        const res = await axios.get('/mesures');
        if (mounted) setMesures(res.data || []);
      } catch (err) {
        console.error('Erreur fetch mesures', err);
        if (err.response?.status === 401) { clearToken(); navigate('/', { replace: true }); return; }
        if (mounted) setError('Impossible de récupérer les mesures.');
      } finally { if (mounted) setLoading(false); }
    }
    fetch();
    return () => { mounted = false; };
  }, [navigate]);

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cette mesure ?')) return;
    try {
      const token = getToken();
      if (!token || isTokenExpired()) { clearToken(); navigate('/', { replace: true }); return; }
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      await axios.delete(`/mesures/${id}`);
      setMesures(prev => prev.filter(m => m.id !== id));
      setActionMessage('Mesure supprimée');
    } catch (err) {
      console.error('Erreur suppression', err);
      setError(err.response?.data?.message || 'Erreur lors de la suppression');
    }
  };

  useEffect(() => {
    if (!actionMessage) return;
    const t = setTimeout(() => setActionMessage(''), 3000);
    return () => clearTimeout(t);
  }, [actionMessage]);

  return (
    <>
      <Header />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5">Liste des mesures</Typography>
          <Button variant="contained" onClick={() => navigate('/mesures/create')}>Nouvelle mesure</Button>
        </Box>

        {actionMessage && <Alert severity="success" sx={{ mb: 2 }}>{actionMessage}</Alert>}
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Désignation</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Unité</TableCell>
                  <TableCell>Prix unitaire</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {mesures.map(m => (
                  <TableRow key={m.id}>
                    <TableCell>{m.designation}</TableCell>
                    <TableCell>{m.type}</TableCell>
                    <TableCell>{m.unite}</TableCell>
                    <TableCell>
                      {m.prixunit !== null && m.prixunit !== undefined
                        ? Number(m.prixunit).toFixed(2)
                        : '-'}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton size="small" onClick={() => navigate(`/mesures/${m.id}/edit`)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleDelete(m.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}

                {mesures.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} align="center">Aucune mesure.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Container>
      <Footer />
    </>
  );
}
