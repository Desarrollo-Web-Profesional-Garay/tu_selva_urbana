// Test rápido para verificar que Brevo SMTP funciona
require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.BREVO_USER,
        pass: process.env.BREVO_SMTP_KEY,
    },
});

async function test() {
    console.log('=== Test Brevo SMTP ===');
    console.log('BREVO_USER:', process.env.BREVO_USER || '❌ NO CONFIGURADO');
    console.log('BREVO_SMTP_KEY:', process.env.BREVO_SMTP_KEY ? '✅ configurado' : '❌ NO CONFIGURADO');
    console.log('BREVO_FROM_EMAIL:', process.env.BREVO_FROM_EMAIL || '❌ NO CONFIGURADO');
    
    const from = process.env.BREVO_FROM_EMAIL || process.env.BREVO_USER;
    const to = 'cesar20437@cbtis75.edu.mx'; // el email del usuario

    try {
        console.log(`\nEnviando email de prueba desde ${from} a ${to}...`);
        const info = await transporter.sendMail({
            from: `"Tu Selva Urbana TEST" <${from}>`,
            to,
            subject: '🌿 Test — Si ves esto, Brevo funciona!',
            text: 'Este es un email de prueba. Si lo recibes, la configuración de Brevo está correcta.',
            html: '<h1>🌿 ¡Funciona!</h1><p>Email de prueba exitoso.</p>',
        });
        console.log('✅ Email enviado! MessageId:', info.messageId);
        console.log('Response:', info.response);
    } catch (err) {
        console.error('❌ Error:', err.message);
        console.error('Código:', err.code);
        console.error('Detalle completo:', err);
    }
}

test();
