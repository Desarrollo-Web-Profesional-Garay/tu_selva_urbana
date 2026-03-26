const prisma = require('../config/db');

// GET /api/posts
exports.getAll = async (req, res) => {
    try {
        const posts = await prisma.post.findMany({
            include: {
                author: { select: { id: true, name: true, avatar: true } },
                plant: true,
                likedBy: { select: { id: true } },
                comments: { include: { author: { select: { id: true, name: true, avatar: true } } } }
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
                plant: true,
                likedBy: { select: { id: true } }
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
        const postId = parseInt(req.params.id);
        const postInfo = await prisma.post.findUnique({ where: { id: postId }, include: { likedBy: true } });
        if (!postInfo) return res.status(404).json({ error: 'Post no encontrado' });

        const userExists = await prisma.user.findUnique({ where: { id: req.userId } });
        if (!userExists) return res.status(401).json({ error: 'Usuario no válido. Por favor cierra sesión y vuelve a iniciar.' });
        
        const hasLiked = postInfo.likedBy.some(u => u.id === req.userId);
        
        const post = await prisma.post.update({
            where: { id: postId },
            data: { 
                likes: hasLiked ? { decrement: 1 } : { increment: 1 },
                likedBy: hasLiked ? { disconnect: { id: req.userId } } : { connect: { id: req.userId } }
            },
            include: { 
                likedBy: { select: { id: true } },
                comments: { include: { author: { select: { id: true, name: true, avatar: true } } } }
            }
        });
        res.json({ likes: post.likes, likedBy: post.likedBy, comments: post.comments });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al dar like' });
    }
};

// GET /api/posts/:id/comments
exports.getComments = async (req, res) => {
    try {
        const post = await prisma.post.findUnique({
            where: { id: parseInt(req.params.id) },
            include: {
                comments: { include: { author: { select: { id: true, name: true, avatar: true } } }, orderBy: { createdAt: 'desc' } }
            }
        });
        res.json(post.comments);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener comentarios' });
    }
};

// POST /api/posts/:id/comments
exports.addComment = async (req, res) => {
    try {
        const userExists = await prisma.user.findUnique({ where: { id: req.userId } });
        if (!userExists) return res.status(401).json({ error: 'Usuario no válido.' });

        const { text } = req.body;
        const comment = await prisma.comment.create({
            data: { text, postId: parseInt(req.params.id), authorId: req.userId },
            include: { author: { select: { id: true, name: true, avatar: true } } },
        });
        res.status(201).json(comment);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al agregar comentario' });
    }
};
