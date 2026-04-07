import React, { useState } from 'react';
import AdminDashboard from '../components/AdminDashboard';
import AdminCatalog from '../components/AdminCatalog';
import AdminOrders from '../components/AdminOrders';
import AdminUsers from '../components/AdminUsers'; // Importado correctamente

const AdminPanel = () => {
    // Estado para controlar la navegación del panel
    const [activeSection, setActiveSection] = useState('Dashboard');

    // Items del menú lateral con sus IDs para vinculación lógica
    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: '📊' },
        { id: 'pedidos', label: 'Pedidos', icon: '📦' },
        { id: 'usuarios', label: 'Usuarios', icon: '👥' },
        { id: 'catalogo', label: 'Catálogo de Plantas', icon: '🌿' },
    ];

    // Función para renderizar el componente correcto según la sección activa
    const renderContent = () => {
        switch (activeSection) {
            case 'Dashboard':
                return <AdminDashboard />;
            case 'Catálogo de Plantas':
                return <AdminCatalog />;
            case 'Pedidos':
                return <AdminOrders />;
            case 'Usuarios':
                return <AdminUsers />; // Ahora renderiza el componente real de gestión
            default:
                return <AdminDashboard />;
        }
    };

    return (
        <div className="flex min-h-screen bg-[#f8faf8]">
            {/* --- SIDEBAR (Menú Lateral) --- */}
            <aside className="w-20 md:w-64 bg-[#1a2e1a] text-white flex flex-col transition-all duration-300 shadow-2xl z-20">
                <div className="p-6 text-center border-b border-white/10">
                    <h2 className="text-xl font-bold tracking-tighter hidden md:block text-green-400 uppercase">
                        TU SELVA <span className="text-white text-[10px] block font-light tracking-widest">ADMIN PANEL</span>
                    </h2>
                    <span className="md:hidden text-2xl">🌿</span>
                </div>
                
                <nav className="flex-1 mt-6">
                    <ul className="space-y-1 px-3">
                        {menuItems.map((item) => (
                            <li
                                key={item.id}
                                onClick={() => setActiveSection(item.label)}
                                className={`
                                    flex items-center p-3 cursor-pointer rounded-xl transition-all duration-200 group
                                    ${activeSection === item.label 
                                        ? 'bg-green-600 text-white shadow-lg shadow-green-900/20' 
                                        : 'text-gray-400 hover:bg-green-800/40 hover:text-white'}
                                `}
                            >
                                <span className="text-xl w-8 flex justify-center transition-transform group-hover:scale-110">
                                    {item.icon}
                                </span>
                                <span className="ml-3 font-medium hidden md:block">{item.label}</span>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className="p-4 border-t border-white/10">
                    <button className="w-full flex items-center p-3 text-gray-400 hover:text-red-400 hover:bg-red-900/10 rounded-xl transition-all">
                        <span className="text-xl w-8 flex justify-center">🚪</span>
                        <span className="ml-3 hidden md:block font-medium">Salir</span>
                    </button>
                </div>
            </aside>

            {/* --- ÁREA DE CONTENIDO --- */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Header Superior */}
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 z-10 shadow-sm">
                    <div className="flex items-center gap-3">
                        <nav className="flex text-sm text-gray-500 font-medium">
                            <span className="hover:text-green-700 cursor-pointer">Panel</span>
                            <span className="mx-2 text-gray-300">/</span>
                            <span className="font-bold text-green-800 uppercase tracking-wider text-[10px] mt-1 bg-green-50 px-2 py-0.5 rounded border border-green-100">
                                {activeSection}
                            </span>
                        </nav>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <div className="hidden sm:block text-right">
                            <p className="text-[10px] text-gray-400 font-black uppercase leading-none">Status</p>
                            <p className="text-sm font-bold text-gray-700">Root Admin</p>
                        </div>
                        <div className="relative">
                            <div className="w-10 h-10 bg-gradient-to-tr from-green-600 to-green-400 rounded-full flex items-center justify-center text-white font-bold shadow-md ring-2 ring-white">
                                A
                            </div>
                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></span>
                        </div>
                    </div>
                </header>

                {/* Vista Principal con Scroll Independiente */}
                <div className="flex-1 overflow-y-auto p-4 md:p-8">
                    <div className="max-w-6xl mx-auto">
                        <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                            <div>
                                <h1 className="text-4xl font-black text-gray-900 tracking-tighter">
                                    {activeSection}
                                </h1>
                                <div className="h-1 w-12 bg-green-500 mt-2 rounded-full"></div>
                                <p className="text-gray-500 font-medium mt-3">
                                    Gestión centralizada de <span className="text-green-700 font-bold italic">Tu Selva Urbana</span>.
                                </p>
                            </div>
                            <div className="text-[10px] bg-white px-3 py-1.5 rounded-full border border-gray-200 text-gray-400 font-mono shadow-sm flex items-center gap-2">
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                Sync: {new Date().toLocaleTimeString()}
                            </div>
                        </header>

                        {/* Renderizado dinámico con animación suave */}
                        <div className="animate-in fade-in slide-in-from-bottom-3 duration-700">
                            {renderContent()}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminPanel;