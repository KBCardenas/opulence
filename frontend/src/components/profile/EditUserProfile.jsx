import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate
import userService from '../../services/userService'; // Importa tu servicio de usuario

const EditUserProfile = () => {
    const [userInfo, setUserInfo] = useState({
        nombre: '',
        apellido: '',
        correo: '',
        telefono: '',
        direccion: ''
    });
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate(); // Inicializa useNavigate

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await userService.userProfile(); // Llama a tu servicio
                setUserInfo(response.data); // Guarda la información en el estado
            } catch (err) {
                setError('Error al obtener la información del usuario');
                console.error(err);
            } finally {
                setIsLoading(false); // Termina el estado de carga
            }
        };

        fetchUserInfo(); // Llama a la función al montar el componente
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserInfo((prev) => ({ ...prev, [name]: value })); // Actualiza el estado
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await userService.updateUser(userInfo); // Llama a tu servicio para actualizar el usuario
            navigate('/user-profile'); // Redirige al perfil de usuario
        } catch (err) {
            setError('Error al actualizar la información del usuario');
            console.error(err);
        }
    };

    if (isLoading) {
        return <div className="text-center">Cargando...</div>; // Mensaje de carga
    }

    return (
        <div className="container mt-4">
            <h2 className="text-center">Editar Información del Usuario</h2>
            {error && <div className="alert alert-danger">{error}</div>} {/* Muestra error si existe */}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Nombre</label>
                    <input
                        type="text"
                        className="form-control"
                        name="nombre"
                        value={userInfo.nombre}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Apellido</label>
                    <input
                        type="text"
                        className="form-control"
                        name="apellido"
                        value={userInfo.apellido}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Correo</label>
                    <input
                        type="email"
                        className="form-control"
                        name="correo"
                        value={userInfo.correo}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Teléfono</label>
                    <input
                        type="tel"
                        className="form-control"
                        name="telefono"
                        value={userInfo.telefono}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Dirección</label>
                    <input
                        type="text"
                        className="form-control"
                        name="direccion"
                        value={userInfo.direccion}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">Actualizar Información</button>
            </form>
        </div>
    );
};

export default EditUserProfile;
