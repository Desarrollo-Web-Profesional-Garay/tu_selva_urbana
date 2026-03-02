import { NavLink } from 'react-router-dom';
import { Home, Sparkles, Leaf } from 'lucide-react';
import { motion } from 'framer-motion';

export default function BottomNav() {
    const navItems = [
        { to: '/feed', icon: Home, label: 'Feed' },
        { to: '/recomendaciones', icon: Sparkles, label: 'Catálogo' },
        { to: '/mis-plantas', icon: Leaf, label: 'Mis Plantas' },
    ];

    return (
        <nav className="fixed bottom-0 w-full max-w-md left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-lg border-t border-gray-100 pb-safe shadow-[0_-5px_15px_rgba(0,0,0,0.03)] z-50">
            <div className="flex justify-around items-center h-16 px-4">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            className={({ isActive }) =>
                                `flex flex-col items-center justify-center w-16 h-full transition-colors relative ${isActive ? 'text-forest' : 'text-gray-400 hover:text-sage'
                                }`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                                    <span className="text-[10px] sm:text-xs font-medium mt-1">
                                        {item.label}
                                    </span>

                                    {isActive && (
                                        <motion.div
                                            layoutId="bottom-nav-indicator"
                                            className="absolute top-0 w-8 h-1 bg-sage rounded-b-full"
                                            initial={false}
                                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                        />
                                    )}
                                </>
                            )}
                        </NavLink>
                    );
                })}
            </div>
        </nav>
    );
}
