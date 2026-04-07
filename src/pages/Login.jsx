import { useState, useContext, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { GlobalContext } from '../context/GlobalContext';
import { Leaf, Mail, Lock, User, Eye, EyeOff, Sparkles, Phone, ShieldCheck, RefreshCw } from 'lucide-react';
import { authAPI } from '../services/api';

// ─── Paso de verificación OTP: 6 inputs individuales ───
function OTPStep({ email, phone, onSuccess, onResend }) {
    const [digits, setDigits] = useState(['', '', '', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [resending, setResending] = useState(false);
    const [resent, setResent] = useState(false);
    const refs = useRef([]);

    const handleDigit = (i, val) => {
        if (!/^\d?$/.test(val)) return;
        const next = [...digits];
        next[i] = val;
        setDigits(next);
        if (val && i < 5) refs.current[i + 1]?.focus();
        if (!val && i > 0) refs.current[i - 1]?.focus();
    };

    const handleKeyDown = (i, e) => {
        if (e.key === 'Backspace' && !digits[i] && i > 0) {
            refs.current[i - 1]?.focus();
        }
    };

    const handlePaste = (e) => {
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        if (pasted.length === 6) {
            setDigits(pasted.split(''));
            refs.current[5]?.focus();
        }
    };

    const handleVerify = async () => {
        const code = digits.join('');
        if (code.length < 6) { setError('Ingresa los 6 dígitos'); return; }
        setLoading(true); setError('');
        try {
            const data = await authAPI.verifyEmail(email, code);
            onSuccess(data);
        } catch (err) {
            setError(err.message || 'Código incorrecto');
            setDigits(['', '', '', '', '', '']);
            refs.current[0]?.focus();
        }
        setLoading(false);
    };

    const handleResend = async () => {
        setResending(true);
        try {
            await authAPI.resendCode(email);
            setResent(true);
            setTimeout(() => setResent(false), 4000);
        } catch {}
        setResending(false);
    };

    return (
        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
            <div className="text-center">
                <div className="w-14 h-14 bg-sage/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <ShieldCheck size={28} className="text-white" />
                </div>
                <h3 className="text-white font-black text-xl mb-1">Verifica tu identidad</h3>
                <p className="text-white/60 text-sm">
                    Enviamos un código a <strong className="text-white">{email}</strong>
                    {phone && <><br />y al teléfono <strong className="text-white">{phone}</strong></>}
                </p>
            </div>

            {error && (
                <div className="bg-red-500/20 border border-red-400/30 text-red-200 text-sm px-4 py-2.5 rounded-xl text-center">
                    ❌ {error}
                </div>
            )}
            {resent && (
                <div className="bg-green-500/20 border border-green-400/30 text-green-200 text-sm px-4 py-2.5 rounded-xl text-center">
                    ✅ Código reenviado al email y SMS
                </div>
            )}

            {/* 6 inputs OTP */}
            <div className="flex justify-center gap-2.5" onPaste={handlePaste}>
                {digits.map((d, i) => (
                    <input
                        key={i}
                        ref={el => refs.current[i] = el}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={d}
                        onChange={e => handleDigit(i, e.target.value)}
                        onKeyDown={e => handleKeyDown(i, e)}
                        className="w-12 h-14 text-center text-2xl font-black bg-white/10 border-2 border-white/20 rounded-2xl text-white focus:border-sage focus:bg-white/20 focus:outline-none transition-all"
                        autoFocus={i === 0}
                    />
                ))}
            </div>

            <motion.button
                onClick={handleVerify}
                disabled={loading || digits.join('').length < 6}
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                className="w-full py-4 rounded-2xl font-bold text-white bg-gradient-to-r from-sage to-[#4a9e60] shadow-xl shadow-sage/20 disabled:opacity-50 flex items-center justify-center gap-2"
            >
                {loading ? (
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                    <><ShieldCheck size={18} /> Verificar y Entrar</>
                )}
            </motion.button>

            <button
                onClick={handleResend}
                disabled={resending}
                className="w-full text-center text-white/40 hover:text-white/70 text-xs font-medium transition-colors flex items-center justify-center gap-1.5"
            >
                <RefreshCw size={13} className={resending ? 'animate-spin' : ''} />
                {resending ? 'Reenviando...' : 'No lo recibí — Reenviar código'}
            </button>
        </motion.div>
    );
}

// ─── Paso de Forgot Password ───
function ForgotStep({ onBack }) {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); setError('');
        try {
            await authAPI.forgotPassword(email);
            setSent(true);
        } catch (err) {
            setError(err.message);
        }
        setLoading(false);
    };

    return (
        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <div className="text-center mb-2">
                <div className="text-4xl mb-2">🔑</div>
                <h3 className="text-white font-black text-xl mb-1">Recuperar Contraseña</h3>
                <p className="text-white/60 text-sm">Te enviaremos un enlace a tu correo</p>
            </div>

            {sent ? (
                <div className="bg-green-500/20 border border-green-400/30 text-green-200 text-sm px-4 py-4 rounded-xl text-center">
                    ✅ Si el email existe, recibirás el enlace de recuperación en tu correo.
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="bg-red-500/20 border border-red-400/30 text-red-200 text-sm px-4 py-2.5 rounded-xl text-center">❌ {error}</div>
                    )}
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                        <input
                            type="email" required value={email} onChange={e => setEmail(e.target.value)}
                            placeholder="tu@email.com"
                            className="w-full bg-white/10 border border-white/15 rounded-2xl py-3.5 pl-12 pr-4 text-white placeholder-white/30 focus:outline-none focus:border-sage/60 text-sm"
                        />
                    </div>
                    <button type="submit" disabled={loading}
                        className="w-full py-3.5 rounded-2xl font-bold text-white bg-terra/80 hover:bg-terra disabled:opacity-50 transition-colors"
                    >
                        {loading ? 'Enviando...' : 'Enviar enlace de recuperación'}
                    </button>
                </form>
            )}

            <button onClick={onBack} className="w-full text-center text-white/40 hover:text-white/60 text-xs font-medium transition-colors">
                ← Volver al inicio de sesión
            </button>
        </motion.div>
    );
}

