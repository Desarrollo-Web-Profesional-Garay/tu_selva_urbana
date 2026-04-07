const nodemailer = require('nodemailer');

/**
 * Servicio de Email usando SMTP (Basado en la configuración de la imagen del usuario)
 * Host: smtp-relay.brevo.com
 * Port: 587
 */

const transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
    secure: false, // 587 usa TLS (StartTLS), no SSL directo
    auth: {
        user: process.env['BREVO_USER'], // Debe ser: a754b1001@smtp-brevo.com
        pass: process.env['BREVO_SMTP_KEY'], // La clave xsmtpsib...
    },
    tls: {
        // Esta opción es CRUCIAL para evitar el "Connection Timeout" en Railway
        rejectUnauthorized: false
    },
    connectionTimeout: 10000, // 10 segundos
});

const FROM_EMAIL = process.env['BREVO_FROM_EMAIL'] || process.env['BREVO_USER'] || 'noreply@tuselvaurbana.com';
const FROM = `"Tu Selva Urbana 🌿" <${FROM_EMAIL}>`;

async function sendVerificationEmail(to, name, code) {
    const html = `
    <div style="font-family: sans-serif; max-width: 500px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #2C3E2D; text-align: center;">¡Hola, ${name}! 👋</h2>
        <p style="text-align: center; font-size: 16px;">Usa el siguiente código para verificar tu cuenta:</p>
        <div style="background: #f5f7f0; padding: 20px; text-align: center; border-radius: 10px; font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #2C3E2D;">
            ${code}
        </div>
        <p style="text-align: center; color: #9ab09e; font-size: 12px; margin-top: 20px;">Válido por 15 minutos.</p>
    </div>`;

    const mailOptions = {
        from: FROM,
        to,
        subject: `${code} — Tu código de verificación | Tu Selva Urbana`,
        html,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`✅ Email enviado exitosamente a ${to}`);
        return { success: true, messageId: info.messageId };
    } catch (err) {
        console.error(`❌ Error enviando email:`, err.message);
        return { success: false, error: err.message };
    }
}

async function sendPasswordResetEmail(to, name, resetLink) {
    const html = `
    <div style="font-family: sans-serif; max-width: 500px; margin: auto; padding: 20px;">
        <h2 style="color: #2C3E2D;">Restablecer Contraseña</h2>
        <p>Hola ${name}, haz clic en el botón de abajo para cambiar tu contraseña:</p>
        <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" style="background: #2C3E2D; color: white; padding: 15px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Restablecer ahora</a>
        </div>
        <p style="color: #9ab09e; font-size: 12px;">El enlace expira en 30 minutos.</p>
    </div>`;

    const mailOptions = {
        from: FROM,
        to,
        subject: 'Restablece tu contraseña — Tu Selva Urbana',
        html,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`✅ Email de recuperación enviado a ${to}`);
        return { success: true, messageId: info.messageId };
    } catch (err) {
        console.error(`❌ Error enviando email de recuperación:`, err.message);
        return { success: false, error: err.message };
    }
}

module.exports = { sendVerificationEmail, sendPasswordResetEmail };
