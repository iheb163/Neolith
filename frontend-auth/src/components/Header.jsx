// src/components/Header.jsx
import React, { useEffect, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Avatar from '@mui/material/Avatar';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { clearToken, getToken, isTokenExpired } from '../auth';

export default function Header() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null); // { nom, prenom, email } ou null
  const [loadingUser, setLoadingUser] = useState(false);

  // Petit utilitaire pour décoder le payload JWT (safe)
  const decodePayload = (token) => {
    if (!token) return null;
    try {
      const part = token.split('.')[1];
      if (!part) return null;
      const json = atob(part.replace(/-/g, '+').replace(/_/g, '/'));
      return JSON.parse(json);
    } catch (e) {
      console.error('decodePayload error', e);
      return null;
    }
  };

  useEffect(() => {
    const token = getToken();
    if (!token || (isTokenExpired && isTokenExpired())) {
      // pas de token valide -> on ne charge rien
      setUser(null);
      return;
    }

    const payload = decodePayload(token);
    const userId = payload?.sub ?? payload?.userId ?? payload?.id;

    if (!userId) {
      // si payload ne contient pas l'id, on peut afficher email si présent
      if (payload?.email) setUser({ nom: '', prenom: payload.email, email: payload.email });
      return;
    }

    // applique header si non présent (au cas où)
    axios.defaults.baseURL = axios.defaults.baseURL || 'http://localhost:3000';
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    // fetch user details
    let mounted = true;
    setLoadingUser(true);
    axios.get(`/user/${userId}`)
      .then((res) => {
        if (!mounted) return;
        const data = res.data;
        // attend un objet user { nom, prenom, email, ... }
        setUser({
          nom: data?.nom ?? '',
          prenom: data?.prenom ?? '',
          email: data?.email ?? '',
        });
      })
      .catch((err) => {
        console.error('Header: impossible de récupérer user', err);
        // si 401 -> purge token et redirection
        if (err.response?.status === 401) {
          clearToken();
          navigate('/', { replace: true });
        } else {
          // fallback: on peut afficher l'email du token si disponible
          if (payload?.email) setUser({ nom: '', prenom: payload.email, email: payload.email });
          else setUser(null);
        }
      })
      .finally(() => {
        if (mounted) setLoadingUser(false);
      });

    return () => { mounted = false; };
  }, [navigate]);

  const handleLogout = () => {
    clearToken();
    navigate('/', { replace: true });
  };

  const initials = (() => {
    if (!user) return '';
    const p = user.prenom?.trim() ?? '';
    const n = user.nom?.trim() ?? '';
    const initial1 = p ? p[0].toUpperCase() : n ? n[0].toUpperCase() : '';
    const initial2 = n ? n[0].toUpperCase() : p && p[1] ? p[1].toUpperCase() : '';
    return (initial1 + initial2) || '';
  })();

  return (
    <AppBar position="static" color="primary" sx={{ mb: 3 }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 1 }}>
            <MenuIcon />
          </IconButton>

          <Typography
            variant="h6"
            component="div"
            sx={{ cursor: 'pointer' }}
            onClick={() => navigate('/main')}
          >
            Mon Application
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button color="inherit" onClick={() => navigate('/localites')}>Localités</Button>
          <Button color="inherit" onClick={() => navigate('/mesures')}>Mesures</Button>

          {/* Bouton Consommations plus gros avec effet hover */}
          <Button
            color="inherit"
            onClick={() => navigate('/consommations/create')}
            sx={{
              px: 2.5,
              py: 0.8,
              fontWeight: 600,
              borderRadius: 2,
              marginLeft: 1,
              boxShadow: '2px 3px 8px rgba(0,0,0,0.12)',
              transition: 'transform 150ms ease, box-shadow 150ms ease, background-color 150ms',
              '&:hover': {
                transform: 'translateY(-3px) scale(1.03)',
                boxShadow: '6px 8px 18px rgba(0,0,0,0.25)',
                backgroundColor: 'primary.light',
              },
            }}
            variant="contained" // variante pour plus de contraste
          >
            Consommations
          </Button>

          {/* Avatar + nom/prénom */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 2 }}>
            <Avatar sx={{ width: 40, height: 40, bgcolor: 'secondary.main' }}>
              {initials || <span aria-hidden>U</span>}
            </Avatar>

            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <Typography variant="body2" sx={{ lineHeight: 1 }}>
                {loadingUser ? 'Chargement...' : (user ? `${user.prenom} ${user.nom}`.trim() : 'Invité')}
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.8 }}>
                {user?.email ?? ''}
              </Typography>
            </Box>
          </Box>

          <Box>
            <Button color="inherit" variant="outlined" onClick={handleLogout}>
              Se déconnecter
            </Button>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
