/**
 * Servicio de Email usando la API v3 de Brevo (Sendinblue)
 * Recomendado para Railway para evitar errores de Connection Timeout.
 */

async function sendVerificationEmail(to, name, code) {
    const apiKey = process.env['BREVO_SMTP_KEY'];
    const fromEmail = process.env['BREVO_FROM_EMAIL'] || 'cesarenriquegaraygarcia50@gmail.com';

    if (!apiKey) {
        console.log("⚠️ No se encontró la clave de API (BREVO_SMTP_KEY)");
        return { success: false, error: 'API Key missing' };
    }

    try {
        const response = await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'api-key': apiKey.trim(), // Limpiar espacios accidentales
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                sender: { name: "Tu Selva Urbana 🌿", email: fromEmail },
                to: [{ email: to, name: name }],
                subject: `${code} — Código de Verificación`,
                htmlContent: `<h2>¡Hola, ${name}! 👋</h2><p>Tu código es: <b>${code}</b></p>`
            })
        });

        const data = await response.json();

        if (response.ok) {
            console.log(`✅ Email enviado vía API a ${to}`);
            return { success: true };
        } else {
            console.error('❌ Error de Brevo API:', data);
            // Si el error es "unauthorized", es porque la clave en Railway no es la de la pestaña "API keys"
            return { success: false, error: data.code || data.message };
        }
    } catch (err) {
        console.error('❌ Error de conexión:', err.message);
        return { success: false, error: err.message };
    }
}

async function sendPasswordResetEmail(to, name, resetLink) {
    const apiKey = process.env['BREVO_SMTP_KEY'];
    const fromEmail = process.env['BREVO_FROM_EMAIL'] || 'cesarenriquegaraygarcia50@gmail.com';

    try {
        const response = await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'api-key': apiKey.trim(),
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                sender: { name: "Tu Selva Urbana 🌿", email: fromEmail },
                to: [{ email: to, name: name }],
                subject: `Restablecer Contraseña`,
                htmlContent: `<p>Haz clic aquí para restablecer: <a href="${resetLink}">${resetLink}</a></p>`
            })
        });
        return { success: response.ok };
    } catch (err) {
        return { success: false, error: err.message };
    }
}

module.exports = { sendVerificationEmail, sendPasswordResetEmail };
