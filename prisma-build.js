const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env');
let createdEnv = false;

if (!process.env.DATABASE_URL && !fs.existsSync(envPath)) {
    console.log('⚠️ No se detectó DATABASE_URL en Nixpacks. Creando dummy temporal...');
    fs.writeFileSync(envPath, 'DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"');
    createdEnv = true;
}

try {
    console.log('🚀 Generando Prisma Client...');
    execSync('npx prisma generate', { stdio: 'inherit' });
    console.log('✅ Prisma Client completado.');
} catch (err) {
    console.error('❌ Error Prisma:', err.message);
    process.exit(1);
} finally {
    if (createdEnv && fs.existsSync(envPath)) {
        fs.unlinkSync(envPath);
        console.log('🧹 Archivo Dummy limpiado para start de Railway.');
    }
}
