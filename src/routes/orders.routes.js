const router = require('express').Router();
const auth = require('../middleware/auth');
const ctrl = require('../controllers/orders.controller');

router.post('/', auth, ctrl.create);
router.get('/', auth, ctrl.getAll);

module.exports = router;
