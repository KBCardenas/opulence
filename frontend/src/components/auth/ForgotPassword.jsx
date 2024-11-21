import { useState } from 'react';
import axios from 'axios';

const ForgotPassword = () => {
    const [correo, setCorreo] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        try {
            const response = await axios.post('http://localhost:5000/api/forgot-password', { correo });
            setMessage(response.data.message);
        } catch (err) {
            setError(err.response?.data?.error || 'Error al enviar el correo');
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center">Recuperar Contraseña</h2>
            <form onSubmit={handleSubmit} className="p-4 border rounded shadow-sm">
                <div className="mb-3">
                    <label htmlFor="correo" className="form-label">Correo Electrónico</label>
                    <input
                        type="email"
                        className="form-control"
                        id="correo"
                        value={correo}
                        onChange={(e) => setCorreo(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary w-100">Enviar</button>
            </form>
            {message && <p className="mt-3 text-success text-center">{message}</p>}
            {error && <p className="mt-3 text-danger text-center">{error}</p>}
        </div>
    );
};

export default ForgotPassword;
