import React from 'react';
import { useNavigate } from 'react-router-dom';
import { clearToken } from './auth'; // <-- on importe clearToken

function MainPage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    clearToken(); // <-- supprime complètement le token
    navigate('/'); // <-- redirection vers la page de connexion
  };

  return (
    <div>
      <h2>Bienvenue !</h2>
      <button onClick={handleLogout}>Se déconnecter</button>
    </div>
  );
}

export default MainPage;
