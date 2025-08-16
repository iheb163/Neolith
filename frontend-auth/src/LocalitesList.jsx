// src/LocalitesList.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Typography, CircularProgress, Button, Box, Alert
} from '@mui/material';
import Header from './components/Header';
import Footer from './components/Footer';
import { useNavigate } from 'react-router-dom';

export default function LocalitesList() {
  const [localites, setLocalites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    async function fetchLocalites() {
      try {
        const res = await axios.get('http://localhost:3000/localites');
        if (mounted) setLocalites(res.data || []);
      } catch (err) {
        console.error('Erreur fetch localites', err);
        if (mounted) setError('Impossible de récupérer les localités.');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    fetchLocalites();
    return () => { mounted = false; };
  }, []);

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
                  <TableCell>ID</TableCell>
                  <TableCell>Site</TableCell>
                  <TableCell>Superficie</TableCell>
                  <TableCell>Ville</TableCell>
                  <TableCell>Code postal</TableCell>
                  <TableCell>Adresse</TableCell>
                  <TableCell>Latitude</TableCell>
                  <TableCell>Longitude</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {localites.map((loc) => (
                  <TableRow key={loc.id}>
                    <TableCell>{loc.id}</TableCell>
                    <TableCell>{loc.site}</TableCell>
                    <TableCell>{loc.superficie}</TableCell>
                    <TableCell>{loc.ville}</TableCell>
                    <TableCell>{loc.code_postal}</TableCell>
                    <TableCell>{loc.adresse}</TableCell>
                    <TableCell>{loc.latitude}</TableCell>
                    <TableCell>{loc.longitude}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Container>
      <Footer />
    </>
  );
}
