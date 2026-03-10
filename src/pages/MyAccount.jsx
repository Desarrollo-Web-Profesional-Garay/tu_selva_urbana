import { useContext, useState } from 'react';
import { GlobalContext } from '../context/GlobalContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit2, Heart, MessageCircle, Settings, Camera } from 'lucide-react';
import EditProfileModal from '../components/EditProfileModal';

export default function MyAccount() {
    const { user, posts, myPlants } = useContext(GlobalContext);
    const [activeTab, setActiveTab] = useState('posts');
    const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

    const userPosts = posts.filter(p => p.author?.id === user?.id);

    return (
        <div className="pb-12 h-full flex flex-col relative w-full">
            <header className="mb-10 flex flex-col md:flex-row md:justify-between md:items-end gap-6 bg-white/80 backdrop-blur-md p-8 rounded-[32px] border border-sage/20 shadow-sm">
                <div className="flex items-center gap-6">
                    <div className="relative group">
                        <img
                            src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name}&background=ECECE5&color=2C3E2D`}
                            alt={user?.name}
                            className="w-24 h-24 rounded-3xl object-cover border-4 border-white shadow-md bg-bone transition-transform duration-300 group-hover:scale-105"
                        />
                        <button
                            onClick={() => setIsEditProfileOpen(true)}
                            className="absolute -bottom-2 -right-2 bg-sage hover:bg-forest text-white p-2 rounded-xl text-sm font-bold shadow-lg transition-colors"
                        >
                            <Camera size={16} />
                        </button>
                    </div>
                    <div>
                        <h1 className="text-3xl lg:text-4xl font-extrabold text-forest mb-1 tracking-tight">{user?.name}</h1>
                        <p className="text-forest/60 text-lg">{user?.email}</p>
                        <div className="flex gap-4 mt-3">
                            <div className="text-sm font-bold text-forest"><span className="text-sage">{userPosts.length}</span> Posts</div>
                            <div className="text-sm font-bold text-forest"><span className="text-sage">{myPlants.length}</span> Plantas</div>
                        </div>
                    </div>
                </div>

                <motion.button
                    onClick={() => setIsEditProfileOpen(true)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 bg-bone text-forest px-5 py-3 rounded-xl text-sm font-bold shadow-sm hover:shadow-md transition-all self-start md:self-auto"
                >
                    <Settings size={18} /> Editar Perfil
                </motion.button>
            </header>

            {/* Toggle Tabs */}
            <div className="flex bg-white/50 backdrop-blur-md rounded-2xl p-1 mb-8 max-w-md mx-auto xl:mx-0 border border-sage/20">
                <button
                    onClick={() => setActiveTab('posts')}
                    className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${activeTab === 'posts' ? 'bg-white text-forest shadow-md' : 'text-forest/50 hover:text-forest/80'}`}
                >
                    Mis Publicaciones
                </button>
                <button
                    onClick={() => setActiveTab('plants')}
                    className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${activeTab === 'plants' ? 'bg-white text-forest shadow-md' : 'text-forest/50 hover:text-forest/80'}`}
                >
                    Mis Plantas
                </button>
            </div>

            {/* Content Area */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                >
                    {activeTab === 'posts' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                            {userPosts.length > 0 ? userPosts.map((post) => (
                                <article key={post.id} className="bg-white/90 backdrop-blur-md rounded-[32px] overflow-hidden shadow-sm border border-sage/10 relative group">
                                    <div className="aspect-square w-full bg-bone relative overflow-hidden">
                                        {post.image ? (
                                            <img src={post.image} alt="Publicación" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                        ) : (
                                            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-bone to-sage/20 text-forest/40">
                                                <span className="text-4xl mb-2">🌿</span>
                                                <p className="font-medium text-sm">Post de texto</p>
                                            </div>
                                        )}
                                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold text-forest flex items-center gap-1 shadow-sm">
                                            {new Date(post.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <p className="text-forest/80 leading-relaxed text-[15px] mb-4 line-clamp-2">{post.content}</p>
                                        <div className="flex items-center gap-4 text-forest/50">
                                            <div className="flex items-center gap-1.5"><Heart size={18} /> <span className="text-sm font-bold">{post.likes}</span></div>
                                            <div className="flex items-center gap-1.5"><MessageCircle size={18} /> <span className="text-sm font-bold">{post.comments || 0}</span></div>
                                        </div>
                                    </div>
                                    <button className="absolute top-4 left-4 bg-white/90 backdrop-blur-md p-2 rounded-full text-forest/50 hover:text-terra opacity-0 group-hover:opacity-100 transition-all shadow-sm">
                                        <Edit2 size={16} />
                                    </button>
                                </article>
                            )) : (
                                <div className="col-span-full py-20 text-center">
                                    <div className="w-20 h-20 bg-bone rounded-full flex items-center justify-center mx-auto mb-4 text-forest/30">
                                        <Camera size={40} />
                                    </div>
                                    <h3 className="text-xl font-bold text-forest mb-2">Aún no tienes publicaciones</h3>
                                    <p className="text-forest/60 max-w-md mx-auto">Comparte el progreso de tus plantas con la comunidad biofílica.</p>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'plants' && (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {myPlants.length > 0 ? myPlants.map((plant) => (
                                <div key={plant.id} className="bg-white/80 backdrop-blur-md rounded-[32px] p-6 flex flex-col items-center text-center shadow-sm border border-sage/20 group">
                                    <div className="w-full aspect-square mb-5 rounded-full bg-gradient-to-t from-bone to-sage/10 flex items-center justify-center overflow-hidden border border-sage/30">
                                        {plant.modelUrl ? (
                                            <model-viewer src={plant.modelUrl} auto-rotate camera-controls={false} interaction-prompt="none" style={{ width: '130%', height: '130%' }} />
                                        ) : (
                                            <img src={plant.imageUrl} alt={plant.name} className="w-full h-full object-cover" />
                                        )}
                                    </div>
                                    <h3 className="font-bold text-forest text-lg leading-tight">{plant.name}</h3>
                                </div>
                            )) : (
                                <div className="col-span-full py-20 text-center">
                                    <span className="text-5xl block mb-4">🌱</span>
                                    <h3 className="text-xl font-bold text-forest mb-2">Tu selva está vacía</h3>
                                    <p className="text-forest/60">Realiza un diagnóstico para encontrar tus primeras compañeras.</p>
                                </div>
                            )}
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>

            <EditProfileModal isOpen={isEditProfileOpen} onClose={() => setIsEditProfileOpen(false)} />
        </div>
    );
}
