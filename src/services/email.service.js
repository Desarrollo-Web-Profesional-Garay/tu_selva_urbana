/**
 * Servicio de Email usando la API v3 de Brevo (Sendinblue)
 */

const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';

async function sendEmailViaAPI(payload) {
    const apiKey = process.env['BREVO_SMTP_KEY'];
    if (!apiKey) return { success: false, simulated: true };

    try {
        const response = await fetch(BREVO_API_URL, {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'api-key': apiKey.trim(),
                'content-type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        return { success: response.ok, data: await response.json() };
    } catch (err) {
        return { success: false, error: err.message };
    }
}

async function sendVerificationEmail(to, name, code) {
    const fromEmail = process.env['BREVO_FROM_EMAIL'] || 'cesarenriquegaraygarcia50@gmail.com';
    
    const payload = {
        sender: { name: "Tu Selva Urbana 🌿", email: fromEmail },
        to: [{ email: to, name: name }],
        subject: `${code} — Código de Verificación | Tu Selva Urbana`,
        htmlContent: `
        <!DOCTYPE html>
        <html>
        <head><meta charset="UTF-8"></head>
        <body style="margin:0;padding:0;background-color:#f9fafb;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
            <div style="max-width:600px;margin:20px auto;background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.05);">
                <div style="background:linear-gradient(135deg, #1a2e1b 0%, #2d4a2e 100%);padding:40px 20px;text-align:center;">
                    <div style="font-size:40px;margin-bottom:10px;">🌿</div>
                    <h1 style="color:#ffffff;margin:0;font-size:24px;letter-spacing:1px;text-transform:uppercase;">Tu Selva Urbana</h1>
                    <p style="color:#a8c5a0;margin-top:5px;font-size:14px;">Bienvenido a tu ecosistema digital</p>
                </div>
                <div style="padding:40px 30px;text-align:center;">
                    <h2 style="color:#1a2e1b;font-size:22px;margin-bottom:20px;">¡Hola, ${name}!</h2>
                    <p style="color:#4b5563;font-size:16px;line-height:1.6;margin-bottom:30px;">
                        Estamos emocionados de tenerte con nosotros. Para completar tu registro y asegurar tu cuenta, por favor usa el siguiente código de seguridad:
                    </p>
                    <div style="background-color:#f3f4f6;padding:30px;border-radius:12px;border:2px dashed #d1d5db;display:inline-block;margin-bottom:30px;">
                        <span style="font-size:42px;font-weight:900;letter-spacing:10px;color:#1a2e1b;font-family:monospace;">${code}</span>
                    </div>
                    <p style="color:#9ca3af;font-size:13px;">
                        Este código expirará en 15 minutos.<br>Si no solicitaste este registro, puedes ignorar este correo.
                    </p>
                </div>
                <div style="background-color:#f9fafb;padding:20px;text-align:center;border-top:1px solid #f3f4f6;">
                    <p style="color:#9ca3af;font-size:12px;margin:0;">
                        © ${new Date().getFullYear()} Tu Selva Urbana · Arquitectura Biofílica & Comunidad
                    </p>
                </div>
            </div>
        </body>
        </html>`
    };

    return await sendEmailViaAPI(payload);
}

async function sendPasswordResetEmail(to, name, resetLink) {
    const fromEmail = process.env['BREVO_FROM_EMAIL'] || 'cesarenriquegaraygarcia50@gmail.com';

    const payload = {
        sender: { name: "Tu Selva Urbana 🌿", email: fromEmail },
        to: [{ email: to, name: name }],
        subject: `Restablecer tu contraseña | Tu Selva Urbana`,
        htmlContent: `
        <!DOCTYPE html>
        <html>
        <head><meta charset="UTF-8"></head>
        <body style="margin:0;padding:0;background-color:#f9fafb;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
            <div style="max-width:600px;margin:20px auto;background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.05);">
                <div style="background:linear-gradient(135deg, #442a1b 0%, #6b442e 100%);padding:40px 20px;text-align:center;">
                    <div style="font-size:40px;margin-bottom:10px;">🔑</div>
                    <h1 style="color:#ffffff;margin:0;font-size:24px;letter-spacing:1px;text-transform:uppercase;">Recuperación</h1>
                </div>
                <div style="padding:40px 30px;text-align:center;">
                    <h2 style="color:#442a1b;font-size:22px;margin-bottom:20px;">¿Olvidaste tu contraseña?</h2>
                    <p style="color:#4b5563;font-size:16px;line-height:1.6;margin-bottom:35px;">
                        No te preocupes, sucede. Haz clic en el botón de abajo para elegir una nueva contraseña. Este enlace es válido por 30 minutos.
                    </p>
                    <a href="${resetLink}" style="display:inline-block;background-color:#442a1b;color:#ffffff;padding:18px 35px;border-radius:10px;text-decoration:none;font-weight:bold;font-size:16px;box-shadow:0 10px 15px -3px rgba(68,42,27,0.3);">
                        Restablecer Contraseña
                    </a>
                    <p style="color:#9ca3af;font-size:13px;margin-top:35px;">
                        Si el botón no funciona, copia y pega este enlace en tu navegador:<br>
                        <span style="color:#6b7280;word-break:break-all;">${resetLink}</span>
                    </p>
                </div>
                <div style="background-color:#f9fafb;padding:20px;text-align:center;border-top:1px solid #f3f4f6;">
                    <p style="color:#9ca3af;font-size:12px;margin:0;">
                        Si no solicitaste esto, puedes ignorar este mensaje de forma segura.
                    </p>
                </div>
            </div>
        </body>
        </html>`
    };

    return await sendEmailViaAPI(payload);
}

module.exports = { sendVerificationEmail, sendPasswordResetEmail };
