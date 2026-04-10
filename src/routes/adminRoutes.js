const router = require('express').Router();
const ctrl = require('../controllers/admin.controller');
const auth = require('../middleware/auth'); 
const isAdmin = require('../middleware/isAdmin');

// ==========================================
// PROTECCIÓN DE RUTAS
// ==========================================
// Todas las rutas definidas a continuación requieren:
// 1. Un token JWT válido (auth)
// 2. Rol de administrador (isAdmin)
router.use(auth);
router.use(isAdmin);

// ==========================================
// GESTIÓN DE PEDIDOS (ORDERS)
// ==========================================

// Obtener todos los pedidos de todos los usuarios
// GET /api/admin/orders
router.get('/orders', ctrl.getAllOrders);

// Actualizar el estado de un pedido (pendiente, pagado, enviado, etc.)
// PUT /api/admin/orders/:id/status
router.put('/orders/:id/status', ctrl.updateOrderStatus);

// ==========================================
// GESTIÓN DE USUARIOS (USERS)
// ==========================================

// Listar todos los usuarios registrados (sin passwords)
// GET /api/admin/users
router.get('/users', ctrl.getAllUsers);

// Cambiar el rol de un usuario (user <-> admin)
// PUT /api/admin/users/:id/role
router.put('/users/:id/role', ctrl.updateUserRole);

// Eliminar un usuario permanentemente (Borrado en cascada)
// DELETE /api/admin/users/:id
router.delete('/users/:id', ctrl.deleteUser);

// ==========================================
// GESTIÓN DE PLANTAS (CATÁLOGO)
// ==========================================

// Crear planta
// POST /api/admin/plants
router.post('/plants', ctrl.createPlant);

// Editar planta
// PUT /api/admin/plants/:id
router.put('/plants/:id', ctrl.updatePlant);

// Eliminar planta
// DELETE /api/admin/plants/:id
router.delete('/plants/:id', ctrl.deletePlant);

module.exports = router;