// ─── COMPONENTE PRINCIPAL ───
export default function Login() {
    const { login, register } = useContext(GlobalContext);
    const navigate = useNavigate();
    const [mode, setMode] = useState('login'); // 'login' | 'register' | 'verify' | 'forgot'
    const [showPassword, setShowPassword] = useState(false);
    const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [pendingEmail, setPendingEmail] = useState('');
    const [pendingPhone, setPendingPhone] = useState('');

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); setError('');

        if (mode === 'register') {
            try {
                const data = await authAPI.register(form.name, form.email, form.password, form.phone);
                if (data.requiresVerification) {
                    setPendingEmail(form.email);
                    setPendingPhone(form.phone);
                    setMode('verify');
                }
            } catch (err) {
                setError(err.message || 'Error al crear cuenta');
            }
        } else {
            // Login directo — ya no hay usuarios sin verificar en la tabla User
            try {
                const result = await login(form.email, form.password);
                if (result.success) navigate('/feed');
                else setError(result.error || 'Credenciales inválidas');
            } catch (err) {
                setError(err.message || 'Credenciales inválidas');
            }
        }
        setLoading(false);
    };

    // Cuando verificación OTP tiene éxito — el backend devuelve token + user
    const onVerifySuccess = (data) => {
        localStorage.setItem('tsu_token', data.token);
        // Recargar para que el GlobalContext lea el token
        window.location.href = '/feed';
    };

    const isRegister = mode === 'register';

    return (
        <div className="relative w-screen h-screen overflow-hidden">
            {/* VIDEO BACKGROUND */}
            <video autoPlay muted loop playsInline
                className="absolute inset-0 w-full h-full object-cover scale-105"
                src="/video_SeedVR2_00003_.mp4"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-forest/70 via-black/50 to-forest/60" />

            {/* Partículas */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {[...Array(6)].map((_, i) => (
                    <motion.div key={i}
                        className="absolute w-1 h-1 rounded-full bg-white/30"
                        style={{ left: `${15 + i * 15}%`, top: `${20 + i * 10}%` }}
                        animate={{ y: [0, -40, 0], opacity: [0, 0.8, 0], scale: [0.5, 1.5, 0.5] }}
                        transition={{ duration: 4 + i, repeat: Infinity, delay: i * 0.8 }}
                    />
                ))}
            </div>

            {/* CARD */}
            <div className="relative z-10 flex items-center justify-center h-full px-4">
                <motion.div
                    initial={{ opacity: 0, y: 40, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="w-full max-w-md"
                >
                    <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[32px] shadow-2xl shadow-black/30 p-8 md:p-10">

                        {/* Logo */}
                        <div className="text-center mb-6">
                            <motion.div
                                initial={{ scale: 0 }} animate={{ scale: 1 }}
                                transition={{ type: 'spring', stiffness: 200, delay: 0.3 }}
                                className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-sage/30 backdrop-blur-lg border border-sage/40 mb-3"
                            >
                                <Leaf className="text-white" size={28} />
                            </motion.div>
                            <h1 className="text-2xl font-black text-white tracking-tight">Tu Selva Urbana</h1>
                            <p className="text-white/50 text-xs mt-1">
                                {mode === 'verify' ? '🛡️ Verificación de seguridad' :
                                 mode === 'forgot' ? '🔑 Recuperar acceso' :
                                 mode === 'register' ? 'Crea tu cuenta gratis' : 'Bienvenido de vuelta 🌿'}
                            </p>
                        </div>

                        <AnimatePresence mode="wait">

                            {/* OTP Step */}
                            {mode === 'verify' && (
                                <OTPStep
                                    key="verify"
                                    email={pendingEmail}
                                    phone={pendingPhone}
                                    onSuccess={onVerifySuccess}
                                    onResend={() => authAPI.resendCode(pendingEmail)}
                                />
                            )}

                            {/* Forgot Step */}
                            {mode === 'forgot' && (
                                <ForgotStep key="forgot" onBack={() => setMode('login')} />
                            )}

                            {/* Login / Register */}
                            {(mode === 'login' || mode === 'register') && (
                                <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                    {/* Tabs */}
                                    <div className="flex bg-white/10 rounded-2xl p-1 mb-6">
                                        <button onClick={() => { setMode('login'); setError(''); }}
                                            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${mode === 'login' ? 'bg-white/20 text-white shadow-lg' : 'text-white/50 hover:text-white/70'}`}>
                                            Iniciar Sesión
                                        </button>
                                        <button onClick={() => { setMode('register'); setError(''); }}
                                            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${mode === 'register' ? 'bg-white/20 text-white shadow-lg' : 'text-white/50 hover:text-white/70'}`}>
                                            Crear Cuenta
                                        </button>
                                    </div>

                                    <form onSubmit={handleSubmit} className="space-y-3.5">
                                        {error && (
                                            <div className="bg-red-500/20 border border-red-400/30 text-red-200 text-sm px-4 py-2.5 rounded-xl text-center">
                                                ❌ {error}
                                            </div>
                                        )}

                                        {/* Nombre (solo registro) */}
                                        <AnimatePresence>
                                            {isRegister && (
                                                <motion.div key="name"
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    exit={{ opacity: 0, height: 0 }}>
                                                    <div className="relative group">
                                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-sage transition-colors" size={18} />
                                                        <input type="text" name="name" value={form.name} onChange={handleChange}
                                                            required={isRegister} placeholder="Tu nombre completo"
                                                            className="w-full bg-white/10 border border-white/15 rounded-2xl py-3.5 pl-12 pr-4 text-white placeholder-white/30 focus:outline-none focus:border-sage/60 focus:bg-white/15 transition-all text-sm" />
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        {/* Email */}
                                        <div className="relative group">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-sage transition-colors" size={18} />
                                            <input type="email" name="email" value={form.email} onChange={handleChange}
                                                required placeholder="tu@email.com"
                                                className="w-full bg-white/10 border border-white/15 rounded-2xl py-3.5 pl-12 pr-4 text-white placeholder-white/30 focus:outline-none focus:border-sage/60 focus:bg-white/15 transition-all text-sm" />
                                        </div>

                                        {/* Teléfono (solo registro, obligatorio) */}
                                        <AnimatePresence>
                                            {isRegister && (
                                                <motion.div key="phone"
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    exit={{ opacity: 0, height: 0 }}>
                                                    <div className="relative group">
                                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-sage transition-colors" size={18} />
                                                        <input type="tel" name="phone" value={form.phone} onChange={handleChange}
                                                            required={isRegister} placeholder="+52 5512345678"
                                                            className="w-full bg-white/10 border border-white/15 rounded-2xl py-3.5 pl-12 pr-4 text-white placeholder-white/30 focus:outline-none focus:border-sage/60 focus:bg-white/15 transition-all text-sm" />
                                                    </div>
                                                    <p className="text-white/30 text-[11px] mt-1 pl-2">Se usará para enviarte el código de verificación</p>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        {/* Contraseña */}
                                        <div className="relative group">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-sage transition-colors" size={18} />
                                            <input type={showPassword ? 'text' : 'password'} name="password" value={form.password} onChange={handleChange}
                                                required placeholder="Contraseña (mín. 6 caracteres)"
                                                className="w-full bg-white/10 border border-white/15 rounded-2xl py-3.5 pl-12 pr-12 text-white placeholder-white/30 focus:outline-none focus:border-sage/60 focus:bg-white/15 transition-all text-sm" />
                                            <button type="button" onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>

                                        {/* Forgot password */}
                                        {mode === 'login' && (
                                            <div className="flex justify-end">
                                                <button type="button" onClick={() => { setMode('forgot'); setError(''); }}
                                                    className="text-white/40 hover:text-sage text-xs font-medium transition-colors">
                                                    ¿Olvidaste tu contraseña?
                                                </button>
                                            </div>
                                        )}

                                        {/* Submit */}
                                        <motion.button type="submit" disabled={loading}
                                            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                            className="w-full py-4 rounded-2xl font-bold text-white text-base bg-gradient-to-r from-terra to-[#D36C52] hover:from-[#D36C52] hover:to-terra shadow-xl shadow-terra/30 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                                        >
                                            {loading ? (
                                                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            ) : (
                                                <><Sparkles size={18} />{isRegister ? 'Crear cuenta y verificar' : 'Entrar a mi selva'}</>
                                            )}
                                        </motion.button>
                                    </form>

                                    <p className="text-center text-white/40 text-xs mt-5">
                                        {isRegister ? '¿Ya tienes cuenta? ' : '¿No tienes cuenta? '}
                                        <button onClick={() => { setMode(isRegister ? 'login' : 'register'); setError(''); }}
                                            className="text-sage hover:text-white font-bold transition-colors underline underline-offset-2">
                                            {isRegister ? 'Inicia sesión' : 'Regístrate gratis'}
                                        </button>
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <motion.button
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
                        onClick={() => navigate('/')}
                        className="block mx-auto mt-5 text-white/40 hover:text-white text-sm font-medium transition-colors"
                    >
                        ← Volver al inicio
                    </motion.button>
                </motion.div>
            </div>
        </div>
    );
}
