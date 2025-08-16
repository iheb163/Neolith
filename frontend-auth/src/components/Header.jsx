// src/components/Header.jsx
import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';
import { clearToken } from '../auth';

export default function Header() {
  const navigate = useNavigate();

  const handleLogout = () => {
    clearToken();
    navigate('/');
  };

  return (
    <AppBar position="static" color="primary" sx={{ mb: 3 }}>
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
          <MenuIcon />
        </IconButton>

        <Typography variant="h6" component="div" sx={{ flexGrow: 1, cursor: 'pointer' }}
          onClick={() => navigate('/main')}>
          Mon Application
        </Typography>

        <Button color="inherit" onClick={() => navigate('/localites')}>Localités</Button>

        <Box sx={{ ml: 2 }}>
          <Button color="inherit" variant="outlined" onClick={handleLogout}>
            Se déconnecter
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
