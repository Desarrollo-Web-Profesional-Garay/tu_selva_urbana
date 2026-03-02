import { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { GlobalContext } from '../context/GlobalContext';
import { Sun, Check, ArrowRight, Dog, Clock, Home, Sparkles } from 'lucide-react';

const questions = [
    {
        id: 'light',
        title: '¿Cuánta luz natural recibe tu espacio?',
        options: [
            { value: 'Poca', label: 'Poca', icon: Home, desc: 'Luz indirecta suave' },
            { value: 'Media', label: 'Media', icon: Sun, desc: 'Luz brillante sin sol directo' },
            { value: 'Sol', label: 'Sol Directo', icon: Sun, desc: 'Rayos directos por horas' }
        ]
    },
    {
        id: 'pets',
        title: '¿Tienes mascotas en casa?',
        options: [
            { value: 'Sí', label: 'Sí, peludos', icon: Dog },
            { value: 'No', label: 'No tengo', icon: Check }
        ]
    },
    {
        id: 'time',
        title: '¿Tu nivel de experiencia y tiempo?',
        options: [
            { value: 'Casi nada', label: 'Casi nada', icon: Clock, desc: 'Me olvido de regar' },
            { value: 'Lo normal', label: 'Lo normal', icon: Clock, desc: 'Las reviso 1 vez por semana' },
            { value: 'Experto', label: 'Experto', icon: Check, desc: 'Me dedico a ellas' }
        ]
    }
];

export default function Quiz({ isEmbedded = false }) {
    const { handleDiagnostic } = useContext(GlobalContext);
    const navigate = useNavigate();
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState({ light: null, pets: null, time: null });
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const currentQ = questions[step];

    const handleSelect = (value) => {
        setAnswers(prev => ({ ...prev, [currentQ.id]: value }));
    };

    const handleNext = () => {
        if (step < questions.length - 1) {
            setStep(step + 1);
        } else {
            finishQuiz();
        }
    };

    const finishQuiz = () => {
        setIsAnalyzing(true);
        setTimeout(() => {
            handleDiagnostic(answers);
            navigate('/recomendaciones');
        }, 2500);
    };

    if (isAnalyzing) {
        return (
            <div className={`${isEmbedded ? 'h-full rounded-[40px]' : 'h-screen w-screen absolute inset-0 z-50'} flex flex-col items-center justify-center p-6 text-center bg-bone`}>
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                    className="w-20 h-20 border-[6px] border-terra/30 border-t-terra rounded-full mb-8"
                />
                <h2 className="text-4xl font-extrabold text-forest mb-4">Analizando tu entorno...</h2>
                <p className="text-lg text-forest/70 max-w-md">Cruzando tus respuestas con nuestra base de datos botánica para encontrar tu compañera ideal.</p>
            </div>
        );
    }

    return (
        <div className={`${isEmbedded ? 'relative w-full h-full' : 'absolute inset-0 z-50 hd-screen flex'} bg-bone`}>
            {/* Left Panel: Branding & Progress (Desktop Solo si NO es embedded) */}
            {!isEmbedded && (
                <div className="hidden lg:flex w-1/3 bg-forest text-bone flex-col justify-between p-12 relative overflow-hidden">
                    <div className="absolute -left-20 -bottom-20 opacity-10 pointer-events-none">
                        <svg width="400" height="400" viewBox="0 0 200 200" fill="currentColor">
                            <path d="M100,200 C44.77,200 0,155.23 0,100 C0,44.77 44.77,0 100,0 C155.23,0 200,44.77 200,100 C200,155.23 155.23,200 100,200 Z" />
                        </svg>
                    </div>
                    <div>
                        <div className="flex items-center gap-3 mb-16">
                            <Sparkles className="text-sage" size={32} />
                            <span className="text-2xl font-bold tracking-tight">Arquitecto Biofílico</span>
                        </div>
                        <h2 className="text-5xl font-extrabold leading-tight mb-6">
                            Paso {step + 1} de {questions.length}
                        </h2>
                        <p className="text-bone/70 text-lg">
                            Asegurémonos de que tu próxima planta se adapte a tu estilo de vida.
                        </p>
                    </div>
                    <div className="w-full h-2 bg-bone/20 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-sage"
                            initial={{ width: 0 }}
                            animate={{ width: `${((step + 1) / questions.length) * 100}%` }}
                        />
                    </div>
                </div>
            )}

            {/* Right Panel: Interactive Wizard */}
            <div className={`${isEmbedded ? 'w-full px-6 py-10 lg:px-12' : 'flex-1 flex flex-col px-6 py-12 md:p-20 justify-center h-full relative'}`}>
                <div className="max-w-2xl mx-auto w-full">
                    {/* Mobile/Embedded progress fallback */}
                    {(isEmbedded || true) && (
                        <div className={`mb-10 ${!isEmbedded ? 'lg:hidden' : ''}`}>
                            <div className="h-2 w-full bg-sage/20 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-sage"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${((step + 1) / questions.length) * 100}%` }}
                                />
                            </div>
                            <p className="text-xs font-semibold text-sage mt-2 uppercase tracking-wider">
                                Paso {step + 1} de {questions.length}
                            </p>
                        </div>
                    )}

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={step}
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ duration: 0.3 }}
                            className="flex flex-col"
                        >
                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-forest leading-tight mb-8">
                                {currentQ.title}
                            </h1>

                            <div className="grid gap-3 md:grid-cols-2">
                                {currentQ.options.map(opt => {
                                    const Icon = opt.icon;
                                    const isSelected = answers[currentQ.id] === opt.value;

                                    return (
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            key={opt.value}
                                            onClick={() => handleSelect(opt.value)}
                                            className={`w-full flex items-center p-5 rounded-3xl border-2 text-left transition-all duration-300 ${isSelected
                                                    ? 'border-forest bg-forest text-white shadow-xl shadow-forest/20'
                                                    : 'border-transparent bg-white text-forest shadow-md hover:border-sage/50'
                                                }`}
                                        >
                                            <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 flex-shrink-0 ${isSelected ? 'bg-white/20' : 'bg-bone'}`}>
                                                <Icon size={24} />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-bold text-lg">{opt.label}</h3>
                                                {opt.desc && <p className={`text-xs mt-1 ${isSelected ? 'text-white/80' : 'text-forest/60'}`}>{opt.desc}</p>}
                                            </div>
                                            {isSelected && <Check className="ml-2 flex-shrink-0" size={24} />}
                                        </motion.button>
                                    );
                                })}
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    <div className="mt-12 flex justify-between items-center border-t border-sage/20 pt-6">
                        <button
                            onClick={() => step > 0 ? setStep(step - 1) : navigate('/feed')}
                            className="text-forest/60 hover:text-forest font-bold px-4 py-3 rounded-full hover:bg-sage/10 transition-colors"
                        >
                            Volver
                        </button>
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={handleNext}
                            disabled={!answers[currentQ.id]}
                            className={`flex items-center gap-2 px-8 py-4 rounded-full font-bold text-base md:text-lg text-white transition-all ${answers[currentQ.id]
                                    ? 'bg-terra hover:bg-[#D36C52] shadow-xl shadow-terra/30'
                                    : 'bg-gray-300 cursor-not-allowed opacity-70'
                                }`}
                        >
                            {step === questions.length - 1 ? 'Analizar' : 'Siguiente'}
                            <ArrowRight size={20} />
                        </motion.button>
                    </div>
                </div>
            </div>
        </div>
    );
}
