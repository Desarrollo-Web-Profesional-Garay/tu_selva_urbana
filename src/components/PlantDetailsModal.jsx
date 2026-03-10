import { motion, AnimatePresence } from 'framer-motion';
import { X, Droplet, Sun, Wind, CheckCircle2 } from 'lucide-react';

export default function PlantDetailsModal({ isOpen, onClose, plant }) {
    if (!plant) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-forest/80 backdrop-blur-md"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 50 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 50 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="relative w-full max-w-4xl bg-bone/95 backdrop-blur-3xl border border-sage/40 rounded-[40px] shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-6 right-6 z-10 bg-white/70 backdrop-blur-sm hover:bg-white text-forest p-3 rounded-full shadow-md transition-all"
                        >
                            <X size={24} />
                        </button>

                        {/* Left Side: Photo/Model (50%) */}
                        <div className="w-full md:w-1/2 bg-gradient-to-br from-bone to-sage/30 relative flex items-center justify-center min-h-[300px] md:min-h-full border-r border-sage/20 overflow-hidden group">
                            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-sage via-transparent to-transparent pointer-events-none mix-blend-multiply" />
                            {plant.modelUrl ? (
                                <model-viewer
                                    src={plant.modelUrl}
                                    auto-rotate
                                    camera-controls
                                    shadow-intensity="2"
                                    interaction-prompt="none"
                                    style={{ width: '150%', height: '150%' }}
                                />
                            ) : (
                                <motion.img
                                    initial={{ scale: 1.1 }}
                                    animate={{ scale: 1 }}
                                    transition={{ duration: 1.5 }}
                                    src={plant.imageUrl}
                                    alt={plant.name}
                                    className="w-full h-full object-cover"
                                />
                            )}
                            <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-forest animate-pulse" />
                                <span className="text-xs font-bold text-forest tracking-wider uppercase">Ficha Botánica Oficial</span>
                            </div>
                        </div>

                        {/* Right Side: Information (50%) */}
                        <div className="w-full md:w-1/2 p-8 md:p-12 overflow-y-auto custom-scrollbar">
                            <div className="mb-8">
                                <div className="inline-block px-3 py-1 bg-terra/10 border border-terra/20 text-terra rounded-full text-xs font-black uppercase tracking-widest mb-4">
                                    {plant.tag || 'Botánica Premium'}
                                </div>
                                <h2 className="text-4xl md:text-5xl font-black text-forest leading-tight mb-2">
                                    {plant.name}
                                </h2>
                                <p className="text-xl text-sage font-bold font-serif italic mb-6">
                                    {plant.slug.replace('-', ' ')}
                                </p>

                                <div className="flex gap-4 mb-8">
                                    <div className="bg-white px-4 py-3 rounded-2xl shadow-sm border border-sage/20 flex-1 text-center">
                                        <p className="text-xs text-forest/50 font-bold uppercase mb-1">Nivel</p>
                                        <p className="text-forest font-bold capitalize">{plant.careLevel}</p>
                                    </div>
                                    <div className="bg-white px-4 py-3 rounded-2xl shadow-sm border border-sage/20 flex-1 text-center">
                                        <p className="text-xs text-forest/50 font-bold uppercase mb-1">Dificultad</p>
                                        <div className="flex items-center justify-center gap-1 text-forest">
                                            {[...Array(3)].map((_, i) => (
                                                <div key={i} className={`w-2 h-2 rounded-full ${i < (plant.careLevel === 'facil' ? 1 : plant.careLevel === 'normal' ? 2 : 3) ? 'bg-sage' : 'bg-sage/20'}`} />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <h3 className="text-lg font-extrabold text-forest uppercase tracking-widest mb-4 border-b border-sage/20 pb-2">Guía de Cuidados</h3>

                                <motion.div whileHover={{ scale: 1.02 }} className="bg-white/80 p-5 rounded-3xl border border-sage/20 shadow-sm flex gap-5 items-start">
                                    <div className="bg-blue-50 text-blue-500 p-3 rounded-2xl"><Droplet size={24} /></div>
                                    <div>
                                        <h4 className="font-bold text-forest mb-1">Riego Óptimo</h4>
                                        <p className="text-sm text-forest/70 leading-relaxed text-balance">{plant.careWater}</p>
                                    </div>
                                </motion.div>

                                <motion.div whileHover={{ scale: 1.02 }} className="bg-white/80 p-5 rounded-3xl border border-sage/20 shadow-sm flex gap-5 items-start">
                                    <div className="bg-amber-50 text-amber-500 p-3 rounded-2xl"><Sun size={24} /></div>
                                    <div>
                                        <h4 className="font-bold text-forest mb-1">Exposición Solar</h4>
                                        <p className="text-sm text-forest/70 leading-relaxed text-balance">{plant.careLight}</p>
                                    </div>
                                </motion.div>

                                <motion.div whileHover={{ scale: 1.02 }} className="bg-white/80 p-5 rounded-3xl border border-sage/20 shadow-sm flex gap-5 items-start">
                                    <div className="bg-emerald-50 text-emerald-500 p-3 rounded-2xl"><Wind size={24} /></div>
                                    <div>
                                        <h4 className="font-bold text-forest mb-1">Humedad y Clima</h4>
                                        <p className="text-sm text-forest/70 leading-relaxed text-balance">{plant.careHumidity}</p>
                                    </div>
                                </motion.div>
                            </div>

                            {plant.petSafe && (
                                <div className="mt-8 bg-forest/5 border border-forest/10 p-4 rounded-2xl flex items-center gap-3">
                                    <CheckCircle2 className="text-forest" size={24} />
                                    <span className="text-sm font-bold text-forest">Esta planta es 100% segura para mascotas (Pet Friendly).</span>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
