import { motion, AnimatePresence } from 'framer-motion';
import { X, Send } from 'lucide-react';
import { useState, useContext } from 'react';
import { postsAPI } from '../services/api';
import { GlobalContext } from '../context/GlobalContext';

export default function CommentsModal({ isOpen, onClose, post }) {
    const { user } = useContext(GlobalContext);
    const [text, setText] = useState('');
    const [submitting, setSubmitting] = useState(false);

    if (!post) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!text.trim() || submitting || !user) return;
        
        setSubmitting(true);
        try {
            const newComment = await postsAPI.addComment(post.id, text);
            post.comments = [newComment, ...(post.comments || [])];
            setText('');
        } catch (error) {
            console.error('Error enviando comentario', error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[150] flex items-end md:items-center justify-center p-0 md:p-4">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-forest/80 backdrop-blur-sm" />
                    
                    <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: "spring", damping: 25, stiffness: 300 }} className="relative w-full max-w-lg bg-white rounded-t-[40px] md:rounded-[40px] shadow-2xl flex flex-col h-[75vh] md:h-[600px] overflow-hidden">
                        <div className="p-6 border-b border-sage/20 flex items-center justify-between bg-bone">
                            <h3 className="text-xl font-bold text-forest">Comentarios</h3>
                            <button onClick={onClose} className="bg-white hover:bg-sage/10 text-forest p-2 rounded-full transition-all"><X size={20} /></button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-white">
                            {post.comments?.length > 0 ? post.comments.map(c => (
                                <div key={c.id} className="flex gap-4">
                                    <img src={c.author.avatar || `https://ui-avatars.com/api/?name=${c.author.name}&background=ECECE5&color=2C3E2D`} alt={c.author.name} className="w-10 h-10 rounded-full bg-bone object-cover border border-sage/30 shadow-sm" />
                                    <div className="flex-1">
                                        <div className="bg-bone px-4 py-3 rounded-2xl rounded-tl-none shadow-sm">
                                            <p className="font-bold text-forest text-sm mb-1">{c.author.name}</p>
                                            <p className="text-forest/80 text-sm leading-relaxed">{c.text}</p>
                                        </div>
                                        <p className="text-xs text-forest/40 mt-1 ml-2 font-medium">{new Date(c.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            )) : (
                                <div className="text-center py-10 text-forest/50 font-medium">Sé el primero en comentar algo lindo. 🌱</div>
                            )}
                        </div>

                        <div className="p-6 border-t border-sage/20 bg-bone">
                            {user ? (
                                <form onSubmit={handleSubmit} className="relative flex items-center shadow-sm rounded-full bg-white">
                                    <input type="text" value={text} onChange={(e) => setText(e.target.value)} placeholder="Escribe un comentario..." className="w-full bg-transparent border border-sage/30 rounded-full px-6 py-4 pr-14 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-terra/50 transition-all text-forest" />
                                    <button type="submit" disabled={!text.trim() || submitting} className="absolute right-2 bg-terra text-white p-2.5 rounded-full hover:bg-forest transition-colors disabled:opacity-50"><Send size={18} /></button>
                                </form>
                            ) : (
                                <div className="text-center text-sm font-bold text-terra/80 bg-terra/10 py-3 rounded-xl">Debes iniciar sesión para interactuar</div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
