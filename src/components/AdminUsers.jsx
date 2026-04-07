import React, { useState, useEffect } from 'react';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await fetch('/api/admin/users'); // Ajustar a tu endpoint de Railway
            if (!res.ok) throw new Error('Error al obtener usuarios');
            const data = await res.json();
            setUsers(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const toggleRole = async (userId, currentRole) => {
        const newRole = currentRole === 'admin' ? 'user' : 'admin';
        try {
            const res = await fetch(`/api/admin/users/${userId}/role`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ role: newRole }),
            });

            if (res.ok) {
                setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
                showNotification(`✅ Rol actualizado a ${newRole}`, 'success');
            }
        } catch (err) {
            showNotification('❌ Error al cambiar el rol', 'error');
        }
    };

    const deleteUser = async (userId) => {
        if (window.confirm("¿Estás seguro de eliminar este usuario? Esta acción no se puede deshacer.")) {
            try {
                const res = await fetch(`/api/admin/users/${userId}`, { method: 'DELETE' });
                if (res.ok) {
                    setUsers(users.filter(u => u.id !== userId));
                    showNotification('🗑️ Usuario eliminado correctamente', 'success');
                }
            } catch (err) {
                showNotification('❌ Error al eliminar usuario', 'error');
            }
        }
    };

    const showNotification = (msg, type) => {
        setNotification({ msg, type });
        setTimeout(() => setNotification(null), 3000);
    };

    if (loading) return <div className="p-10 text-center font-bold text-green-800">Cargando usuarios...</div>;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {notification && (
                <div className={`fixed top-20 right-10 z-50 px-6 py-3 rounded-lg shadow-lg animate-fade-in ${
                    notification.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
                }`}>
                    {notification.msg}
                </div>
            )}

            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h2 className="text-xl font-bold text-gray-800">Control de Usuarios</h2>
                <span className="text-xs font-mono bg-gray-200 px-2 py-1 rounded text-gray-600 uppercase tracking-tighter">
                    Total: {users.length}
                </span>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-500 uppercase text-[10px] font-black tracking-widest">
                        <tr>
                            <th className="px-6 py-4">Usuario</th>
                            <th className="px-6 py-4">Email</th>
                            <th className="px-6 py-4">Rol</th>
                            <th className="px-6 py-4">Registro</th>
                            <th className="px-6 py-4 text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm">
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-500">
                                            {user.name.charAt(0)}
                                        </div>
                                        <span className="font-medium text-gray-800">{user.name}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-gray-600">{user.email}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                                        user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                                    }`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-gray-500">
                                    {new Date(user.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex justify-center gap-2">
                                        <button 
                                            onClick={() => toggleRole(user.id, user.role)}
                                            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                                                user.role === 'admin' 
                                                ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' 
                                                : 'bg-green-100 text-green-700 hover:bg-green-200'
                                            }`}
                                        >
                                            {user.role === 'admin' ? 'Quitar Admin' : 'Hacer Admin'}
                                        </button>
                                        <button 
                                            onClick={() => deleteUser(user.id)}
                                            className="p-1 text-red-400 hover:text-red-600 transition-colors"
                                            title="Eliminar usuario"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminUsers;