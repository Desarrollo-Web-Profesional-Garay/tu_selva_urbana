import { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, ArrowRight, Brain } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { GlobalContext } from '../context/GlobalContext';

export default function QuizNudge() {
    const { user, quizAnswers } = useContext(GlobalContext);
    const navigate = useNavigate();
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (!user?.id) return;

        // Si ya hizo el quiz en esta sesión, nunca mostrar
        if (quizAnswers) return;

        // Clave única por usuario en la DB (usa el ID real del usuario)
        const nudgeKey = `tsu_nudge_shown_uid_${user.id}`;
        const alreadySeen = localStorage.getItem(nudgeKey);

        // Solo mostrar si NUNCA ha visto el nudge Y no tiene quiz completado
        if (!alreadySeen) {
            const timer = setTimeout(() => setVisible(true), 2500);
            return () => clearTimeout(timer);
        }
    }, [user?.id, quizAnswers]);

    const handleDismiss = () => {
        setVisible(false);
        // Marcar como visto para SIEMPRE para este usuario específico
        if (user?.id) {
            localStorage.setItem(`tsu_nudge_shown_uid_${user.id}`, 'true');
        }
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
                    initial={{ opacity: 0, x: 100, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 100, scale: 0.95 }}
                    transition={{ type: 'spring', stiffness: 280, damping: 22 }}
                    className="fixed bottom-24 right-5 z-[200] w-full max-w-[340px]"
                >
                    <div className="relative bg-white rounded-[24px] shadow-2xl shadow-forest/20 overflow-hidden border border-sage/20">
                        {/* Barra superior decorativa */}
                        <div className="h-1 w-full bg-gradient-to-r from-[#4A7C59] via-[#6dbf87] to-[#C1674B]" />

                        {/* Fondo decorativo */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-sage/5 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                        <div className="p-5">
                            {/* Header */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <motion.div
                                        animate={{ rotate: [0, -10, 10, -10, 0] }}
                                        transition={{ repeat: Infinity, duration: 3, repeatDelay: 2 }}
                                        className="w-11 h-11 bg-gradient-to-br from-[#4A7C59] to-[#2C3E2D] rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0"
                                    >
                                        <Brain size={22} className="text-white" />
                                    </motion.div>
                                    <div>
                                        <p className="font-black text-forest text-sm leading-tight">
                                            ¡Hola, {user.name?.split(' ')[0]}! 🌿
                                        </p>
                                        <p className="text-xs text-forest/50 mt-0.5">Personaliza tu experiencia</p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleDismiss}
                                    className="p-1.5 text-forest/30 hover:text-forest hover:bg-bone rounded-full transition-colors flex-shrink-0"
                                >
                                    <X size={15} />
                                </button>
                            </div>

                            {/* Mensaje */}
                            <p className="text-sm text-forest/70 leading-relaxed mb-4">
                                Descubre qué planta <span className="font-bold text-forest">sobrevivirá</span> en tu espacio con nuestro diagnóstico de IA personalizado.
                            </p>

                            {/* Features */}
                            <div className="grid grid-cols-3 gap-2 mb-4">
                                {[
                                    { emoji: '⚡', label: '2 minutos' },
                                    { emoji: '🏠', label: 'Tu espacio' },
                                    { emoji: '🤖', label: 'Con IA' },
                                ].map((item) => (
                                    <div key={item.label} className="bg-bone rounded-xl p-2.5 text-center">
                                        <div className="text-lg mb-0.5">{item.emoji}</div>
                                        <div className="text-[10px] font-bold text-forest/60">{item.label}</div>
                                    </div>
                                ))}
                            </div>

                            {/* Botones */}
                            <div className="flex gap-2">
                                <button
                                    onClick={handleDismiss}
                                    className="flex-1 py-2.5 text-xs font-bold text-forest/50 bg-bone rounded-xl hover:bg-sage/10 transition-colors"
                                >
                                    Después
                                </button>
                                <motion.button
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                    onClick={handleGoQuiz}
                                    className="flex-[2] py-2.5 text-xs font-black text-white bg-gradient-to-r from-[#2C3E2D] to-[#4A7C59] rounded-xl shadow-lg shadow-forest/25 flex items-center justify-center gap-1.5"
                                >
                                    Hacer Diagnóstico <ArrowRight size={13} />
                                </motion.button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
