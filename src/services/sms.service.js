// SMS Service con Twilio
// Variables de entorno en Railway:
//   TWILIO_ACCOUNT_SID
//   TWILIO_AUTH_TOKEN
//   TWILIO_PHONE_NUMBER  (ej. +12345678900)

async function sendSMSCode(to, code) {
    if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN || !process.env.TWILIO_PHONE_NUMBER) {
        console.log(`\n📱 [SMS SIMULADO - agrega variables TWILIO_* en Railway]`);
        console.log(`   Para: ${to}`);
        console.log(`   Código SMS: ${code}\n`);
        return { success: true, simulated: true };
    }

    try {
        const twilio = require('twilio');
        const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

        await client.messages.create({
            body: `Tu Selva Urbana 🌿\n\nCódigo de verificación: ${code}\n\nVálido por 15 minutos. No lo compartas.`,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: to,
        });

        return { success: true };
    } catch (err) {
        console.error('Error enviando SMS:', err.message);
        // Fallback gracioso — no interrumpir el flujo
        return { success: false, error: err.message };
    }
}

module.exports = { sendSMSCode };
