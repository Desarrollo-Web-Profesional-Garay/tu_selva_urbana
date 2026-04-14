import React, { useState, useEffect } from 'react';
import { plantsAPI } from '../services/api';
import PlantForm from '../pages/PlantForm';

const AdminCatalog = () => {
    const [plants, setPlants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPlant, setCurrentPlant] = useState(null);
    const [refreshKey, setRefreshKey] = useState(0);

    useEffect(() => {
        fetchPlants();
    }, []);

    const fetchPlants = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await plantsAPI.getAll();
            console.log('Plantas cargadas en admin:', data);
            setPlants(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Error al cargar plantas:", err);
            setError(err.message || "Error al cargar el cat\u00E1logo");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id, plantName) => {
        if (window.confirm(`\u00BFEst\u00E1s seguro de eliminar "${plantName}"?`)) {
            try {
                await plantsAPI.delete(id);
                setPlants(prevPlants => prevPlants.filter(p => p.id !== id));
                alert(`\u2705 "${plantName}" eliminada exitosamente`);
            } catch (err) {
                console.error("Error al eliminar:", err);
                alert(err.message || "Error al eliminar la planta");
            }
        }
    };

    const handlePlantSaved = async () => {
        setIsModalOpen(false);
        setCurrentPlant(null);
        await fetchPlants();
    };

    const openModal = (plant = null) => {
        setCurrentPlant(plant);
        setIsModalOpen(true);
        setRefreshKey(prev => prev + 1);
    };

    if (loading) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">Gesti\u00F3n de Inventario</h2>
                        <p className="text-sm text-gray-500 mt-1">Administra el cat\u00E1logo de plantas de Tu Selva Urbana</p>
                    </div>
                    <button 
                        onClick={() => openModal()}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 shadow-md"
                    >
                        <span className="text-xl">+</span> Nueva Planta
                    </button>
                </div>
                <div className="text-center p-10">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700 mx-auto mb-4"></div>
                    <p className="text-green-800 font-bold">Cargando cat\u00E1logo...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">Gesti\u00F3n de Inventario</h2>
                        <p className="text-sm text-gray-500 mt-1">Administra el cat\u00E1logo de plantas de Tu Selva Urbana</p>
                    </div>
                    <button 
                        onClick={() => openModal()}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 shadow-md"
                    >
                        <span className="text-xl">+</span> Nueva Planta
                    </button>
                </div>
                <div className="text-center p-10">
                    <p className="text-red-500 mb-4">\u274C Error: {error}</p>
                    <button 
                        onClick={fetchPlants}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                        Reintentar
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <div>
                    <h2 className="text-xl font-bold text-gray-800">Gesti\u00F3n de Inventario</h2>
                    <p className="text-sm text-gray-500 mt-1">Administra el cat\u00E1logo de plantas de Tu Selva Urbana</p>
                </div>
                <button 
                    onClick={() => openModal()}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 shadow-md"
                >
                    <span className="text-xl">+</span> Nueva Planta
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-semibold">
                        <tr>
                            <th className="px-6 py-4">IMAGEN</th>
                            <th className="px-6 py-4">NOMBRE</th>
                            <th className="px-6 py-4">PRECIO</th>
                            <th className="px-6 py-4">CUIDADO</th>
                            <th className="px-6 py-4">LUZ</th>
                            <th className="px-6 py-4">PET FRIENDLY</th>
                            <th className="px-6 py-4">ACCIONES</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {plants.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="px-6 py-12 text-center text-gray-400">
                                    \uD83C\uDF31 No hay plantas en el cat\u00E1logo. \u00A1Crea la primera!
                                 </td>
                            </tr>
                        ) : (
                            plants.map((plant) => (
                                <tr key={plant.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <img 
                                            src={plant.imageUrl || 'https://via.placeholder.com/50x50?text=No+img'} 
                                            alt={plant.name} 
                                            className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                                            onError={(e) => {
                                                e.target.src = 'https://via.placeholder.com/50x50?text=Error';
                                            }}
                                        />
                                    </td>
                                    <td className="px-6 py-4 font-medium text-gray-800">{plant.name}</td>
                                    <td className="px-6 py-4 text-green-700 font-bold">${plant.price?.toFixed(2)}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                            plant.careLevel === 'facil' ? 'bg-green-100 text-green-700' :
                                            plant.careLevel === 'experto' ? 'bg-red-100 text-red-700' :
                                            'bg-yellow-100 text-yellow-700'
                                        }`}>
                                            {plant.careLevel === 'facil' ? '\uD83C\uDF31 F\u00E1cil' : 
                                             plant.careLevel === 'experto' ? '\uD83C\uDF35 Experto' : 
                                             '\uD83C\uDF3F Normal'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-1 flex-wrap">
                                            {plant.light && plant.light.length > 0 ? (
                                                plant.light.map((l, i) => (
                                                    <span key={i} className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                                                        {l === 'Poca' && '\uD83C\uDF11 '}
                                                        {l === 'Media' && '\uD83C\uDF24\uFE0F '}
                                                        {l === 'Sol' && '\u2600\uFE0F '}
                                                        {l}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-xs text-gray-400">No especificado</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {plant.petSafe ? 
                                            <span className="text-green-600">\u2705 S\u00ED</span> : 
                                            <span className="text-red-400">\u274C No</span>
                                        }
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2">
                                            <button 
                                                onClick={() => openModal(plant)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Editar"
                                            >
                                                \u270F\uFE0F
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(plant.id, plant.name)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Eliminar"
                                            >
                                                \uD83D\uDDD1\uFE0F
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className="p-4 border-t border-gray-100 bg-gray-50/30 text-sm text-gray-500">
                Total: {plants.length} {plants.length === 1 ? 'planta' : 'plantas'} en el cat\u00E1logo
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl relative">
                        <div className="sticky top-0 bg-white border-b border-gray-100 p-4 flex justify-between items-center z-10">
                            <h3 className="text-xl font-bold text-green-800">
                                {currentPlant ? '\u270F\uFE0F Editar Planta' : '\uD83C\uDF31 Agregar Nueva Planta'}
                            </h3>
                            <button 
                                onClick={() => {
                                    setIsModalOpen(false);
                                    setCurrentPlant(null);
                                }} 
                                className="text-gray-400 hover:text-gray-600 text-2xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
                            >
                                \u00D7
                            </button>
                        </div>
                        <div className="p-6">
                            <PlantForm 
                                key={refreshKey}
                                initialData={currentPlant} 
                                onSuccess={handlePlantSaved}
                                onCancel={() => {
                                    setIsModalOpen(false);
                                    setCurrentPlant(null);
                                }}
                                isEditing={!!currentPlant}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminCatalog;
