import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const isAdmin = async (req, res, next) => {
  try {
    // 1. El req.userId viene del middleware de autenticación previo (auth.js)
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: "No autorizado. Falta el ID de usuario." });
    }

    // 2. Buscamos al usuario en la base de datos para verificar su rol
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true } // Solo pedimos el rol por eficiencia
    });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    // 3. Verificamos si el rol es 'admin'
    // Comparamos con el enum que definiste en Prisma
    if (user.role !== 'admin') {
      return res.status(403).json({ 
        message: "Acceso denegado. Se requieren permisos de administrador." 
      });
    }

    // 4. Si todo está bien, pasamos al siguiente controlador
    next();
  } catch (error) {
    console.error("Error en isAdmin middleware:", error);
    res.status(500).json({ message: "Error interno del servidor al verificar permisos." });
  }
};