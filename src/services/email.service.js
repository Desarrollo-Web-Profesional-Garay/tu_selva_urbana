const nodemailer = require('nodemailer');

// Configuración Brevo SMTP
// Variables de entorno necesarias en Railway:
//   BREVO_USER  = tu email de login en Brevo
//   BREVO_SMTP_KEY = clave SMTP generada en Brevo > SMTP & API
const transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.BREVO_USER,
        pass: process.env.BREVO_SMTP_KEY,
    },
});

const FROM = `"Tu Selva Urbana 🌿" <${process.env.BREVO_USER || 'noreply@tuselvaurbana.com'}>`;

/**
 * Envía un código OTP de verificación de email
 */
async function sendVerificationEmail(to, name, code) {
    const html = `
    <!DOCTYPE html>
    <html lang="es">
    <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
    <body style="margin:0;padding:0;background:#ECECE5;font-family:'Segoe UI',Arial,sans-serif;">
      <div style="max-width:560px;margin:40px auto;background:#fff;border-radius:24px;overflow:hidden;box-shadow:0 8px 40px rgba(44,62,45,0.1);">
        <!-- Header verde -->
        <div style="background:linear-gradient(135deg,#2C3E2D,#4A7C59);padding:40px 40px 30px;text-align:center;">
          <div style="font-size:48px;margin-bottom:12px;">🌿</div>
          <h1 style="color:#fff;margin:0;font-size:26px;font-weight:900;letter-spacing:-0.5px;">Tu Selva Urbana</h1>
          <p style="color:rgba(255,255,255,0.7);margin:6px 0 0;font-size:13px;">Plataforma de Arquitectura Biofílica</p>
        </div>
        <!-- Cuerpo -->
        <div style="padding:40px;">
          <h2 style="color:#2C3E2D;font-size:20px;margin:0 0 12px;font-weight:800;">¡Hola, ${name}! 👋</h2>
          <p style="color:#5a6b5a;font-size:15px;line-height:1.6;margin:0 0 28px;">
            Estás a un paso de unirte a nuestra comunidad verde. Usa el siguiente código para verificar tu dirección de correo:
          </p>
          <!-- Código OTP -->
          <div style="background:#f5f7f0;border:2px dashed #a8c5a0;border-radius:16px;padding:24px;text-align:center;margin:0 0 28px;">
            <p style="color:#6b8f71;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:2px;margin:0 0 10px;">Tu código de verificación</p>
            <div style="font-size:44px;font-weight:900;letter-spacing:12px;color:#2C3E2D;font-family:monospace;">${code}</div>
            <p style="color:#9ab09e;font-size:12px;margin:10px 0 0;">⏰ Válido por 15 minutos</p>
          </div>
          <p style="color:#9ab09e;font-size:13px;line-height:1.5;margin:0;">
            Si no creaste una cuenta en Tu Selva Urbana, puedes ignorar este mensaje con seguridad.
          </p>
        </div>
        <!-- Footer -->
        <div style="background:#f5f7f0;padding:20px 40px;text-align:center;border-top:1px solid #e0e8dd;">
          <p style="color:#b0c4b1;font-size:12px;margin:0;">© ${new Date().getFullYear()} Tu Selva Urbana · Hecho con 💚</p>
        </div>
      </div>
    </body>
    </html>`;

    const mailOptions = {
        from: FROM,
        to,
        subject: `${code} — Tu código de verificación | Tu Selva Urbana`,
        html,
        text: `Hola ${name}, tu código de verificación es: ${code}. Válido por 15 minutos.`,
    };

    if (!process.env.BREVO_USER || !process.env.BREVO_SMTP_KEY) {
        console.log(`\n📧 [EMAIL SIMULADO - agrega BREVO_USER y BREVO_SMTP_KEY en Railway]`);
        console.log(`   Para: ${to}`);
        console.log(`   Código OTP: ${code}\n`);
        return;
    }

    await transporter.sendMail(mailOptions);
}

/**
 * Envía el email de recuperación de contraseña
 */
async function sendPasswordResetEmail(to, name, resetLink) {
    const html = `
    <!DOCTYPE html>
    <html lang="es">
    <head><meta charset="UTF-8"></head>
    <body style="margin:0;padding:0;background:#ECECE5;font-family:'Segoe UI',Arial,sans-serif;">
      <div style="max-width:560px;margin:40px auto;background:#fff;border-radius:24px;overflow:hidden;box-shadow:0 8px 40px rgba(44,62,45,0.1);">
        <div style="background:linear-gradient(135deg,#C1674B,#E8835B);padding:40px;text-align:center;">
          <div style="font-size:48px;margin-bottom:12px;">🔑</div>
          <h1 style="color:#fff;margin:0;font-size:24px;font-weight:900;">Restablecer Contraseña</h1>
        </div>
        <div style="padding:40px;">
          <h2 style="color:#2C3E2D;font-size:18px;margin:0 0 12px;">Hola, ${name}</h2>
          <p style="color:#5a6b5a;font-size:15px;line-height:1.6;margin:0 0 28px;">
            Recibimos una solicitud para restablecer tu contraseña. Haz clic en el botón de abajo. El enlace expira en <strong>30 minutos</strong>.
          </p>
          <div style="text-align:center;margin:0 0 28px;">
            <a href="${resetLink}" style="background:#2C3E2D;color:#fff;text-decoration:none;padding:16px 32px;border-radius:12px;font-weight:800;font-size:15px;display:inline-block;">
              Restablecer Contraseña →
            </a>
          </div>
          <p style="color:#9ab09e;font-size:13px;">Si no solicitaste esto, ignora este email. Tu contraseña no cambiará.</p>
          <p style="color:#c0c0c0;font-size:11px;word-break:break-all;margin-top:20px;">Enlace: ${resetLink}</p>
        </div>
      </div>
    </body>
    </html>`;

    const mailOptions = {
        from: FROM,
        to,
        subject: 'Restablece tu contraseña — Tu Selva Urbana',
        html,
        text: `Restablece tu contraseña: ${resetLink}`,
    };

    if (!process.env.BREVO_USER || !process.env.BREVO_SMTP_KEY) {
        console.log(`\n🔑 [RESET EMAIL SIMULADO]`);
        console.log(`   Para: ${to}`);
        console.log(`   Link: ${resetLink}\n`);
        return;
    }

    await transporter.sendMail(mailOptions);
}

module.exports = { sendVerificationEmail, sendPasswordResetEmail };
