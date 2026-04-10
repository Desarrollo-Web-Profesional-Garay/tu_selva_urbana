import { motion } from 'framer-motion';
import { Truck, MapPin, Package, CheckCircle2, Loader } from 'lucide-react';

// Calcula el progreso simulado basado en cuándo se creó la orden
function getTrackingState(createdAt) {
    if (!createdAt) return { step: 0, percent: '10%' };
    const now = new Date();
    const created = new Date(createdAt);
    const diffMinutes = (now - created) / 1000 / 60;

    // Simular que:
    // < 5 min: preparando (10%)
    // 5-15 min: en tránsito (40%)
    // 15-30 min: en tu ciudad (70%)
    // > 30 min: entregado (100%)
    if (diffMinutes < 5) return { step: 0, percent: '10%', label: 'Preparando pedido' };
    if (diffMinutes < 15) return { step: 1, percent: '42%', label: 'En tránsito' };
    if (diffMinutes < 30) return { step: 2, percent: '74%', label: 'En tu zona' };
    return { step: 3, percent: '100%', label: 'Entregado 🎉' };
}

const STEPS = [
    { icon: '📦', label: 'Preparando', desc: 'Vivero CDMX' },
    { icon: '🚚', label: 'En tránsito', desc: 'Saliendo...' },
    { icon: '🏙️', label: 'Tu zona', desc: 'Llegando...' },
    { icon: '🏠', label: 'Entregado', desc: 'En tu hogar' },
];

export default function OrderTracker({ order }) {
    const { step, percent, label } = getTrackingState(order?.createdAt);
    const isDelivered = step === 3;

    return (
        <div className="w-full bg-white/60 backdrop-blur-md rounded-[24px] border border-sage/20 p-5 mt-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h4 className="font-bold text-forest text-sm flex items-center gap-2">
                    <Truck size={16} className="text-sage" /> Seguimiento del Envío
                </h4>
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                    isDelivered
                        ? 'bg-sage/20 text-sage'
                        : 'bg-terra/10 text-terra'
                }`}>
                    {isDelivered ? '✅ Entregado' : '🚚 En camino'}
                </span>
            </div>

            {/* Barra de progreso */}
            <div className="relative mb-6">
                <div className="h-2 bg-bone rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: percent }}
                        transition={{ duration: 1.5, ease: 'easeOut' }}
                        className={`h-full rounded-full ${isDelivered ? 'bg-sage' : 'bg-gradient-to-r from-sage to-[#5a9e6f]'}`}
                    />
                </div>

                {/* Camión animado */}
                {!isDelivered && (
                    <motion.div
                        initial={{ left: '0%' }}
                        animate={{ left: percent }}
                        transition={{ duration: 1.5, ease: 'easeOut' }}
                        className="absolute -top-3 -translate-x-1/2 text-lg pointer-events-none"
                        style={{ position: 'absolute' }}
                    >
                        🚚
                    </motion.div>
                )}
            </div>

            {/* Pasos */}
            <div className="grid grid-cols-4 gap-1">
                {STEPS.map((s, i) => {
                    const done = i <= step;
                    const active = i === step;
                    return (
                        <div key={i} className="flex flex-col items-center text-center gap-1">
                            <motion.div
                                initial={{ scale: 0.8 }}
                                animate={{ scale: active ? [1, 1.15, 1] : 1 }}
                                transition={{ repeat: active ? Infinity : 0, duration: 1.5 }}
                                className={`w-9 h-9 rounded-full flex items-center justify-center text-base border-2 transition-colors ${
                                    done
                                        ? 'border-sage bg-sage/15'
                                        : 'border-sage/20 bg-white/50 opacity-40'
                                }`}
                            >
                                {done && i < step ? '✅' : s.icon}
                            </motion.div>
                            <span className={`text-[10px] font-bold leading-tight ${done ? 'text-forest' : 'text-forest/30'}`}>
                                {s.label}
                            </span>
                            <span className={`text-[9px] leading-tight ${done ? 'text-forest/50' : 'text-forest/20'}`}>
                                {s.desc}
                            </span>
                        </div>
                    );
                })}
            </div>

            {/* Dirección */}
            {order?.address && (
                <div className="mt-4 pt-4 border-t border-sage/10 flex items-center gap-2 text-xs text-forest/60">
                    <MapPin size={13} className="text-terra flex-shrink-0" />
                    <span>{order.address}</span>
                </div>
            )}

            {/* Método de pago */}
            {order?.paymentMethod && (
                <div className="text-xs text-forest/40 mt-1 pl-5">
                    Pagado con: <span className="font-bold capitalize">{order.paymentMethod === 'paypal' ? '🟡 PayPal' : '💳 Tarjeta'}</span>
                </div>
            )}
        </div>
    );
}
