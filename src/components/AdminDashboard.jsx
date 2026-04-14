import React, { useEffect, useState } from 'react';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [adminName, setAdminName] = useState('Administrador');
  const [usingMockData, setUsingMockData] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // 🔥 DEBUG: Verificar token en diferentes posibles nombres
        const token = localStorage.getItem('tsu_token') || 
                      localStorage.getItem('token') || 
                      localStorage.getItem('authToken');
        
        console.log('🔍 Token encontrado:', token ? '✅ Sí' : '❌ No');
        console.log('🔍 Token value:', token ? token.substring(0, 50) + '...' : 'null');
        
        // Obtener nombre del admin desde diferentes posibles keys
        const userStr = localStorage.getItem('tsu_user') || 
                        localStorage.getItem('user') ||
                        localStorage.getItem('userData');
        
        if (userStr) {
          try {
            const userData = JSON.parse(userStr);
            setAdminName(userData.name || userData.nombre || userData.username || 'Administrador');
          } catch (e) {
            console.error('Error parsing user data:', e);
          }
        }

        // Si no hay token, mostrar error claro
        if (!token) {
          throw new Error('No hay sesión activa. Por favor, inicia sesión como administrador.');
        }

        const response = await fetch('/api/admin/stats', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        console.log('🔍 Response status:', response.status);

        // Si es 401, el token es inválido o expiró
        if (response.status === 401) {
          throw new Error('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
        }

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Error ${response.status}: ${errorText || 'No autorizado'}`);
        }

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("El servidor no respondió con JSON. Revisa la conexión.");
        }

        const data = await response.json();
        console.log('📊 Datos recibidos:', data);
        setStats(data);
        setUsingMockData(false);
        
      } catch (err) {
        console.error("❌ Fallo en Dashboard:", err.message);
        setError(err.message);
        
        // Si hay error, usar datos de demostración para que se vea el diseño
        setUsingMockData(true);
        setStats({
          totalUsers: 145,
          totalOrders: 38,
          pendingOrders: 5,
          totalRevenue: 12450.00,
          totalPlants: 32,
          totalPosts: 67
        });
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

  // Solo mostrar error si no hay datos y no estamos usando mock
  if (error && !usingMockData) return (
    <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded shadow-sm">
      <p className="font-bold">⚠️ Error de sincronización</p>
      <p className="text-sm">{error}</p>
      <div className="flex gap-3 mt-3">
        <button 
          onClick={() => window.location.reload()} 
          className="text-xs underline font-bold uppercase"
        >
          Reintentar conexión
        </button>
        <button 
          onClick={() => {
            localStorage.removeItem('tsu_token');
            window.location.href = '/login';
          }} 
          className="text-xs underline font-bold uppercase text-red-600"
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );

  const cards = [
    { title: 'Total Usuarios', value: stats?.totalUsers, icon: '👥', color: 'bg-blue-500' },
    { title: 'Total Pedidos', value: stats?.totalOrders, icon: '📦', color: 'bg-green-500' },
    { title: 'Pedidos Pendientes', value: stats?.pendingOrders, icon: '⏳', color: 'bg-yellow-500' },
    { title: 'Ingresos Totales', value: `$${stats?.totalRevenue?.toFixed(2) || 0}`, icon: '💰', color: 'bg-emerald-600' },
    { title: 'Total Plantas', value: stats?.totalPlants, icon: '🌿', color: 'bg-lime-600' },
    { title: 'Total Posts', value: stats?.totalPosts, icon: '📝', color: 'bg-purple-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Aviso de datos de demostración */}
      {usingMockData && (
        <div className="bg-yellow-50 border-l-4 border-yellow-500 text-yellow-700 px-4 py-3 rounded shadow-sm">
          <p className="font-bold">📊 Datos de demostración</p>
          <p className="text-sm">No se pudo conectar con el servidor. Mostrando datos de ejemplo.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 text-xs underline font-bold"
          >
            Reintentar conexión
          </button>
        </div>
      )}

      {/* Mensaje de Bienvenida */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
        <div className="flex items-start gap-4">
          <div className="bg-green-100 rounded-full p-3">
            <span className="text-2xl">🌿</span>
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-800">
              👋 ¡Hola, {adminName}!
            </h1>
            <p className="text-gray-600 mt-1 max-w-2xl">
              Bienvenido al panel de control de <span className="font-semibold text-green-700">Tu Selva Urbana</span>. 
              Desde aquí puedes gestionar el catálogo de plantas, revisar los pedidos de los clientes, 
              administrar los usuarios de la comunidad y dar de alta nuevas especies en el inventario.
            </p>
            <div className="flex flex-wrap gap-4 mt-4">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>📦</span>
                <span>Gestiona pedidos</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>🌿</span>
                <span>Administra plantas</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>👥</span>
                <span>Controla usuarios</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>📝</span>
                <span>Modera publicaciones</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tarjetas de métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 transition-all hover:shadow-md hover:-translate-y-1">
            <div className={`w-12 h-12 ${card.color} rounded-lg flex items-center justify-center text-2xl text-white shadow-inner`}>
              {card.icon}
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">{card.title}</p>
              <h3 className="text-2xl font-black text-gray-800 tracking-tight">
                {card.value !== undefined && card.value !== null ? card.value : '---'}
              </h3>
            </div>
          </div>
        ))}
      </div>

      {/* Mensaje de estado */}
      <div className="text-right">
        <p className="text-xs text-gray-400">
          {usingMockData ? '📊 Datos de demostración - ' : ''}
          Última actualización: {new Date().toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default AdminDashboard;