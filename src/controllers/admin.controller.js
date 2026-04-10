const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Obtener todos los pedidos de todos los usuarios
const getAllOrders = async (req, res) => {
    try {
        const orders = await prisma.order.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                },
                items: {
                    include: {
                        plant: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        res.json(orders);
    } catch (error) {
        console.error("Error al obtener pedidos:", error);
        res.status(500).json({ error: "Error al obtener la lista de pedidos." });
    }
};

// Actualizar el estado de un pedido
const updateOrderStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pendiente', 'pagado', 'enviado', 'entregado', 'cancelado'];

    if (!validStatuses.includes(status)) {
        return res.status(400).json({ 
            error: "Estado no válido. Use: " + validStatuses.join(', ') 
        });
    }

    try {
        const updatedOrder = await prisma.order.update({
            where: { id: parseInt(id) },
            data: { status }
        });
        res.json({ message: "Estado actualizado con éxito", order: updatedOrder });
    } catch (error) {
        console.error("Error al actualizar pedido:", error);
        res.status(500).json({ error: "Error al actualizar el estado del pedido." });
    }
    
};
// --- Gestión de Usuarios ---

// Listar todos los usuarios (sin el password)
const getAllUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                phone: true,
                createdAt: true,
                avatar: true
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(users);
    } catch (error) {
        console.error("Error al listar usuarios:", error);
        res.status(500).json({ error: "Error al obtener la lista de usuarios." });
    }
};

// Eliminar un usuario por ID
const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.user.delete({
            where: { id: parseInt(id) }
        });
        res.json({ message: "Usuario eliminado correctamente (borrado en cascada aplicado)." });
    } catch (error) {
        console.error("Error al eliminar usuario:", error);
        res.status(500).json({ error: "Error al intentar eliminar el usuario." });
    }
};

// Cambiar el rol de un usuario
const updateUserRole = async (req, res) => {
    const { id } = req.params;
    const { role } = req.body;

    if (!['user', 'admin'].includes(role)) {
        return res.status(400).json({ error: "Rol no válido. Use 'user' o 'admin'." });
    }

    try {
        const updatedUser = await prisma.user.update({
            where: { id: parseInt(id) },
            data: { role },
            select: { id: true, name: true, role: true }
        });
        res.json({ message: "Rol actualizado", user: updatedUser });
    } catch (error) {
        console.error("Error al actualizar rol:", error);
        res.status(500).json({ error: "Error al actualizar el rol del usuario." });
    }
};
// --- Gestión de Plantas del Catálogo ---

// Crear una nueva planta
const createPlant = async (req, res) => {
    const { name, slug, price, careLevel, light, petSafe, imageUrl, tag } = req.body;

    try {
        const newPlant = await prisma.plant.create({
            data: {
                name,
                slug: slug || name.toLowerCase().replace(/ /g, '-'), // Genera slug si no hay
                price: parseFloat(price) || 0,
                careLevel: careLevel || "normal",
                light: light || [], // Espera un arreglo como ["Poca", "Media"]
                petSafe: petSafe || false,
                imageUrl,
                tag
            }
        });
        res.status(201).json({ message: "Planta creada con éxito", plant: newPlant });
    } catch (error) {
        console.error("Error al crear planta:", error);
        if (error.code === 'P2002') {
            return res.status(400).json({ error: "El slug o nombre ya existe." });
        }
        res.status(500).json({ error: "Error al crear la planta en el catálogo." });
    }
};

// Editar una planta existente
const updatePlant = async (req, res) => {
    const { id } = req.params;
    const data = req.body;

    try {
        // Convertimos el precio a float si viene en el body
        if (data.price) data.price = parseFloat(data.price);

        const updatedPlant = await prisma.plant.update({
            where: { id: parseInt(id) },
            data: data
        });
        res.json({ message: "Planta actualizada correctamente", plant: updatedPlant });
    } catch (error) {
        console.error("Error al actualizar planta:", error);
        res.status(500).json({ error: "Error al actualizar la planta." });
    }
};

// Eliminar una planta del catálogo
const deletePlant = async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.plant.delete({
            where: { id: parseInt(id) }
        });
        res.json({ message: "Planta eliminada del catálogo satisfactoriamente." });
    } catch (error) {
        console.error("Error al eliminar planta:", error);
        res.status(500).json({ error: "Error al intentar eliminar la planta." });
    }
};
module.exports = {
    getAllOrders,
    updateOrderStatus,
    getAllUsers,
    deleteUser,
    updateUserRole,
    createPlant,   // Nuevo
    updatePlant,   // Nuevo
    deletePlant    // Nuevo
};