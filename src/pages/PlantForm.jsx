// src/pages/PlantForm.jsx - VERSIÓN CORREGIDA (SOLO URL)
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Droplets, Sun, Wind, ChevronRight, Loader2, AlertCircle, Sparkles, Check, X, Link } from 'lucide-react';
import { plantsAPI } from '../services/api';

const PlantForm = ({ initialData = null, onSuccess, onCancel, isEditing = false }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [slug, setSlug] = useState('');
  const [imagePreview, setImagePreview] = useState(initialData?.imageUrl || '');
  
  // Inicializar con datos existentes si estamos editando
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    price: initialData?.price || '',
    careLevel: initialData?.careLevel || 'normal',
    petSafe: initialData?.petSafe || false,
    light: initialData?.light || [],
    careWater: initialData?.careWater || '',
    careLight: initialData?.careLight || '',
    careHumidity: initialData?.careHumidity || '',
    imageUrl: initialData?.imageUrl || '',
    tag: initialData?.tag || '',
    modelUrl: initialData?.modelUrl || ''
  });

  // Opciones de luz disponibles
  const lightOptions = ['Poca', 'Media', 'Sol'];

  const inputStyle = "w-full bg-white border-2 border-transparent focus:border-[#8BA888] rounded-3xl px-6 py-3 outline-none transition-all shadow-sm text-[#1B3022]";
  const labelStyle = "block text-[#1B3022] font-bold mb-2 ml-4 text-sm uppercase tracking-wider";

  // Generar slug automáticamente desde el nombre
  useEffect(() => {
    if (formData.name) {
      const generatedSlug = formData.name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      setSlug(generatedSlug);
    }
  }, [formData.name]);

  // Actualizar preview cuando cambia la URL
  useEffect(() => {
    setImagePreview(formData.imageUrl);
  }, [formData.imageUrl]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (error) setError(null);
  };

  const handleLightToggle = (option) => {
    setFormData(prev => {
      const newLight = prev.light.includes(option)
        ? prev.light.filter(l => l !== option)
        : [...prev.light, option];
      return { ...prev, light: newLight };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validaciones
      if (!formData.name.trim()) {
        throw new Error('🌱 El nombre de la planta es obligatorio');
      }
      if (!formData.price || formData.price <= 0) {
        throw new Error('💰 El precio debe ser mayor a 0');
      }
      if (!formData.imageUrl.trim()) {
        throw new Error('📸 La URL de la imagen es obligatoria');
      }
      if (!formData.imageUrl.match(/^https?:\/\/.+\.[a-z]{2,4}/i)) {
        throw new Error('🔗 Ingresa una URL válida (https://...');
      }
      if (formData.light.length === 0) {
        throw new Error('☀️ Selecciona al menos un tipo de luz');
      }

      // Preparar datos para enviar al backend
      const plantToSend = {
        name: formData.name.trim(),
        slug: slug,
        price: parseFloat(formData.price),
        careLevel: formData.careLevel,
        petSafe: formData.petSafe,
        light: formData.light,
        imageUrl: formData.imageUrl,
        tag: formData.tag || null,
        modelUrl: formData.modelUrl || null,
        careWater: formData.careWater || null,
        careLight: formData.careLight || null,
        careHumidity: formData.careHumidity || null
      };

      console.log('Enviando planta:', plantToSend);

      let result;
      if (isEditing && initialData?.id) {
        result = await plantsAPI.update(initialData.id, plantToSend);
      } else {
        result = await plantsAPI.create(plantToSend);
      }
      
      setSuccess(true);
      
      if (onSuccess) {
        setTimeout(() => {
          onSuccess(result.plant);
        }, 1500);
      } else {
        setTimeout(() => {
          navigate('/catalogo', { 
            state: { 
              message: `✅ ¡${formData.name} ha sido publicada exitosamente!`,
              plant: result.plant 
            } 
          });
        }, 1500);
      }
      
    } catch (err) {
      console.error('Error detallado:', err);
      let errorMessage = err.message;
      
      if (err.message.includes('slug') || err.message.includes('Unique')) {
        errorMessage = '⚠️ Ya existe una planta con ese nombre. Usa otro nombre.';
      } else if (err.message.includes('P2002')) {
        errorMessage = '⚠️ Esta planta ya está registrada en el catálogo.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Si hay éxito y estamos en modal
  if (success && onSuccess) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check size={32} className="text-green-600" />
        </div>
        <h3 className="text-xl font-bold text-[#1B3022] mb-2">
          {isEditing ? '¡Planta Actualizada! ✨' : '¡Planta Creada! 🎉'}
        </h3>
        <p className="text-gray-600 mb-4">
          {formData.name} {isEditing ? 'se actualizó correctamente' : 'se agregó al catálogo'}
        </p>
        <button
          onClick={onSuccess}
          className="bg-[#1B3022] text-white px-6 py-2 rounded-full hover:bg-[#2d4d37] transition"
        >
          Cerrar
        </button>
      </div>
    );
  }

  return (
    <div className={`${!onCancel ? 'min-h-screen bg-[#F7F6F2] p-8' : ''}`}>
      <div className="max-w-3xl mx-auto">
        
        {!onCancel && (
          <header className="mb-10 text-center">
            <span className="bg-[#8BA888]/20 text-[#1B3022] px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 w-fit mx-auto">
              <Sparkles size={14} /> {isEditing ? 'Editar Planta' : 'Nueva Publicación'}
            </span>
            <h1 className="text-4xl font-black text-[#1B3022] mt-4">
              {isEditing ? 'Editar Planta' : 'Vender una Planta'}
            </h1>
            <p className="text-[#1B3022]/60 mt-2 font-medium">
              {isEditing ? 'Actualiza los detalles de la planta' : 'Completa los detalles para el Catálogo Botánico'}
            </p>
          </header>
        )}

        {onCancel && (
          <h2 className="text-2xl font-bold text-[#1B3022] mb-6">
            {isEditing ? '✏️ Editar Planta' : '🌱 Nueva Planta'}
          </h2>
        )}

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center gap-3">
            <AlertCircle className="text-red-500 flex-shrink-0" size={20} />
            <p className="text-red-700 text-sm flex-1">{error}</p>
            <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600">✕</button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Sección de Imagen - SOLO URL */}
          <div className="relative w-full">
            <label className={labelStyle}>URL de la Imagen *</label>
            <div className="relative">
              <Link className="absolute left-4 top-3.5 text-[#8BA888]" size={18} />
              <input 
                type="url"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                placeholder="https://ejemplo.com/imagen-de-planta.jpg"
                className={`${inputStyle} pl-12`}
                required
              />
            </div>
            <p className="text-xs text-[#1B3022]/40 mt-1 ml-4">
              Usa una URL de imagen válida (Unsplash, Imgur, etc.)
            </p>
          </div>

          {/* Preview de imagen desde URL */}
          {imagePreview && (
            <div className="relative w-full h-64 bg-[#EAE8E1] rounded-[40px] overflow-hidden">
              <img 
                src={imagePreview} 
                alt="Preview" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/400x500?text=Error+de+URL';
                  setError('❌ La URL de la imagen no es válida o no se puede cargar');
                }}
                onLoad={() => setError(null)}
              />
              <button
                type="button"
                onClick={() => {
                  setFormData(prev => ({ ...prev, imageUrl: '' }));
                  setImagePreview('');
                }}
                className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition"
              >
                <X size={16} />
              </button>
            </div>
          )}

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
              {slug && formData.name && (
                <p className="text-xs text-[#8BA888] mt-1 ml-4">
                  URL amigable: {slug}
                </p>
              )}
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

          {/* Nivel de Cuidado */}
          <div>
            <label className={labelStyle}>Nivel de Cuidado</label>
            <div className="flex gap-3 flex-wrap">
              {[
                { value: 'facil', label: '🌱 Fácil', desc: 'Para principiantes' },
                { value: 'normal', label: '🌿 Normal', desc: 'Cuidado moderado' },
                { value: 'experto', label: '🌵 Experto', desc: 'Requiere atención' }
              ].map((level) => (
                <button
                  key={level.value}
                  type="button"
                  className={`px-6 py-2 rounded-full border-2 font-bold capitalize transition-all ${
                    formData.careLevel === level.value 
                    ? "bg-[#1B3022] border-[#1B3022] text-white" 
                    : "bg-white border-transparent text-[#1B3022] hover:bg-[#8BA888]/10"
                  }`}
                  onClick={() => setFormData({...formData, careLevel: level.value})}
                >
                  {level.label}
                </button>
              ))}
            </div>
          </div>

          {/* Requisitos de Luz */}
          <div>
            <label className={labelStyle}>Requisitos de Luz * ({formData.light.length} seleccionados)</label>
            <div className="flex gap-3 flex-wrap">
              {lightOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => handleLightToggle(option)}
                  className={`px-6 py-2 rounded-full border-2 font-bold transition-all ${
                    formData.light.includes(option)
                    ? "bg-[#8BA888] border-[#8BA888] text-white" 
                    : "bg-white border-transparent text-[#1B3022] hover:bg-[#8BA888]/10"
                  }`}
                >
                  {option === 'Poca' && '🌑 '}
                  {option === 'Media' && '🌤️ '}
                  {option === 'Sol' && '☀️ '}
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Tips de Cuidado */}
          <div className="bg-white/50 p-6 rounded-[35px] space-y-4">
            <h3 className="text-[#1B3022] font-black text-lg mb-4 flex items-center gap-2">
              🌿 Guía de Cuidados (Opcional)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Droplets className="absolute left-4 top-3.5 text-[#8BA888]" size={18}/>
                <input 
                  type="text" 
                  name="careWater"
                  value={formData.careWater}
                  onChange={handleChange}
                  placeholder="💧 Riego (Ej: Cada 7 días)"
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
                  placeholder="☀️ Luz (Ej: Indirecta brillante)"
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
                  placeholder="💨 Humedad (Ej: 60-80%)"
                  className={`${inputStyle} pl-12 text-sm`} 
                />
              </div>
            </div>
          </div>

          {/* Tag y Modelo 3D */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelStyle}>🏷️ Tag (Opcional)</label>
              <input 
                type="text" 
                name="tag"
                value={formData.tag}
                onChange={handleChange}
                placeholder="Ej: popular, oferta, nueva"
                className={inputStyle}
              />
            </div>
            <div>
              <label className={labelStyle}>🎨 Modelo 3D (Opcional)</label>
              <input 
                type="url" 
                name="modelUrl"
                value={formData.modelUrl}
                onChange={handleChange}
                placeholder="URL del modelo .glb"
                className={inputStyle}
              />
            </div>
          </div>

          {/* Switch Pet Friendly */}
          <div className="flex items-center justify-between bg-[#1B3022] p-6 rounded-[30px] text-white">
            <div>
              <p className="font-bold flex items-center gap-2">
                🐾 Segura para mascotas
              </p>
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

          {/* Botones */}
          <div className="flex gap-3 pt-4">
            <button 
              type="submit"
              disabled={loading}
              className="flex-1 bg-[#1B3022] hover:bg-[#2d4d37] text-white font-black py-5 rounded-[30px] shadow-xl shadow-[#1B3022]/20 flex items-center justify-center gap-2 transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  {isEditing ? 'ACTUALIZANDO...' : 'PUBLICANDO...'}
                </>
              ) : (
                <>
                  {isEditing ? '✏️ ACTUALIZAR PLANTA' : '🌿 PUBLICAR PLANTA'}
                  <ChevronRight size={20} />
                </>
              )}
            </button>
            
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="px-8 py-5 border-2 border-gray-300 rounded-[30px] font-bold text-gray-600 hover:bg-gray-50 transition active:scale-95"
              >
                Cancelar
              </button>
            )}
          </div>

        </form>
      </div>
    </div>
  );
};

export default PlantForm;