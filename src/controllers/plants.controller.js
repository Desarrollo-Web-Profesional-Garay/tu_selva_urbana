const prisma = require('../config/db');

// ============================================
// GET /api/plants - Obtener TODAS las plantas
// ============================================
exports.getAll = async (req, res) => {
    try {
        const { careLevel, petSafe, search } = req.query;
        
        // Construir filtros dinámicamente
        let where = {};
        
        if (careLevel && careLevel !== 'todas') {
            where.careLevel = careLevel;
        }
        
        if (petSafe === 'true') {
            where.petSafe = true;
        }
        
        if (search) {
            where.name = {
                contains: search,
                mode: 'insensitive'
            };
        }

        const plants = await prisma.plant.findMany({ 
            where,
            orderBy: { name: 'asc' } 
        });
        
        res.json(plants);
    } catch (err) {
        console.error('Error en getAll:', err);
        res.status(500).json({ error: 'Error al obtener plantas' });
    }
};

// ============================================
// GET /api/plants/:id - Obtener una planta por ID
// ============================================
exports.getById = async (req, res) => {
    try {
        const { id } = req.params;
        
        const plant = await prisma.plant.findUnique({
            where: { id: parseInt(id) },
            include: {
                posts: true // Incluir posts relacionados si existen
            }
        });
        
        if (!plant) {
            return res.status(404).json({ error: 'Planta no encontrada' });
        }
        
        res.json(plant);
    } catch (err) {
        console.error('Error en getById:', err);
        res.status(500).json({ error: 'Error al obtener la planta' });
    }
};

// ============================================
// GET /api/plants/slug/:slug - Obtener una planta por SLUG
// ============================================
exports.getBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        
        const plant = await prisma.plant.findUnique({
            where: { slug },
            include: {
                posts: true
            }
        });
        
        if (!plant) {
            return res.status(404).json({ error: 'Planta no encontrada' });
        }
        
        res.json(plant);
    } catch (err) {
        console.error('Error en getBySlug:', err);
        res.status(500).json({ error: 'Error al obtener la planta' });
    }
};

// ============================================
// GET /api/plants/care-level/:level - Filtrar por nivel de cuidado
// ============================================
exports.getByCareLevel = async (req, res) => {
    try {
        const { level } = req.params;
        
        const plants = await prisma.plant.findMany({
            where: { careLevel: level },
            orderBy: { name: 'asc' }
        });
        
        res.json(plants);
    } catch (err) {
        console.error('Error en getByCareLevel:', err);
        res.status(500).json({ error: 'Error al obtener plantas por nivel' });
    }
};

// ============================================
// GET /api/plants/pet-friendly - Obtener solo plantas Pet Friendly
// ============================================
exports.getPetFriendly = async (req, res) => {
    try {
        const plants = await prisma.plant.findMany({
            where: { petSafe: true },
            orderBy: { name: 'asc' }
        });
        
        res.json(plants);
    } catch (err) {
        console.error('Error en getPetFriendly:', err);
        res.status(500).json({ error: 'Error al obtener plantas pet friendly' });
    }
};

// ============================================
// POST /api/plants - CREAR una nueva planta
// ============================================
exports.create = async (req, res) => {
    try {
        const {
            name,
            price,
            careLevel,
            petSafe,
            careWater,
            careLight,
            careHumidity,
            imageUrl,
            light,
            tag,
            modelUrl
        } = req.body;

        // Validar campos obligatorios
        if (!name) {
            return res.status(400).json({ 
                error: 'El nombre es obligatorio' 
            });
        }

        if (price === undefined || price === null) {
            return res.status(400).json({ 
                error: 'El precio es obligatorio' 
            });
        }

        // Generar slug automático desde el nombre
        let slug = name.toLowerCase()
            .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // quita acentos
            .replace(/[^\w\s]/gi, '') // quita caracteres especiales
            .replace(/\s+/g, '-') // reemplaza espacios con guiones
            .replace(/-+/g, '-') // evita guiones múltiples
            .replace(/^-|-$/g, ''); // quita guiones al inicio o final

        // Si el slug está vacío después de la limpieza, asignar uno genérico
        if (!slug) {
            slug = `planta-${Date.now()}`;
        }

        // Verificar si el slug ya existe
        const existingPlant = await prisma.plant.findUnique({
            where: { slug }
        });

        // Si el slug existe, agregar un sufijo numérico
        if (existingPlant) {
            let counter = 1;
            let newSlug = `${slug}-${counter}`;
            
            while (await prisma.plant.findUnique({ where: { slug: newSlug } })) {
                counter++;
                newSlug = `${slug}-${counter}`;
            }
            
            slug = newSlug;
        }

        // Crear la planta
        const plant = await prisma.plant.create({
            data: {
                name,
                slug,
                price: parseFloat(price),
                careLevel: careLevel || 'normal',
                petSafe: petSafe || false,
                careWater: careWater || null,
                careLight: careLight || null,
                careHumidity: careHumidity || null,
                imageUrl: imageUrl || null,
                light: light || [], // Array de strings
                tag: tag || null,
                modelUrl: modelUrl || null
            }
        });

        res.status(201).json({
            message: 'Planta creada exitosamente',
            plant
        });
    } catch (err) {
        console.error('Error en create:', err);
        res.status(500).json({ error: 'Error al crear la planta' });
    }
};

