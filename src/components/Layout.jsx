import { Outlet, NavLink } from 'react-router-dom';
import { Home, Sparkles, Leaf, Compass } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Layout() {
    const navItems = [
        { to: '/feed', icon: Home, label: 'Feed Social' },
        { to: '/recomendaciones', icon: Sparkles, label: 'Catálogo Botánico' },
        { to: '/mis-plantas', icon: Leaf, label: 'Mi Selva' },
    ];

    return (
        <div className="flex h-screen w-screen bg-bone overflow-hidden">
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

                {/* Banner Inferior Sidebar */}
                <div className="p-8 m-8 bg-gradient-to-br from-sage/20 to-bone rounded-3xl border border-sage/30 text-center shadow-sm">
                    <span className="text-3xl mb-4 block">🌿</span>
                    <p className="text-sm font-bold text-forest/80 mb-4 leading-relaxed">Conviértete en un Arquitecto Biofílico.</p>
                    <button className="w-full bg-forest text-white text-xs font-bold uppercase tracking-wider py-3 rounded-xl hover:bg-sage transition-colors">
                        Upgrade Pro
                    </button>
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
        </div>
    );
}
