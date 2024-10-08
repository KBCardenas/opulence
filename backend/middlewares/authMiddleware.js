const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
    try {
        // Obtener el token desde el encabezado 'Authorization'
        const token = req.header('Authorization')?.replace('Bearer ', '');

        // Verificar si el token fue proporcionado
        if (!token) {
            console.log('No se proporcionó token');
            return res.status(401).json({ error: 'Acceso denegado. Token requerido.' });
        }

        // Verificar el token usando la clave secreta
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Token decodificado:', decoded);

        // Asignar los datos del usuario decodificado a req.user
        req.user = {
            id: decoded.id,  // ID del usuario
            role: decoded.role,  // Suponiendo que incluyas el rol en el token
            // Agregar otros campos del token según sea necesario
        };

        // Proceder al siguiente middleware
        next();
    } catch (error) {
        console.error('Error al verificar el token:', error);

        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({ error: 'Token expirado' });
        }
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({ error: 'Token inválido' });
        }
        
        // Si ocurre algún otro error
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
};

module.exports = authenticate;
