import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ResetPassword = () => {
    const { token } = useParams(); // Capturar el token de la URL
    const [nuevaContrasena, setNuevaContrasena] = useState('');
    const [confirmarContrasena, setConfirmarContrasena] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        if (nuevaContrasena !== confirmarContrasena) {
            setError("Las contraseñas no coinciden");
            return;
        }

        try {
            // Enviar la nueva contraseña al backend junto con el token
            const response = await axios.post('http://localhost:5000/api/reset-password', { token, nuevaContrasena });
            setMessage(response.data.message);
            
            // Redirigir al usuario al login después de unos segundos
            setTimeout(() => {
                navigate('/login');
            }, 3000); // Esperar 3 segundos antes de redirigir
        } catch (err) {
            setError(err.response?.data?.message || 'Error al restablecer la contraseña');
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center">Restablecer Contraseña</h2>
            <form onSubmit={handleSubmit} className="p-4 border rounded shadow-sm">
                <div className="mb-3">
                    <label htmlFor="nuevaContrasena" className="form-label">Nueva Contraseña</label>
                    <input
                        type="password"
                        className="form-control"
                        id="nuevaContrasena"
                        value={nuevaContrasena}
                        onChange={(e) => setNuevaContrasena(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="confirmarContrasena" className="form-label">Confirmar Contraseña</label>
                    <input
                        type="password"
                        className="form-control"
                        id="confirmarContrasena"
                        value={confirmarContrasena}
                        onChange={(e) => setConfirmarContrasena(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary w-100">Restablecer</button>
            </form>
            {message && <p className="mt-3 text-success text-center">{message}</p>}
            {error && <p className="mt-3 text-danger text-center">{error}</p>}
        </div>
    );
};

export default ResetPassword;
