const router = require('express').Router();
const ctrl = require('../controllers/chat.controller');

router.post('/', ctrl.sendMessage);

module.exports = router;
