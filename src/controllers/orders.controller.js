const prisma = require('../config/db');

// POST /api/orders
exports.create = async (req, res) => {
    try {
        const { items } = req.body;
        // items = [{ plantId: 1, quantity: 2 }, ...]

        if (!items || items.length === 0) {
            return res.status(400).json({ error: 'El carrito está vacío' });
        }

        // Obtener precios de las plantas
        const plantIds = items.map(i => i.plantId);
        const plants = await prisma.plant.findMany({ where: { id: { in: plantIds } } });

        // Calcular total y preparar items
        let total = 0;
        const orderItems = items.map(item => {
            const plant = plants.find(p => p.id === item.plantId);
            if (!plant) throw new Error(`Planta ${item.plantId} no encontrada`);
            const lineTotal = plant.price * (item.quantity || 1);
            total += lineTotal;
            return { plantId: item.plantId, quantity: item.quantity || 1, price: plant.price };
        });

        const order = await prisma.order.create({
            data: {
                userId: req.userId,
                total,
                status: 'pendiente',
                items: { create: orderItems },
            },
            include: {
                items: { include: { plant: { select: { id: true, name: true, slug: true } } } },
            },
        });

        res.status(201).json(order);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al crear orden' });
    }
};

// GET /api/orders
exports.getAll = async (req, res) => {
    try {
        const orders = await prisma.order.findMany({
            where: { userId: req.userId },
            include: {
                items: { include: { plant: { select: { id: true, name: true, slug: true, imageUrl: true } } } },
            },
            orderBy: { createdAt: 'desc' },
        });
        res.json(orders);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener órdenes' });
    }
};
