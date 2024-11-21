import { useState } from 'react';

const useAuth = () => {
    // Recuperamos el token y el rol de localStorage al cargar
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
    const [role, setRole] = useState(localStorage.getItem('esAdmin') === 'true');  // 'true' o 'false'

    const saveToken = (token, userRole) => {
        // Guardamos el token y el rol (esAdmin) en localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('esAdmin', userRole ? 'true' : 'false'); // Guardamos 'true' o 'false'

        setIsAuthenticated(true); // El usuario está autenticado
        setRole(userRole);  // Guardamos el rol (true o false)
    };

    const logout = () => {
        // Limpiamos los datos de localStorage y restablecemos el estado
        localStorage.removeItem('token');
        localStorage.removeItem('esAdmin');
        setIsAuthenticated(false);
        setRole(false);  // Resetear el rol
    };

    return { isAuthenticated, role, saveToken, logout };
};

export default useAuth;
