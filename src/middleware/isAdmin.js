const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Middleware para restringir acceso solo a administradores.
 * Valida tanto el usuario inyectado por código como los roles en la base de datos.
 */
const isAdmin = async (req, res, next) => {
    try {
        // El req.userId y req.userRole vienen del middleware auth.js
        const userId = req.userId;

        if (!userId) {
            return res.status(401).json({ error: "No autorizado. Falta el ID de usuario." });
        }

        // --- 1. PASO DIRECTO (Bypass) ---
        // Si el middleware auth.js detectó que es el admin de pruebas o el token ya trae el rol
        if (req.isDefaultAdmin || req.userRole === 'admin') {
            console.log(`👑 Acceso administrativo concedido por bypass/token al ID: ${userId}`);
            return next();
        }

        // --- 2. VERIFICACIÓN EN BASE DE DATOS ---
        // Si no es el admin de pruebas, consultamos en la DB por si es un admin real
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { role: true }
        });

        if (!user) {
            return res.status(404).json({ error: "Usuario no encontrado en la base de datos." });
        }

        // Verificamos si el rol guardado en la DB es 'admin'
        if (user.role !== 'admin') {
            return res.status(403).json({ 
                error: "Acceso denegado. Se requieren permisos de administrador para realizar esta acción." 
            });
        }

        // Si llegamos aquí, es un administrador real de la DB
        next();
    } catch (error) {
        console.error("❌ Error en isAdmin middleware:", error);
        res.status(500).json({ 
            error: "Error interno del servidor al verificar permisos de administrador." 
        });
    }
};

module.exports = isAdmin;