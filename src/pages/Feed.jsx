import { useContext } from 'react';
import { GlobalContext } from '../context/GlobalContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, ShoppingBag, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PlantDetailsModal from '../components/PlantDetailsModal';
import CommentsModal from '../components/CommentsModal';
import { useState } from 'react';

export default function Feed() {
    const { posts, likePost, user } = useContext(GlobalContext);
    const navigate = useNavigate();
    const [selectedPlantId, setSelectedPlantId] = useState(null);
    const [activeCommentPost, setActiveCommentPost] = useState(null);
    const [animatingLikes, setAnimatingLikes] = useState({});

    const handleDoubleTap = (postId) => {
        likePost(postId);
        setAnimatingLikes(prev => ({ ...prev, [postId]: true }));
        setTimeout(() => {
            setAnimatingLikes(prev => ({ ...prev, [postId]: false }));
        }, 1000);
    };

    return (
        <div className="pb-12 h-full">
            <header className="mb-10 flex flex-col md:flex-row md:justify-between md:items-end gap-6">
                <div>
                    <h1 className="text-4xl lg:text-5xl font-extrabold text-forest mb-3 tracking-tight">
                        Comunidad Biofílica
                    </h1>
                    <p className="text-lg text-forest/70 max-w-xl">
                        Descubre inspiración, consejos y las exóticas selvas urbanas de cultivadores alrededor del mundo.
                    </p>
                </div>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/quiz')}
                    className="bg-terra text-white px-8 py-4 rounded-full text-base font-bold shadow-xl shadow-terra/30 flex items-center justify-center gap-3 w-full md:w-auto"
                >
                    <Sparkles size={20} className="text-bone" />
                    Diagnóstico Inteligente
                </motion.button>
            </header>

            {/* Grid Premium Desktop Inmersivo */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8 items-start">
                {posts.map((post, i) => (
                    <motion.article
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1, type: "spring", stiffness: 100 }}
                        key={post.id}
                        className="bg-white/90 backdrop-blur-md rounded-[32px] overflow-hidden shadow-sm border border-sage/10 hover:shadow-2xl hover:shadow-sage/20 transition-all duration-500 group flex flex-col h-full"
                    >
                        {/* Image Immersive Area */}
                        <div 
                            className="relative aspect-[4/5] w-full bg-bone overflow-hidden flex-shrink-0 cursor-pointer"
                            onDoubleClick={() => handleDoubleTap(post.id)}
                        >
                            <img
                                src={post.image}
                                alt="Planta"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                            />
                            <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />

                            {/* Floating Heart Animation Overlay */}
                            <AnimatePresence>
                                {animatingLikes[post.id] && (
                                    <motion.div
                                        initial={{ scale: 0, opacity: 0, x: '-50%', y: '-50%' }}
                                        animate={{ scale: [0, 1.5, 1], opacity: [0, 1, 0] }}
                                        exit={{ scale: 0, opacity: 0 }}
                                        transition={{ duration: 0.8 }}
                                        className="absolute top-1/2 left-1/2 pointer-events-none drop-shadow-2xl"
                                    >
                                        <Heart size={100} className="fill-white text-white opacity-80" />
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Header superpuesto en la imagen */}
                            <div className="absolute top-0 left-0 right-0 p-6 flex items-center gap-4">
                                <img src={post.author?.avatar} alt={post.author?.name} className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md bg-bone" />
                                <div className="text-white drop-shadow-md">
                                    <h3 className="font-bold text-base">{post.author?.name}</h3>
                                    <p className="text-xs font-medium text-white/80">Hace 2 horas</p>
                                </div>
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className="p-8 flex-1 flex flex-col justify-between bg-white">
                            <div>
                                {/* Actions */}
                                <div className="flex items-center gap-6 mb-6">
                                    <motion.button
                                        whileTap={{ scale: 0.8 }}
                                        onClick={() => likePost(post.id)}
                                        className={`flex items-center gap-2 hover:text-terra transition-colors cursor-pointer ${post.likedBy?.some(u => u.id === user?.id) ? 'text-terra' : 'text-forest'}`}
                                    >
                                        <Heart size={26} className={post.likedBy?.some(u => u.id === user?.id) ? "fill-terra text-terra" : "fill-transparent hover:fill-terra/20"} />
                                        <span className="font-bold text-lg">{post.likes}</span>
                                    </motion.button>
                                    <button onClick={() => setActiveCommentPost(post)} className="flex items-center gap-2 text-forest/60 hover:text-sage transition-colors cursor-pointer">
                                        <MessageCircle size={26} className="hover:fill-sage/20" />
                                        <span className="font-bold text-lg">{post.comments?.length || 0}</span>
                                    </button>
                                </div>

                                {/* Text content */}
                                <p className="text-[16px] text-forest/80 leading-relaxed overflow-hidden">
                                    <span className="font-bold text-forest mr-2">{post.author?.name}</span>
                                    {post.content}
                                </p>
                            </div>

                            {/* CTA Ad Botánico (Siempre al fondo) */}
                            {post.plantId && (
                                <div className="mt-8 bg-gradient-to-r from-bone to-sage/10 rounded-2xl p-4 flex items-center justify-between border border-sage/30 hover:border-sage/60 transition-colors">
                                    <div className="flex items-center gap-3 text-sm font-bold text-forest flex-1 min-w-0 mr-4">
                                        <span className="text-2xl drop-shadow-sm flex-shrink-0">🪴</span>
                                        <span className="truncate" title={post.plant?.name}>{post.plant?.name || 'Planta Taggeada'}</span>
                                    </div>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => navigate('/catalogo')}
                                        className="flex items-center gap-2 bg-forest text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md shadow-forest/20 cursor-pointer"
                                    >
                                        <ShoppingBag size={16} /> Ver
                                    </motion.button>
                                </div>
                            )}
                        </div>
                    </motion.article>
                ))}
            </div>

            <PlantDetailsModal
                isOpen={!!selectedPlantId}
                plant={selectedPlantId}
                onClose={() => setSelectedPlantId(null)}
            />

            <CommentsModal 
                isOpen={!!activeCommentPost} 
                post={activeCommentPost} 
                onClose={() => setActiveCommentPost(null)} 
            />
        </div>
    );
}
