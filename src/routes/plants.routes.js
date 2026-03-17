const router = require('express').Router();
const ctrl = require('../controllers/plants.controller');

// ============================================
// RUTAS GET (Consulta de datos)
// ============================================

// Obtener todas las plantas (con filtros opcionales)
router.get('/', ctrl.getAll);

// Obtener plantas pet friendly
router.get('/pet-friendly', ctrl.getPetFriendly);

// Obtener plantas por nivel de cuidado
router.get('/care-level/:level', ctrl.getByCareLevel);

// Obtener planta por slug (debe ir ANTES de /:id para que no interfiera)
router.get('/slug/:slug', ctrl.getBySlug);

// Obtener planta por ID (específico, va después de rutas más específicas)
router.get('/:id', ctrl.getById);

// ============================================
// RUTAS POST (Creación de datos)
// ============================================

// Endpoint del quiz (mantener antes de rutas genéricas)
router.post('/quiz', ctrl.quiz);

// Crear una nueva planta
router.post('/', ctrl.create);

// ============================================
// RUTAS PUT (Actualización de datos)
// ============================================

// Actualizar una planta existente
router.put('/:id', ctrl.update);

// ============================================
// RUTAS DELETE (Eliminación de datos)
// ============================================

// Eliminar una planta específica
router.delete('/:id', ctrl.remove);

// NOTA: No incluir deleteAll por seguridad
// router.delete('/', ctrl.deleteAll);

module.exports = router;