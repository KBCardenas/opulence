const User = require('../models/User');

const isAdmin = async (req, res, next) => {
    try {
        // Buscar al usuario autenticado
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Verificar si el usuario es administrador
        if (user.rol !== 'admin') {
            return res.status(403).json({ message: 'Acceso denegado. Solo los administradores pueden realizar esta accion.' });
        }

        // Si es administrador, continuar con la siguiente función
        next();
    } catch (error) {
        res.status(500).json({ message: 'Error al verificar el rol de administrador', error });
    }
};

module.exports = isAdmin;