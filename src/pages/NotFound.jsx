import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Search, ArrowLeft, Leaf } from 'lucide-react';
import { useContext } from 'react';
import { GlobalContext } from '../context/GlobalContext';

export default function NotFound() {
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated } = useContext(GlobalContext);

    const leaves = ['🌿', '🍃', '🌱', '🌾', '🌵'];

    return (
        <div className="min-h-screen bg-bone flex items-center justify-center relative overflow-hidden px-4">
            {/* Hojas flotantes decorativas */}
            {leaves.map((leaf, i) => (
                <motion.div
                    key={i}
                    className="absolute text-4xl pointer-events-none select-none opacity-20"
                    style={{
                        left: `${10 + i * 20}%`,
                        top: `${15 + (i % 3) * 25}%`,
                    }}
                    animate={{
                        y: [0, -20, 0],
                        rotate: [0, 10, -10, 0],
                        opacity: [0.2, 0.4, 0.2],
                    }}
                    transition={{
                        duration: 3 + i * 0.5,
                        repeat: Infinity,
                        delay: i * 0.4,
                        ease: 'easeInOut',
                    }}
                >
                    {leaf}
                </motion.div>
            ))}

            {/* Círculo de fondo */}
            <div className="absolute w-[600px] h-[600px] rounded-full bg-sage/5 border border-sage/10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative z-10 text-center max-w-lg"
            >
                {/* Planta "marchita" animada */}
                <motion.div
                    animate={{ rotate: [0, -5, 5, -3, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                    className="text-[120px] leading-none mb-4 drop-shadow-sm"
                >
                    🥀
                </motion.div>

                {/* Código de error */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, type: 'spring' }}
                    className="inline-flex items-center gap-2 bg-terra/10 text-terra px-4 py-1.5 rounded-full text-sm font-black mb-4 border border-terra/20"
                >
                    <Leaf size={14} />
                    Error 404 — Página no encontrada
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-4xl md:text-5xl font-black text-forest tracking-tighter mb-3"
                >
                    Esta página se fue a hibernar
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-forest/60 text-lg mb-2"
                >
                    La ruta{' '}
                    <code className="bg-sage/20 text-forest font-mono text-sm px-2 py-0.5 rounded-lg">
                        {location.pathname}
                    </code>{' '}
                    no existe en nuestra selva.
                </motion.p>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.45 }}
                    className="text-forest/40 text-sm mb-8"
                >
                    {isAuthenticated
                        ? 'Tu sesión está activa. No te preocupes, todo sigue igual. 🌿'
                        : 'Puedes volver al inicio y empezar desde ahí.'}
                </motion.p>

                {/* Botones */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex flex-col sm:flex-row gap-3 justify-center"
                >
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-sage/30 text-forest font-bold rounded-2xl hover:border-sage/60 hover:bg-sage/5 transition-all shadow-sm"
                    >
                        <ArrowLeft size={18} /> Volver atrás
                    </button>

                    {isAuthenticated ? (
                        <button
                            onClick={() => navigate('/feed')}
                            className="flex items-center justify-center gap-2 px-6 py-3 bg-forest text-white font-bold rounded-2xl hover:bg-[#1A251B] transition-all shadow-lg shadow-forest/20"
                        >
                            <Home size={18} /> Ir al Feed
                        </button>
                    ) : (
                        <button
                            onClick={() => navigate('/')}
                            className="flex items-center justify-center gap-2 px-6 py-3 bg-forest text-white font-bold rounded-2xl hover:bg-[#1A251B] transition-all shadow-lg shadow-forest/20"
                        >
                            <Home size={18} /> Ir al Inicio
                        </button>
                    )}

                    {isAuthenticated && (
                        <button
                            onClick={() => navigate('/catalogo')}
                            className="flex items-center justify-center gap-2 px-6 py-3 bg-sage/15 text-forest border border-sage/30 font-bold rounded-2xl hover:bg-sage/25 transition-all"
                        >
                            <Search size={18} /> Ver Catálogo
                        </button>
                    )}
                </motion.div>
            </motion.div>
        </div>
    );
}
