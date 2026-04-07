const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Evitar que el build de Railway falle por falta de variables
if (!process.env.DATABASE_URL) {
    process.env.DATABASE_URL = "postgresql://postgres:postgres@localhost:5432/postgres";
}

try {
    console.log('🚀 Generando Prisma Client...');
    execSync('npx prisma generate', { stdio: 'inherit' });
    console.log('✅ Prisma Client completado.');
} catch (err) {
    console.error('❌ Error Prisma:', err.message);
    process.exit(1);
}
