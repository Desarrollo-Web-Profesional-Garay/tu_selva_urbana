# Tu Selva Urbana - Backend API 🌿

API REST para la plataforma Tu Selva Urbana: Vivero Inteligente + Red Social de Plantas.

## Tech Stack
- **Runtime:** Node.js + Express
- **Base de Datos:** PostgreSQL + Prisma ORM
- **Auth:** JWT + bcrypt
- **Deploy:** Railway

## Instalación

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno
cp .env.example .env
# Editar .env con tu DATABASE_URL de PostgreSQL

# 3. Ejecutar migraciones
npx prisma migrate dev --name init

# 4. Sembrar datos iniciales
npm run db:seed

# 5. Iniciar servidor
npm run dev
```

## Variables de Entorno
| Variable | Descripción |
|----------|-------------|
| `DATABASE_URL` | URL de conexión PostgreSQL |
| `JWT_SECRET` | Clave secreta para tokens JWT |
| `PORT` | Puerto del servidor (default: 3001) |

## Endpoints

### Auth (Públicos)
- `POST /api/auth/register` - Crear cuenta
- `POST /api/auth/login` - Iniciar sesión

### Plantas (Públicos)
- `GET /api/plants` - Catálogo completo
- `GET /api/plants/:id` - Detalle
- `POST /api/plants/quiz` - Recomendaciones

### Usuarios (Requieren JWT)
- `GET /api/users/me` - Mi perfil
- `PUT /api/users/me` - Editar perfil
- `GET /api/users/me/plants` - Mis plantas
- `POST /api/users/me/plants` - Adoptar planta

### Posts (Requieren JWT)
- `GET /api/posts` - Feed
- `POST /api/posts` - Publicar
- `POST /api/posts/:id/like` - Like

### Órdenes (Requieren JWT)
- `POST /api/orders` - Crear compra
- `GET /api/orders` - Historial

### Health
- `GET /api/health` - Status del servidor

## Usuarios Demo
Después del seed, puedes usar:
- `lucia@demo.com` / `123456`
- `carlos@demo.com` / `123456`
- `ana@demo.com` / `123456`
