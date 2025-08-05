import React from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from './auth';

function MainPage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div>
      <h2>Bienvenue !</h2>
      <button onClick={handleLogout}>Se déconnecter</button>
    </div>
  );
}

export default MainPage;
