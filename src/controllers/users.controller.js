const prisma = require('../config/db');

// GET /api/users/me
exports.getMe = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.userId },
            select: { id: true, name: true, email: true, avatar: true, createdAt: true },
        });
        if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener perfil' });
    }
};

// PUT /api/users/me
exports.updateMe = async (req, res) => {
    try {
        const { name, avatar } = req.body;
        const user = await prisma.user.update({
            where: { id: req.userId },
            data: { name, avatar },
            select: { id: true, name: true, email: true, avatar: true },
        });
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al actualizar perfil' });
    }
};

// GET /api/users/me/plants
exports.getMyPlants = async (req, res) => {
    try {
        const userPlants = await prisma.userPlant.findMany({
            where: { userId: req.userId },
            include: { plant: true },
            orderBy: { adoptedAt: 'desc' },
        });
        res.json(userPlants.map(up => ({ ...up.plant, adoptedAt: up.adoptedAt })));
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener mis plantas' });
    }
};

// POST /api/users/me/plants
exports.adoptPlant = async (req, res) => {
    try {
        const { plantId } = req.body;

        const existing = await prisma.userPlant.findUnique({
            where: { userId_plantId: { userId: req.userId, plantId: parseInt(plantId) } },
        });
        if (existing) return res.status(400).json({ error: 'Ya tienes esta planta' });

        const adoption = await prisma.userPlant.create({
            data: { userId: req.userId, plantId: parseInt(plantId) },
            include: { plant: true },
        });
        res.status(201).json(adoption);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al adoptar planta' });
    }
};
