const router = require('express').Router();
const ctrl = require('../controllers/admin.controller');
const auth = require('../middleware/auth'); 
const isAdmin = require('../middleware/isAdmin');

// Aplicamos auth e isAdmin a todas las rutas de este archivo
router.use(auth);
router.use(isAdmin);

// GET /api/admin/orders
router.get('/orders', ctrl.getAllOrders);

// PUT /api/admin/orders/:id/status
router.put('/orders/:id/status', ctrl.updateOrderStatus);

module.exports = router;