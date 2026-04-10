require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth.routes');
const plantsRoutes = require('./routes/plants.routes');
const postsRoutes = require('./routes/posts.routes');
const ordersRoutes = require('./routes/orders.routes');
const usersRoutes = require('./routes/users.routes');
const adminRoutes = require('./routes/adminRoutes'); // <-- Importada la nueva ruta

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares globales
app.use(cors());
app.use(express.json({ limit: '5mb' }));

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/plants', plantsRoutes);
app.use('/api/posts', postsRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/chat', require('./routes/chat.routes'));
app.use('/api/admin', adminRoutes); // <-- Registrada la ruta de administración

// Health check + diagnóstico
app.get('/api/health', async (req, res) => {
    const prisma = require('./config/db');
    let dbOk = false;
    let pendingTableExists = false;
    try {
        await prisma.$queryRaw`SELECT 1`;
        dbOk = true;
        // Verificar si PendingRegistration existe
        const tables = await prisma.$queryRaw`SELECT tablename FROM pg_tables WHERE schemaname = 'public'`;
        pendingTableExists = tables.some(t => t.tablename === 'PendingRegistration');
    } catch {}

    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        db: dbOk ? 'connected' : 'error',
        pendingRegistrationTable: pendingTableExists,
        email: {
            BREVO_USER: process.env.BREVO_USER ? '✅ set' : '❌ missing',
            BREVO_SMTP_KEY: process.env.BREVO_SMTP_KEY ? '✅ set' : '❌ missing',
            BREVO_FROM_EMAIL: process.env.BREVO_FROM_EMAIL || '❌ not set (using BREVO_USER)',
            APP_URL: process.env.APP_URL || '❌ not set',
        },
    });
});

// Test de envío de email (temporal para debug)
app.get('/api/test-email', async (req, res) => {
    const to = req.query.to;
    if (!to) return res.status(400).json({ error: 'Agrega ?to=tu@email.com' });

    const { sendVerificationEmail } = require('./services/email.service');
    const result = await sendVerificationEmail(to, 'Test', '123456');
    res.json({
        result,
        from: process.env.BREVO_FROM_EMAIL || process.env.BREVO_USER,
        to,
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
});

// Error handler global
app.use((err, req, res, next) => {
    console.error('Error no controlado:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🌿 Tu Selva Urbana API corriendo en el puerto ${PORT}`);
    console.log(`📋 Health check disponible (Bound to 0.0.0.0)`);
});