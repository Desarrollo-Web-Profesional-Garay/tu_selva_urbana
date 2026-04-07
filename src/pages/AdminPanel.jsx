import React, { useState } from 'react';
import AdminDashboard from '../components/AdminDashboard';

const AdminPanel = () => {
    // Estado para controlar qué sección se muestra en el panel
    const [activeSection, setActiveSection] = useState('Dashboard');

    // Configuración de los items del menú lateral
    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: '📊' },
        { id: 'pedidos', label: 'Pedidos', icon: '📦' },
        { id: 'usuarios', label: 'Usuarios', icon: '👥' },
        { id: 'catalogo', label: 'Catálogo de Plantas', icon: '🌿' },
    ];

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* --- SIDEBAR (Barra Lateral) --- */}
            <aside className="w-20 md:w-64 bg-[#1a2e1a] text-white flex flex-col transition-all duration-300 shadow-xl">
                <div className="p-6 text-center border-b border-green-900/50">
                    <h2 className="text-xl font-bold tracking-wider hidden md:block text-green-400">
                        TU SELVA <span className="text-white text-sm block">Admin Panel</span>
                    </h2>
                    <span className="md:hidden text-2xl">🌿</span>
                </div>
                
                <nav className="flex-1 mt-6">
                    <ul className="space-y-2 px-2">
                        {menuItems.map((item) => (
                            <li
                                key={item.id}
                                onClick={() => setActiveSection(item.label)}
                                className={`
                                    flex items-center p-4 cursor-pointer rounded-lg transition-all duration-200
                                    ${activeSection === item.label 
                                        ? 'bg-green-700 text-white shadow-lg translate-x-1' 
                                        : 'text-gray-400 hover:bg-green-800/50 hover:text-gray-200'}
                                `}
                            >
                                <span className="text-xl w-8 flex justify-center">{item.icon}</span>
                                <span className="ml-3 font-medium hidden md:block">{item.label}</span>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className="p-4 border-t border-green-900/50">
                    <button className="w-full flex items-center p-2 text-gray-400 hover:text-red-400 transition-colors">
                        <span className="text-xl w-8 flex justify-center">🚪</span>
                        <span className="ml-3 hidden md:block">Cerrar Sesión</span>
                    </button>
                </div>
            </aside>

            {/* --- CONTENIDO PRINCIPAL --- */}
            <main className="flex-1 flex flex-col overflow-hidden">
                {/* Header Superior */}
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shadow-sm">
                    <div className="flex items-center gap-2">
                        <span className="text-gray-400">Panel</span>
                        <span className="text-gray-300">/</span>
                        <span className="font-semibold text-green-800">{activeSection}</span>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                            <p className="text-xs text-gray-400 font-bold uppercase">Sesión activa</p>
                            <p className="text-sm font-medium text-gray-700">Administrador</p>
                        </div>
                        <div className="w-10 h-10 bg-green-100 border-2 border-green-500 rounded-full flex items-center justify-center text-green-700 font-bold shadow-sm">
                            A
                        </div>
                    </div>
                </header>

                {/* Área Scrollable del Contenido */}
                <div className="flex-1 overflow-y-auto p-6 md:p-10 bg-[#f8faf8]">
                    <div className="max-w-7xl mx-auto">
                        <header className="mb-8">
                            <h1 className="text-3xl font-bold text-gray-800">{activeSection}</h1>
                            <p className="text-gray-500 mt-1">Gestión integral de tu ecosistema digital.</p>
                        </header>

                        {/* Renderizado Condicional de Secciones */}
                        <div className="animate-in fade-in duration-500">
                            {activeSection === 'Dashboard' ? (
                                <AdminDashboard />
                            ) : (
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                                    <div className="text-6xl mb-4">🚧</div>
                                    <h2 className="text-2xl font-bold text-gray-700">Sección en Construcción</h2>
                                    <p className="text-gray-500 mt-2">
                                        Estamos trabajando para traerte la gestión de <strong>{activeSection}</strong> muy pronto.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminPanel;