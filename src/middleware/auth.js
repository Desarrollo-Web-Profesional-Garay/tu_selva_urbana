const jwt = require('jsonwebtoken');

/**
 * Middleware que verifica el token JWT y extrae la identidad del usuario.
 * Soporta roles para permitir el acceso al administrador de pruebas.
 */
const authMiddleware = (req, res, next) => {
    const header = req.headers.authorization;

    if (!header || !header.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Token no proporcionado' });
    }

    const token = header.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        req.userId = decoded.userId;
        req.userRole = decoded.role;

        if (req.userRole === 'admin') {
            req.isDefaultAdmin = true;
        }

        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'El token ha expirado. Por favor, inicia sesión de nuevo.' });
        }
        return res.status(401).json({ error: 'Token inválido' });
    }
};

module.exports = authMiddleware;
