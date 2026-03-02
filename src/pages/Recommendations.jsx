import { useContext, useState } from 'react';
import { GlobalContext } from '../context/GlobalContext';
import { motion } from 'framer-motion';
import { ShoppingBag, Star, Info } from 'lucide-react';

export default function Recommendations() {
    const { recommendations, adoptPlant } = useContext(GlobalContext);
    const [addingIndex, setAddingIndex] = useState(null);

    const handleAdopt = (plant, index) => {
        setAddingIndex(index);
        adoptPlant(plant);

        // Simulate network request + success animation delay
        setTimeout(() => {
            setAddingIndex(null);
        }, 1500);
    };

    return (
        <div className="pb-16 h-full flex flex-col">
            <header className="mb-12 text-center max-w-2xl mx-auto">
                <h1 className="text-4xl md:text-5xl font-extrabold text-forest mb-4 tracking-tight">Tus compañeras ideales</h1>
                <p className="text-forest/70 text-lg">
                    Basado en tu diagnóstico, estas plantas tienen un nivel de supervivencia óptimo en tu entorno.
                </p>
            </header>

            {/* Grid Premium Multi-Columna */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {recommendations.map((plant, idx) => (
                    <motion.div
                        key={plant.id}
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ delay: idx * 0.15, type: 'spring', stiffness: 100 }}
                        className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-sage/20 relative hover:shadow-2xl hover:shadow-sage/20 transition-all duration-500 group flex flex-col"
                    >
                        {/* Tag Overlay */}
                        <div className="absolute top-5 left-5 z-10 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-md flex items-center gap-2">
                            <Star size={16} className="text-terra fill-terra" />
                            <span className="text-xs font-bold text-forest tracking-wide uppercase">{plant.tag.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ ]/g, "").trim()}</span>
                        </div>

                        {/* Model Viewer Container */}
                        <div className="w-full aspect-square bg-gradient-to-br from-bone to-sage/10 relative flex justify-center items-center overflow-hidden cursor-grab active:cursor-grabbing">
                            {/* @google/model-viewer */}
                            <model-viewer
                                src={plant.modelUrl}
                                alt={`Modelo 3D de ${plant.name}`}
                                auto-rotate
                                camera-controls
                                shadow-intensity="1.5"
                                interaction-prompt="none"
                                style={{ width: '130%', height: '130%', outline: 'none' }}
                            />

                            <div className="absolute bottom-5 right-5 bg-white/80 backdrop-blur-md p-3 rounded-full shadow-lg text-forest/50 group-hover:text-forest transition-colors">
                                <Info size={20} />
                            </div>
                        </div>

                        {/* Details */}
                        <div className="p-8 flex-1 flex flex-col justify-between">
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold text-forest mb-1">{plant.name}</h2>
                                <div className="flex items-end justify-between mt-2">
                                    <p className="text-sage font-semibold text-sm">Resistencia Alta</p>
                                    <span className="text-2xl font-black text-forest">${plant.price.toFixed(2)}</span>
                                </div>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.96 }}
                                disabled={addingIndex === idx}
                                onClick={() => handleAdopt(plant, idx)}
                                className={`w-full py-4 rounded-2xl font-bold text-white flex items-center justify-center gap-3 transition-all duration-300 ${addingIndex === idx
                                        ? 'bg-sage shadow-inner text-white cursor-wait'
                                        : 'bg-forest hover:bg-forest-hover shadow-xl shadow-forest/20 cursor-pointer'
                                    }`}
                            >
                                {addingIndex === idx ? (
                                    <>
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                                            className="w-5 h-5 border-[3px] border-white/30 border-t-white rounded-full"
                                        />
                                        Añadida al Botánico
                                    </>
                                ) : (
                                    <>
                                        <ShoppingBag size={20} /> Adoptar Planta
                                    </>
                                )}
                            </motion.button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
