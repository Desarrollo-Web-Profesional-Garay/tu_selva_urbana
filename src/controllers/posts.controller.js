const prisma = require('../config/db');

// GET /api/posts
exports.getAll = async (req, res) => {
    try {
        const posts = await prisma.post.findMany({
            include: {
                author: { select: { id: true, name: true, avatar: true } },
                plant: { select: { id: true, name: true, slug: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
        res.json(posts);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener posts' });
    }
};

// POST /api/posts
exports.create = async (req, res) => {
    try {
        const { content, image, plantId } = req.body;
        const post = await prisma.post.create({
            data: {
                content,
                image: image || null,
                plantId: plantId ? parseInt(plantId) : null,
                authorId: req.userId,
            },
            include: {
                author: { select: { id: true, name: true, avatar: true } },
                plant: { select: { id: true, name: true, slug: true } },
            },
        });
        res.status(201).json(post);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al crear post' });
    }
};

// POST /api/posts/:id/like
exports.like = async (req, res) => {
    try {
        const post = await prisma.post.update({
            where: { id: parseInt(req.params.id) },
            data: { likes: { increment: 1 } },
        });
        res.json({ likes: post.likes });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al dar like' });
    }
};
