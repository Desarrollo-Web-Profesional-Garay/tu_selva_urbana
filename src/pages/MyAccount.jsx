import { useContext, useState } from 'react';
import { GlobalContext } from '../context/GlobalContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit2, Heart, MessageCircle, Settings, Camera, PlusCircle, Sparkles } from 'lucide-react';
import EditProfileModal from '../components/EditProfileModal';
import { useNavigate } from 'react-router-dom';

export default function MyAccount() {
    const { user, posts, myPlants, logout } = useContext(GlobalContext);
    const [activeTab, setActiveTab] = useState('posts');
    const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
    const navigate = useNavigate();

    const userPosts = posts.filter(p => p.author?.id === user?.id);
    const likedPosts = posts.filter(p => p.likedBy?.some(u => u.id === user?.id));

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

                <div className="flex flex-col gap-3 self-start md:self-auto w-full md:w-auto mt-4 md:mt-0">
                    <motion.button
                        onClick={() => setIsEditProfileOpen(true)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center justify-center gap-2 bg-bone text-forest px-5 py-3 rounded-xl text-sm font-bold shadow-sm hover:shadow-md transition-all"
                    >
                        <Settings size={18} /> Editar Perfil
                    </motion.button>
                    <motion.button
                        onClick={() => { logout(); navigate('/login'); }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center justify-center gap-2 bg-terra/10 text-terra hover:bg-terra hover:text-white border border-terra/20 px-5 py-3 rounded-xl text-sm font-bold shadow-sm hover:shadow-md transition-all sm:hidden lg:flex"
                    >
                        <LogOut size={18} /> Cerrar Sesión
                    </motion.button>
                </div>
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
                <button
                    onClick={() => setActiveTab('likes')}
                    className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${activeTab === 'likes' ? 'bg-white text-forest shadow-md' : 'text-forest/50 hover:text-forest/80'}`}
                >
                    Favoritos
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
                                            <div className="flex items-center gap-1.5"><MessageCircle size={18} /> <span className="text-sm font-bold">{post.comments?.length || 0}</span></div>
                                        </div>
                                    </div>
                                    <button className="absolute top-4 left-4 bg-white/90 backdrop-blur-md p-2 rounded-full text-forest/50 hover:text-terra opacity-0 group-hover:opacity-100 transition-all shadow-sm">
                                        <Edit2 size={16} />
                                    </button>
                                </article>
                            )) : (
                                <div className="col-span-full py-20 text-center flex flex-col items-center">
                                    <div className="w-20 h-20 bg-bone rounded-full flex items-center justify-center mx-auto mb-4 text-forest/30 shadow-inner">
                                        <Camera size={40} />
                                    </div>
                                    <h3 className="text-xl font-bold text-forest mb-2">Aún no tienes publicaciones</h3>
                                    <p className="text-forest/60 max-w-md mx-auto mb-8">Comparte el progreso de tus plantas con la comunidad biofílica. Muestra al mundo cómo crecen.</p>
                                    <motion.button 
                                        whileHover={{ scale: 1.05 }} 
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => navigate('/feed')}
                                        className="bg-forest text-white px-6 py-3 rounded-full font-bold shadow-md shadow-forest/20 flex items-center gap-2"
                                    >
                                        <PlusCircle size={18} /> Explorar el Feed
                                    </motion.button>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'likes' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                            {likedPosts.length > 0 ? likedPosts.map((post) => (
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
                                            <div className="flex items-center gap-1.5"><Heart size={18} className="text-terra fill-terra" /> <span className="text-sm font-bold">{post.likes}</span></div>
                                            <div className="flex items-center gap-1.5"><MessageCircle size={18} /> <span className="text-sm font-bold">{post.comments?.length || 0}</span></div>
                                        </div>
                                    </div>
                                </article>
                            )) : (
                                <div className="col-span-full py-20 text-center flex flex-col items-center">
                                    <div className="w-20 h-20 bg-bone rounded-full flex items-center justify-center mx-auto mb-4 text-forest/30 shadow-inner">
                                        <Heart size={40} />
                                    </div>
                                    <h3 className="text-xl font-bold text-forest mb-2">Aún no tienes favoritos</h3>
                                    <p className="text-forest/60 max-w-md mx-auto mb-8">Navega por el feed y guarda aquí las publicaciones que te inspiran.</p>
                                    <motion.button 
                                        whileHover={{ scale: 1.05 }} 
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => navigate('/feed')}
                                        className="bg-forest text-white px-6 py-3 rounded-full font-bold shadow-md shadow-forest/20 flex items-center gap-2"
                                    >
                                        <PlusCircle size={18} /> Ir al Feed
                                    </motion.button>
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
                                <div className="col-span-full py-20 text-center flex flex-col items-center">
                                    <span className="text-6xl block mb-6 drop-shadow-sm">🌱</span>
                                    <h3 className="text-xl font-extrabold text-forest mb-2">Tu selva está vacía</h3>
                                    <p className="text-forest/60 max-w-sm mb-8">No te preocupes. Todo empieza con una sola hoja. Descubre las compañeras perfectas para tu hogar.</p>
                                    
                                    <motion.button 
                                        whileHover={{ scale: 1.05 }} 
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => navigate('/quiz')}
                                        className="bg-terra text-white px-6 py-3 rounded-full font-bold shadow-lg shadow-terra/20 flex items-center gap-2"
                                    >
                                        <Sparkles size={18} /> Realizar Diagnóstico
                                    </motion.button>
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
