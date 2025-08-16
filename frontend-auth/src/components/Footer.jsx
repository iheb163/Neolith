// src/components/Footer.jsx
import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export default function Footer() {
  return (
    <Box component="footer" sx={{
      mt: 4,
      py: 2,
      px: 2,
      borderTop: '1px solid rgba(0,0,0,0.12)',
      textAlign: 'center'
    }}>
      <Typography variant="body2" color="text.secondary">
        © {new Date().getFullYear()} Mon entreprise — Informations et contacts
      </Typography>
    </Box>
  );
}
