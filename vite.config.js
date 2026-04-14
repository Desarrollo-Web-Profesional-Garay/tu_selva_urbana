import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        port: 5173,
        proxy: {
            '/api': {
                target: 'http://localhost:3001',
                changeOrigin: true,
                secure: false
            }
        }
    },
    preview: {
        host: true,
        port: process.env.PORT ? parseInt(process.env.PORT) : 4173,
        allowedHosts: ['tuselvaurbana-production.up.railway.app']
    }
})