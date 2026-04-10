import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const ROUTE_LABELS = {
    '/': 'Inicio',
    '/feed': 'Feed Social',
    '/catalogo': 'Catálogo',
    '/mis-plantas': 'Mis Plantas',
    '/mi-cuenta': 'Mi Perfil',
    '/quiz': 'Diagnóstico IA',
    '/recomendaciones': 'Recomendaciones',
};

export default function Breadcrumbs({ currentPlant = null }) {
    const location = useLocation();
    const navigate = useNavigate();

    // Construir ruta de migas
    const crumbs = [{ label: 'Inicio', path: '/feed' }];

    const label = ROUTE_LABELS[location.pathname];
    if (label && location.pathname !== '/feed') {
        crumbs.push({ label, path: location.pathname });
    }

    // Si hay una planta seleccionada (en catálogo), añadir su nombre
    if (currentPlant && location.pathname === '/catalogo') {
        crumbs.push({ label: currentPlant.name, path: null });
    }

    if (crumbs.length <= 1) return null;

    return (
        <motion.nav
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            aria-label="Breadcrumb"
            className="flex items-center gap-1 text-xs text-forest/50 font-medium mb-4 flex-wrap"
        >
            {crumbs.map((crumb, i) => {
                const isLast = i === crumbs.length - 1;
                return (
                    <span key={i} className="flex items-center gap-1">
                        {i === 0 && <Home size={11} className="text-forest/40" />}
                        {crumb.path && !isLast ? (
                            <button
                                onClick={() => navigate(crumb.path)}
                                className="hover:text-forest hover:underline transition-colors"
                            >
                                {crumb.label}
                            </button>
                        ) : (
                            <span className={isLast ? 'text-forest font-semibold' : ''}>
                                {crumb.label}
                            </span>
                        )}
                        {!isLast && <ChevronRight size={11} className="text-forest/30" />}
                    </span>
                );
            })}
        </motion.nav>
    );
}
