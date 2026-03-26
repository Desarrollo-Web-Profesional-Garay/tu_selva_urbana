import { useRef, useLayoutEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import { ArrowDown, LogIn, UserPlus, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { GlobalContext } from '../context/GlobalContext';

import HeroScene from '../components/3d/HeroScene';
import Quiz from './Quiz'; // We embed the Quiz directly into the landing page flow

gsap.registerPlugin(ScrollTrigger);

export default function LandingPage() {
    const containerRef = useRef();
    const navigate = useNavigate();
    const { isAuthenticated } = useContext(GlobalContext);
    // Use state callback ref so GSAP reliably waits for the Canvas to mount the ThreeJS scene
    const [modelNode, setModelNode] = useState(null);

    useLayoutEffect(() => {
        // We wait for the model to be available in the DOM/Canvas
        if (!modelNode) return;

        const ctx = gsap.context(() => {
            // Create a GSAP Timeline attached to ScrollTrigger
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top top',
                    end: 'bottom bottom',
                    scrub: 1, // Smooth scrubbing (1 second trail)
                }
            });

            // Animate the 2.5D Image plane:
            // When scrolling down, the image moves right, shrinks, and tilts slightly (Parallax)
            tl.to(modelNode.position, { x: 2, y: 0, z: -1 }, 0)
                .to(modelNode.rotation, { y: -0.4, x: 0.1, z: -0.1 }, 0)
                .to(modelNode.scale, { x: 0.85, y: 0.85, z: 0.85 }, 0);

            // We can also animate HTML elements (e.g. fading out the hero text)
            tl.to('.hero-content', { opacity: 0, y: -50 }, 0);

        }, containerRef); // Scope to our main container

        return () => ctx.revert(); // Cleanup GSAP animations on unmount
    }, [modelNode]);

    return (
        <div ref={containerRef} className="relative w-full overflow-x-hidden bg-bone">

            {/* ===== TOP NAV BAR ===== */}
            <motion.nav
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 lg:px-12 py-4"
            >
                <div className="flex items-center gap-2">
                    <span className="text-2xl">🌿</span>
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
                                <LogIn size={16} />
                                Iniciar Sesión
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate('/register')}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold text-white bg-terra hover:bg-[#D36C52] shadow-lg shadow-terra/30 transition-all"
                            >
                                <UserPlus size={16} />
                                Crear Cuenta
                            </motion.button>
                        </>
                    ) : (
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate('/feed')}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold text-white bg-forest hover:bg-forest/90 shadow-lg shadow-forest/30 transition-all"
                        >
                            <Home size={16} />
                            Ir a Mi Selva
                        </motion.button>
                    )}
                </div>
            </motion.nav>

            {/* 
        Fixed Canvas Background. 
        It stays fixed while the page scrolls so GSAP can just update the model inside it.
      */}
            <div className="fixed top-0 left-0 w-full h-screen pointer-events-none z-0">
                <HeroScene setModelNode={setModelNode} />
            </div>

            {/* 
        Scrollable Content Layer 
        Total 200vh height to create enough scroll distance to trigger the GSAP timeline
      */}
            <div className="relative z-10">

                {/* -- SECTION 1: HERO (100vh) -- */}
                <section className="h-screen w-full flex items-center justify-center pointer-events-none px-6">
                    <div className="hero-content text-center max-w-4xl mx-auto -mt-16">
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, delay: 0.5 }}
                            className="text-5xl md:text-7xl lg:text-8xl font-black text-forest tracking-tighter leading-tight drop-shadow-sm"
                        >
                            Encuentra la planta que sobrevivirá en tu hogar.
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1, delay: 1 }}
                            className="mt-6 text-xl text-forest/80 font-medium"
                        >
                            Arquitectura Biofílica Inteligente
                        </motion.p>

                        {/* CTA Buttons */}
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
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 2, duration: 1 }}
                        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center text-forest/50 font-bold uppercase tracking-widest text-sm"
                    >
                        <span>Descubre cómo</span>
                        <motion.div
                            animate={{ y: [0, 10, 0] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="mt-2"
                        >
                            <ArrowDown size={24} />
                        </motion.div>
                    </motion.div>
                </section>


                {/* -- SECTION 2: QUIZ (100vh) -- */}
                <section className="h-screen w-full flex items-center justify-start px-6 lg:px-20 pointer-events-auto">
                    {/* 
            Since the 3D plant moves to the RIGHT (x: 1.5), 
            we position our Quiz container on the LEFT.
          */}
                    <div className="w-full lg:w-1/2 h-full py-20 flex justify-center">
                        {/* Note: We reuse the existing Quiz but wrap it or adapt it slightly if needed */}
                        <div className="bg-white/90 backdrop-blur-xl shadow-2xl rounded-[40px] w-full max-w-2xl overflow-hidden border border-sage/30 relative z-20">
                            <Quiz isEmbedded={true} />
                        </div>
                    </div>
                </section>

            </div>
        </div>
    );
}
