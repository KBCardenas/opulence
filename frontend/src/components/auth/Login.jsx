import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Para redirigir
import api from '../../services/authService'; // Servicio API para login
import useAuth from '../../hooks/useAuth'; // Hook para manejar el estado de autenticación

const Login = () => {
    const [correo, setCorreo] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [error, setError] = useState('');
    const { saveToken } = useAuth(); // Usamos el hook para manejar el token y rol
    const navigate = useNavigate(); // Inicializamos el hook de navegación

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            // Realizamos la solicitud de login a la API
            const response = await api.login({ correo, contrasena });

            // Desestructuramos la respuesta
            const { token, user } = response.data;

            // Guardamos el token y el rol (esAdmin) en localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('esAdmin', user.esAdmin ? 'true' : 'false'); // Guardamos como string 'true' o 'false'

            // Usamos el hook saveToken para guardar en el estado
            saveToken(token, user.esAdmin);

            // Redirigimos según el rol del usuario
            if (user.esAdmin) {
                navigate('/admin');  // Redirige al dashboard de administrador
            } else {
                navigate('/home');   // Redirige a la página de inicio para usuarios normales
            }
        } catch (err) {
            if (err.response) {
                setError(err.response.data.error || 'Error al iniciar sesión');
            } else {
                setError('Error de red');
            }
        }
    };

    return (
        <section className='container-fluid py-5 vh-100 negrobg'>
            <div className='row d-flex align-items-center justify-content-center h-100'>
                <div className="col-12 col-md-8 col-lg-6 col-xl-5">
                    <div className="card shadow-2-strong rounded-4">
                        <form onSubmit={handleLogin} className='card-body p-5 text-center'>
                            <h2 className='mb-4'>LOG-IN</h2>

                            <div className='form-outline mb-4 text-start'>
                                <label htmlFor="correo" className='form-label fs-5'>Correo:</label>
                                <input
                                    className='form-control form-control-lg i-opu'
                                    type="email"
                                    id="correo"
                                    value={correo}
                                    onChange={(e) => setCorreo(e.target.value)}
                                    required
                                />
                            </div>
                            <div className='form-outline mb-5 text-start'>
                                <label htmlFor="contrasena" className='form-label fs-5'>Contraseña:</label>
                                <input
                                    className='form-control form-control-lg i-opu'
                                    type="password"
                                    id="contrasena"
                                    value={contrasena}
                                    onChange={(e) => setContrasena(e.target.value)}
                                    required
                                />
                            </div>
                            {error && <p style={{ color: 'red' }}>{error}</p>}
                            <button className='btn btn-opu btn-lg btn-block w-100 mb-4 amarillobg fw-bold text-uppercase' type="submit">ingresar</button>

                            <p>
                                ¿No tienes una cuenta? <a href="/register">Regístrate!</a>
                            </p> 
                            <p>
                                ¿Olvidaste la contraseña? <a href="/forgot-password">Recuperala!</a>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Login;
