const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const isAdmin = async (req, res, next) => {
  try {
    // El req.userId lo inyecta el middleware auth.js
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ error: "No autorizado. Falta el ID de usuario." });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true }
    });

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado." });
    }

    // Verificamos si el rol es exactamente 'admin'
    if (user.role !== 'admin') {
      return res.status(403).json({ 
        error: "Acceso denegado. Se requieren permisos de administrador." 
      });
    }

    next();
  } catch (error) {
    console.error("Error en isAdmin middleware:", error);
    res.status(500).json({ error: "Error interno del servidor al verificar permisos." });
  }
};

module.exports = isAdmin;