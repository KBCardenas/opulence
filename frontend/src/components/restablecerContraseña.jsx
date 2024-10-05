// ResetPassword.jsx
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';  // Para obtener el token de la URL

const ResetPassword = () => {
  const { token } = useParams();  // Obtener el token desde la URL
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Enviar la nueva contraseña y el token al backend
    const response = await fetch('http://localhost:5000/api/users/reset-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ password, token })
    });

    if (response.ok) {
      alert('Contraseña restablecida con éxito');
      navigate('/login');  // Redirigir al login
    } else {
      alert('Error al restablecer la contraseña');
    }
  };

  return (
    <div>
      <h2>Restablecer contraseña</h2>
      <form onSubmit={handleSubmit}>
        <input 
          type="password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Nueva contraseña"
          required
        />
        <button type="submit">Restablecer contraseña</button>
      </form>
    </div>
  );
};

export default ResetPassword;
