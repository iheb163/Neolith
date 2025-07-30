import React, { useState } from 'react';
import axios from 'axios';

function RegisterForm() {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    password: '',
    tel: '',
    date_naissance: '',
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/user', formData); // adapte le port si besoin
      setMessage('Utilisateur créé avec succès ✅');
    } catch (error) {
      console.error(error);
      setMessage("Erreur lors de la création de l'utilisateur ❌");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: 'auto' }}>
      <h2>Créer un utilisateur</h2>
      {['nom', 'prenom', 'email', 'password', 'tel', 'date_naissance'].map((field) => (
        <div key={field} style={{ marginBottom: '10px' }}>
          <input
            type={field === 'password' ? 'password' : field === 'date_naissance' ? 'date' : 'text'}
            name={field}
            placeholder={field}
            value={formData[field]}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
      ))}
      <button type="submit">S'inscrire</button>
      <p>{message}</p>
    </form>
  );
}

export default RegisterForm;
