import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate
import authService from '../../services/authService';
import useAuth from '../../hooks/useAuth'; // Importa useAuth para gestionar el token

const Register = () => {
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        correo: '',
        telefono: '',
        direccion: '',
        contrasena: ''
    });
    const [message, setMessage] = useState('');
    const navigate = useNavigate(); // Inicializa useNavigate
    const { saveToken } = useAuth(); // Importa la función para guardar el token

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await authService.register(formData);
            const token = response.data.token; // Asegúrate de que el token se retorne en la respuesta
            saveToken(token); // Guarda el token en localStorage
            setMessage(response.data.message || 'Registro exitoso'); // Notificación de éxito
            navigate('/home'); // Redirige a la página de inicio
        } catch (error) {
            console.error(error);
            setMessage(error.response?.data?.error || 'Error al registrar usuario');
        }
    };

    return (
        <section className='container-fluid py-5 negrobg'>
            <div className='row d-flex align-items-center justify-content-center h-100'>
            <div className="col-12 col-md-8 col-lg-6 col-xl-5">
            <div className="card shadow-2-strong rounded-4">
            <form onSubmit={handleSubmit} className='card-body p-5 text-center'>
                <h2 className='mb-4'>SIGN-UP</h2>

                <div className='form-outline mb-4'>
                <input type="text" name="nombre" className='form-control form-control-lg i-opu' placeholder="Nombre" onChange={handleChange} required />
                </div>

                <div className='form-outline mb-4'>
                <input type="text" name="apellido" className='form-control form-control-lg i-opu' placeholder="Apellido" onChange={handleChange} required />
                </div>

                <div className='form-outline mb-4'>
                <input type="email" name="correo" className='form-control form-control-lg i-opu' placeholder="Correo" onChange={handleChange} required />
                </div>

                <div className='form-outline mb-4'>
                <input type="text" name="telefono" className='form-control form-control-lg i-opu' placeholder="Teléfono" onChange={handleChange} required />
                </div>

                <div className='form-outline mb-4'>
                <input type="text" name="direccion" className='form-control form-control-lg i-opu' placeholder="Dirección" onChange={handleChange} required />
                </div>

                <div className='form-outline mb-4'>
                <input type="password" name="contrasena" className='form-control form-control-lg i-opu' placeholder="Contraseña" onChange={handleChange} required />
                </div>

                <button type="submit" className='btn btn-opu btn-lg btn-block w-100 mb-4 amarillobg fw-bold text-uppercase'>Registrarse</button>
                <p>
                ¿Ya tienes una cuenta? <a href="/login">Inicia sesión</a>
                </p>

                {message && <p>{message}</p>} {/* Mostrar mensaje al usuario */}
            </form>
            
            </div>
            </div>
            </div>
        </section>
    );
};

export default Register;
