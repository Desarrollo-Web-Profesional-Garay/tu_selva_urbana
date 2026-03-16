const prisma = require('../config/db');

// GET /api/plants
exports.getAll = async (req, res) => {
    try {
        const plants = await prisma.plant.findMany({ orderBy: { name: 'asc' } });
        res.json(plants);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener plantas' });
    }
};

// GET /api/plants/:id
exports.getById = async (req, res) => {
    try {
        const plant = await prisma.plant.findUnique({
            where: { id: parseInt(req.params.id) },
        });
        if (!plant) return res.status(404).json({ error: 'Planta no encontrada' });
        res.json(plant);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener planta' });
    }
};

// POST /api/plants/quiz
// Recibe { light, pets, time } y devuelve plantas que coinciden
exports.quiz = async (req, res) => {
    try {
        const { light, pets } = req.body;

        let plants = await prisma.plant.findMany();

        // Filtrar por luz
        if (light) {
            plants = plants.filter(p => p.light.includes(light));
        }

        // Filtrar por mascotas (si el usuario tiene mascotas, solo pet-safe)
        if (pets === 'Sí') {
            plants = plants.filter(p => p.petSafe === true);
        }

        // Si no hay resultados, devolvemos la Sansevieria como fallback
        if (plants.length === 0) {
            const fallback = await prisma.plant.findUnique({ where: { slug: 'sansevieria' } });
            plants = fallback ? [fallback] : [];
        }

        res.json(plants.slice(0, 3));
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error en el quiz' });
    }
};
