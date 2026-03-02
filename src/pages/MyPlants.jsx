import { useContext, useState } from 'react';
import { GlobalContext } from '../context/GlobalContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Droplet, Sun, Wind, X, Bell, Star } from 'lucide-react';
import { notificationsData } from '../data/mocks';

export default function MyPlants() {
    const { myPlants } = useContext(GlobalContext);
    const [selectedPlant, setSelectedPlant] = useState(null);

    return (
        <div className="pb-12 h-full flex flex-col relative w-full">
            <header className="mb-10 flex flex-col md:flex-row md:justify-between md:items-end gap-6">
                <div>
                    <h1 className="text-4xl lg:text-5xl font-extrabold text-forest mb-3 tracking-tight">Mi Selva Botánica</h1>
                    <p className="text-lg text-forest/70">Tienes {myPlants.length} hermosas plantas saludables guiadas por ti.</p>
                </div>
            </header>

            {/* Alertas Simuladas (Desktop-first row vs Mobile stack) */}
            <div className="mb-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {notificationsData.map((notif, i) => (
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        key={notif.id}
                        className="bg-terra/10 hover:bg-terra/20 border border-terra/30 rounded-3xl p-5 flex items-center gap-4 transition-colors duration-300"
                    >
                        <div className="bg-white p-3 rounded-2xl shadow-sm text-terra flex-shrink-0">
                            <Bell size={24} />
                        </div>
                        <div>
                            <p className="font-bold text-forest text-[15px] leading-tight mb-1.5">{notif.message}</p>
                            <button className="text-terra text-sm font-bold uppercase hover:underline">
                                Marcar como atendida
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Grid Premium Multi-Columna */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6 xl:gap-8">
                {myPlants.map((plant, index) => (
                    <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        key={`${plant.id}-${index}`}
                        onClick={() => setSelectedPlant(plant)}
                        className="bg-white/80 backdrop-blur-md rounded-[32px] p-6 flex flex-col items-center text-center shadow-sm border border-sage/20 hover:shadow-xl hover:shadow-sage/30 transition-all duration-300 group cursor-pointer"
                    >
                        <div className="w-full aspect-square mb-5 rounded-full bg-gradient-to-t from-bone to-sage/10 flex items-center justify-center overflow-hidden border border-sage/30 group-hover:border-sage/60 transition-colors pointer-events-none">
                            <model-viewer
                                src={plant.modelUrl}
                                auto-rotate
                                camera-controls={false}
                                interaction-prompt="none"
                                style={{ width: '130%', height: '130%' }}
                            />
                        </div>
                        <h3 className="font-bold text-forest text-lg leading-tight mb-3 xl:text-xl">{plant.name}</h3>
                        <span className="text-xs xl:text-sm text-sage font-bold px-4 py-2 bg-sage/10 rounded-full group-hover:bg-sage/20 transition-colors w-full">
                            Ver ficha técnica
                        </span>
                    </motion.button>
                ))}
            </div>

            {/* Modal Guide Promovido a Side Panel para Web */}
            <AnimatePresence>
                {selectedPlant && (
                    <div className="fixed inset-0 z-[100] flex justify-end pointer-events-none">
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedPlant(null)}
                            className="absolute inset-0 bg-forest/40 backdrop-blur-md pointer-events-auto"
                        />

                        {/* Side Panel Content Desktop */}
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 30, stiffness: 250 }}
                            className="w-full max-w-lg h-full bg-white shadow-[-20px_0_50px_rgba(0,0,0,0.1)] p-8 md:p-12 relative pointer-events-auto overflow-y-auto"
                        >
                            <button
                                onClick={() => setSelectedPlant(null)}
                                className="absolute top-8 right-8 bg-bone hover:bg-sage/20 transition-colors p-3 rounded-full text-forest"
                            >
                                <X size={24} />
                            </button>

                            <div className="flex flex-col items-center text-center mb-10 pt-10">
                                <div className="w-56 h-56 bg-gradient-to-br from-bone to-sage/40 rounded-[40px] flex items-center justify-center object-cover mb-8 pointer-events-none">
                                    <model-viewer src={selectedPlant.modelUrl} style={{ width: '150%', height: '150%' }} />
                                </div>
                                <h2 className="text-4xl font-extrabold text-forest mb-2">{selectedPlant.name}</h2>
                                <div className="inline-flex items-center gap-2 bg-sage/20 px-4 py-2 rounded-full mt-2">
                                    <Star size={16} className="text-forest fill-forest" />
                                    <p className="text-forest text-sm font-bold uppercase tracking-wider">Ficha de Cuidados Pro</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="bg-bone/40 border border-sage/20 p-6 rounded-3xl flex gap-6 items-start hover:bg-bone transition-colors group">
                                    <div className="bg-white p-3 rounded-2xl shadow-sm text-blue-500 mt-1"><Droplet size={28} /></div>
                                    <div>
                                        <h4 className="font-bold text-forest text-lg mb-2">Protocolo de Riego</h4>
                                        <p className="text-forest/80 text-[15px] leading-relaxed">{selectedPlant.careGuide.water}</p>
                                    </div>
                                </div>

                                <div className="bg-bone/40 border border-sage/20 p-6 rounded-3xl flex gap-6 items-start hover:bg-bone transition-colors group">
                                    <div className="bg-white p-3 rounded-2xl shadow-sm text-amber-500 mt-1"><Sun size={28} /></div>
                                    <div>
                                        <h4 className="font-bold text-forest text-lg mb-2">Exposición Lumínica</h4>
                                        <p className="text-forest/80 text-[15px] leading-relaxed">{selectedPlant.careGuide.light}</p>
                                    </div>
                                </div>

                                <div className="bg-bone/40 border border-sage/20 p-6 rounded-3xl flex gap-6 items-start hover:bg-bone transition-colors group">
                                    <div className="bg-white p-3 rounded-2xl shadow-sm text-sage mt-1"><Wind size={28} /></div>
                                    <div>
                                        <h4 className="font-bold text-forest text-lg mb-2">Microclima</h4>
                                        <p className="text-forest/80 text-[15px] leading-relaxed">{selectedPlant.careGuide.humidity}</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
