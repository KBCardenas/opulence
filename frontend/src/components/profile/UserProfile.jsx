import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import userService from '../../services/userService';

const UserProfile = () => {
    const [userInfo, setUserInfo] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await userService.userProfile();
                setUserInfo(response.data);
            } catch (err) {
                setError('Error al obtener la información del usuario');
                console.error(err);
            }
        };
        fetchUserInfo();
    }, []);

    const handleEdit = () => {
        navigate('/edit-profile');
    };

    const handleDeleteAccount = async () => {
        const isConfirmed = window.confirm('¿Estás seguro de que deseas eliminar tu cuenta?');
        if (isConfirmed) {
            try {
                await userService.deleteAccount();
                alert('Cuenta eliminada exitosamente');
                navigate('/'); // Redirige a la página principal u otra de tu elección
            } catch (error) {
                setError('Error al eliminar la cuenta');
                console.error(error);
            }
        }
    };

    if (error) {
        return <div>{error}</div>;
    }

    if (!userInfo) {
        return <div>Cargando...</div>;
    }

    return (
        <div className="container mt-4">
            <h2 className="text-center">Perfil de Usuario</h2>
            <div className="card p-4">
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-6">
                            <p><strong>Nombre:</strong> {userInfo.nombre}</p>
                        </div>
                        <div className="col-md-6">
                            <p><strong>Apellido:</strong> {userInfo.apellido}</p>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6">
                            <p><strong>Correo:</strong> {userInfo.correo}</p>
                        </div>
                        <div className="col-md-6">
                            <p><strong>Teléfono:</strong> {userInfo.telefono}</p>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <p><strong>Dirección:</strong> {userInfo.direccion}</p>
                        </div>
                    </div>
                    <button className="btn btn-primary me-2" onClick={handleEdit}>Editar Información</button>
                    <button className="btn btn-danger" onClick={handleDeleteAccount}>Eliminar Cuenta</button>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
