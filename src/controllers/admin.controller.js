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

module.exports = {
    getAllOrders,
    updateOrderStatus
};