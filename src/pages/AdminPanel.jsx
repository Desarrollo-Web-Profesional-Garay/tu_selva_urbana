import React, { useState } from 'react';

const AdminPanel = () => {
  const [activeSection, setActiveSection] = useState('Dashboard');

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'pedidos', label: 'Pedidos', icon: '📦' },
    { id: 'usuarios', label: 'Usuarios', icon: '👥' },
    { id: 'catalogo', label: 'Catálogo de Plantas', icon: '🌿' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar - Barra Lateral Izquierda */}
      <aside className="w-64 bg-[#1a2e1a] text-white flex flex-col transition-all duration-300 md:w-64 w-20">
        <div className="p-6 text-center border-b border-green-900">
          <h2 className="text-xl font-bold hidden md:block">Tu Selva Admin</h2>
          <span className="md:hidden">🌿</span>
        </div>
        
        <nav className="flex-1 mt-4">
          <ul>
            {menuItems.map((item) => (
              <li
                key={item.id}
                onClick={() => setActiveSection(item.label)}
                className={`flex items-center p-4 cursor-pointer transition-colors hover:bg-green-800 ${
                  activeSection === item.label ? 'bg-green-700 border-l-4 border-green-400' : ''
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="ml-4 font-medium hidden md:block">{item.label}</span>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main Content - Área de Contenido Derecha */}
      <main className="flex-1 flex flex-col">
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-8">
          <h1 className="text-2xl font-semibold text-gray-800">{activeSection}</h1>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-200 rounded-full flex items-center justify-center text-green-800 font-bold">
              A
            </div>
            <span className="text-sm font-medium text-gray-600">Admin</span>
          </div>
        </header>

        <div className="p-8">
          <div className="bg-white rounded-lg shadow-md p-6 min-h-[400px] border border-gray-200">
            <h3 className="text-lg text-gray-500 mb-4">Bienvenido al panel de gestión</h3>
            <p className="text-gray-700">
              Aquí podrás gestionar la sección de <span className="font-bold text-green-700">{activeSection}</span> de tu aplicación.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminPanel;