import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Droplets, Sun, Wind, ChevronRight, Loader2, AlertCircle } from 'lucide-react';
import { plantsAPI } from '../services/api';

const PlantForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    careLevel: 'normal',
    petSafe: false,
    light: [],
    careWater: '',
    careLight: '',
    careHumidity: '',
    imageUrl: '',
    tag: '',
    modelUrl: ''
  });

  const inputStyle = "w-full bg-white border-2 border-transparent focus:border-[#8BA888] rounded-3xl px-6 py-3 outline-none transition-all shadow-sm text-[#1B3022]";
  const labelStyle = "block text-[#1B3022] font-bold mb-2 ml-4 text-sm uppercase tracking-wider";

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validar campos obligatorios
      if (!formData.name.trim()) {
        throw new Error('El nombre de la planta es obligatorio');
      }
      if (!formData.price || formData.price <= 0) {
        throw new Error('El precio debe ser mayor a 0');
      }

      // Preparar datos para enviar
      const plantToSend = {
        ...formData,
        price: parseFloat(formData.price),
        light: formData.light.length ? formData.light : ['luz indirecta'], // Valor por defecto
        petSafe: formData.petSafe
      };

      const result = await plantsAPI.create(plantToSend);
      
      // Redirigir al catálogo con mensaje de éxito
      navigate('/catalogo', { 
        state: { 
          message: '¡Planta creada exitosamente!',
          plant: result.plant 
        } 
      });
    } catch (err) {
      setError(err.message);
      console.error('Error al crear planta:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Aquí deberías subir a Cloudinary o un servicio de almacenamiento
      // Por ahora lo guardamos como base64 (no recomendado para producción)
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, imageUrl: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F6F2] p-8">
      <div className="max-w-3xl mx-auto">
        
        <header className="mb-10 text-center">
          <span className="bg-[#8BA888]/20 text-[#1B3022] px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
            Nueva Publicación
          </span>
          <h1 className="text-4xl font-black text-[#1B3022] mt-4">Vender una Planta</h1>
          <p className="text-[#1B3022]/60 mt-2 font-medium">Llena los detalles para el Catálogo Botánico</p>
        </header>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center gap-3">
            <AlertCircle className="text-red-500 flex-shrink-0" size={20} />
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Sección de Imagen */}
          <label className="group relative w-full h-64 bg-[#EAE8E1] rounded-[40px] border-4 border-dashed border-[#8BA888]/30 flex flex-col items-center justify-center cursor-pointer hover:border-[#8BA888] transition-all overflow-hidden">
            {formData.imageUrl ? (
              <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <>
                <Camera className="text-[#8BA888] mb-2" size={48} />
                <p className="text-[#1B3022] font-bold">Subir foto de la planta</p>
                <p className="text-xs text-[#1B3022]/50">JPG, PNG o WEBP (Máx. 5MB)</p>
              </>
            )}
            <input 
              type="file" 
              className="hidden" 
              accept="image/*"
              onChange={handleImageUpload}
            />
          </label>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelStyle}>Nombre de la Planta *</label>
              <input 
                type="text" 
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ej. Monstera Deliciosa"
                className={inputStyle}
                required
              />
            </div>

            <div>
              <label className={labelStyle}>Precio de Venta ($) *</label>
              <input 
                type="number" 
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="0.00"
                className={inputStyle}
                step="0.01"
                min="0"
                required
              />
            </div>
          </div>

          {/* Dificultad */}
          <div>
            <label className={labelStyle}>Nivel de Cuidado</label>
            <div className="flex gap-3 flex-wrap">
              {['facil', 'normal', 'experto'].map((level) => (
                <button
                  key={level}
                  type="button"
                  className={`px-6 py-2 rounded-full border-2 font-bold capitalize transition-all ${
                    formData.careLevel === level 
                    ? "bg-[#1B3022] border-[#1B3022] text-white" 
                    : "bg-white border-transparent text-[#1B3022] hover:bg-[#8BA888]/10"
                  }`}
                  onClick={() => setFormData({...formData, careLevel: level})}
                >
                  {level === 'facil' ? 'Fácil' : level === 'normal' ? 'Normal' : 'Experto'}
                </button>
              ))}
            </div>
          </div>

          {/* Tips de Cuidado */}
          <div className="bg-white/50 p-6 rounded-[35px] space-y-4">
            <h3 className="text-[#1B3022] font-black text-lg mb-4 flex items-center gap-2">
              🌿 Guía de Cuidados
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Droplets className="absolute left-4 top-3.5 text-[#8BA888]" size={18}/>
                <input 
                  type="text" 
                  name="careWater"
                  value={formData.careWater}
                  onChange={handleChange}
                  placeholder="Riego (Ej: Cada 7 días)"
                  className={`${inputStyle} pl-12 text-sm`} 
                />
              </div>
              <div className="relative">
                <Sun className="absolute left-4 top-3.5 text-[#8BA888]" size={18}/>
                <input 
                  type="text" 
                  name="careLight"
                  value={formData.careLight}
                  onChange={handleChange}
                  placeholder="Luz (Ej: Indirecta brillante)"
                  className={`${inputStyle} pl-12 text-sm`} 
                />
              </div>
              <div className="relative">
                <Wind className="absolute left-4 top-3.5 text-[#8BA888]" size={18}/>
                <input 
                  type="text" 
                  name="careHumidity"
                  value={formData.careHumidity}
                  onChange={handleChange}
                  placeholder="Humedad (Ej: Alta)"
                  className={`${inputStyle} pl-12 text-sm`} 
                />
              </div>
            </div>
          </div>

          {/* Switch Pet Friendly */}
          <div className="flex items-center justify-between bg-[#1B3022] p-6 rounded-[30px] text-white">
            <div>
              <p className="font-bold">Segura para mascotas</p>
              <p className="text-xs text-white/60">¿Es tóxica si se ingiere?</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                name="petSafe"
                checked={formData.petSafe}
                onChange={handleChange}
                className="sr-only peer" 
              />
              <div className="w-14 h-7 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#8BA888]"></div>
            </label>
          </div>

          {/* Botón de envío */}
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-[#1B3022] hover:bg-[#2d4d37] text-white font-black py-5 rounded-[30px] shadow-xl shadow-[#1B3022]/20 flex items-center justify-center gap-2 transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                PUBLICANDO...
              </>
            ) : (
              <>
                PUBLICAR PLANTA <ChevronRight size={20} />
              </>
            )}
          </button>

        </form>
      </div>
    </div>
  );
};

export default PlantForm;