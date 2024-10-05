const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
        console.log('No se proporcionó token');
        return res.status(401).json({ error: 'Acceso denegado' });
    }

    try {
        console.log('Verificando token:', token);
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Token decodificado:', decoded);

        // Sanitiza la información del usuario
        req.user = {
            id: decoded.id,
            // Agrega otros campos necesarios, pero evita información sensible
        };

        next();
    } catch (error) {
        console.error('Error al verificar el token:', error);
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({ error: 'Token expirado' });
        }
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({ error: 'Token inválido' });
        }
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
};

module.exports = authenticate;