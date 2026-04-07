import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Leaf, Instagram, Github, Globe, Heart } from 'lucide-react';

const SITEMAP = [
    {
        title: '🌿 Explorar',
        links: [
            { label: 'Feed Social', path: '/feed' },
            { label: 'Catálogo Botánico', path: '/catalogo' },
            { label: 'Diagnóstico IA', path: '/quiz' },
            { label: 'Recomendaciones', path: '/recomendaciones' },
        ],
    },
    {
        title: '👤 Mi Selva',
        links: [
            { label: 'Mi Perfil', path: '/mi-cuenta' },
            { label: 'Mis Plantas', path: '/mis-plantas' },
            { label: 'Mis Pedidos', path: '/mi-cuenta' },
        ],
    },
    {
        title: '📖 Información',
        links: [
            { label: 'Inicio', path: '/' },
            { label: 'Quiénes Somos', path: '/#about' },
        ],
    },
];

export default function Footer() {
    const navigate = useNavigate();
    const year = new Date().getFullYear();

    return (
        <motion.footer
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-12 border-t border-sage/20 bg-white/50 backdrop-blur-md"
        >
            <div className="max-w-6xl mx-auto px-6 py-8">
                {/* Logo + descripción */}
                <div className="flex flex-col md:flex-row gap-8 mb-8">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-8 h-8 rounded-xl bg-forest flex items-center justify-center">
                                <Leaf size={16} className="text-white" />
                            </div>
                            <span className="font-black text-forest text-lg tracking-tight">Tu Selva Urbana</span>
                        </div>
                        <p className="text-forest/60 text-sm leading-relaxed max-w-xs">
                            Plataforma de arquitectura biofílica inteligente. Encuentra la planta perfecta para tu espacio y únete a nuestra comunidad verde.
                        </p>
                    </div>

                    {/* Mapa del sitio */}
                    {SITEMAP.map((section) => (
                        <div key={section.title} className="flex-1">
                            <h3 className="text-xs font-black text-forest/50 uppercase tracking-widest mb-3">
                                {section.title}
                            </h3>
                            <ul className="space-y-2">
                                {section.links.map((link) => (
                                    <li key={link.label}>
                                        <button
                                            onClick={() => navigate(link.path)}
                                            className="text-sm text-forest/70 hover:text-forest transition-colors hover:translate-x-0.5 transform inline-block"
                                        >
                                            {link.label}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Línea inferior */}
                <div className="border-t border-sage/20 pt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="text-xs text-forest/40 flex items-center gap-1">
                        © {year} Tu Selva Urbana — Hecho con <Heart size={11} className="text-terra fill-terra" /> para la comunidad botánica
                    </p>
                    <div className="flex items-center gap-3">
                        <span className="text-xs text-forest/40 font-mono bg-sage/10 px-2 py-0.5 rounded-md">
                            React + Node.js + PostgreSQL
                        </span>
                    </div>
                </div>
            </div>
        </motion.footer>
    );
}
