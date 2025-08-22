// src/LocalitesList.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Typography, CircularProgress, Button, Box, Alert, IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import Header from './components/Header';
import Footer from './components/Footer';
import { useNavigate } from 'react-router-dom';
import { getToken, isTokenExpired, clearToken } from './auth';

export default function LocalitesList() {
  const [localites, setLocalites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionMessage, setActionMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    async function fetchLocalites() {
      setError('');
      setLoading(true);

      try {
        axios.defaults.baseURL = axios.defaults.baseURL || 'http://localhost:3000';
        const token = getToken();
        if (!token || isTokenExpired()) {
          clearToken();
          navigate('/', { replace: true });
          return;
        }
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        const res = await axios.get('/localites');
        if (mounted) setLocalites(res.data || []);
      } catch (err) {
        console.error('Erreur fetch localites', err);
        if (err.response?.status === 401) {
          clearToken();
          navigate('/', { replace: true });
          return;
        }
        if (mounted) setError('Impossible de récupérer les localités.');
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchLocalites();

    return () => { mounted = false; };
  }, [navigate]);

  const handleDelete = async (id) => {
    const ok = window.confirm('Voulez-vous vraiment supprimer cette localité ?');
    if (!ok) return;

    try {
      const token = getToken();
      if (!token || isTokenExpired()) { clearToken(); navigate('/', { replace: true }); return; }
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      await axios.delete(`/localites/${id}`);
      setLocalites((prev) => prev.filter((l) => l.id !== id));
      setActionMessage('Localité supprimée');
    } catch (err) {
      console.error('Erreur suppression localité', err);
      if (err.response?.status === 401) { clearToken(); navigate('/', { replace: true }); return; }
      const msg = err.response?.data?.message || err.message || 'Erreur lors de la suppression';
      setError(msg);
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
          <Typography variant="h5">Liste des localités</Typography>
          <Button variant="contained" onClick={() => navigate('/localites/create')}>
            Nouvelle localité
          </Button>
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
                  <TableCell>Type</TableCell>
                  <TableCell>Superficie</TableCell>
                  <TableCell>City</TableCell>
                  <TableCell>Region</TableCell>
                  <TableCell>Local</TableCell>
                  <TableCell>Adresse</TableCell>
                  <TableCell>Code</TableCell>
                  <TableCell>Nb employés</TableCell>
                  <TableCell>Ref STEG</TableCell>
                  <TableCell>Maps</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {localites.map((loc) => (
                  <TableRow key={loc.id}>
                    <TableCell>{loc.type}</TableCell>
                    <TableCell>{loc.superficie}</TableCell>
                    <TableCell>{loc.city}</TableCell>
                    <TableCell>{loc.region}</TableCell>
                    <TableCell>{loc.local}</TableCell>
                    <TableCell>{loc.adresse}</TableCell>
                    <TableCell>{loc.code}</TableCell>
                    <TableCell>{loc.nombre_employes}</TableCell>
                    <TableCell>{loc.ref_steg}</TableCell>
                    <TableCell>{loc.maps}</TableCell>
                    <TableCell align="center">
                      <IconButton aria-label="delete" size="small" onClick={() => handleDelete(loc.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {localites.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={11} align="center">Aucune localité trouvée.</TableCell>
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
