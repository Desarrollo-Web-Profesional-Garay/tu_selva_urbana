import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Droplets, Sun, Wind, ShieldCheck, ShoppingCart, Loader2 } from 'lucide-react';
import { plantsAPI } from '../services/api';

const PlantDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { slug, id } = useParams(); // Para obtener por slug o id desde la URL
  const [plant, setPlant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadPlant();
  }, [slug, id]);

  const loadPlant = async () => {
    setLoading(true);
    setError(null);
    
    try {
      let data;
      
      // Si tenemos datos en location.state (desde el catálogo), usarlos
      if (location.state?.plantData) {
        setPlant(location.state.plantData);
        setLoading(false);
        return;
      }
      
      // Si no, cargar desde API
      if (slug) {
        data = await plantsAPI.getBySlug(slug);
      } else if (id) {
        data = await plantsAPI.getById(id);
      } else {
        throw new Error('No se especificó qué planta mostrar');
      }
      
      setPlant(data);
    } catch (err) {
      setError(err.message);
      console.error('Error loading plant:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F6F2] flex justify-center items-center">
        <Loader2 className="animate-spin text-[#1B3022]" size={48} />
      </div>
    );
  }

  if (error || !plant) {
    return (
      <div className="min-h-screen bg-[#F7F6F2] flex flex-col justify-center items-center p-6">
        <p className="text-red-500 mb-4">{error || 'Planta no encontrada'}</p>
        <button 
          onClick={() => navigate('/catalogo')}
          className="bg-[#1B3022] text-white px-6 py-2 rounded-full"
        >
          Volver al catálogo
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F6F2] pb-20 animate-fadeIn">
      {/* Barra superior de navegación */}
      <div className="p-6 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="p-3 bg-white rounded-full shadow-sm hover:bg-[#EAE8E1] transition-all">
          <ArrowLeft size={20} className="text-[#1B3022]" />
        </button>
        <span className="bg-[#1B3022] text-white px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
          Vista Previa
        </span>
      </div>

      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12">
        
        {/* Lado Izquierdo: Imagen Hero */}
        <div className="relative">
          <div className="aspect-[4/5] bg-[#EAE8E1] rounded-[60px] overflow-hidden shadow-2xl">
            <img 
              src={plant.imageUrl || 'https://via.placeholder.com/400x500?text=Sin+Imagen'} 
              alt={plant.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/400x500?text=Sin+Imagen';
              }}
            />
          </div>
          {plant.petSafe && (
            <div className="absolute top-8 right-8 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl flex items-center gap-2 shadow-lg">
              <ShieldCheck className="text-[#8BA888]" size={18} />
              <span className="text-[#1B3022] font-bold text-xs">Pet Friendly</span>
            </div>
          )}
        </div>

        {/* Lado Derecho: Información detallada */}
        <div className="flex flex-col justify-center">
          <div className="mb-2">
             <span className="text-[#8BA888] font-black uppercase text-xs tracking-[0.2em]">
               Categoría: {plant.careLevel === 'facil' ? 'Fácil' : plant.careLevel === 'normal' ? 'Normal' : 'Experto'}
             </span>
          </div>
          <h1 className="text-5xl font-black text-[#1B3022] leading-tight mb-4">{plant.name}</h1>
          
          <div className="flex items-center gap-4 mb-8">
            <span className="text-3xl font-bold text-[#1B3022]">
              ${typeof plant.price === 'number' ? plant.price.toFixed(2) : plant.price}
            </span>
            <div className="h-6 w-[2px] bg-[#EAE8E1]"></div>
            <span className="text-[#1B3022]/40 text-sm font-medium">Envío calculado en checkout</span>
          </div>

          <p className="text-[#1B3022]/70 leading-relaxed mb-10 text-lg">
            Esta hermosa {plant.name} ha sido cuidada bajo condiciones óptimas. 
            Es perfecta para quienes buscan un nivel de dificultad <strong>
              {plant.careLevel === 'facil' ? 'fácil' : plant.careLevel === 'normal' ? 'normal' : 'experto'}
            </strong> 
            y desean darle un toque vibrante a su selva urbana.
          </p>

          {/* Cards de Cuidados */}
          <div className="grid grid-cols-3 gap-4 mb-10">
            <div className="bg-white p-5 rounded-[30px] shadow-sm text-center">
              <Droplets className="mx-auto text-[#8BA888] mb-2" size={24} />
              <p className="text-[10px] font-black text-[#1B3022]/30 uppercase">Riego</p>
              <p className="text-xs font-bold text-[#1B3022] mt-1">{plant.careWater || 'Regular'}</p>
            </div>
            <div className="bg-white p-5 rounded-[30px] shadow-sm text-center">
              <Sun className="mx-auto text-[#8BA888] mb-2" size={24} />
              <p className="text-[10px] font-black text-[#1B3022]/30 uppercase">Luz</p>
              <p className="text-xs font-bold text-[#1B3022] mt-1">{plant.careLight || 'Indirecta'}</p>
            </div>
            <div className="bg-white p-5 rounded-[30px] shadow-sm text-center">
              <Wind className="mx-auto text-[#8BA888] mb-2" size={24} />
              <p className="text-[10px] font-black text-[#1B3022]/30 uppercase">Humedad</p>
              <p className="text-xs font-bold text-[#1B3022] mt-1">{plant.careHumidity || 'Media'}</p>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex gap-4">
            <button className="flex-[2] bg-[#1B3022] text-white font-black py-5 rounded-[25px] flex items-center justify-center gap-3 shadow-xl hover:scale-[1.02] transition-all">
              AÑADIR AL CARRITO <ShoppingCart size={20} />
            </button>
            <button className="flex-1 border-2 border-[#1B3022] text-[#1B3022] font-black py-5 rounded-[25px] hover:bg-[#1B3022] hover:text-white transition-all">
              WISHLIST
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlantDetail;