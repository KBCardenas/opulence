import axios from 'axios';

const API_URL = 'http://localhost:5000'; // La URL de tu backend

const getToken = () => {
    return localStorage.getItem('token'); // Obtiene el token del localStorage
};

const userProfile = async () => {
    return await axios.get(`${API_URL}/api/obtener-usuario`, {
        headers: {
            Authorization: `Bearer ${getToken()}`, // Agrega el token a las cabeceras
        },
    });
}

// Actualizar usuario
const updateUser = async (userData) => {
    return await axios.put(`${API_URL}/api/editar-perfil`, userData, {
        headers: {
            Authorization: `Bearer ${getToken()}`, // Agrega el token a las cabeceras
        },
    });
};

// Eliminar cuenta del usuario
const deleteAccount = async () => {
    return await axios.delete(`${API_URL}/api/eliminar-cuenta`, {
        headers: {
            Authorization: `Bearer ${getToken()}`, // Agrega el token a las cabeceras
        },
    });
};


// Exportar las funciones para poder usarlas en los componentes
export default {
    userProfile,
    updateUser,
    deleteAccount
}
