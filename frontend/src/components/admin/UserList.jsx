import { useEffect, useState } from 'react';
import axios from 'axios';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('token'); // Asegúrate de que el token esté presente

  // Función para obtener los usuarios desde la API
  useEffect(() => {
    const fetchUsers = async () => {
      if (!token) {
        setError('Token no encontrado');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get('http://localhost:5000/api/usuarios', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUsers(response.data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setError('Error al cargar los usuarios');
        setLoading(false);
      }
    };

    fetchUsers();
  }, [token]);

  // Alternar rol de usuario
  const toggleRole = async (userId) => {
    try {
      const response = await axios.post(
        'http://localhost:5000/api/toggle-rol', 
        { userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Usar la respuesta de la API para actualizar el usuario
      const updatedUser = response.data.user;
      setUsers(users.map(user => 
        user._id === userId ? updatedUser : user
      ));
    } catch (error) {
      console.log(error);
      setError('Error al cambiar el rol del usuario');
    }
  };

  // Eliminar usuario
  const deleteUser = async (userId) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/eliminar-usuario`,  // Ruta para eliminar sin el userId en la URL
        {
          headers: { Authorization: `Bearer ${token}` },
          data: { userId } // Pasamos el userId en el cuerpo de la solicitud
        }
      );
      console.log(response);

      // Eliminar el usuario de la lista localmente después de eliminarlo en la base de datos
      setUsers(users.filter(user => user._id !== userId));
    } catch (error) {
      console.log(error);
      setError('Error al eliminar el usuario');
    }
  };

  // Formatear la fecha
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Mostrar mensaje de carga o error
  if (loading) {
    return <p>Cargando usuarios...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="container-fluid mt-5" style={{ maxWidth: '100%', padding: 0 }}>
      <h2>Lista de Usuarios</h2>
      <ul className="list-group">
        {users.map((user, index) => (
          <li key={user._id} className="list-group-item d-flex justify-content-between align-items-center w-100">
            <div style={{ width: '100%' }}>
              <strong>{index + 1}. {user.nombre} {user.apellido}</strong><br />
              <small><strong>Correo:</strong> {user.correo}</small><br />
              <small><strong>Teléfono:</strong> {user.telefono}</small><br />
              <small><strong>Dirección:</strong> {user.direccion || 'No disponible'}</small><br />
              <small><strong>Rol:</strong> {user.esAdmin ? 'Administrador' : 'Usuario regular'}</small><br />
              <small><strong>Fecha de Registro:</strong> {formatDate(user.fechaRegistro)}</small>
            </div>
            <div className="d-flex">
              <button 
                onClick={() => toggleRole(user._id)} 
                className="btn btn-warning btn-sm mr-2"
              >
                {user.esAdmin ? 'Quitar Admin' : 'Poner como Admin'}
              </button>
              <button 
                onClick={() => deleteUser(user._id)} 
                className="btn btn-danger btn-sm"
                disabled={user.esAdmin}  // Deshabilita el botón si es admin
              >
                Eliminar
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
