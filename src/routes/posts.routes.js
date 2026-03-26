const router = require('express').Router();
const auth = require('../middleware/auth');
const ctrl = require('../controllers/posts.controller');

router.get('/', auth, ctrl.getAll);
router.post('/', auth, ctrl.create);
router.post('/:id/like', auth, ctrl.like);
router.get('/:id/comments', auth, ctrl.getComments);
router.post('/:id/comments', auth, ctrl.addComment);

module.exports = router;
