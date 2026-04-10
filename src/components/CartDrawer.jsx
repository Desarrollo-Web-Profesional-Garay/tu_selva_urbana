import { useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Trash2, Plus, Minus, ShoppingCart, Leaf, ArrowRight } from 'lucide-react';
import { GlobalContext } from '../context/GlobalContext';
import CheckoutModal from './CheckoutModal';
import { useState } from 'react';

export default function CartDrawer() {
    const {
        cart, removeFromCart, updateQty, clearCart,
        cartCount, cartTotal, isCartOpen, setIsCartOpen
    } = useContext(GlobalContext);

    const [checkoutOpen, setCheckoutOpen] = useState(false);

    return (
        <>
            {/* Overlay */}
            <AnimatePresence>
                {isCartOpen && (
                    <motion.div
                        key="overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsCartOpen(false)}
                        className="fixed inset-0 bg-forest/30 backdrop-blur-sm z-[150]"
                    />
                )}
            </AnimatePresence>

            {/* Drawer */}
            <AnimatePresence>
                {isCartOpen && (
                    <motion.aside
                        key="drawer"
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        className="fixed top-0 right-0 h-full w-full max-w-[400px] bg-bone z-[160] flex flex-col shadow-2xl shadow-forest/20"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-5 bg-white border-b border-sage/20">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 bg-forest rounded-xl flex items-center justify-center">
                                    <ShoppingCart size={18} className="text-white" />
                                </div>
                                <div>
                                    <h2 className="font-black text-forest text-lg leading-none">Tu Carrito</h2>
                                    <p className="text-xs text-forest/50 mt-0.5">
                                        {cartCount === 0 ? 'Vacío' : `${cartCount} ${cartCount === 1 ? 'planta' : 'plantas'}`}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsCartOpen(false)}
                                className="p-2 rounded-full hover:bg-bone text-forest/50 hover:text-forest transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Contenido */}
                        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                            {cart.length === 0 ? (
                                // Estado vacío
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex flex-col items-center justify-center h-full pb-20 text-center"
                                >
                                    <div className="w-24 h-24 bg-sage/10 rounded-full flex items-center justify-center mb-6">
                                        <Leaf size={40} className="text-sage/50" />
                                    </div>
                                    <h3 className="font-black text-forest text-xl mb-2">Tu selva está vacía</h3>
                                    <p className="text-forest/50 text-sm max-w-[200px] leading-relaxed mb-6">
                                        Explora el catálogo y agrega tus plantas favoritas aquí.
                                    </p>
                                    <motion.button
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.97 }}
                                        onClick={() => {
                                            setIsCartOpen(false);
                                            window.location.href = '/catalogo';
                                        }}
                                        className="bg-forest text-white px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg shadow-forest/20"
                                    >
                                        <ShoppingBag size={16} /> Explorar Catálogo
                                    </motion.button>
                                </motion.div>
                            ) : (
                                <>
                                    {/* Lista de items */}
                                    <AnimatePresence initial={false}>
                                        {cart.filter(item => item?.plant?.id).map((item) => {
                                            const price = parseFloat(item.plant?.price) || 0;
                                            return (
                                            <motion.div
                                                key={item.plant.id}
                                                layout
                                                initial={{ opacity: 0, x: 40 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: 40, scale: 0.9 }}
                                                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                                                className="bg-white rounded-2xl p-4 flex gap-4 shadow-sm border border-sage/10 items-center"
                                            >
                                                {/* Imagen */}
                                                <div className="w-16 h-16 rounded-xl overflow-hidden bg-bone flex-shrink-0">
                                                    <img
                                                        src={item.plant.imageUrl}
                                                        alt={item.plant.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>

                                                {/* Info */}
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-bold text-forest text-sm truncate">{item.plant.name}</p>
                                                    <p className="text-forest/50 text-xs mb-2">${price.toFixed(2)} MXN c/u</p>

                                                    {/* Control de cantidad */}
                                                    <div className="flex items-center gap-2">
                                                        <motion.button
                                                            whileTap={{ scale: 0.9 }}
                                                            onClick={() => updateQty(item.plant.id, item.quantity - 1)}
                                                            className="w-7 h-7 rounded-full bg-bone border border-sage/20 flex items-center justify-center text-forest hover:bg-red-50 hover:border-red-200 hover:text-red-500 transition-colors"
                                                        >
                                                            <Minus size={12} />
                                                        </motion.button>
                                                        <span className="w-8 text-center font-black text-forest text-sm">
                                                            {item.quantity}
                                                        </span>
                                                        <motion.button
                                                            whileTap={{ scale: 0.9 }}
                                                            onClick={() => updateQty(item.plant.id, item.quantity + 1)}
                                                            className="w-7 h-7 rounded-full bg-bone border border-sage/20 flex items-center justify-center text-forest hover:bg-sage/20 hover:border-sage/40 transition-colors"
                                                        >
                                                            <Plus size={12} />
                                                        </motion.button>
                                                    </div>
                                                </div>

                                                {/* Precio total del item + quitar */}
                                                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                                                    <p className="font-black text-forest text-sm">
                                                        ${(price * item.quantity).toFixed(2)}
                                                    </p>
                                                    <motion.button
                                                        whileTap={{ scale: 0.9 }}
                                                        onClick={() => removeFromCart(item.plant.id)}
                                                        className="p-1.5 rounded-full text-forest/30 hover:text-red-500 hover:bg-red-50 transition-colors"
                                                    >
                                                        <Trash2 size={14} />
                                                    </motion.button>
                                                </div>
                                            </motion.div>
                                            );
                                        })}
                                    </AnimatePresence>

                                    {/* Botón limpiar carrito */}
                                    <button
                                        onClick={clearCart}
                                        className="w-full text-xs text-forest/40 hover:text-red-500 transition-colors py-2 font-bold"
                                    >
                                        Vaciar carrito
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Footer con Total y Checkout */}
                        {cart.length > 0 && (
                            <div className="px-5 py-5 bg-white border-t border-sage/20 space-y-3">
                                {/* Desglose */}
                                <div className="space-y-1.5">
                                    <div className="flex justify-between text-sm text-forest/60">
                                        <span>Subtotal ({cartCount} {cartCount === 1 ? 'planta' : 'plantas'})</span>
                                        <span className="font-bold">${cartTotal.toFixed(2)} MXN</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-forest/60">
                                        <span>Envío estimado</span>
                                        <span className="font-bold text-sage">Gratis 🌿</span>
                                    </div>
                                    <div className="h-px bg-sage/10 my-2" />
                                    <div className="flex justify-between font-black text-forest text-lg">
                                        <span>Total</span>
                                        <span>${cartTotal.toFixed(2)} MXN</span>
                                    </div>
                                </div>

                                {/* Botón Checkout */}
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setCheckoutOpen(true)}
                                    className="w-full bg-gradient-to-r from-forest to-[#4A7C59] text-white py-4 rounded-2xl font-black text-base flex items-center justify-center gap-2 shadow-xl shadow-forest/25"
                                >
                                    Proceder al Pago <ArrowRight size={18} />
                                </motion.button>

                                <p className="text-center text-[11px] text-forest/40 flex items-center justify-center gap-1">
                                    🔒 Pago seguro y cifrado
                                </p>
                            </div>
                        )}
                    </motion.aside>
                )}
            </AnimatePresence>

            {/* Checkout Modal — recibe el carrito completo */}
            <CheckoutModal
                isOpen={checkoutOpen}
                onClose={() => setCheckoutOpen(false)}
                cartItems={cart}
            />
        </>
    );
}
