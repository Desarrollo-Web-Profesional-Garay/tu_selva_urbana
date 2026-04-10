import React, { useEffect, useState } from 'react';
import axios from 'axios'; // O usa fetch si prefieres

const UsersTable = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Cargar usuarios al montar el componente
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token'); // Tu JWT
      const response = await axios.get('http://localhost:3001/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      setLoading(false);
    }
  };

  // 2. Función para cambiar el rol (Toggle)
  const handleToggleRole = async (user) => {
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:3001/api/admin/users/${user.id}/role`, 
        { role: newRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Actualizamos el estado local sin recargar la página
      setUsers(users.map(u => u.id === user.id ? { ...u, role: newRole } : u));
    } catch (error) {
      alert("Error al cambiar el rol");
    }
  };

  // 3. Función para eliminar usuario
  const handleDeleteUser = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer.")) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:3001/api/admin/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Filtramos el usuario eliminado del estado
        setUsers(users.filter(user => user.id !== id));
      } catch (error) {
        alert("Error al eliminar el usuario");
      }
    }
  };

  if (loading) return <p className="text-center mt-10">Cargando usuarios de la selva...</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-green-800">Gestión de Usuarios</h2>
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full table-auto">
          <thead className="bg-green-100">
            <tr>
              <th className="px-4 py-2 text-left">ID</th>
              <th className="px-4 py-2 text-left">Nombre</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Rol</th>
              <th className="px-4 py-2 text-left">Registro</th>
              <th className="px-4 py-2 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">{user.id}</td>
                <td className="px-4 py-2 font-medium">{user.name}</td>
                <td className="px-4 py-2">{user.email}</td>
                <td className="px-4 py-2">
                  <span className={`px-2 py-1 rounded text-xs ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-4 py-2">{new Date(user.createdAt).toLocaleDateString()}</td>
                <td className="px-4 py-2 text-center space-x-2">
                  <button 
                    onClick={() => handleToggleRole(user)}
                    className="bg-amber-500 hover:bg-amber-600 text-white px-3 py-1 rounded text-sm transition"
                  >
                    {user.role === 'admin' ? 'Quitar Admin' : 'Hacer Admin'}
                  </button>
                  <button 
                    onClick={() => handleDeleteUser(user.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersTable;