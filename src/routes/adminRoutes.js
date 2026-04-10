const router = require('express').Router();
const ctrl = require('../controllers/admin.controller');
const auth = require('../middleware/auth'); 
const isAdmin = require('../middleware/isAdmin');

// Protección Global para todas las rutas de este archivo
router.use(auth);
router.use(isAdmin);

// --- Dashboard ---
router.get('/stats', ctrl.getDashboardStats);

// --- Gestión de Pedidos ---
router.get('/orders', ctrl.getAllOrders);
router.put('/orders/:id/status', ctrl.updateOrderStatus);

// --- Gestión de Usuarios ---
router.get('/users', ctrl.getAllUsers);
router.put('/users/:id/role', ctrl.updateUserRole);
router.delete('/users/:id', ctrl.deleteUser);

// --- Gestión de Plantas (Catálogo) ---
router.post('/plants', ctrl.createPlant);
router.put('/plants/:id', ctrl.updatePlant);
router.delete('/plants/:id', ctrl.deletePlant);

module.exports = router;