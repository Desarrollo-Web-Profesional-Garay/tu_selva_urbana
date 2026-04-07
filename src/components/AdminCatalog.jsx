import React, { useState, useEffect } from 'react';

const AdminCatalog = () => {
    const [plants, setPlants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPlant, setCurrentPlant] = useState(null); // null para nueva, objeto para editar

    useEffect(() => {
        fetchPlants();
    }, []);

    const fetchPlants = async () => {
        try {
            const res = await fetch('/api/plants'); // Ajusta a tu endpoint de Railway
            const data = await res.json();
            setPlants(data);
        } catch (err) {
            console.error("Error al cargar plantas:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("¿Estás seguro de eliminar esta planta?")) {
            try {
                await fetch(`/api/admin/plants/${id}`, { method: 'DELETE' });
                setPlants(plants.filter(p => p.id !== id));
            } catch (err) {
                alert("Error al eliminar");
            }
        }
    };

    const handleSave = (savedPlant) => {
        if (currentPlant) {
            // Actualizar en la lista
            setPlants(plants.map(p => p.id === savedPlant.id ? savedPlant : p));
        } else {
            // Agregar a la lista
            setPlants([...plants, savedPlant]);
        }
        setIsModalOpen(false);
    };

    if (loading) return <div className="text-center p-10 text-green-800 font-bold">Cargando catálogo...</div>;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h2 className="text-xl font-bold text-gray-800">Gestión de Inventario</h2>
                <button 
                    onClick={() => { setCurrentPlant(null); setIsModalOpen(true); }}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                    <span>+</span> Nueva Planta
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-semibold">
                        <tr>
                            <th className="px-6 py-4">Imagen</th>
                            <th className="px-6 py-4">Nombre</th>
                            <th className="px-6 py-4">Precio</th>
                            <th className="px-6 py-4">Cuidado</th>
                            <th className="px-6 py-4">Pet Friendly</th>
                            <th className="px-6 py-4">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {plants.map((plant) => (
                            <tr key={plant.id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-4">
                                    <img src={plant.imageUrl} alt={plant.name} className="w-12 h-12 rounded-lg object-cover border border-gray-200" />
                                </td>
                                <td className="px-6 py-4 font-medium text-gray-800">{plant.name}</td>
                                <td className="px-6 py-4 text-green-700 font-bold">${plant.price}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                                        plant.careLevel === 'Fácil' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                                    }`}>
                                        {plant.careLevel}
                                    </span>
                                </td>
                                <td className="px-6 py-4">{plant.petSafe ? '✅ Sí' : '❌ No'}</td>
                                <td className="px-6 py-4 flex gap-2">
                                    <button 
                                        onClick={() => { setCurrentPlant(plant); setIsModalOpen(true); }}
                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                    >
                                        ✏️
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(plant.id)}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        🗑️
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal para el Formulario (Simplificado para el ejemplo) */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
                        <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white">
                            <h3 className="text-xl font-bold text-green-900">
                                {currentPlant ? 'Editar Planta' : 'Agregar Nueva Planta'}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
                        </div>
                        <div className="p-6">
                            {/* Aquí integrarías el formulario con los campos solicitados */}
                            <p className="text-sm text-gray-500 mb-4">Formulario de datos para: {currentPlant?.name || 'Nueva'}</p>
                            <button 
                                onClick={() => handleSave({...currentPlant, id: currentPlant?.id || Date.now(), name: "Planta Test", price: 250, imageUrl: "https://via.placeholder.com/150"})}
                                className="w-full bg-green-600 text-white py-3 rounded-xl font-bold"
                            >
                                Guardar Cambios
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminCatalog;