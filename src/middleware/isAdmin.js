const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Middleware para restringir acceso solo a administradores.
 * Valida tanto el usuario inyectado por token como los roles en la base de datos.
 */
const isAdmin = async (req, res, next) => {
    try {
        const userId = req.userId;

        if (!userId) {
            return res.status(401).json({ error: "No autorizado. Falta el ID de usuario." });
        }

        // Bypass si el token ya trae rol admin
        if (req.isDefaultAdmin || req.userRole === 'admin') {
            return next();
        }

        // Verificación en base de datos
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { role: true }
        });

        if (!user) {
            return res.status(404).json({ error: "Usuario no encontrado en la base de datos." });
        }

        if (user.role !== 'admin') {
            return res.status(403).json({ 
                error: "Acceso denegado. Se requieren permisos de administrador." 
            });
        }

        next();
    } catch (error) {
        console.error("❌ Error en isAdmin middleware:", error);
        res.status(500).json({ error: "Error interno del servidor al verificar permisos." });
    }
};

module.exports = isAdmin;