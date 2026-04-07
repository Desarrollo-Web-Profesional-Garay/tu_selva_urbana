import React, { useEffect, useState } from 'react';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        // Ajusta la URL según tu configuración de variables de entorno o API
        const response = await fetch('/api/admin/stats');
        if (!response.ok) throw new Error('Error al cargar las estadísticas');
        
        const data = await response.json();
        setStats(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
    </div>
  );

  if (error) return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
      Error: {error}
    </div>
  );

  const cards = [
    { title: 'Total Usuarios', value: stats?.totalUsers, icon: '👥', color: 'bg-blue-500' },
    { title: 'Total Pedidos', value: stats?.totalOrders, icon: '📦', color: 'bg-green-500' },
    { title: 'Pedidos Pendientes', value: stats?.pendingOrders, icon: '⏳', color: 'bg-yellow-500' },
    { title: 'Ingresos Totales', value: `$${stats?.totalRevenue}`, icon: '💰', color: 'bg-emerald-600' },
    { title: 'Total Plantas', value: stats?.totalPlants, icon: '🌿', color: 'bg-lime-600' },
    { title: 'Total Posts', value: stats?.totalPosts, icon: '📝', color: 'bg-purple-500' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map((card, index) => (
        <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 transition-transform hover:scale-105">
          <div className={`w-12 h-12 ${card.color} rounded-lg flex items-center justify-center text-2xl text-white shadow-inner`}>
            {card.icon}
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">{card.title}</p>
            <h3 className="text-2xl font-bold text-gray-800">{card.value || 0}</h3>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminDashboard;