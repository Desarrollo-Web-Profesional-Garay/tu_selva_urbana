import { useState, useContext, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlobalContext } from '../context/GlobalContext';
import { X, User, Image as ImageIcon, Save } from 'lucide-react';

export default function EditProfileModal({ isOpen, onClose }) {
    const { user, updateProfile } = useContext(GlobalContext);
    const [name, setName] = useState('');
    const [avatar, setAvatar] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (user) {
            setName(user.name || '');
            setAvatar(user.avatar || '');
        }
    }, [user, isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const result = await updateProfile({ name, avatar });

        if (result.success) {
            onClose();
        } else {
            setError(result.error || 'Ocurrió un error al actualizar el perfil.');
        }
        setLoading(false);
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
                        className="relative w-full max-w-md bg-bone/90 backdrop-blur-2xl border border-sage/30 rounded-[32px] shadow-2xl overflow-hidden flex flex-col"
                    >
                        <div className="flex items-center justify-between p-6 border-b border-sage/20 bg-white/50">
                            <h2 className="text-xl font-bold text-forest">Editar Perfil</h2>
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

                            {/* Avatar Preview */}
                            <div className="flex flex-col items-center justify-center mb-2">
                                <img
                                    src={avatar || `https://ui-avatars.com/api/?name=${name || 'User'}&background=ECECE5&color=2C3E2D`}
                                    alt="Preview"
                                    className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md bg-bone mb-4 transition-all"
                                    onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${name || 'User'}&background=ECECE5&color=2C3E2D` }}
                                />
                            </div>

                            {/* Inputs */}
                            <div className="space-y-4">
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-bold text-forest/70 mb-2">
                                        <User size={16} /> Nombre completo
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full bg-white/50 border border-sage/30 rounded-xl py-3 px-4 text-forest focus:ring-2 focus:ring-sage focus:outline-none transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="flex items-center gap-2 text-sm font-bold text-forest/70 mb-2">
                                        <ImageIcon size={16} /> URL de tu Avatar
                                    </label>
                                    <input
                                        type="url"
                                        value={avatar}
                                        onChange={(e) => setAvatar(e.target.value)}
                                        placeholder="https://ejemplo.com/mifoto.jpg"
                                        className="w-full bg-white/50 border border-sage/30 rounded-xl py-3 px-4 text-forest focus:ring-2 focus:ring-sage focus:outline-none transition-all text-sm"
                                    />
                                    <p className="text-xs text-forest/40 mt-2">Puedes dejarlo en blanco para usar un avatar automático.</p>
                                </div>
                            </div>

                            <div className="pt-4 flex justify-end">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    disabled={loading || !name.trim()}
                                    className="flex items-center justify-center w-full gap-2 bg-forest text-white px-8 py-3.5 rounded-xl font-bold text-sm shadow-xl hover:bg-[#1A251B] hover:shadow-forest/20 disabled:opacity-50 transition-all"
                                >
                                    {loading ? 'Guardando...' : (
                                        <>
                                            Guardar Cambios <Save size={18} />
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
