import { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, Truck, ShieldCheck, Leaf } from 'lucide-react';
import { GlobalContext } from '../context/GlobalContext';
import { ordersAPI } from '../services/api';

export default function CheckoutModal({ isOpen, onClose, plant }) {
    const { adoptPlant } = useContext(GlobalContext);
    const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Success
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Form data mock
    const [address, setAddress] = useState('');
    const [card, setCard] = useState('');

    if (!plant) return null;

    const handleCheckout = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // 1. Crear la orden de compra en el backend
            await ordersAPI.create([
                { plantId: plant.id, quantity: 1, price: plant.price || 25 }
            ]);

            // 2. Adoptar la planta (agregarla a Mi Selva)
            await adoptPlant(plant);

            // 3. Mostrar pantalla de éxito
            setStep(3);
        } catch (err) {
            setError('Error al procesar el pago. Intenta de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setStep(1);
        setAddress('');
        setCard('');
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="absolute inset-0 bg-forest/60 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-2xl bg-bone/95 backdrop-blur-2xl border border-sage/30 rounded-[32px] shadow-2xl overflow-hidden flex flex-col md:flex-row h-[600px] md:h-auto max-h-[90vh]"
                    >
                        {/* Left Side: Summary */}
                        <div className="bg-white/50 border-r border-sage/20 p-8 flex flex-col items-center justify-center md:w-5/12 hidden md:flex">
                            <div className="w-48 h-48 rounded-full bg-gradient-to-t from-bone to-sage/20 flex items-center justify-center mb-6 border-4 border-white shadow-lg relative overflow-hidden">
                                {plant.modelUrl ? (
                                    <model-viewer
                                        src={plant.modelUrl}
                                        auto-rotate
                                        camera-controls={false}
                                        interaction-prompt="none"
                                        style={{ width: '150%', height: '150%' }}
                                    />
                                ) : (
                                    <img src={plant.imageUrl} alt={plant.name} className="w-full h-full object-cover" />
                                )}
                            </div>
                            <h3 className="text-xl font-bold text-forest text-center mb-1">{plant.name}</h3>
                            <p className="text-forest/60 text-sm mb-6">{plant.tag || 'Planta de interior'}</p>

                            <div className="w-full bg-white rounded-2xl p-4 shadow-sm border border-sage/10">
                                <div className="flex justify-between text-sm text-forest mb-2">
                                    <span>Subtotal</span>
                                    <span className="font-bold">${plant.price?.toFixed(2) || '25.00'}</span>
                                </div>
                                <div className="flex justify-between text-sm text-forest mb-2">
                                    <span>Envío</span>
                                    <span className="text-sage font-bold">Gratis</span>
                                </div>
                                <div className="border-t border-sage/20 my-2 pt-2 flex justify-between font-bold text-forest text-lg">
                                    <span>Total</span>
                                    <span>${plant.price?.toFixed(2) || '25.00'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Right Side: Flow */}
                        <div className="p-8 flex-1 flex flex-col overflow-y-auto">
                            <div className="flex justify-end mb-4">
                                <button onClick={handleClose} className="p-2 bg-white/50 hover:bg-sage/20 rounded-full text-forest/70 hover:text-forest transition-colors">
                                    <X size={20} />
                                </button>
                            </div>

                            {step === 1 && (
                                <form onSubmit={(e) => { e.preventDefault(); setStep(2); }} className="flex-1 flex flex-col">
                                    <h2 className="text-2xl font-bold text-forest mb-6 flex items-center gap-2">
                                        <Truck className="text-sage" /> Detalles de Envío
                                    </h2>

                                    <div className="space-y-4 flex-1">
                                        <div>
                                            <label className="block text-sm font-bold text-forest/70 mb-2">Dirección Completa</label>
                                            <input
                                                required
                                                type="text"
                                                autoFocus
                                                value={address}
                                                onChange={e => setAddress(e.target.value)}
                                                placeholder="Calle Falsa 123, Ciudad"
                                                className="w-full bg-white/60 border border-sage/30 rounded-xl py-3 px-4 text-forest focus:ring-2 focus:ring-sage focus:outline-none"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-bold text-forest/70 mb-2">Ciudad</label>
                                                <input required type="text" className="w-full bg-white/60 border border-sage/30 rounded-xl py-3 px-4 text-forest focus:ring-2 focus:ring-sage focus:outline-none" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-forest/70 mb-2">Código Postal</label>
                                                <input required type="text" className="w-full bg-white/60 border border-sage/30 rounded-xl py-3 px-4 text-forest focus:ring-2 focus:ring-sage focus:outline-none" />
                                            </div>
                                        </div>
                                    </div>

                                    <button type="submit" className="w-full bg-forest text-white py-4 rounded-xl font-bold mt-6 hover:bg-[#1A251B] transition-colors shadow-lg">
                                        Continuar al Pago
                                    </button>
                                </form>
                            )}

                            {step === 2 && (
                                <form onSubmit={handleCheckout} className="flex-1 flex flex-col">
                                    <button type="button" onClick={() => setStep(1)} className="text-sm font-bold text-sage mb-4 self-start hover:text-forest transition-colors">
                                        ← Volver al Envío
                                    </button>
                                    <h2 className="text-2xl font-bold text-forest mb-6 flex items-center gap-2">
                                        <CreditCard className="text-sage" /> Pago Seguro
                                    </h2>

                                    {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4">{error}</div>}

                                    <div className="space-y-4 flex-1">
                                        <div className="bg-white/80 border border-sage/30 rounded-2xl p-4 flex items-center justify-between cursor-pointer border-sage shadow-sm">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-forest/10 rounded-full flex items-center justify-center">
                                                    <CreditCard size={16} className="text-forest" />
                                                </div>
                                                <span className="font-bold text-forest">Tarjeta de Crédito</span>
                                            </div>
                                            <div className="w-5 h-5 rounded-full border-4 border-sage bg-white"></div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-forest/70 mb-2">Número de Tarjeta</label>
                                            <input
                                                required
                                                type="text"
                                                autoFocus
                                                value={card}
                                                onChange={e => setCard(e.target.value)}
                                                placeholder="0000 0000 0000 0000"
                                                maxLength={19}
                                                className="w-full bg-white/60 border border-sage/30 rounded-xl py-3 px-4 text-forest font-mono tracking-widest focus:ring-2 focus:ring-sage focus:outline-none"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-bold text-forest/70 mb-2">Vencimiento</label>
                                                <input required type="text" placeholder="MM/YY" className="w-full bg-white/60 border border-sage/30 rounded-xl py-3 px-4 text-forest focus:ring-2 focus:ring-sage focus:outline-none" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-forest/70 mb-2">CVC</label>
                                                <input required type="password" placeholder="•••" maxLength={3} className="w-full bg-white/60 border border-sage/30 rounded-xl py-3 px-4 text-forest focus:ring-2 focus:ring-sage focus:outline-none" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 mt-4 text-xs text-forest/50 justify-center">
                                        <ShieldCheck size={14} /> Transacción encriptada y segura
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-forest text-white py-4 rounded-xl font-bold mt-4 hover:bg-[#1A251B] transition-colors shadow-lg disabled:opacity-50"
                                    >
                                        {loading ? 'Procesando...' : `Pagar $${plant.price?.toFixed(2) || '25.00'}`}
                                    </button>
                                </form>
                            )}

                            {step === 3 && (
                                <motion.div
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="flex-1 flex flex-col items-center justify-center text-center"
                                >
                                    <div className="w-24 h-24 bg-sage text-white rounded-full flex items-center justify-center mb-6 shadow-lg shadow-sage/30">
                                        <Leaf size={40} className="drop-shadow-sm" />
                                    </div>
                                    <h2 className="text-3xl font-black text-forest mb-2 tracking-tight">¡Adopción Exitosa!</h2>
                                    <p className="text-forest/70 max-w-sm mb-8">
                                        Tu nueva <strong>{plant.name}</strong> está en camino a tu hogar. Ya puedes verla en <strong>Mi Selva</strong>.
                                    </p>
                                    <button onClick={handleClose} className="bg-bone text-forest border border-sage/30 font-bold py-3 px-8 rounded-xl hover:bg-white transition-colors">
                                        Volver al Catálogo
                                    </button>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
