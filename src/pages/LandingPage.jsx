import { useRef, useLayoutEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import { ArrowDown, LogIn, UserPlus, Home, Leaf, Sparkles, Users, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { GlobalContext } from '../context/GlobalContext';
import HeroScene from '../components/3d/HeroScene';

gsap.registerPlugin(ScrollTrigger);

// Partículas de hojas flotantes decorativas
function FloatingLeaves() {
    const leaves = [
        { emoji: '🍃', x: '5%', delay: 0, duration: 6 },
        { emoji: '🌿', x: '15%', delay: 1.5, duration: 7 },
        { emoji: '🌱', x: '80%', delay: 0.8, duration: 5.5 },
        { emoji: '🍃', x: '90%', delay: 2.2, duration: 8 },
        { emoji: '🌾', x: '70%', delay: 0.3, duration: 6.5 },
        { emoji: '🍂', x: '25%', delay: 3, duration: 7.5 },
    ];

    return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            {leaves.map((leaf, i) => (
                <motion.div
                    key={i}
                    className="absolute text-2xl select-none opacity-20"
                    style={{ left: leaf.x, top: '-5%' }}
                    animate={{
                        y: ['0vh', '110vh'],
                        rotate: [0, 180, 360],
                        opacity: [0, 0.25, 0.25, 0],
                    }}
                    transition={{
                        duration: leaf.duration,
                        repeat: Infinity,
                        delay: leaf.delay,
                        ease: 'linear',
                    }}
                >
                    {leaf.emoji}
                </motion.div>
            ))}
        </div>
    );
}

const FEATURES = [
    {
        icon: '🌱',
        title: 'Catálogo Botánico',
        desc: 'Más de 12 especies de plantas cuidadosamente curadas para interiores, exteriores y espacios de trabajo. Con modelos 3D interactivos.',
        color: 'from-sage/20 to-sage/5',
        border: 'border-sage/30',
    },
    {
        icon: '🤖',
        title: 'Diagnóstico con IA',
        desc: 'Nuestro algoritmo de inteligencia artificial analiza tus condiciones de vida (luz, mascotas, hábitos) y te recomienda la planta perfecta.',
        color: 'from-terra/10 to-terra/5',
        border: 'border-terra/20',
    },
    {
        icon: '🌍',
        title: 'Comunidad Verde',
        desc: 'Comparte el progreso de tus plantas, reacciona a publicaciones de otros amantes de la naturaleza y aprende con la comunidad.',
        color: 'from-forest/10 to-forest/5',
        border: 'border-forest/20',
    },
];

const STATS = [
    { value: '12+', label: 'Especies de plantas', icon: Leaf },
    { value: '100%', label: 'Diagnóstico personalizado', icon: Sparkles },
    { value: '∞', label: 'Comunidad activa', icon: Users },
    { value: '🛒', label: 'Adopción y envío', icon: ShoppingBag },
];

export default function LandingPage() {
    const containerRef = useRef();
    const navigate = useNavigate();
    const { isAuthenticated } = useContext(GlobalContext);
    const [modelNode, setModelNode] = useState(null);

    useLayoutEffect(() => {
        if (!modelNode) return;

        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top top',
                    end: 'bottom bottom',
                    scrub: 1,
                }
            });

            tl.to(modelNode.position, { x: 2, y: 0.3, z: -1 }, 0)
                .to(modelNode.rotation, { y: -0.5, x: 0.08, z: -0.05 }, 0)
                .to(modelNode.scale, { x: 0.8, y: 0.8, z: 0.8 }, 0);

            tl.to('.hero-content', { opacity: 0, y: -60 }, 0);
        }, containerRef);

        return () => ctx.revert();
    }, [modelNode]);

    return (
        <div ref={containerRef} className="relative w-full overflow-x-hidden bg-bone">
            <FloatingLeaves />

            {/* NAV */}
            <motion.nav
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 lg:px-12 py-4"
            >
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-forest rounded-xl flex items-center justify-center">
                        <Leaf size={16} className="text-white" />
                    </div>
                    <span className="text-forest font-black text-lg tracking-tight">Tu Selva Urbana</span>
                </div>
                <div className="flex items-center gap-3">
                    {!isAuthenticated ? (
                        <>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate('/login')}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold text-forest border-2 border-forest/20 hover:border-forest/50 bg-white/60 backdrop-blur-md transition-all"
                            >
                                <LogIn size={16} /> Iniciar Sesión
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate('/login')}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold text-white bg-terra hover:bg-[#D36C52] shadow-lg shadow-terra/30 transition-all"
                            >
                                <UserPlus size={16} /> Crear Cuenta
                            </motion.button>
                        </>
                    ) : (
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate('/feed')}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold text-white bg-forest hover:bg-forest/90 shadow-lg shadow-forest/30 transition-all"
                        >
                            <Home size={16} /> Ir a Mi Selva
                        </motion.button>
                    )}
                </div>
            </motion.nav>

            {/* Canvas 3D Orquídea (fijo) */}
            <div className="fixed top-0 left-0 w-full h-screen pointer-events-none z-0">
                <HeroScene setModelNode={setModelNode} />
                {/* Niebla en la base */}
                <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-bone via-bone/60 to-transparent pointer-events-none z-10" />
            </div>

            {/* Contenido scrollable */}
            <div className="relative z-10">

                {/* SECCIÓN 1: HERO */}
                <section className="h-screen w-full flex items-center justify-center pointer-events-none px-6">
                    <div className="hero-content text-center max-w-4xl mx-auto -mt-16">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.4 }}
                            className="inline-flex items-center gap-2 bg-forest/10 text-forest/80 text-xs font-black px-4 py-1.5 rounded-full border border-forest/20 mb-5 backdrop-blur-sm"
                        >
                            <Sparkles size={13} /> Arquitectura Biofílica Inteligente
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, delay: 0.5 }}
                            className="text-5xl md:text-7xl lg:text-8xl font-black text-forest tracking-tighter leading-tight drop-shadow-sm"
                        >
                            Encuentra la planta que <span className="text-sage">sobrevivirá</span> en tu hogar.
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1, delay: 1 }}
                            className="mt-6 text-xl text-forest/70 font-medium"
                        >
                            Diagnóstico con IA · Catálogo botánico · Comunidad verde
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 1.5 }}
                            className="mt-10 flex items-center justify-center gap-4 pointer-events-auto"
                        >
                            <button
                                onClick={() => navigate('/login')}
                                className="px-8 py-4 rounded-full font-bold text-white bg-terra hover:bg-[#D36C52] shadow-xl shadow-terra/30 transition-all text-lg"
                            >
                                Comenzar Gratis
                            </button>
                            <button
                                onClick={() => navigate('/quiz')}
                                className="px-8 py-4 rounded-full font-bold text-forest border-2 border-forest/20 bg-white/60 backdrop-blur-md hover:bg-white/80 transition-all text-lg"
                            >
                                Hacer el Quiz 🌱
                            </button>
                        </motion.div>
                    </div>

                    {/* Scroll indicator */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 2.2, duration: 1 }}
                        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center text-forest/40 font-bold uppercase tracking-widest text-xs"
                    >
                        <span>Descubre más</span>
                        <motion.div
                            animate={{ y: [0, 8, 0] }}
                            transition={{ repeat: Infinity, duration: 1.8 }}
                            className="mt-2"
                        >
                            <ArrowDown size={20} />
                        </motion.div>
                    </motion.div>
                </section>

                {/* SECCIÓN 2: QUIÉNES SOMOS */}
                <section className="min-h-screen w-full flex items-center justify-start px-6 lg:px-20 py-24 pointer-events-auto" id="about">
                    <div className="w-full lg:w-1/2 xl:w-5/12">

                        {/* Tag */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="inline-flex items-center gap-2 bg-sage/20 text-forest text-xs font-black px-4 py-1.5 rounded-full border border-sage/30 mb-6"
                        >
                            <Leaf size={13} className="text-sage" /> Nuestro Ecosistema
                        </motion.div>

                        {/* Título */}
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7, delay: 0.1 }}
                            className="text-4xl md:text-5xl font-black text-forest tracking-tighter leading-tight mb-4"
                        >
                            Tu ecosistema verde, <span className="text-terra">inteligente</span> y social
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="text-forest/70 text-lg leading-relaxed mb-8"
                        >
                            Somos una plataforma de arquitectura biofílica que une tecnología e inteligencia artificial para ayudarte a construir entornos más verdes, saludables y conectados con la naturaleza.
                        </motion.p>

                        {/* Tarjetas de características */}
                        <div className="flex flex-col gap-4 mb-8">
                            {FEATURES.map((feat, i) => (
                                <motion.div
                                    key={feat.title}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.1 + i * 0.12, duration: 0.6 }}
                                    whileHover={{ scale: 1.02, x: 4 }}
                                    className={`bg-gradient-to-r ${feat.color} border ${feat.border} rounded-2xl p-5 flex items-start gap-4 backdrop-blur-sm cursor-default`}
                                >
                                    <span className="text-3xl flex-shrink-0 mt-0.5">{feat.icon}</span>
                                    <div>
                                        <h3 className="font-black text-forest text-base mb-1">{feat.title}</h3>
                                        <p className="text-forest/60 text-sm leading-relaxed">{feat.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Stats */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4 }}
                            className="grid grid-cols-2 gap-3 mb-8"
                        >
                            {STATS.map(({ value, label }) => (
                                <div key={label} className="bg-white/70 backdrop-blur-md border border-sage/20 rounded-2xl p-4 text-center shadow-sm">
                                    <div className="text-2xl font-black text-forest mb-0.5">{value}</div>
                                    <div className="text-xs text-forest/60 font-medium">{label}</div>
                                </div>
                            ))}
                        </motion.div>

                        {/* CTA */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.5 }}
                            className="flex gap-3"
                        >
                            <button
                                onClick={() => navigate('/login')}
                                className="flex-1 py-3.5 bg-forest text-white font-bold rounded-2xl hover:bg-[#1A251B] transition-all shadow-lg shadow-forest/20 text-sm"
                            >
                                Unirme a la Comunidad
                            </button>
                            <button
                                onClick={() => navigate('/quiz')}
                                className="flex-1 py-3.5 bg-sage/20 text-forest border border-sage/30 font-bold rounded-2xl hover:bg-sage/30 transition-all text-sm flex items-center justify-center gap-1.5"
                            >
                                <Sparkles size={15} /> Hacer el Quiz IA
                            </button>
                        </motion.div>

                        {/* Cita */}
                        <motion.blockquote
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.6 }}
                            className="mt-8 pl-4 border-l-4 border-sage/40 text-forest/50 italic text-sm leading-relaxed"
                        >
                            "Las plantas son los pulmones del hogar. Cada hoja que respira, purifica el aire que te rodea y conecta tu espacio con la naturaleza."
                        </motion.blockquote>
                    </div>
                </section>

            </div>
        </div>
    );
}
