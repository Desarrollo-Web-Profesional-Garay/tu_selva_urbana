import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf, Camera, LayoutGrid, ListChecks, DollarSign, Box } from 'lucide-react';

const AdminPanel = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '',
    precio: '',
    categoria: 'Venta',
    resistencia: 'Alta',
    stock: 1,
    vivero: 'Selva Central',
    descripcion: '',
    petFriendly: false,
    envioGratis: true,
    imagenUrl: null
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Función para ir a la vista "Amazon Style"
  const handlePreview = () => {
    navigate('/admin/detalle', { state: { plantData: formData } });
  };

  return (
    <div className="min-h-screen bg-[#F9F9F7] p-6 text-[#1D3528]">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-black italic">Console Admin</h1>
            <p className="text-gray-400 font-medium">Gestión de inventario y Marketplace</p>
          </div>
          <button 
            onClick={handlePreview}
            className="bg-white border-2 border-[#1D3528] px-6 py-3 rounded-2xl font-bold hover:bg-[#1D3528] hover:text-white transition-all shadow-sm flex items-center gap-2"
          >
            <LayoutGrid size={18} /> Previsualizar como Amazon
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* SECCIÓN 1: Identidad del Producto */}
          <div className="lg:col-span-2 space-y-6">
            <section className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
              <h2 className="text-lg font-extrabold mb-6 flex items-center gap-2">
                <ListChecks size={20} className="text-green-700" /> Información Principal
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="text-xs font-black uppercase ml-2 text-gray-400">Título del Producto (SEO)</label>
                  <input 
                    name="nombre"
                    onChange={handleChange}
                    className="w-full mt-2 p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-green-800 outline-none"
                    placeholder="Ej. Planta Monstera Deliciosa - Tamaño Mediano"
                  />
                </div>

                <div>
                  <label className="text-xs font-black uppercase ml-2 text-gray-400">Vivero / Marca</label>
                  <input 
                    name="vivero"
                    onChange={handleChange}
                    className="w-full mt-2 p-4 bg-gray-50 rounded-2xl border-none outline-none"
                    placeholder="Nombre del proveedor"
                  />
                </div>

                <div>
                  <label className="text-xs font-black uppercase ml-2 text-gray-400">Categoría</label>
                  <select name="categoria" onChange={handleChange} className="w-full mt-2 p-4 bg-gray-50 rounded-2xl border-none outline-none">
                    <option value="Venta">Venta Directa</option>
                    <option value="Adopción">Programa de Adopción</option>
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="text-xs font-black uppercase ml-2 text-gray-400">Descripción detallada (Bullets)</label>
                  <textarea 
                    name="descripcion"
                    onChange={handleChange}
                    rows="4"
                    className="w-full mt-2 p-4 bg-gray-50 rounded-2xl border-none outline-none resize-none"
                    placeholder="Escribe los puntos clave que verá el cliente..."
                  ></textarea>
                </div>
              </div>
            </section>

            {/* SECCIÓN 2: Atributos Técnicos */}
            <section className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
              <h2 className="text-lg font-extrabold mb-6 flex items-center gap-2">
                <Box size={20} className="text-green-700" /> Especificaciones
              </h2>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-gray-50 rounded-2xl">
                  <span className="block text-[10px] font-black text-gray-400 mb-2 uppercase">Resistencia</span>
                  <select name="resistencia" onChange={handleChange} className="bg-transparent font-bold outline-none">
                    <option>Alta</option>
                    <option>Media</option>
                    <option>Baja</option>
                  </select>
                </div>
                <div className="p-4 bg-gray-50 rounded-2xl flex flex-col items-center">
                  <span className="text-[10px] font-black text-gray-400 mb-2 uppercase">Pet Friendly</span>
                  <input type="checkbox" name="petFriendly" onChange={handleChange} className="w-5 h-5 accent-[#1D3528]" />
                </div>
                <div className="p-4 bg-gray-50 rounded-2xl flex flex-col items-center">
                  <span className="text-[10px] font-black text-gray-400 mb-2 uppercase">Envío Gratis</span>
                  <input type="checkbox" name="envioGratis" onChange={handleChange} defaultChecked className="w-5 h-5 accent-[#1D3528]" />
                </div>
              </div>
            </section>
          </div>

          {/* COLUMNA DERECHA: Precio y Acción */}
          <div className="space-y-6">
            <section className="bg-[#1D3528] text-white p-8 rounded-[2.5rem] shadow-xl shadow-green-900/20">
              <h2 className="text-sm font-black uppercase tracking-widest mb-6 opacity-60">Oferta y Stock</h2>
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-black uppercase">Precio de Venta (USD)</label>
                  <div className="flex items-center gap-2 text-3xl font-bold mt-1">
                    <span>$</span>
                    <input 
                      name="precio"
                      type="number" 
                      onChange={handleChange}
                      placeholder="0.00"
                      className="bg-transparent border-none outline-none w-full placeholder:text-green-800"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase">Unidades Disponibles</label>
                  <input 
                    name="stock"
                    type="number"
                    onChange={handleChange}
                    className="w-full mt-2 p-3 bg-white/10 rounded-xl border border-white/20 outline-none"
                    placeholder="Cantidad"
                  />
                </div>
                <button className="w-full py-4 bg-white text-[#1D3528] rounded-2xl font-black hover:scale-[1.02] transition-transform">
                  SUBIR A AMAZON CLONE
                </button>
              </div>
            </section>

            {/* Multimedia */}
            <section className="bg-white p-6 rounded-[2.5rem] border border-dashed border-gray-300 flex flex-col items-center justify-center min-h-[200px] text-center">
              <Camera size={32} className="text-gray-300 mb-2" />
              <p className="text-xs font-bold text-gray-400">Click para subir imagen principal</p>
              <p className="text-[10px] text-gray-300 mt-1">Sugerido: 1000x1000px (Fondo blanco)</p>
            </section>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminPanel;