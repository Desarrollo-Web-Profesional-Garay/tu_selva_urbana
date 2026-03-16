const router = require('express').Router();
const ctrl = require('../controllers/plants.controller');

router.get('/', ctrl.getAll);
router.get('/:id', ctrl.getById);
router.post('/quiz', ctrl.quiz);

module.exports = router;
