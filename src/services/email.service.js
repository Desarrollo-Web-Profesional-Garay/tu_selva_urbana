/**
 * Servicio de Email usando la API v3 de Brevo (Sendinblue)
 * Más fiable que SMTP en entornos de nube como Railway.
 */

const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';

async function sendEmailViaAPI(payload) {
    const apiKey = process.env['BREVO_SMTP_KEY'];
    
    if (!apiKey) {
        console.log(`\n📧 [EMAIL SIMULADO]`);
        console.log(`   Para: ${payload.to[0].email}`);
        console.log(`   Asunto: ${payload.subject}\n`);
        return { success: true, simulated: true };
    }

    try {
        const response = await fetch(BREVO_API_URL, {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'api-key': apiKey,
                'content-type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (response.ok) {
            console.log(`✅ Email enviado vía API a ${payload.to[0].email} — MessageId: ${data.messageId}`);
            return { success: true, messageId: data.messageId };
        } else {
            console.error('❌ Error de la API de Brevo:', data);
            return { success: false, error: data.message || 'Error desconocido' };
        }
    } catch (err) {
        console.error('❌ Error de red conectando con Brevo:', err.message);
        return { success: false, error: err.message };
    }
}

async function sendVerificationEmail(to, name, code) {
    const fromEmail = process.env['BREVO_FROM_EMAIL'] || process.env['BREVO_USER'] || 'noreply@tuselvaurbana.com';
    
    const payload = {
        sender: { name: "Tu Selva Urbana 🌿", email: fromEmail },
        to: [{ email: to, name: name }],
        subject: `${code} — Tu código de verificación | Tu Selva Urbana`,
        htmlContent: `
        <div style="font-family: sans-serif; max-width: 500px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #2C3E2D; text-align: center;">¡Hola, ${name}! 👋</h2>
            <p style="text-align: center; font-size: 16px;">Usa el siguiente código para verificar tu cuenta:</p>
            <div style="background: #f5f7f0; padding: 20px; text-align: center; border-radius: 10px; font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #2C3E2D;">
                ${code}
            </div>
            <p style="text-align: center; color: #9ab09e; font-size: 12px; margin-top: 20px;">Válido por 15 minutos.</p>
        </div>`
    };

    return await sendEmailViaAPI(payload);
}

async function sendPasswordResetEmail(to, name, resetLink) {
    const fromEmail = process.env['BREVO_FROM_EMAIL'] || process.env['BREVO_USER'] || 'noreply@tuselvaurbana.com';

    const payload = {
        sender: { name: "Tu Selva Urbana 🌿", email: fromEmail },
        to: [{ email: to, name: name }],
        subject: 'Restablece tu contraseña — Tu Selva Urbana',
        htmlContent: `
        <div style="font-family: sans-serif; max-width: 500px; margin: auto; padding: 20px;">
            <h2 style="color: #2C3E2D;">Restablecer Contraseña</h2>
            <p>Hola ${name}, haz clic en el botón de abajo para cambiar tu contraseña:</p>
            <div style="text-align: center; margin: 30px 0;">
                <a href="${resetLink}" style="background: #2C3E2D; color: white; padding: 15px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Restablecer ahora</a>
            </div>
            <p style="color: #9ab09e; font-size: 12px;">El enlace expira en 30 minutos.</p>
        </div>`
    };

    return await sendEmailViaAPI(payload);
}

module.exports = { sendVerificationEmail, sendPasswordResetEmail };
