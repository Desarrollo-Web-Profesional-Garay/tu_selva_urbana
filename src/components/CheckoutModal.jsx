import { useState, useContext, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, Truck, ShieldCheck, Leaf, MapPin, CheckCircle2, Package } from 'lucide-react';
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { GlobalContext } from '../context/GlobalContext';
import { ordersAPI } from '../services/api';

// Componente de confetti de hojas
function Confetti() {
    const pieces = Array.from({ length: 24 });
    const emojis = ['🌿', '🍃', '🌱', '✨', '🌸', '🍀'];
    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {pieces.map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute text-xl select-none"
                    initial={{
                        x: `${Math.random() * 100}vw`,
                        y: -40,
                        opacity: 1,
                        rotate: Math.random() * 360,
                        scale: 0.6 + Math.random() * 0.8,
                    }}
                    animate={{
                        y: '110vh',
                        rotate: Math.random() * 720 - 360,
                        opacity: [1, 1, 0],
                    }}
                    transition={{
                        duration: 2.5 + Math.random() * 2,
                        delay: Math.random() * 1.5,
                        ease: 'easeIn',
                    }}
                >
                    {emojis[i % emojis.length]}
                </motion.div>
            ))}
        </div>
    );
}

// Mini-mapa visual de entrega (simulado en CSS)
function DeliveryMap({ address }) {
    return (
        <div className="w-full rounded-2xl overflow-hidden border border-sage/20 shadow-sm bg-gradient-to-br from-[#e8f5e9] to-[#c8e6c9] relative" style={{ height: '160px' }}>
            {/* Grid de fondo estilo mapa */}
            <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
                        <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#2C3E2D" strokeWidth="0.5"/>
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>

            {/* Carreteras simuladas */}
            <svg className="absolute inset-0 w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
                <line x1="0" y1="80" x2="100%" y2="80" stroke="#4CAF50" strokeWidth="6" strokeLinecap="round"/>
                <line x1="200" y1="0" x2="200" y2="100%" stroke="#4CAF50" strokeWidth="4" strokeLinecap="round"/>
                <line x1="400" y1="0" x2="400" y2="100%" stroke="#4CAF50" strokeWidth="3" strokeLinecap="round"/>
            </svg>

            {/* Punto origen */}
            <div className="absolute left-6 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1">
                <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="w-8 h-8 bg-sage rounded-full border-4 border-white shadow-lg flex items-center justify-center"
                >
                    <Leaf size={14} className="text-white" />
                </motion.div>
                <span className="text-[10px] font-black text-forest bg-white/80 px-2 py-0.5 rounded-full shadow-sm">Vivero</span>
            </div>

            {/* Camión animado */}
            <motion.div
                initial={{ left: '15%' }}
                animate={{ left: '50%' }}
                transition={{ duration: 3, ease: 'easeInOut', repeat: Infinity, repeatType: 'reverse', repeatDelay: 1 }}
                className="absolute top-1/2 -translate-y-1/2 text-2xl"
                style={{ position: 'absolute' }}
            >
                🚚
            </motion.div>

            {/* Línea punteada */}
            <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <line x1="15%" y1="50%" x2="85%" y2="50%" stroke="#2C3E2D" strokeWidth="2" strokeDasharray="8,6" opacity="0.4"/>
            </svg>

            {/* Punto destino */}
            <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1">
                <motion.div
                    animate={{ y: [0, -4, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="w-8 h-8 bg-terra/80 rounded-full border-4 border-white shadow-lg flex items-center justify-center"
                >
                    <MapPin size={14} className="text-white" />
                </motion.div>
                <span className="text-[10px] font-black text-forest bg-white/80 px-2 py-0.5 rounded-full shadow-sm max-w-[80px] truncate">
                    {address ? address.split(',')[0] : 'Tu hogar'}
                </span>
            </div>
        </div>
    );
}

// Componente de paso de método de pago
function PaymentMethodSelector({ method, setMethod }) {
    return (
        <div className="grid grid-cols-2 gap-3 mb-4">
            <button
                type="button"
                onClick={() => setMethod('card')}
                className={`flex items-center gap-2 p-3 rounded-xl border-2 font-bold text-sm transition-all ${
                    method === 'card'
                        ? 'border-sage bg-sage/10 text-forest shadow'
                        : 'border-sage/20 bg-white/50 text-forest/60 hover:border-sage/50'
                }`}
            >
                <CreditCard size={18} /> Tarjeta
            </button>
            <button
                type="button"
                onClick={() => setMethod('paypal')}
                className={`flex items-center justify-center p-3 rounded-xl border-2 font-bold text-sm transition-all ${
                    method === 'paypal'
                        ? 'border-[#003087] bg-[#003087]/5 text-[#003087] shadow'
                        : 'border-sage/20 bg-white/50 text-forest/60 hover:border-[#009cde]/50'
                }`}
            >
                <span className="font-black">Pay</span>
                <span className="font-black text-[#009cde]">Pal</span>
            </button>
        </div>
    );
}

// Hook para reproducir sonido de éxito
function useSuccessSound() {
    const audioRef = useRef(null);

    const playSound = () => {
        try {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            const ctx = new AudioCtx();
            // Acorde de éxito: C-E-G en secuencia
            const notes = [523.25, 659.25, 783.99, 1046.5];
            notes.forEach((freq, i) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.frequency.value = freq;
                osc.type = 'sine';
                gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.12);
                gain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + i * 0.12 + 0.05);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.12 + 0.4);
                osc.start(ctx.currentTime + i * 0.12);
                osc.stop(ctx.currentTime + i * 0.12 + 0.4);
            });
        } catch (e) {
            // Silencioso si no hay soporte
        }
    };

    return { playSound };
}

