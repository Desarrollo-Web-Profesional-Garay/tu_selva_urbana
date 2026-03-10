import { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlobalContext } from '../context/GlobalContext';
import { X, Image as ImageIcon, Leaf, Send } from 'lucide-react';
import { postsAPI } from '../services/api';

export default function CreatePostModal({ isOpen, onClose }) {
    const { user, fetchPosts, myPlants } = useContext(GlobalContext);
    const [content, setContent] = useState('');
    const [image, setImage] = useState('');
    const [plantId, setPlantId] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content.trim() && !image.trim()) {
            setError('Por favor, agrega texto o una imagen.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await postsAPI.create({
                content,
                image: image.trim() || null,
                plantId: plantId ? parseInt(plantId, 10) : null
            });
            await fetchPosts(); // Refresh feed
            setContent('');
            setImage('');
            setPlantId('');
            onClose();
        } catch (err) {
            setError('Ocurrió un error al publicar. Inténtalo de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-forest/40 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-lg bg-bone/90 backdrop-blur-2xl border border-sage/30 rounded-[32px] shadow-2xl overflow-hidden flex flex-col"
                    >
                        <div className="flex items-center justify-between p-6 border-b border-sage/20 bg-white/50">
                            <h2 className="text-xl font-bold text-forest">Crear Publicación</h2>
                            <button onClick={onClose} className="p-2 bg-bone hover:bg-sage/20 rounded-full text-forest/70 hover:text-forest transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 flex-1 flex flex-col gap-5">
                            {error && (
                                <div className="bg-red-50 text-red-600 text-sm font-medium p-3 rounded-xl border border-red-100">
                                    {error}
                                </div>
                            )}

                            <div className="flex gap-4">
                                <img
                                    src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name}&background=ECECE5&color=2C3E2D`}
                                    alt={user?.name}
                                    className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                                />
                                <div className="flex-1">
                                    <textarea
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                        placeholder="¿Qué quieres compartir con la comunidad botánica?"
                                        className="w-full bg-transparent resize-none border-none focus:ring-0 p-0 text-forest placeholder:text-forest/40 text-lg min-h-[100px]"
                                    />
                                </div>
                            </div>

                            {/* Image Input */}
                            <div className="bg-white/50 rounded-2xl p-4 border border-sage/20">
                                <label className="flex items-center gap-3 text-sm font-bold text-forest/70 mb-2 cursor-pointer">
                                    <ImageIcon size={18} /> URL de Imagen (Opcional)
                                </label>
                                <input
                                    type="url"
                                    value={image}
                                    onChange={(e) => setImage(e.target.value)}
                                    placeholder="https://ejemplo.com/planta.jpg"
                                    className="w-full bg-bone border-none rounded-xl py-2 px-4 text-sm text-forest focus:ring-2 focus:ring-sage focus:outline-none"
                                />
                                {image && (
                                    <div className="mt-4 rounded-xl overflow-hidden border border-sage/30 aspect-video bg-bone">
                                        <img src={image} alt="Preview" className="w-full h-full object-cover" onError={(e) => e.target.style.display = 'none'} />
                                    </div>
                                )}
                            </div>

                            {/* Plant Tagging */}
                            {myPlants.length > 0 && (
                                <div className="bg-white/50 rounded-2xl p-4 border border-sage/20">
                                    <label className="flex items-center gap-3 text-sm font-bold text-forest/70 mb-3">
                                        <Leaf size={18} /> Etiquetar una de tus plantas
                                    </label>
                                    <select
                                        value={plantId}
                                        onChange={(e) => setPlantId(e.target.value)}
                                        className="w-full bg-bone border-none rounded-xl py-3 px-4 text-sm text-forest font-medium focus:ring-2 focus:ring-sage focus:outline-none appearance-none cursor-pointer"
                                    >
                                        <option value="">No etiquetar ninguna planta</option>
                                        {myPlants.map(plant => (
                                            <option key={plant.id} value={plant.id}>{plant.name}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            <div className="pt-4 flex justify-end">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    disabled={loading || (!content.trim() && !image.trim())}
                                    className="flex items-center gap-2 bg-forest text-white px-8 py-3 rounded-xl font-bold text-sm shadow-lg hover:bg-[#1A251B] disabled:opacity-50 transition-colors"
                                >
                                    {loading ? 'Publicando...' : (
                                        <>
                                            Publicar <Send size={16} />
                                        </>
                                    )}
                                </motion.button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
