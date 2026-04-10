import { useState, useContext, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlobalContext } from '../context/GlobalContext';
import { X, Image as ImageIcon, Leaf, Send, Upload, Trash2 } from 'lucide-react';
import { postsAPI } from '../services/api';

export default function CreatePostModal({ isOpen, onClose }) {
    const { user, fetchPosts, myPlants } = useContext(GlobalContext);
    const [content, setContent] = useState('');
    const [imageBase64, setImageBase64] = useState('');
    const [imagePreview, setImagePreview] = useState('');
    const [plantId, setPlantId] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validar tamaño (máx 4MB)
        if (file.size > 4 * 1024 * 1024) {
            setError('La imagen es demasiado grande. Máximo 4MB.');
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            setImageBase64(event.target.result);  // base64 completo
            setImagePreview(event.target.result);
            setError('');
        };
        reader.readAsDataURL(file);
    };

    const handleRemoveImage = () => {
        setImageBase64('');
        setImagePreview('');
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleClose = () => {
        setContent('');
        setImageBase64('');
        setImagePreview('');
        setPlantId('');
        setError('');
        onClose();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content.trim() && !imageBase64) {
            setError('Por favor, agrega texto o una imagen.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await postsAPI.create({
                content,
                image: imageBase64 || null,
                plantId: plantId ? parseInt(plantId, 10) : null
            });
            await fetchPosts();
            handleClose();
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
                        onClick={handleClose}
                        className="absolute inset-0 bg-forest/40 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-lg bg-bone/95 backdrop-blur-2xl border border-sage/30 rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                    >
                        <div className="flex items-center justify-between p-6 border-b border-sage/20 bg-white/50">
                            <h2 className="text-xl font-bold text-forest">Crear Publicación</h2>
                            <button onClick={handleClose} className="p-2 bg-bone hover:bg-sage/20 rounded-full text-forest/70 hover:text-forest transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 flex-1 flex flex-col gap-5 overflow-y-auto">
                            {error && (
                                <div className="bg-red-50 text-red-600 text-sm font-medium p-3 rounded-xl border border-red-100">
                                    {error}
                                </div>
                            )}

                            {/* Texto */}
                            <div className="flex gap-4">
                                <img
                                    src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name}&background=ECECE5&color=2C3E2D`}
                                    alt={user?.name}
                                    className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm flex-shrink-0"
                                />
                                <textarea
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    placeholder="¿Qué quieres compartir con la comunidad botánica?"
                                    className="flex-1 bg-transparent resize-none border-none focus:ring-0 p-0 text-forest placeholder:text-forest/40 text-lg min-h-[100px]"
                                />
                            </div>

                            {/* Upload de Imagen */}
                            <div className="bg-white/50 rounded-2xl p-4 border border-sage/20">
                                <p className="flex items-center gap-2 text-sm font-bold text-forest/70 mb-3">
                                    <ImageIcon size={16} /> Imagen (Opcional)
                                </p>

                                {imagePreview ? (
                                    // Preview de la imagen seleccionada
                                    <div className="relative rounded-xl overflow-hidden border border-sage/30">
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="w-full max-h-56 object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleRemoveImage}
                                            className="absolute top-2 right-2 bg-black/60 text-white p-1.5 rounded-full hover:bg-red-500 transition-colors"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                ) : (
                                    // Zona de clic para subir
                                    <motion.div
                                        whileHover={{ scale: 1.01 }}
                                        whileTap={{ scale: 0.99 }}
                                        onClick={() => fileInputRef.current?.click()}
                                        className="border-2 border-dashed border-sage/40 rounded-xl p-6 text-center cursor-pointer hover:border-sage hover:bg-sage/5 transition-all"
                                    >
                                        <Upload size={28} className="mx-auto mb-2 text-sage/60" />
                                        <p className="text-sm font-bold text-forest/60">
                                            Haz clic para elegir una imagen
                                        </p>
                                        <p className="text-xs text-forest/40 mt-1">JPG, PNG, WebP · Máx. 4MB</p>
                                    </motion.div>
                                )}

                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp,image/gif"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                            </div>

                            {/* Plant Tagging */}
                            {myPlants.length > 0 && (
                                <div className="bg-white/50 rounded-2xl p-4 border border-sage/20">
                                    <label className="flex items-center gap-3 text-sm font-bold text-forest/70 mb-3">
                                        <Leaf size={16} /> Etiquetar una de tus plantas
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

                            <div className="flex justify-end">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    disabled={loading || (!content.trim() && !imageBase64)}
                                    className="flex items-center gap-2 bg-forest text-white px-8 py-3 rounded-xl font-bold text-sm shadow-lg hover:bg-[#1A251B] disabled:opacity-50 transition-colors"
                                >
                                    {loading ? 'Publicando...' : (<>Publicar <Send size={16} /></>)}
                                </motion.button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