export default function CheckoutModal({ isOpen, onClose, plant, cartItems, initialQuantity = 1 }) {
    const { adoptPlant, clearCart } = useContext(GlobalContext);
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('card');
    const { playSound } = useSuccessSound();

    const [addressStreet, setAddressStreet] = useState('');
    const [addressCity, setAddressCity] = useState('');
    const [addressZip, setAddressZip] = useState('');
    const [card, setCard] = useState('');

    const [{ isPending }] = usePayPalScriptReducer();

    const fullAddress = [addressStreet, addressCity, addressZip].filter(Boolean).join(', ');

    // Construir lista de items
    const orderItems = cartItems && cartItems.length > 0
        ? cartItems.map(item => ({ plantId: item.plant.id, quantity: item.quantity, price: item.plant.price }))
        : plant ? [{ plantId: plant.id, quantity: initialQuantity, price: plant.price || 25 }] : [];

    const orderTotal = orderItems.reduce((s, i) => s + i.price * i.quantity, 0);
    const displayPlant = plant || (cartItems && cartItems.length > 0 ? cartItems[0].plant : null);

    if (!displayPlant && (!cartItems || cartItems.length === 0)) return null;

    const procesarOrden = async (method) => {
        try {
            await ordersAPI.create(orderItems, fullAddress, method);
            // Adoptar cada planta del carrito
            if (cartItems && cartItems.length > 0) {
                for (const item of cartItems) await adoptPlant(item.plant);
                clearCart();
            } else if (plant) {
                await adoptPlant(plant);
            }
            playSound();
            setStep(3);
        } catch (err) {
            setError('Error al procesar el pago. Intenta de nuevo.');
        }
    };

    const handleCardCheckout = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        await procesarOrden('tarjeta');
        setLoading(false);
    };

    const handleClose = () => {
        setStep(1);
        setAddressStreet('');
        setAddressCity('');
        setAddressZip('');
        setCard('');
        setError('');
        setPaymentMethod('card');
        onClose();
    };

    const displayTotal = orderTotal.toFixed(2);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={step < 3 ? handleClose : undefined}
                        className="absolute inset-0 bg-forest/60 backdrop-blur-sm"
                    />

                    {/* Confetti en éxito */}
                    {step === 3 && <Confetti />}

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-2xl bg-bone/95 backdrop-blur-2xl border border-sage/30 rounded-[32px] shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[92vh]"
                    >
                        {/* Panel izquierdo: resumen de la planta (oculto en éxito) */}
                        {step < 3 && (
                            <div className="bg-white/50 border-r border-sage/20 p-8 flex flex-col items-center justify-center md:w-5/12 hidden md:flex flex-shrink-0">
                                <div className="w-44 h-44 rounded-full bg-gradient-to-t from-bone to-sage/20 flex items-center justify-center mb-5 border-4 border-white shadow-lg overflow-hidden">
                                    {displayPlant.modelUrl ? (
                                        <model-viewer
                                            src={displayPlant.modelUrl}
                                            auto-rotate
                                            camera-controls={false}
                                            interaction-prompt="none"
                                            style={{ width: '150%', height: '150%' }}
                                        />
                                    ) : (
                                        <img src={displayPlant.imageUrl} alt={displayPlant.name} className="w-full h-full object-cover" />
                                    )}
                                </div>
                                <h3 className="text-xl font-bold text-forest text-center mb-1">
                                    {cartItems && cartItems.length > 1 ? `${displayPlant.name} y más...` : displayPlant.name}
                                </h3>
                                <p className="text-forest/60 text-sm mb-5">{displayPlant.tag || 'Planta de interior'}</p>

                                <div className="w-full bg-white rounded-2xl p-4 shadow-sm border border-sage/10 space-y-2">
                                    <div className="flex justify-between text-sm text-forest">
                                        <span>Subtotal</span>
                                        <span className="font-bold">${displayTotal} MXN</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-forest">
                                        <span>Envío</span>
                                        <span className="text-sage font-bold">Gratis</span>
                                    </div>
                                    <div className="border-t border-sage/20 pt-2 flex justify-between font-bold text-forest text-lg">
                                        <span>Total</span>
                                        <span>${displayTotal} MXN</span>
                                    </div>
                                </div>

                                <div className="mt-4 flex items-center gap-2 text-xs text-forest/40">
                                    <ShieldCheck size={14} /> Pago 100% seguro
                                </div>
                            </div>
                        )}

                        {/* Panel derecho: flujo */}
                        <div className={`flex-1 flex flex-col overflow-y-auto ${step === 3 ? 'w-full' : ''}`}>
                            {/* Header */}
                            <div className="flex justify-between items-center p-6 pb-0">
                                {step < 3 && (
                                    <div className="flex items-center gap-2">
                                        {[1, 2].map(s => (
                                            <div key={s} className={`w-2 h-2 rounded-full transition-colors ${step >= s ? 'bg-sage' : 'bg-sage/20'}`} />
                                        ))}
                                        <span className="text-xs text-forest/50 font-bold ml-1">
                                            Paso {step} de 2
                                        </span>
                                    </div>
                                )}
                                {step < 3 ? (
                                    <button onClick={handleClose} className="ml-auto p-2 bg-white/50 hover:bg-sage/20 rounded-full text-forest/70 hover:text-forest transition-colors">
                                        <X size={20} />
                                    </button>
                                ) : (
                                    <div className="w-full" />
                                )}
                            </div>

                            <div className="p-6 pt-4 flex-1 flex flex-col">

                                {/* STEP 1: Envío */}
                                {step === 1 && (
                                    <motion.form
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        onSubmit={(e) => { e.preventDefault(); setStep(2); }}
                                        className="flex-1 flex flex-col"
                                    >
                                        <h2 className="text-2xl font-bold text-forest mb-1 flex items-center gap-2">
                                            <Truck size={22} className="text-sage" /> Detalles de Envío
                                        </h2>
                                        <p className="text-sm text-forest/50 mb-6">¿A dónde llevamos tu nueva compañera?</p>

                                        <div className="space-y-4 flex-1">
                                            <div>
                                                <label className="block text-sm font-bold text-forest/70 mb-2">Calle y número</label>
                                                <input
                                                    required
                                                    type="text"
                                                    autoFocus
                                                    value={addressStreet}
                                                    onChange={e => setAddressStreet(e.target.value)}
                                                    placeholder="Av. Naturaleza 456, Col. Verde"
                                                    className="w-full bg-white/70 border border-sage/30 rounded-xl py-3 px-4 text-forest focus:ring-2 focus:ring-sage focus:outline-none transition-all"
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <label className="block text-sm font-bold text-forest/70 mb-2">Ciudad</label>
                                                    <input
                                                        required
                                                        type="text"
                                                        value={addressCity}
                                                        onChange={e => setAddressCity(e.target.value)}
                                                        placeholder="Ciudad de México"
                                                        className="w-full bg-white/70 border border-sage/30 rounded-xl py-3 px-4 text-forest focus:ring-2 focus:ring-sage focus:outline-none transition-all"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-bold text-forest/70 mb-2">Código Postal</label>
                                                    <input
                                                        required
                                                        type="text"
                                                        value={addressZip}
                                                        onChange={e => setAddressZip(e.target.value)}
                                                        placeholder="06600"
                                                        maxLength={5}
                                                        className="w-full bg-white/70 border border-sage/30 rounded-xl py-3 px-4 text-forest focus:ring-2 focus:ring-sage focus:outline-none transition-all"
                                                    />
                                                </div>
                                            </div>

                                            {/* Mini mapa visual */}
                                            {addressStreet && (
                                                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                                                    <DeliveryMap address={fullAddress} />
                                                </motion.div>
                                            )}
                                        </div>

                                        <button
                                            type="submit"
                                            className="w-full bg-forest text-white py-4 rounded-xl font-bold mt-5 hover:bg-[#1A251B] transition-colors shadow-lg shadow-forest/20 flex items-center justify-center gap-2"
                                        >
                                            <CreditCard size={18} /> Continuar al Pago
                                        </button>
                                    </motion.form>
                                )}

                                {/* STEP 2: Pago */}
                                {step === 2 && (
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="flex-1 flex flex-col"
                                    >
                                        <button type="button" onClick={() => setStep(1)} className="text-sm font-bold text-sage mb-4 self-start hover:text-forest transition-colors flex items-center gap-1">
                                            ← Volver al Envío
                                        </button>
                                        <h2 className="text-2xl font-bold text-forest mb-1 flex items-center gap-2">
                                            <ShieldCheck size={22} className="text-sage" /> Método de Pago
                                        </h2>
                                        <p className="text-sm text-forest/50 mb-4">Elige cómo prefieres pagar tu planta</p>

                                        {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-3 border border-red-100">{error}</div>}

                                        <PaymentMethodSelector method={paymentMethod} setMethod={setPaymentMethod} />

                                        {paymentMethod === 'card' && (
                                            <form onSubmit={handleCardCheckout} className="flex-1 flex flex-col gap-3">
                                                <div>
                                                    <label className="block text-sm font-bold text-forest/70 mb-2">Número de Tarjeta</label>
                                                    <input
                                                        required
                                                        type="text"
                                                        autoFocus
                                                        value={card}
                                                        onChange={e => setCard(e.target.value.replace(/\D/g, '').slice(0, 16).replace(/(\d{4})/g, '$1 ').trim())}
                                                        placeholder="0000 0000 0000 0000"
                                                        maxLength={19}
                                                        className="w-full bg-white/70 border border-sage/30 rounded-xl py-3 px-4 text-forest font-mono tracking-widest focus:ring-2 focus:ring-sage focus:outline-none"
                                                    />
                                                </div>
                                                <div className="grid grid-cols-2 gap-3">
                                                    <div>
                                                        <label className="block text-sm font-bold text-forest/70 mb-2">Vencimiento</label>
                                                        <input required type="text" placeholder="MM/YY" maxLength={5} className="w-full bg-white/70 border border-sage/30 rounded-xl py-3 px-4 text-forest focus:ring-2 focus:ring-sage focus:outline-none" />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-bold text-forest/70 mb-2">CVC</label>
                                                        <input required type="password" placeholder="•••" maxLength={3} className="w-full bg-white/70 border border-sage/30 rounded-xl py-3 px-4 text-forest focus:ring-2 focus:ring-sage focus:outline-none" />
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2 text-xs text-forest/40 justify-center mt-1">
                                                    <ShieldCheck size={13} /> Transacción encriptada SSL
                                                </div>

                                                <button
                                                    type="submit"
                                                    disabled={loading}
                                                    className="w-full bg-forest text-white py-4 rounded-xl font-bold mt-auto hover:bg-[#1A251B] transition-colors shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
                                                >
                                                    {loading ? (
                                                        <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Procesando...</span>
                                                    ) : (
                                                        <><CheckCircle2 size={18} /> Pagar ${price} MXN</>
                                                    )}
                                                </button>
                                            </form>
                                        )}

                                        {paymentMethod === 'paypal' && (
                                            <div className="flex-1 flex flex-col">
                                                <div className="bg-[#003087]/5 border border-[#003087]/20 rounded-2xl p-4 mb-4">
                                                    <p className="text-sm text-center text-[#003087] font-bold">
                                                        Serás redirigido a PayPal para completar tu pago de manera segura
                                                    </p>
                                                    <p className="text-xs text-center text-[#003087]/60 mt-1">
                                                        Total: ${price} MXN
                                                    </p>
                                                </div>

                                                {isPending ? (
                                                    <div className="flex justify-center py-6 text-forest/50 font-bold text-sm">
                                                        <span className="w-5 h-5 border-2 border-sage/40 border-t-sage rounded-full animate-spin mr-2" /> Cargando PayPal...
                                                    </div>
                                                ) : (
                                                    <PayPalButtons
                                                        style={{ layout: 'vertical', color: 'blue', shape: 'rect', label: 'pay' }}
                                                        createOrder={(data, actions) => {
                                                            return actions.order.create({
                                                                purchase_units: [{
                                                                    amount: {
                                                                        value: displayTotal,
                                                                        currency_code: 'MXN',
                                                                    },
                                                                    description: `Tu Selva Urbana: ${cartItems && cartItems.length > 1 ? 'Pedido Múltiple' : displayPlant.name}`,
                                                                }],
                                                            });
                                                        }}
                                                        onApprove={async (data, actions) => {
                                                            await actions.order.capture();
                                                            setLoading(true);
                                                            await procesarOrden('paypal');
                                                            setLoading(false);
                                                        }}
                                                        onError={(err) => {
                                                            setError('Hubo un problema con PayPal. Intenta con tarjeta.');
                                                        }}
                                                    />
                                                )}
                                            </div>
                                        )}
                                    </motion.div>
                                )}

                                {/* STEP 3: Éxito + Tracking */}
                                {step === 3 && (
                                    <motion.div
                                        initial={{ scale: 0.9, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                                        className="flex-1 flex flex-col items-center justify-center text-center px-4 py-8"
                                    >
                                        {/* Ícono de éxito animado */}
                                        <motion.div
                                            initial={{ scale: 0, rotate: -180 }}
                                            animate={{ scale: 1, rotate: 0 }}
                                            transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.1 }}
                                            className="w-24 h-24 rounded-full bg-gradient-to-br from-sage to-[#5a9e6f] flex items-center justify-center mb-6 shadow-xl shadow-sage/40"
                                        >
                                            <CheckCircle2 size={48} className="text-white drop-shadow" />
                                        </motion.div>

                                        <motion.h2
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.3 }}
                                            className="text-3xl font-black text-forest mb-1 tracking-tight"
                                        >
                                            ¡Adopción Exitosa! 🌿
                                        </motion.h2>

                                        <motion.p
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.4 }}
                                            className="text-forest/70 max-w-sm mb-6"
                                        >
                                            {cartItems && cartItems.length > 1 ? (
                                                <>Tus plantas están siendo preparadas con cuidado en nuestro vivero.<br/>Con amor, estarán en tu hogar pronto. 🚚</>
                                            ) : (
                                                <>Tu <strong>{displayPlant.name}</strong> está siendo preparada con cuidado en nuestro vivero.<br/>Con amor, estará en tu hogar pronto. 🚚</>
                                            )}
                                        </motion.p>

                                        {/* Resumen de orden */}
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.5 }}
                                            className="w-full max-w-sm bg-white/80 rounded-2xl border border-sage/20 p-4 mb-5 text-left shadow-sm"
                                        >
                                            <div className="flex items-center gap-3 mb-3 pb-3 border-b border-sage/10">
                                                <img src={displayPlant.imageUrl} alt={displayPlant.name} className="w-12 h-12 rounded-xl object-cover border border-sage/20" />
                                                <div>
                                                    <div className="font-bold text-forest text-sm">
                                                        {cartItems && cartItems.length > 1 ? 'Pedido Múltiple' : displayPlant.name}
                                                    </div>
                                                    <div className="text-xs text-forest/50">Envío Estándar</div>
                                                </div>
                                            </div>
                                            <div className="flex justify-between text-forest/70 text-sm mb-1">
                                                <span>Total Pagado</span>
                                                <span className="font-bold text-forest">${displayTotal} MXN</span>
                                            </div>
                                            <div className="flex justify-between text-forest/70 text-sm">
                                                <span>Método</span>
                                                <span className="capitalize">{paymentMethod}</span>
                                            </div>
                                        </motion.div>

                                        {/* Mini mapa de tracking */}
                                        {fullAddress && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.6 }}
                                                className="w-full max-w-sm mb-6"
                                            >
                                                <DeliveryMap address={fullAddress} />
                                                <p className="text-xs text-forest/40 mt-2 text-center">
                                                    🚚 Tu planta ya está en camino desde nuestro vivero en CDMX
                                                </p>
                                            </motion.div>
                                        )}

                                        {/* Pasos de tracking */}
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.7 }}
                                            className="flex items-center gap-1 text-xs text-forest/60 mb-6 w-full max-w-sm justify-between"
                                        >
                                            {[
                                                { icon: '📦', label: 'Preparando' },
                                                { icon: '🚚', label: 'En tránsito' },
                                                { icon: '🏙️', label: 'Tu ciudad' },
                                                { icon: '🏠', label: 'Entregado' },
                                            ].map((s, i) => (
                                                <div key={i} className="flex flex-col items-center gap-1">
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm border-2 ${i <= 1 ? 'border-sage bg-sage/10' : 'border-sage/20 bg-white/50'}`}>
                                                        {s.icon}
                                                    </div>
                                                    <span className={`text-[10px] font-bold ${i <= 1 ? 'text-forest' : 'text-forest/30'}`}>{s.label}</span>
                                                    {i < 3 && <div className={`absolute hidden`} />}
                                                </div>
                                            ))}
                                        </motion.div>

                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.8 }}
                                            className="flex gap-3 w-full max-w-sm"
                                        >
                                            <button
                                                onClick={handleClose}
                                                className="flex-1 bg-bone text-forest border border-sage/30 font-bold py-3 px-4 rounded-xl hover:bg-white transition-colors text-sm"
                                            >
                                                Volver al Catálogo
                                            </button>
                                            <button
                                                onClick={() => { handleClose(); window.location.hash = '#/account'; }}
                                                className="flex-1 bg-forest text-white font-bold py-3 px-4 rounded-xl hover:bg-[#1A251B] transition-colors text-sm flex items-center justify-center gap-1"
                                            >
                                                <Package size={14} /> Mis Pedidos
                                            </button>
                                        </motion.div>
                                    </motion.div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
