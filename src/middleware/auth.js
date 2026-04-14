const jwt = require('jsonwebtoken');

/**
 * Middleware que verifica el token JWT y extrae la identidad del usuario.
 * Ahora soporta roles para permitir el acceso al administrador de pruebas.
 */
const authMiddleware = (req, res, next) => {
    const header = req.headers.authorization;

    // 1. Verificación básica de existencia del header
    if (!header || !header.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Token no proporcionado' });
    }

    const token = header.split(' ')[1];

    try {
        // 2. Verificamos el token con nuestra clave secreta
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // 3. Inyectamos los datos en el objeto 'req' para los siguientes middlewares
        req.userId = decoded.userId;
        req.userRole = decoded.role; // Extraemos el rol (admin o user) del token

        // 4. Bandera especial para el administrador de pruebas
        if (req.userRole === 'admin') {
            req.isDefaultAdmin = true;
        }

        next();
    } catch (err) {
        // Manejo de errores específicos de JWT
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'El token ha expirado. Por favor, inicia sesión de nuevo.' });
        }
        return res.status(401).json({ error: 'Token inválido' });
    }
};

module.exports = authMiddleware;