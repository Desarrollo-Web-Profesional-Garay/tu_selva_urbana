const router = require('express').Router();
const { body } = require('express-validator');
const ctrl = require('../controllers/auth.controller');

router.post('/register', [
    body('name').notEmpty().withMessage('El nombre es requerido'),
    body('email').isEmail().withMessage('Email inválido'),
    body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
], ctrl.register);

router.post('/login', [
    body('email').isEmail().withMessage('Email inválido'),
    body('password').notEmpty().withMessage('La contraseña es requerida'),
], ctrl.login);

module.exports = router;