// ============================================
// PUT /api/plants/:id - ACTUALIZAR una planta existente
// ============================================
exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // Verificar que la planta existe
        const existingPlant = await prisma.plant.findUnique({
            where: { id: parseInt(id) }
        });

        if (!existingPlant) {
            return res.status(404).json({ error: 'Planta no encontrada' });
        }

        // Si se está actualizando el nombre, regenerar el slug
        if (updateData.name && updateData.name !== existingPlant.name) {
            let newSlug = updateData.name.toLowerCase()
                .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
                .replace(/[^\w\s]/gi, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-')
                .replace(/^-|-$/g, '');

            // Verificar que el nuevo slug no exista (excepto para esta misma planta)
            if (newSlug !== existingPlant.slug) {
                const slugExists = await prisma.plant.findUnique({
                    where: { slug: newSlug }
                });

                if (slugExists) {
                    let counter = 1;
                    let tempSlug = `${newSlug}-${counter}`;
                    
                    while (await prisma.plant.findUnique({ where: { slug: tempSlug } })) {
                        counter++;
                        tempSlug = `${newSlug}-${counter}`;
                    }
                    
                    newSlug = tempSlug;
                }
            }
            
            updateData.slug = newSlug;
        }

        // Si viene precio, asegurarse que sea número
        if (updateData.price) {
            updateData.price = parseFloat(updateData.price);
        }

        // Actualizar la planta
        const plant = await prisma.plant.update({
            where: { id: parseInt(id) },
            data: updateData
        });

        res.json({
            message: 'Planta actualizada exitosamente',
            plant
        });
    } catch (err) {
        console.error('Error en update:', err);
        res.status(500).json({ error: 'Error al actualizar la planta' });
    }
};

// ============================================
// DELETE /api/plants/:id - ELIMINAR una planta
// ============================================
exports.remove = async (req, res) => {
    try {
        const { id } = req.params;

        // Verificar que la planta existe
        const existingPlant = await prisma.plant.findUnique({
            where: { id: parseInt(id) }
        });

        if (!existingPlant) {
            return res.status(404).json({ error: 'Planta no encontrada' });
        }

        // Eliminar la planta (las relaciones en cascada se manejan automáticamente por Prisma)
        await prisma.plant.delete({
            where: { id: parseInt(id) }
        });

        res.json({ 
            message: 'Planta eliminada correctamente',
            deletedPlant: existingPlant
        });
    } catch (err) {
        console.error('Error en remove:', err);
        
        // Manejo específico de errores de restricción de llaves foráneas
        if (err.code === 'P2003') {
            return res.status(400).json({ 
                error: 'No se puede eliminar la planta porque tiene relaciones en otras tablas (posts, órdenes, etc.)' 
            });
        }
        
        res.status(500).json({ error: 'Error al eliminar la planta' });
    }
};

// ============================================
// POST /api/plants/quiz - Endpoint del quiz de recomendaciones
// ============================================
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
            const fallback = await prisma.plant.findUnique({ 
                where: { slug: 'sansevieria' } 
            });
            plants = fallback ? [fallback] : [];
        }

        res.json(plants.slice(0, 3));
    } catch (err) {
        console.error('Error en quiz:', err);
        res.status(500).json({ error: 'Error en el quiz' });
    }
};

// ============================================
// DELETE /api/plants - ELIMINAR TODAS las plantas (¡CUIDADO!)
// ============================================
// Esta función es peligrosa, mejor no incluirla en rutas por ahora
// exports.deleteAll = async (req, res) => {
//     try {
//         await prisma.plant.deleteMany({});
//         res.json({ message: 'Todas las plantas fueron eliminadas' });
//     } catch (err) {
//         console.error('Error en deleteAll:', err);
//         res.status(500).json({ error: 'Error al eliminar todas las plantas' });
//     }
// };