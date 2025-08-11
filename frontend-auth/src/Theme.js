/* =========================
   src/theme.js (amélioré : boutons animés + formulaire stylé)
   ========================= */

import { createTheme } from '@mui/material/styles';

/* petites constantes réutilisées pour garder de la cohérence */
const custom = {
  inputBg: '#A9A9A9',                // couleur initiale fournie
  pageBg: '#d0f0c0',
  primaryMain: '#87CEEB',            // bouton principal
  primaryHover: '#6dbfd6',
  outlinedBtnHoverBg: '#e0f0ff',
  inputBoxShadow: '3px 3px 8px rgba(0,0,0,0.12)',
  btnBoxShadow: '4px 6px 18px rgba(0,0,0,0.18)',
  smallBtnBoxShadow: '2px 2px 6px rgba(0,0,0,0.12)',
};

const theme = createTheme({
  palette: {
    primary: {
      main: custom.primaryMain,
      contrastText: '#000000',
    },
    background: {
      default: custom.pageBg,
      paper: '#ffffff',
    },
    grey: {
      500: custom.inputBg,
    },
    custom, // exposer l'objet custom dans theme.palette.custom si besoin ailleurs
  },

  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    h4: {
      fontWeight: 600,
    },
  },

  components: {
    /* CssBaseline : fond global */
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: custom.pageBg,
        },
      },
    },

    /* Boutons : style global + animation hover */
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 10,
          transition: 'transform 220ms cubic-bezier(.2,.8,.2,1), box-shadow 220ms, background-color 220ms',
          boxShadow: custom.btnBoxShadow,
        },
        /* variant contained + color primary */
        containedPrimary: {
          backgroundColor: custom.primaryMain,
          color: '#000',
          '&:hover': {
            backgroundColor: custom.primaryHover,
            transform: 'translateY(-4px) scale(1.01)',
            boxShadow: '8px 12px 30px rgba(0,0,0,0.22)',
          },
          '&:active': {
            transform: 'translateY(-1px) scale(0.995)',
            boxShadow: '4px 6px 12px rgba(0,0,0,0.18)',
          },
        },
        /* variant outlined (bord / hover) */
        outlined: {
          borderWidth: 1,
          borderStyle: 'solid',
          borderColor: custom.primaryMain,
          color: '#000',
          backgroundColor: 'transparent',
          '&:hover': {
            backgroundColor: custom.outlinedBtnHoverBg,
            transform: 'translateY(-3px)',
            boxShadow: custom.smallBtnBoxShadow,
          },
        },
        /* facultatif : small sizing consistent */
        sizeLarge: {
          padding: '10px 18px',
        },
      },
    },

    /* Inputs (TextField variant="outlined") : fond, bord, focus, ombre */
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          backgroundColor: custom.inputBg,
          boxShadow: custom.inputBoxShadow,
          transition: 'box-shadow 180ms, background-color 180ms, transform 180ms',
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'transparent',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(0,0,0,0.12)',
          },
          '&.Mui-focused': {
            backgroundColor: '#ffffff', /* sur focus on éclaircit l'input */
            boxShadow: `0 8px 20px rgba(135,206,235,0.12)`,
            transform: 'translateY(-1px)',
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: custom.primaryMain,
            },
          },
        },
        input: {
          padding: '12px 14px',
        },
      },
    },

    /* Label du champ */
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: 'rgba(0,0,0,0.7)',
          fontSize: '0.95rem',
          '&.Mui-focused': {
            color: custom.primaryMain,
            fontWeight: 600,
          },
        },
      },
    },

    /* Helper text (erreur / hint) */
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          marginLeft: 0,
          marginTop: 6,
          color: 'rgba(0,0,0,0.6)',
        },
      },
    },

    /* Paper / Card légerement arrondi si utilisé */
    MuiPaper: {
      styleOverrides: {
        elevation1: {
          borderRadius: 12,
        },
      },
    },
  },
});

export default theme;
