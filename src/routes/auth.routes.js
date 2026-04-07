const router = require('express').Router();
const { body, validationResult } = require('express-validator');
const ctrl = require('../controllers/auth.controller');

// Middleware de validación
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array()[0].msg });
    }
    next();
};

// POST /api/auth/register
router.post('/register', [
    body('name').notEmpty().withMessage('El nombre es requerido'),
    body('email').isEmail().withMessage('Email inválido'),
    body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
    body('phone').notEmpty().withMessage('El número de teléfono es obligatorio'),
], validate, ctrl.register);

// POST /api/auth/verify-email
router.post('/verify-email', [
    body('email').isEmail().withMessage('Email inválido'),
    body('code').isLength({ min: 6, max: 6 }).withMessage('Código inválido'),
], validate, ctrl.verifyEmail);

// POST /api/auth/resend-code
router.post('/resend-code', [
    body('email').isEmail().withMessage('Email inválido'),
], validate, ctrl.resendCode);

// POST /api/auth/login
router.post('/login', [
    body('email').isEmail().withMessage('Email inválido'),
    body('password').notEmpty().withMessage('La contraseña es requerida'),
], validate, ctrl.login);

// POST /api/auth/forgot-password
router.post('/forgot-password', [
    body('email').isEmail().withMessage('Email inválido'),
], validate, ctrl.forgotPassword);

// POST /api/auth/reset-password
router.post('/reset-password', [
    body('token').notEmpty().withMessage('Token requerido'),
    body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
], validate, ctrl.resetPassword);

module.exports = router;
