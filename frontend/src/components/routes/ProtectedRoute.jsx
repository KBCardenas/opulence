import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth'; // Hook para usar autenticación
import UserList from "../admin/UserList";
import Statistics from "../admin/Statistics";

const ProtectedRoute= () => {
    const navigate = useNavigate();
    const { isAuthenticated, role } = useAuth();  // Obtenemos el estado de autenticación y el rol

    // Si el usuario no está autenticado o no es admin, lo redirigimos
    if (!isAuthenticated || !role) {
        navigate('/login');  // Redirige al login si no está autenticado o no es admin
        return null;
    }

    return (
        <div className="container w-100">
        <h1>Panel de Administración</h1>
        <div className="row">
            <div className="col-12">
                <UserList />
            </div>
            <div className="col-12">
                <Statistics />
            </div>
        </div>
    </div>
    );
};

export default ProtectedRoute;
