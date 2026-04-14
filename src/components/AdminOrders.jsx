import React, { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';

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
            const data = await adminAPI.getOrders();
            setOrders(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await adminAPI.updateOrderStatus(orderId, newStatus);
            setOrders(orders.map(order => 
                order.id === orderId ? { ...order, status: newStatus } : order
            ));
            showNotification('\u2705 Estado actualizado con \u00E9xito', 'success');
        } catch (err) {
            showNotification('\u274C Error al actualizar el estado', 'error');
        }
    };

    const showNotification = (msg, type) => {
        setNotification({ msg, type });
        setTimeout(() => setNotification(null), 3000);
    };

    if (loading) return <div className="p-10 text-center font-bold text-green-800">Cargando pedidos...</div>;

    return (
        <div className="relative bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {notification && (
                <div className={`fixed top-20 right-10 z-50 px-6 py-3 rounded-lg shadow-lg transition-all animate-bounce ${
                    notification.type === 'success' ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'
                }`}>
                    {notification.msg}
                </div>
            )}

            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <div>
                    <h2 className="text-xl font-bold text-gray-800">Gesti\u00F3n de Pedidos</h2>
                    <p className="text-sm text-gray-500 mt-1">Administra todas las compras realizadas por los clientes</p>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-semibold">
                        <tr>
                            <th className="px-6 py-4">ID Pedido / Fecha</th>
                            <th className="px-6 py-4">Cliente</th>
                            <th className="px-6 py-4">Total</th>
                            <th className="px-6 py-4">Estado</th>
                            <th className="px-6 py-4">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {orders.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="px-6 py-12 text-center text-gray-400">
                                    \uD83D\uDCE6 No hay pedidos registrados en el sistema.
                                 </td>
                            </tr>
                        ) : (
                            orders.map((order) => (
                                <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <p className="font-bold text-gray-800">#{order.id.slice(-6).toUpperCase()}</p>
                                        <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="font-medium text-gray-800">{order.user.name}</p>
                                        <p className="text-xs text-gray-500">{order.user.email}</p>
                                    </td>
                                    <td className="px-6 py-4 font-bold text-green-700">
                                        ${order.total.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${
                                            order.status === 'pagado' ? 'bg-green-100 text-green-700' :
                                            order.status === 'enviado' ? 'bg-blue-100 text-blue-700' :
                                            order.status === 'entregado' ? 'bg-gray-200 text-gray-700' :
                                            order.status === 'cancelado' ? 'bg-red-100 text-red-700' :
                                            'bg-yellow-100 text-yellow-700'
                                        }`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <select
                                            value={order.status}
                                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                            className="bg-white border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2"
                                        >
                                            {statusOptions.map(opt => (
                                                <option key={opt} value={opt}>
                                                    Cambiar a {opt.toUpperCase()}
                                                </option>
                                            ))}
                                        </select>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            
            <div className="p-4 border-t border-gray-100 bg-gray-50/30 text-sm text-gray-500">
                Total: {orders.length} {orders.length === 1 ? 'pedido' : 'pedidos'} en el sistema
            </div>
        </div>
    );
};

export default AdminOrders;
