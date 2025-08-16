import React from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Header from './components/Header';
import Footer from './components/Footer';

export default function MainPage() {
  return (
    <>
      <Header />
      <Container maxWidth="lg">
        <Box sx={{ mt: 4 }}>
          <Typography variant="h4" gutterBottom>
            Bienvenue sur la page principale
          </Typography>

          <Typography variant="body1">
            Ici tu peux afficher le contenu principal de ton application.
          </Typography>
        </Box>
      </Container>
      <Footer />
    </>
  );
}
