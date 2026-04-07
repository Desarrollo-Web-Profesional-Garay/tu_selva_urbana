const prisma = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { sendVerificationEmail, sendPasswordResetEmail } = require('../services/email.service');
const { sendSMSCode } = require('../services/sms.service');

// Generar código OTP numérico de 6 dígitos
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// =============================================
// POST /api/auth/register
// =============================================
exports.register = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;

        if (!phone) {
            return res.status(400).json({ error: 'El número de teléfono es obligatorio' });
        }

        const exists = await prisma.user.findUnique({ where: { email } });

        // Si existe pero NO está verificado → permitir re-registro (actualizar datos)
        if (exists && !exists.emailVerified) {
            const hashed = await bcrypt.hash(password, 10);
            const code = generateOTP();
            const expires = new Date(Date.now() + 15 * 60 * 1000);

            const user = await prisma.user.update({
                where: { email },
                data: {
                    name,
                    password: hashed,
                    phone,
                    verifyCode: code,
                    verifyExpires: expires,
                },
            });

            // Enviar email
            const emailResult = await sendVerificationEmail(email, name, code);
            console.log(`📧 Re-registro ${email} — Email: ${emailResult.success ? '✅' : '❌'}`);

            // Enviar SMS
            const smsResult = await sendSMSCode(phone, code);
            console.log(`📱 SMS ${phone} — ${smsResult.success ? '✅' : '❌ (simulado o error)'}`);

            return res.status(200).json({
                message: 'Código reenviado. Revisa tu email y SMS.',
                email,
                requiresVerification: true,
                emailSent: emailResult.success,
            });
        }

        // Si ya existe Y está verificado → bloquear
        if (exists && exists.emailVerified) {
            return res.status(400).json({ error: 'El email ya está registrado' });
        }

        // Nuevo usuario
        const hashed = await bcrypt.hash(password, 10);
        const code = generateOTP();
        const expires = new Date(Date.now() + 15 * 60 * 1000);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashed,
                phone,
                avatar: null,
                emailVerified: false,
                verifyCode: code,
                verifyExpires: expires,
            },
        });

        // Enviar email con código OTP
        const emailResult = await sendVerificationEmail(email, name, code);
        console.log(`📧 Registro ${email} — Email: ${emailResult.success ? '✅ enviado' : '❌ falló: ' + (emailResult.error || 'simulado')}`);

        // Enviar SMS
        const smsResult = await sendSMSCode(phone, code);
        console.log(`📱 SMS ${phone} — ${smsResult.success ? '✅' : '❌ (simulado o error)'}`);

        res.status(201).json({
            message: 'Cuenta creada. Revisa tu email y SMS para el código de verificación.',
            email,
            requiresVerification: true,
            emailSent: emailResult.success,
        });
    } catch (err) {
        console.error('❌ Error en register:', err);
        res.status(500).json({ error: 'Error al registrar usuario' });
    }
};

// =============================================
// POST /api/auth/verify-email
// =============================================
exports.verifyEmail = async (req, res) => {
    try {
        const { email, code } = req.body;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

        if (user.emailVerified) {
            return res.status(400).json({ error: 'Este correo ya ha sido verificado' });
        }

        if (!user.verifyCode || user.verifyCode !== code) {
            return res.status(400).json({ error: 'Código incorrecto. Inténtalo de nuevo.' });
        }

        if (user.verifyExpires < new Date()) {
            return res.status(400).json({ error: 'El código ha expirado. Solicita uno nuevo.' });
        }

        // Marcar como verificado
        const verified = await prisma.user.update({
            where: { email },
            data: {
                emailVerified: true,
                verifyCode: null,
                verifyExpires: null,
            },
        });

        const token = jwt.sign({ userId: verified.id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.json({
            token,
            user: {
                id: verified.id,
                name: verified.name,
                email: verified.email,
                avatar: verified.avatar,
            },
        });
    } catch (err) {
        console.error('❌ Error en verifyEmail:', err);
        res.status(500).json({ error: 'Error al verificar el código' });
    }
};

// =============================================
// POST /api/auth/resend-code
// =============================================
exports.resendCode = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
        if (user.emailVerified) return res.status(400).json({ error: 'Ya verificado' });

        const code = generateOTP();
        const expires = new Date(Date.now() + 15 * 60 * 1000);

        await prisma.user.update({
            where: { email },
            data: { verifyCode: code, verifyExpires: expires },
        });

        const emailResult = await sendVerificationEmail(email, user.name, code);
        if (user.phone) await sendSMSCode(user.phone, code);

        res.json({ message: 'Código reenviado.', emailSent: emailResult.success });
    } catch (err) {
        console.error('❌ Error en resendCode:', err);
        res.status(500).json({ error: 'Error al reenviar código' });
    }
};

// =============================================
// POST /api/auth/login
// =============================================
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return res.status(401).json({ error: 'Credenciales inválidas' });

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return res.status(401).json({ error: 'Credenciales inválidas' });

        // Si no ha verificado el email, reenviar código
        if (!user.emailVerified) {
            const code = generateOTP();
            const expires = new Date(Date.now() + 15 * 60 * 1000);
            await prisma.user.update({
                where: { email },
                data: { verifyCode: code, verifyExpires: expires },
            });
            const emailResult = await sendVerificationEmail(email, user.name, code);
            if (user.phone) await sendSMSCode(user.phone, code);

            return res.status(403).json({
                error: 'Email no verificado',
                requiresVerification: true,
                email,
                emailSent: emailResult.success,
            });
        }

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.json({
            token,
            user: { id: user.id, name: user.name, email: user.email, avatar: user.avatar },
        });
    } catch (err) {
        console.error('❌ Error en login:', err);
        res.status(500).json({ error: 'Error al iniciar sesión' });
    }
};

// =============================================
// POST /api/auth/forgot-password
// =============================================
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return res.json({ message: 'Si el email existe, recibirás un enlace.' });

        const token = crypto.randomBytes(32).toString('hex');
        const expires = new Date(Date.now() + 30 * 60 * 1000);

        await prisma.user.update({
            where: { email },
            data: { resetToken: token, resetExpires: expires },
        });

        const appUrl = process.env.APP_URL || 'https://tu-selva-urbana.up.railway.app';
        const resetLink = `${appUrl}/reset-password?token=${token}`;

        await sendPasswordResetEmail(email, user.name, resetLink);

        res.json({ message: 'Si el email existe, recibirás un enlace de recuperación.' });
    } catch (err) {
        console.error('❌ Error en forgotPassword:', err);
        res.status(500).json({ error: 'Error al procesar solicitud' });
    }
};

// =============================================
// POST /api/auth/reset-password
// =============================================
exports.resetPassword = async (req, res) => {
    try {
        const { token, password } = req.body;

        const user = await prisma.user.findFirst({
            where: {
                resetToken: token,
                resetExpires: { gt: new Date() },
            },
        });

        if (!user) {
            return res.status(400).json({ error: 'El enlace no es válido o ha expirado.' });
        }

        const hashed = await bcrypt.hash(password, 10);

        await prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashed,
                resetToken: null,
                resetExpires: null,
            },
        });

        res.json({ message: 'Contraseña actualizada correctamente.' });
    } catch (err) {
        console.error('❌ Error en resetPassword:', err);
        res.status(500).json({ error: 'Error al restablecer contraseña' });
    }
};
