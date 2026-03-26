import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Info, Filter, Sparkles, Loader2 } from 'lucide-react';
import { plantsAPI } from '../services/api';
import CheckoutModal from '../components/CheckoutModal';
import PlantDetailsModal from '../components/PlantDetailsModal';

export default function Catalog() {
    const [plants, setPlants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedPlant, setSelectedPlant] = useState(null);
    const [infoPlant, setInfoPlant] = useState(null);
    const [activeFilter, setActiveFilter] = useState('todas');

    const filters = [
        { id: 'todas', label: 'Todas las Plantas' },
        { id: 'facil', label: 'Principiantes' },
        { id: 'normal', label: 'Nivel Medio' },
        { id: 'experto', label: 'Expertos' },
        { id: 'pet', label: 'Pet Friendly' },
    ];

    // Cargar plantas cuando cambia el filtro
    useEffect(() => {
        loadPlants();
    }, [activeFilter]);

    const loadPlants = async () => {
        setLoading(true);
        setError(null);
        try {
            let data;
            
            if (activeFilter === 'pet') {
                data = await plantsAPI.getPetFriendly();
            } else if (activeFilter !== 'todas') {
                data = await plantsAPI.getByCareLevel(activeFilter);
            } else {
                data = await plantsAPI.getAll();
            }
            
            setPlants(data);
        } catch (err) {
            setError(err.message);
            console.error('Error loading plants:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = (plant) => {
        setSelectedPlant(plant);
    };

    if (loading) {
        return (
            <div className="w-full max-w-7xl mx-auto pb-24 flex justify-center items-center min-h-[400px]">
                <Loader2 className="animate-spin text-forest" size={48} />
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full max-w-7xl mx-auto pb-24 text-center py-20">
                <p className="text-red-500 mb-4">{error}</p>
                <button 
                    onClick={loadPlants}
                    className="bg-forest text-white px-6 py-2 rounded-full hover:bg-opacity-90 transition-all"
                >
                    Reintentar
                </button>
            </div>
        );
    }

    return (
        <div className="w-full max-w-7xl mx-auto pb-24">
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
                        className={`px-6 py-2.5 rounded-full font-bold transition-all ${
                            activeFilter === filter.id
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
                {plants.map((plant, index) => (
                    <motion.div
                        key={plant.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
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

                            <img 
                                src={plant.imageUrl || 'https://via.placeholder.com/400x500?text=Sin+Imagen'} 
                                alt={plant.name} 
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                                onError={(e) => {
                                    e.target.src = 'https://via.placeholder.com/400x500?text=Sin+Imagen';
                                }}
                            />

                            <button
                                onClick={() => setInfoPlant(plant)}
                                className="absolute bottom-5 right-5 bg-white/90 backdrop-blur-md p-3 rounded-full shadow-lg text-forest/50 hover:text-forest hover:bg-white transition-all hover:scale-110 z-10"
                            >
                                <Info size={20} />
                            </button>
                        </div>

                        {/* Details */}
                        <div className="p-6 flex flex-col flex-1">
                            <h3 className="text-xl font-black text-forest mb-1">{plant.name}</h3>
                            <div className="flex justify-between items-end mt-auto pt-4 border-t border-sage/10">
                                <div>
                                    <p className="text-xs font-bold text-forest/50 uppercase tracking-wider mb-1">
                                        Nivel: {plant.careLevel === 'facil' ? 'Fácil' : plant.careLevel === 'normal' ? 'Normal' : 'Experto'}
                                    </p>
                                    <p className="text-lg font-black text-forest">
                                        ${typeof plant.price === 'number' ? plant.price.toFixed(2) : plant.price}
                                    </p>
                                </div>

                                <button
                                    onClick={() => handleAddToCart(plant)}
                                    className="bg-forest text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-sage transition-all hover:scale-105 shadow-md shadow-forest/20"
                                >
                                    <ShoppingBag size={18} /> Adoptar
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {plants.length === 0 && !loading && (
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