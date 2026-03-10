import { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { GlobalContext } from '../context/GlobalContext';
import { Leaf, Mail, Lock, User, Eye, EyeOff, Sparkles } from 'lucide-react';

export default function Login() {
    const { login, register } = useContext(GlobalContext);
    const navigate = useNavigate();
    const [isRegister, setIsRegister] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const [loading, setLoading] = useState(false);

    const [error, setError] = useState('');
    const [registerSuccess, setRegisterSuccess] = useState(false);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setRegisterSuccess(false);

        if (isRegister) {
            const result = await register(form.name, form.email, form.password);
            setLoading(false);
            if (result.success) {
                // No auto-login: mostrar mensaje de éxito y cambiar a pestaña login
                setRegisterSuccess(true);
                setForm({ name: '', email: form.email, password: '' });
                setTimeout(() => {
                    setIsRegister(false);
                    setRegisterSuccess(false);
                }, 3000);
            } else {
                setError(result.error || 'Error al crear cuenta');
            }
        } else {
            const result = await login(form.email, form.password);
            setLoading(false);
            if (result.success) {
                navigate('/feed');
            } else {
                setError(result.error || 'Credenciales inválidas');
            }
        }
    };

    return (
        <div className="relative w-screen h-screen overflow-hidden">
            {/* ===== VIDEO BACKGROUND ===== */}
            <video
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 w-full h-full object-cover scale-105"
                src="/Video_realista_de_flores_con_viento.mp4"
            />

            {/* ===== OVERLAY OSCURO ===== */}
            <div className="absolute inset-0 bg-gradient-to-br from-forest/70 via-black/50 to-forest/60" />

            {/* ===== PARTÍCULAS DE BRILLO ===== */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {[...Array(6)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 rounded-full bg-white/30"
                        style={{ left: `${15 + i * 15}%`, top: `${20 + i * 10}%` }}
                        animate={{
                            y: [0, -40, 0],
                            opacity: [0, 0.8, 0],
                            scale: [0.5, 1.5, 0.5],
                        }}
                        transition={{
                            duration: 4 + i,
                            repeat: Infinity,
                            delay: i * 0.8,
                        }}
                    />
                ))}
            </div>

            {/* ===== CONTENIDO PRINCIPAL ===== */}
            <div className="relative z-10 flex items-center justify-center h-full px-4">
                <motion.div
                    initial={{ opacity: 0, y: 40, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="w-full max-w-md"
                >
                    {/* ===== CARD GLASSMORPHISM ===== */}
                    <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[32px] shadow-2xl shadow-black/30 p-8 md:p-10">

                        {/* LOGO / HEADER */}
                        <div className="text-center mb-8">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: 'spring', stiffness: 200, delay: 0.3 }}
                                className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-sage/30 backdrop-blur-lg border border-sage/40 mb-4"
                            >
                                <Leaf className="text-white" size={32} />
                            </motion.div>
                            <h1 className="text-3xl font-black text-white tracking-tight">
                                Tu Selva Urbana
                            </h1>
                            <p className="text-white/60 text-sm mt-1 font-medium">
                                {isRegister ? 'Crea tu cuenta y encuentra tu planta ideal' : 'Bienvenido de vuelta, plantlover 🌿'}
                            </p>
                        </div>

                        {/* TOGGLE TABS */}
                        <div className="flex bg-white/10 rounded-2xl p-1 mb-8">
                            <button
                                onClick={() => setIsRegister(false)}
                                className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${!isRegister ? 'bg-white/20 text-white shadow-lg' : 'text-white/50 hover:text-white/70'
                                    }`}
                            >
                                Iniciar Sesión
                            </button>
                            <button
                                onClick={() => setIsRegister(true)}
                                className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${isRegister ? 'bg-white/20 text-white shadow-lg' : 'text-white/50 hover:text-white/70'
                                    }`}
                            >
                                Crear Cuenta
                            </button>
                        </div>

                        {/* FORM */}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Success Alert */}
                            <AnimatePresence>
                                {registerSuccess && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        className="bg-green-500/20 border border-green-400/30 text-green-200 text-sm font-medium px-4 py-3 rounded-2xl text-center"
                                    >
                                        ✅ ¡Cuenta creada con éxito! Ahora inicia sesión.
                                    </motion.div>
                                )}
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        className="bg-red-500/20 border border-red-400/30 text-red-200 text-sm font-medium px-4 py-3 rounded-2xl text-center"
                                    >
                                        ❌ {error}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <AnimatePresence mode="wait">
                                {isRegister && (
                                    <motion.div
                                        key="name-field"
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <div className="relative group">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-sage transition-colors" size={18} />
                                            <input
                                                type="text"
                                                name="name"
                                                value={form.name}
                                                onChange={handleChange}
                                                required={isRegister}
                                                placeholder="Tu nombre"
                                                className="w-full bg-white/10 border border-white/15 rounded-2xl py-3.5 pl-12 pr-4 text-white placeholder-white/30 focus:outline-none focus:border-sage/60 focus:bg-white/15 transition-all duration-300 text-sm"
                                            />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-sage transition-colors" size={18} />
                                <input
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    required
                                    placeholder="tu@email.com"
                                    className="w-full bg-white/10 border border-white/15 rounded-2xl py-3.5 pl-12 pr-4 text-white placeholder-white/30 focus:outline-none focus:border-sage/60 focus:bg-white/15 transition-all duration-300 text-sm"
                                />
                            </div>

                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-sage transition-colors" size={18} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    required
                                    placeholder="Contraseña"
                                    className="w-full bg-white/10 border border-white/15 rounded-2xl py-3.5 pl-12 pr-12 text-white placeholder-white/30 focus:outline-none focus:border-sage/60 focus:bg-white/15 transition-all duration-300 text-sm"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>

                            {/* SUBMIT BUTTON */}
                            <motion.button
                                type="submit"
                                disabled={loading}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full py-4 rounded-2xl font-bold text-white text-base bg-gradient-to-r from-terra to-[#D36C52] hover:from-[#D36C52] hover:to-terra shadow-xl shadow-terra/30 transition-all duration-300 disabled:opacity-60 flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                                        className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                                    />
                                ) : (
                                    <>
                                        <Sparkles size={18} />
                                        {isRegister ? 'Crear mi cuenta' : 'Entrar a mi selva'}
                                    </>
                                )}
                            </motion.button>
                        </form>

                        {/* FOOTER LINK */}
                        <p className="text-center text-white/40 text-xs mt-6">
                            {isRegister ? '¿Ya tienes cuenta? ' : '¿Aún no tienes una cuenta? '}
                            <button
                                onClick={() => setIsRegister(!isRegister)}
                                className="text-sage hover:text-white font-bold transition-colors underline underline-offset-2"
                            >
                                {isRegister ? 'Inicia sesión' : 'Regístrate gratis'}
                            </button>
                        </p>
                    </div>

                    {/* BACK TO LANDING LINK */}
                    <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                        onClick={() => navigate('/')}
                        className="block mx-auto mt-6 text-white/40 hover:text-white text-sm font-medium transition-colors"
                    >
                        ← Volver al inicio
                    </motion.button>
                </motion.div>
            </div >
        </div >
    );
}
