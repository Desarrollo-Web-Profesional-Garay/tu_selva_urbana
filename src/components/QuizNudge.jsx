import { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { GlobalContext } from '../context/GlobalContext';

export default function QuizNudge() {
    const { user, quizAnswers } = useContext(GlobalContext);
    const navigate = useNavigate();
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (!user) return;
        
        // Solo mostrar si no ha hecho el quiz Y no ha visto el nudge antes
        const alreadyShown = localStorage.getItem(`tsu_quiz_nudge_${user.id}`);
        if (!alreadyShown && !quizAnswers) {
            // Delay de 2 segundos para que el usuario "se instale"
            const timer = setTimeout(() => setVisible(true), 2000);
            return () => clearTimeout(timer);
        }
    }, [user, quizAnswers]);

    const handleDismiss = () => {
        setVisible(false);
        if (user) localStorage.setItem(`tsu_quiz_nudge_${user.id}`, 'shown');
    };

    const handleGoQuiz = () => {
        handleDismiss();
        navigate('/quiz');
    };

    if (!user) return null;

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{ opacity: 0, y: 80, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 80, scale: 0.9 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    className="fixed bottom-6 right-6 z-[200] w-full max-w-sm"
                >
                    <div className="bg-white/95 backdrop-blur-xl border border-sage/30 rounded-[28px] shadow-2xl shadow-forest/15 overflow-hidden">
                        {/* Franja decorativa superior */}
                        <div className="h-1.5 w-full bg-gradient-to-r from-sage via-[#6dbf87] to-terra" />

                        <div className="p-5">
                            {/* Header */}
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <motion.div
                                        animate={{ rotate: [0, 15, -15, 0] }}
                                        transition={{ repeat: Infinity, duration: 2, repeatDelay: 2 }}
                                        className="w-10 h-10 bg-gradient-to-br from-sage to-[#5a9e6f] rounded-2xl flex items-center justify-center shadow-md"
                                    >
                                        <Sparkles size={20} className="text-white" />
                                    </motion.div>
                                    <div>
                                        <p className="font-black text-forest text-sm">¡Hola, {user.name?.split(' ')[0]}! 🌿</p>
                                        <p className="text-xs text-forest/50">Bienvenido a tu selva</p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleDismiss}
                                    className="p-1.5 text-forest/40 hover:text-forest hover:bg-sage/10 rounded-full transition-colors"
                                >
                                    <X size={16} />
                                </button>
                            </div>

                            {/* Mensaje */}
                            <p className="text-sm text-forest/70 leading-relaxed mb-4">
                                Descubre qué planta <span className="font-bold text-forest">sobrevivirá</span> en tu espacio con nuestro diagnóstico de inteligencia artificial personalizado.
                            </p>

                            {/* Bullets */}
                            <ul className="space-y-1 mb-4">
                                {['Toma menos de 2 minutos', 'Personalizado para tu hogar', 'Resultados instantáneos con IA'].map((item, i) => (
                                    <li key={i} className="flex items-center gap-2 text-xs text-forest/60">
                                        <span className="w-4 h-4 bg-sage/20 rounded-full flex items-center justify-center text-[10px] text-sage font-black flex-shrink-0">✓</span>
                                        {item}
                                    </li>
                                ))}
                            </ul>

                            {/* Botones */}
                            <div className="flex gap-2">
                                <button
                                    onClick={handleDismiss}
                                    className="flex-1 py-2.5 text-xs font-bold text-forest/60 bg-bone border border-sage/20 rounded-xl hover:bg-sage/10 transition-colors"
                                >
                                    Más tarde
                                </button>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleGoQuiz}
                                    className="flex-[2] py-2.5 text-xs font-black text-white bg-forest rounded-xl hover:bg-[#1A251B] transition-colors shadow-lg shadow-forest/20 flex items-center justify-center gap-1.5"
                                >
                                    Hacer el Diagnóstico <ArrowRight size={14} />
                                </motion.button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
