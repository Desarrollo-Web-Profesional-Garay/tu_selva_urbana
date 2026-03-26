import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { Home, Sparkles, Leaf, Compass, PlusCircle, LogOut, Library, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useContext, useState } from 'react';
import { GlobalContext } from '../context/GlobalContext';
import CreatePostModal from './CreatePostModal';
import ScannerModal from './ScannerModal';
import { ScanLine } from 'lucide-react';
import Chatbot from './Chatbot';

export default function Layout() {
    const navItems = [
        { to: '/feed', icon: Home, label: 'Feed Social' },
        { to: '/recomendaciones', icon: Star, label: 'Recomendaciones' },
        { to: '/catalogo', icon: Library, label: 'Catálogo Global' },
        { to: '/mis-plantas', icon: Leaf, label: 'Mi Selva' },
    ];

    const navigate = useNavigate();
    const { user, logout } = useContext(GlobalContext);
    const [isPostModalOpen, setIsPostModalOpen] = useState(false);
    const [isScannerOpen, setIsScannerOpen] = useState(false);

    return (
        <div className="flex h-screen w-screen bg-bone bg-organic-pattern bg-[length:600px_600px] overflow-hidden">
            {/* Sidebar Desktop (Premium Web Design) */}
            <aside className="hidden lg:flex flex-col w-80 bg-white/80 backdrop-blur-xl border-r border-sage/20 shadow-xl z-20 flex-shrink-0">
                <div className="p-10 flex items-center gap-4">
                    <div className="w-12 h-12 bg-forest rounded-2xl flex items-center justify-center text-white shadow-lg shadow-forest/20">
                        <Compass size={28} />
                    </div>
                    <h1 className="text-2xl font-black tracking-tight text-forest">
                        Tu Selva<br />Urbana
                    </h1>
                </div>

                <nav className="flex-1 px-8 space-y-4 mt-8">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                className={({ isActive }) =>
                                    `flex items-center gap-5 px-6 py-5 rounded-2xl transition-all duration-300 relative group overflow-hidden ${isActive
                                        ? 'text-white shadow-lg shadow-forest/10'
                                        : 'text-forest/70 hover:bg-sage/10 hover:text-forest'
                                    }`
                                }
                            >
                                {({ isActive }) => (
                                    <>
                                        {/* Indicador Animado Activo */}
                                        {isActive && (
                                            <motion.div
                                                layoutId="sidebar-active"
                                                className="absolute inset-0 bg-forest rounded-2xl -z-10"
                                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                            />
                                        )}

                                        <Icon size={24} className={`relative z-10 transition-transform duration-300 group-hover:scale-110 ${isActive ? 'text-sage' : ''}`} />
                                        <span className="font-bold text-[16px] relative z-10 tracking-wide">
                                            {item.label}
                                        </span>
                                    </>
                                )}
                            </NavLink>
                        );
                    })}
                </nav>

                {/* User Profile & Post Action */}
                <div className="p-6 mt-4 flex flex-col gap-4">
                    <button
                        onClick={() => setIsScannerOpen(true)}
                        className="w-full bg-gradient-to-r from-sage to-forest text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-sage/30 flex items-center justify-center gap-2 hover:opacity-90 transition-all hover:scale-[1.02] active:scale-95 border border-white/20 relative overflow-hidden group"
                    >
                        <ScanLine size={20} className="group-hover:animate-pulse" /> IA Scanner
                        <div className="absolute top-0 left-0 w-full h-full bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
                    </button>

                    <button
                        onClick={() => setIsPostModalOpen(true)}
                        className="w-full bg-forest text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-forest/20 flex items-center justify-center gap-2 hover:bg-[#1A251B] transition-all hover:scale-[1.02] active:scale-95"
                    >
                        <PlusCircle size={20} /> Publicar
                    </button>

                    <div className="flex items-center justify-between p-3 bg-white/50 rounded-2xl border border-sage/20 hover:bg-white transition-colors cursor-pointer group" onClick={() => navigate('/mi-cuenta')}>
                        <div className="flex items-center gap-3 overflow-hidden">
                            <img
                                src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name}&background=ECECE5&color=2C3E2D`}
                                alt={user?.name}
                                className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                            />
                            <div className="flex flex-col overflow-hidden">
                                <span className="font-bold text-sm text-forest truncate">{user?.name}</span>
                                <span className="text-xs text-forest/50 truncate">Ver perfil</span>
                            </div>
                        </div>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                logout();
                                navigate('/login');
                            }}
                            className="p-2 text-forest/40 hover:text-red-500 transition-colors rounded-full hover:bg-red-50"
                            title="Cerrar sesión"
                        >
                            <LogOut size={16} />
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content Area - Expansivo y sin restricciones de ancho */}
            <main className="flex-1 relative h-full overflow-y-auto overflow-x-hidden hide-scrollbar bg-bone/50">
                <div className="w-full max-w-[1600px] mx-auto px-6 py-8 md:px-12 lg:px-20 lg:py-16 min-h-full">
                    <Outlet />
                </div>
            </main>

            {/* Mobile Bottom Nav (Fallback solo para celulares) */}
            <nav className="lg:hidden fixed bottom-0 w-full left-0 bg-white/90 backdrop-blur-lg border-t border-gray-100 pb-safe shadow-[0_-5px_15px_rgba(0,0,0,0.03)] z-50">
                <div className="flex justify-around items-center h-20 px-4">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                className={({ isActive }) =>
                                    `flex flex-col items-center justify-center w-20 h-full transition-colors relative ${isActive ? 'text-forest' : 'text-gray-400 hover:text-sage'
                                    }`
                                }
                            >
                                {({ isActive }) => (
                                    <>
                                        <Icon size={26} strokeWidth={isActive ? 2.5 : 2} />
                                        <span className="text-[11px] font-bold mt-1.5">{item.label}</span>
                                        {isActive && (
                                            <motion.div
                                                layoutId="bottom-nav-mobile"
                                                className="absolute top-0 w-12 h-1.5 bg-sage rounded-b-full"
                                            />
                                        )}
                                    </>
                                )}
                            </NavLink>
                        );
                    })}
                </div>
            </nav>

            <nav className="lg:hidden fixed bottom-16 right-4 z-50">
                <button
                    onClick={() => setIsScannerOpen(true)}
                    className="w-14 h-14 bg-gradient-to-r from-sage to-forest text-white rounded-full flex items-center justify-center shadow-lg shadow-sage/30 hover:scale-110 transition-transform"
                >
                    <ScanLine size={24} />
                </button>
            </nav>

            <CreatePostModal isOpen={isPostModalOpen} onClose={() => setIsPostModalOpen(false)} />
            <ScannerModal isOpen={isScannerOpen} onClose={() => setIsScannerOpen(false)} />
            <Chatbot />
        </div>
    );
}
