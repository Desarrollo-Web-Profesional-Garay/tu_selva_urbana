import React, { useState, useEffect } from 'react';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [notification, setNotification] = useState(null);

    const statusOptions = ['pendiente', 'pagado', 'enviado', 'entregado', 'cancelado'];

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await fetch('/api/admin/orders'); // Endpoint de tu backend en Railway
            if (!res.ok) throw new Error('Error al obtener pedidos');
            const data = await res.json();
            setOrders(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            const res = await fetch(`/api/admin/orders/${orderId}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });

            if (res.ok) {
                // Actualizar estado localmente para reflejar el cambio inmediato
                setOrders(orders.map(order => 
                    order.id === orderId ? { ...order, status: newStatus } : order
                ));
                showNotification('✅ Estado actualizado con éxito', 'success');
            } else {
                throw new Error();
            }
        } catch (err) {
            showNotification('❌ Error al actualizar el estado', 'error');
        }
    };

    const showNotification = (msg, type) => {
        setNotification({ msg, type });
        setTimeout(() => setNotification(null), 3000);
    };

    if (loading) return <div className="p-10 text-center font-bold text-green-800">Cargando pedidos...</div>;

    return (
        <div className="relative bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Notificación Flotante */}
            {notification && (
                <div className={`fixed top-20 right-10 z-50 px-6 py-3 rounded-lg shadow-lg transition-all animate-bounce ${
                    notification.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                }`}>
                    {notification.msg}
                </div>
            )}

            <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                <h2 className="text-xl font-bold text-gray-800 font-mono italic text-green-900">Gestión de Pedidos</h2>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-100 text-gray-600 uppercase text-[10px] font-black tracking-widest">
                        <tr>
                            <th className="px-6 py-4">ID Pedido</th>
                            <th className="px-6 py-4">Cliente</th>
                            <th className="px-6 py-4">Productos</th>
                            <th className="px-6 py-4">Total</th>
                            <th className="px-6 py-4">Fecha</th>
                            <th className="px-6 py-4">Estado</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {orders.map((order) => (
                            <tr key={order.id} className="hover:bg-green-50/30 transition-colors">
                                <td className="px-6 py-4 font-mono text-xs text-gray-500">#{order.id.slice(-6)}</td>
                                <td className="px-6 py-4 font-medium text-gray-800">{order.customerName}</td>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    <ul className="list-disc list-inside">
                                        {order.items.map((item, idx) => (
                                            <li key={idx}>{item.name} (x{item.quantity})</li>
                                        ))}
                                    </ul>
                                </td>
                                <td className="px-6 py-4 font-bold text-green-700">${order.totalAmount}</td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    {new Date(order.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4">
                                    <select 
                                        value={order.status}
                                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                        className={`px-3 py-1 rounded-full text-xs font-bold border-none ring-1 ring-inset outline-none cursor-pointer shadow-sm ${
                                            order.status === 'entregado' ? 'bg-green-100 text-green-800 ring-green-200' :
                                            order.status === 'pendiente' ? 'bg-yellow-100 text-yellow-800 ring-yellow-200' :
                                            order.status === 'cancelado' ? 'bg-red-100 text-red-800 ring-red-200' :
                                            'bg-blue-100 text-blue-800 ring-blue-200'
                                        }`}
                                    >
                                        {statusOptions.map(opt => (
                                            <option key={opt} value={opt}>{opt.toUpperCase()}</option>
                                        ))}
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminOrders;