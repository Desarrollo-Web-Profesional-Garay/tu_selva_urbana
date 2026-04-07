const prisma = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { sendVerificationEmail, sendPasswordResetEmail } = require('../services/email.service');
const { sendSMSCode } = require('../services/sms.service');

function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// =============================================
// POST /api/auth/register
// El usuario NO se crea en la tabla User.
// Se guarda en PendingRegistration hasta que verifique el OTP.
// =============================================
exports.register = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;

        if (!phone) {
            return res.status(400).json({ error: 'El número de teléfono es obligatorio' });
        }

        // Verificar que el email no esté registrado en User (ya verificado)
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'El email ya está registrado' });
        }

        const hashed = await bcrypt.hash(password, 10);
        const code = generateOTP();
        const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 min

        // Upsert en PendingRegistration (si ya existe una pendiente, la sobreescribe)
        await prisma.pendingRegistration.upsert({
            where: { email },
            create: {
                name,
                email,
                password: hashed,
                phone,
                verifyCode: code,
                verifyExpires: expires,
            },
            update: {
                name,
                password: hashed,
                phone,
                verifyCode: code,
                verifyExpires: expires,
            },
        });

        // Enviar email OTP
        const emailResult = await sendVerificationEmail(email, name, code);
        console.log(`📧 Registro pendiente ${email} — Email ${emailResult.success ? '✅ enviado' : '❌ ' + (emailResult.error || 'simulado')}`);

        // Enviar SMS
        const smsResult = await sendSMSCode(phone, code);
        console.log(`📱 SMS ${phone} — ${smsResult.success ? '✅' : '❌ simulado'}`);

        res.status(200).json({
            message: 'Código enviado. Revisa tu email y SMS.',
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
// Verifica el OTP → crea el User real → elimina PendingRegistration
// =============================================
exports.verifyEmail = async (req, res) => {
    try {
        const { email, code } = req.body;

        const pending = await prisma.pendingRegistration.findUnique({ where: { email } });
        if (!pending) {
            return res.status(404).json({ error: 'No hay un registro pendiente para este email.' });
        }

        if (pending.verifyCode !== code) {
            return res.status(400).json({ error: 'Código incorrecto. Inténtalo de nuevo.' });
        }

        if (pending.verifyExpires < new Date()) {
            return res.status(400).json({ error: 'El código ha expirado. Haz clic en "Reenviar código".' });
        }

        // Verificar que no se creó el user mientras tanto
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            await prisma.pendingRegistration.delete({ where: { email } });
            return res.status(400).json({ error: 'Esta cuenta ya fue verificada. Inicia sesión.' });
        }

        // ¡Código correcto! Crear el User real
        const user = await prisma.user.create({
            data: {
                name: pending.name,
                email: pending.email,
                password: pending.password,
                phone: pending.phone,
                avatar: null,
                emailVerified: true,
            },
        });

        // Eliminar registro pendiente
        await prisma.pendingRegistration.delete({ where: { email } });

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        console.log(`✅ Usuario ${email} verificado y creado exitosamente.`);

        res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
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

        const pending = await prisma.pendingRegistration.findUnique({ where: { email } });
        if (!pending) {
            return res.status(404).json({ error: 'No hay un registro pendiente para este email.' });
        }

        const code = generateOTP();
        const expires = new Date(Date.now() + 15 * 60 * 1000);

        await prisma.pendingRegistration.update({
            where: { email },
            data: { verifyCode: code, verifyExpires: expires },
        });

        const emailResult = await sendVerificationEmail(email, pending.name, code);
        await sendSMSCode(pending.phone, code);

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

        const env = process.env;
        const appUrl = env['APP_URL'] || 'https://tu-selva-urbana.up.railway.app';
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
