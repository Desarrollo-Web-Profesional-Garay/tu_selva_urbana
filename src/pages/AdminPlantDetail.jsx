import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Star, ShieldCheck, Truck, 
  RotateCcw, Info, Sun, Droplets, Thermometer 
} from 'lucide-react';

const AdminPlantDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Recuperar datos del estado de navegación
  const data = location.state?.plantData || {
    nombre: "Planta de Ejemplo",
    precio: "0.00",
    categoria: "Venta",
    descripcion: "No hay descripción disponible.",
    petFriendly: false,
    resistencia: "Alta"
  };

  return (
    <div className="min-h-screen bg-white p-4 md:p-10 font-sans text-[#1D3528]">
      {/* Botón Volver estilo Amazon */}
      <button 
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-2 text-sm font-semibold hover:text-green-700 transition-colors"
      >
        <ArrowLeft size={16} /> Volver al panel de edición
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* COLUMNA 1: Galería de Imágenes (4/12) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="bg-[#F3F4F1] rounded-3xl p-10 flex items-center justify-center min-h-[500px] relative overflow-hidden">
            <img 
              src={data.imagenUrl || "https://via.placeholder.com/500"} 
              alt={data.nombre}
              className="w-full h-auto object-contain drop-shadow-2xl"
            />
            {data.petFriendly && (
              <span className="absolute top-6 left-6 bg-white px-4 py-1 rounded-full text-[10px] font-black shadow-sm border border-gray-100 uppercase tracking-tighter">
                🐶 Pet Friendly
              </span>
            )}
          </div>
          <div className="grid grid-cols-4 gap-2">
            {[1,2,3,4].map(i => (
              <div key={i} className="aspect-square bg-gray-100 rounded-xl border border-gray-200 cursor-pointer hover:border-green-600 transition-all"></div>
            ))}
          </div>
        </div>

        {/* COLUMNA 2: Información Principal (4/12) */}
        <div className="lg:col-span-4 space-y-4">
          <h1 className="text-3xl font-bold leading-tight">{data.nombre}</h1>
          
          <div className="flex items-center gap-2 text-yellow-500">
            <div className="flex"><Star size={14} fill="currentColor"/><Star size={14} fill="currentColor"/><Star size={14} fill="currentColor"/><Star size={14} fill="currentColor"/><Star size={14} /></div>
            <span className="text-sm text-blue-600 font-medium">124 valoraciones</span>
          </div>

          <hr className="border-gray-100" />

          <div className="text-2xl font-light">
            <span className="text-sm align-top mt-1">$</span>
            <span className="text-4xl font-semibold">{data.precio}</span>
          </div>

          <div className="space-y-3 pt-4">
            <h3 className="font-bold text-sm">Sobre este artículo:</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              {data.descripcion}
            </p>
            <ul className="text-sm space-y-2 list-disc ml-4 text-gray-600">
              <li>Resistencia: <b>{data.resistencia}</b></li>
              <li>Categoría: <b>{data.categoria}</b></li>
              <li>Ideal para: <b>Interiores y Oficinas</b></li>
            </ul>
          </div>

          {/* Guía de cuidados rápida */}
          <div className="grid grid-cols-3 gap-2 pt-6">
            <div className="flex flex-col items-center p-2 bg-green-50 rounded-xl">
              <Sun size={18} className="text-green-700" />
              <span className="text-[10px] font-bold mt-1">Luz Media</span>
            </div>
            <div className="flex flex-col items-center p-2 bg-blue-50 rounded-xl">
              <Droplets size={18} className="text-blue-700" />
              <span className="text-[10px] font-bold mt-1">Frecuente</span>
            </div>
            <div className="flex flex-col items-center p-2 bg-orange-50 rounded-xl">
              <Thermometer size={18} className="text-orange-700" />
              <span className="text-[10px] font-bold mt-1">22°C</span>
            </div>
          </div>
        </div>

        {/* COLUMNA 3: Caja de Compra (3/12) */}
        <div className="lg:col-span-3">
          <div className="border border-gray-200 rounded-2xl p-6 space-y-4 sticky top-10">
            <div className="text-2xl font-bold">${data.precio}</div>
            <p className="text-sm text-green-700 font-bold">Entrega GRATIS el jueves, 12 de marzo.</p>
            
            <div className="space-y-2 text-xs text-gray-600">
              <div className="flex items-center gap-2"><Truck size={14}/> Envío desde Tu Selva Urbana</div>
              <div className="flex items-center gap-2"><ShieldCheck size={14}/> Transacción segura</div>
              <div className="flex items-center gap-2"><RotateCcw size={14}/> Devolución: 30 días</div>
            </div>

            <div className="space-y-3 pt-4">
              <button className="w-full py-3 bg-[#1D3528] text-white rounded-full font-bold text-sm shadow-md">
                Añadir al carrito
              </button>
              <button className="w-full py-3 bg-white border border-[#1D3528] text-[#1D3528] rounded-full font-bold text-sm">
                Comprar ahora
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminPlantDetail;