import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, ScanLine, X, Sparkles, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ScannerModal({ isOpen, onClose }) {
    const [scanningStep, setScanningStep] = useState(0);
    // 0: Init, 1: Scanning, 2: Analyzing, 3: Found
    const navigate = useNavigate();

    useEffect(() => {
        if (!isOpen) {
            setScanningStep(0);
            return;
        }

        // Simulate AI scanning flow
        let timeout1, timeout2, timeout3;

        timeout1 = setTimeout(() => {
            setScanningStep(1); // Start scan line

            timeout2 = setTimeout(() => {
                setScanningStep(2); // Analyzing data

                timeout3 = setTimeout(() => {
                    setScanningStep(3); // Match found
                }, 2500);
            }, 3000);
        }, 500);

        return () => {
            clearTimeout(timeout1);
            clearTimeout(timeout2);
            clearTimeout(timeout3);
        };
    }, [isOpen]);

    const handleRedirect = () => {
        onClose();
        navigate('/home'); // Redirects to recommendations where the plant will be
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/90 backdrop-blur-xl"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-md bg-forest overflow-hidden rounded-[40px] shadow-2xl border border-white/10 text-white flex flex-col h-[600px]"
                    >
                        <div className="absolute top-6 right-6 z-20">
                            <button onClick={onClose} className="p-3 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-md transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-8 pb-4 text-center relative z-10">
                            <motion.div
                                initial={{ y: -20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full mb-4 border border-white/20"
                            >
                                <Sparkles size={16} className="text-sage" />
                                <span className="text-sm font-bold tracking-widest uppercase">Motor IA Vision</span>
                            </motion.div>
                            <h2 className="text-3xl font-black mb-2">Identificador Botánico</h2>
                            <p className="text-white/60 text-sm">Apunta tu cámara a cualquier hoja o tallo.</p>
                        </div>

                        {/* Camera Viewfinder Mock */}
                        <div className="flex-1 relative mx-8 mb-8 rounded-[32px] overflow-hidden bg-black/50 border-2 border-white/10">
                            {/* Realistic dark generic plant background */}
                            <img
                                src="https://images.unsplash.com/photo-1497250681960-ef046c08a56e?q=80&w=600&auto=format&fit=crop"
                                alt="Camera view"
                                className={`w-full h-full object-cover transition-all duration-1000 ${scanningStep >= 2 ? 'blur-sm scale-105 brightness-50' : 'brightness-75'}`}
                            />

                            {/* Corner brackets */}
                            <div className="absolute top-4 left-4 w-12 h-12 border-t-4 border-l-4 border-sage rounded-tl-xl opacity-80" />
                            <div className="absolute top-4 right-4 w-12 h-12 border-t-4 border-r-4 border-sage rounded-tr-xl opacity-80" />
                            <div className="absolute bottom-4 left-4 w-12 h-12 border-b-4 border-l-4 border-sage rounded-bl-xl opacity-80" />
                            <div className="absolute bottom-4 right-4 w-12 h-12 border-b-4 border-r-4 border-sage rounded-br-xl opacity-80" />

                            {/* Scanning Laser Line */}
                            {scanningStep === 1 && (
                                <motion.div
                                    initial={{ top: '10%' }}
                                    animate={{ top: '90%' }}
                                    transition={{ duration: 1.5, repeat: Infinity, repeatType: 'reverse', ease: 'linear' }}
                                    className="absolute left-0 right-0 h-1 bg-terra shadow-[0_0_20px_5px_rgba(211,108,82,0.6)] z-10"
                                />
                            )}

                            {/* Analyzing Overlay */}
                            <AnimatePresence>
                                {scanningStep === 2 && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="absolute inset-0 flex flex-col items-center justify-center bg-forest/80 backdrop-blur-md z-20"
                                    >
                                        <ScanLine size={48} className="text-sage mb-4 animate-pulse" />
                                        <p className="font-bold text-lg tracking-widest animate-pulse">Analizando clorofila...</p>
                                        <p className="text-xs text-white/50 mt-2 font-mono">Buscando en 12,400 especies</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Success Overlay */}
                            <AnimatePresence>
                                {scanningStep === 3 && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-t from-forest to-forest/80 backdrop-blur-md z-30 p-6 text-center"
                                    >
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ type: "spring", damping: 12 }}
                                            className="w-20 h-20 bg-sage rounded-full flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(202,210,197,0.4)]"
                                        >
                                            <CheckCircle2 size={40} className="text-forest" />
                                        </motion.div>
                                        <h3 className="text-2xl font-black mb-1">¡Match Encontrado!</h3>
                                        <p className="text-sage font-bold font-serif italic text-xl mb-6">Zamioculca Zamiifolia</p>

                                        <button
                                            onClick={handleRedirect}
                                            className="w-full bg-white text-forest font-bold py-4 rounded-2xl hover:bg-bone transition-colors shadow-xl"
                                        >
                                            Ver Ficha y Adoptar
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Bottom Actions if not finished */}
                        {scanningStep < 3 && (
                            <div className="px-8 pb-8 flex justify-center">
                                <button className="w-16 h-16 rounded-full border-4 border-sage flex items-center justify-center p-1">
                                    <div className="w-full h-full bg-sage rounded-full animate-pulse" />
                                </button>
                            </div>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
