import { useContext, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Info, Filter, Sparkles, ShoppingCart, Plus, Minus, Check } from 'lucide-react';
import { GlobalContext } from '../context/GlobalContext';
import CheckoutModal from '../components/CheckoutModal';
import PlantDetailsModal from '../components/PlantDetailsModal';
import Breadcrumbs from '../components/Breadcrumbs';

export default function Catalog() {
    const { plantDatabase, addToCart } = useContext(GlobalContext);
    const [selectedPlant, setSelectedPlant] = useState(null);
    const [infoPlant, setInfoPlant] = useState(null);
    const [activeFilter, setActiveFilter] = useState('todas');
    // Mapa de { plantId: quantity } para el selector de cantidad
    const [quantities, setQuantities] = useState({});
    // Mapa de { plantId: true } para mostrar el check animado al agregar
    const [added, setAdded] = useState({});

    const filters = [
        { id: 'todas', label: 'Todas las Plantas' },
        { id: 'facil', label: 'Principiantes' },
        { id: 'normal', label: 'Nivel Medio' },
        { id: 'experto', label: 'Expertos' },
        { id: 'pet', label: 'Pet Friendly' },
    ];

    const filteredPlants = plantDatabase.filter(plant => {
        if (activeFilter === 'todas') return true;
        if (activeFilter === 'pet') return plant.petSafe;
        return plant.careLevel === activeFilter;
    });

    const getQty = (id) => quantities[id] || 1;

    const changeQty = (id, delta) => {
        setQuantities(prev => ({
            ...prev,
            [id]: Math.max(1, Math.min(99, (prev[id] || 1) + delta))
        }));
    };

    const handleAddToCart = (plant) => {
        addToCart(plant, getQty(plant.id));
        // Animación de confirmación
        setAdded(prev => ({ ...prev, [plant.id]: true }));
        setTimeout(() => setAdded(prev => ({ ...prev, [plant.id]: false })), 1800);
    };

    return (
        <div className="w-full max-w-7xl mx-auto pb-24">
            <Breadcrumbs currentPlant={infoPlant || selectedPlant} />
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-12 text-center"
            >
                <div className="inline-flex items-center gap-2 bg-sage/20 text-forest px-4 py-2 rounded-full mb-4">
                    <Sparkles size={16} />
                    <span className="text-xs font-bold tracking-widest uppercase">Colección Completa</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-forest mb-4">Catálogo Botánico</h1>
                <p className="text-lg text-sage font-medium max-w-2xl mx-auto text-balance">
                    Explora nuestra amplia variedad de especies exóticas. Filtra por dificultad o pet safety y encuentra la planta perfecta para tu espacio.
                </p>
            </motion.div>

            {/* Filtros */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex flex-wrap items-center justify-center gap-3 mb-12"
            >
                {filters.map(filter => (
                    <button
                        key={filter.id}
                        onClick={() => setActiveFilter(filter.id)}
                        className={`px-6 py-2.5 rounded-full font-bold transition-all ${activeFilter === filter.id
                            ? 'bg-forest text-white shadow-lg shadow-forest/20 scale-105'
                            : 'bg-white text-forest/70 border border-sage/30 hover:bg-sage/10 hover:text-forest'
                        }`}
                    >
                        {filter.label}
                    </button>
                ))}
            </motion.div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredPlants.map((plant, index) => (
                    <motion.div
                        key={plant.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.04 }}
                        className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-sage/10 group flex flex-col"
                    >
                        {/* Image Box */}
                        <div className="relative aspect-[4/5] bg-bone overflow-hidden flex items-center justify-center">
                            {plant.petSafe && (
                                <div className="absolute top-4 left-4 z-10 bg-white px-3 py-1 rounded-full shadow-md flex items-center gap-1.5">
                                    <Sparkles size={12} className="text-terra" />
                                    <span className="text-[10px] font-black tracking-wider text-forest uppercase">Pet Friendly</span>
                                </div>
                            )}
                            <img src={plant.imageUrl} alt={plant.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                            <button
                                onClick={() => setInfoPlant(plant)}
                                className="absolute bottom-5 right-5 bg-white/90 backdrop-blur-md p-3 rounded-full shadow-lg text-forest/50 hover:text-forest hover:bg-white transition-all hover:scale-110 z-10"
                            >
                                <Info size={20} />
                            </button>
                        </div>

                        {/* Details */}
                        <div className="p-5 flex flex-col flex-1">
                            <h3 className="text-lg font-black text-forest mb-0.5 leading-tight">{plant.name}</h3>
                            <p className="text-xs font-bold text-forest/40 uppercase tracking-wider mb-3">
                                Nivel: {plant.careLevel}
                            </p>

                            <div className="mt-auto pt-4 border-t border-sage/10 space-y-3">
                                <p className="text-xl font-black text-forest">${plant.price?.toFixed(2) ?? '—'}</p>

                                {/* Selector de cantidad */}
                                <div className="flex items-center gap-2 bg-bone rounded-xl px-3 py-1.5 w-fit">
                                    <button
                                        onClick={() => changeQty(plant.id, -1)}
                                        className="w-6 h-6 rounded-full flex items-center justify-center text-forest/60 hover:bg-sage/20 hover:text-forest transition-colors"
                                    >
                                        <Minus size={12} />
                                    </button>
                                    <span className="w-6 text-center font-black text-forest text-sm">{getQty(plant.id)}</span>
                                    <button
                                        onClick={() => changeQty(plant.id, 1)}
                                        className="w-6 h-6 rounded-full flex items-center justify-center text-forest/60 hover:bg-sage/20 hover:text-forest transition-colors"
                                    >
                                        <Plus size={12} />
                                    </button>
                                    <span className="text-xs text-forest/40 ml-1 font-medium">unid.</span>
                                </div>

                                {/* Botones */}
                                <div className="flex gap-2">
                                    {/* Agregar al carrito con feedback */}
                                    <motion.button
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => handleAddToCart(plant)}
                                        className={`flex-1 py-2.5 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all text-sm ${
                                            added[plant.id]
                                                ? 'bg-green-500 text-white'
                                                : 'bg-bone border border-sage/30 text-forest hover:bg-sage/10'
                                        }`}
                                    >
                                        <AnimatePresence mode="wait">
                                            {added[plant.id] ? (
                                                <motion.span
                                                    key="check"
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    exit={{ scale: 0 }}
                                                    className="flex items-center gap-1"
                                                >
                                                    <Check size={14} /> ¡Listo!
                                                </motion.span>
                                            ) : (
                                                <motion.span
                                                    key="cart"
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    className="flex items-center gap-1.5"
                                                >
                                                    <ShoppingCart size={14} /> Carrito
                                                </motion.span>
                                            )}
                                        </AnimatePresence>
                                    </motion.button>

                                    {/* Comprar ahora */}
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setSelectedPlant(plant)}
                                        className="flex-1 bg-forest text-white py-2.5 rounded-xl font-bold flex items-center justify-center gap-1.5 hover:bg-sage transition-all shadow-md shadow-forest/20 text-sm"
                                    >
                                        <ShoppingBag size={14} /> Adoptar
                                    </motion.button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {filteredPlants.length === 0 && (
                <div className="text-center py-20">
                    <Filter size={48} className="mx-auto text-sage/50 mb-4" />
                    <p className="text-xl text-forest/60 font-medium">No hay plantas que coincidan con este filtro.</p>
                </div>
            )}

            <CheckoutModal
                isOpen={!!selectedPlant}
                onClose={() => setSelectedPlant(null)}
                plant={selectedPlant}
            />

            <PlantDetailsModal
                isOpen={!!infoPlant}
                onClose={() => setInfoPlant(null)}
                plant={infoPlant}
            />
        </div>
    );
}
