const router = require('express').Router();
const auth = require('../middleware/auth');
const ctrl = require('../controllers/users.controller');

router.get('/me', auth, ctrl.getMe);
router.put('/me', auth, ctrl.updateMe);
router.get('/me/plants', auth, ctrl.getMyPlants);
router.post('/me/plants', auth, ctrl.adoptPlant);

module.exports = router;
