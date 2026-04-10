import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, Eye, EyeOff, CheckCircle2, Leaf } from 'lucide-react';
import { authAPI } from '../services/api';

export default function ResetPassword() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');

    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirm) {
            setError('Las contraseñas no coinciden.');
            return;
        }
        if (password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres.');
            return;
        }
        setLoading(true);
        setError('');
        try {
            await authAPI.resetPassword(token, password);
            setSuccess(true);
            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            setError(err.message || 'El enlace no es válido o ha expirado.');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-bone flex items-center justify-center px-4 relative overflow-hidden">
            {/* Fondo decorativo */}
            <div className="absolute inset-0 bg-gradient-to-br from-sage/5 via-bone to-terra/5 pointer-events-none" />
            {['🌿', '🍃', '🌱'].map((e, i) => (
                <motion.div
                    key={i}
                    className="absolute text-5xl opacity-10 pointer-events-none"
                    style={{ left: `${15 + i * 35}%`, top: `${20 + i * 20}%` }}
                    animate={{ y: [0, -15, 0], rotate: [0, 8, -8, 0] }}
                    transition={{ duration: 4, repeat: Infinity, delay: i * 0.7 }}
                >
                    {e}
                </motion.div>
            ))}

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative z-10 w-full max-w-md"
            >
                {/* Card */}
                <div className="bg-white/90 backdrop-blur-xl border border-sage/20 rounded-[32px] shadow-2xl shadow-forest/10 overflow-hidden">
                    <div className="h-1.5 bg-gradient-to-r from-sage to-[#5a9e6f]" />
                    <div className="p-8">
                        {/* Logo */}
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-9 h-9 bg-forest rounded-xl flex items-center justify-center">
                                <Leaf size={18} className="text-white" />
                            </div>
                            <span className="font-black text-forest text-lg">Tu Selva Urbana</span>
                        </div>

                        {!token ? (
                            <div className="text-center py-8">
                                <p className="text-4xl mb-3">⚠️</p>
                                <h2 className="font-bold text-forest text-xl mb-2">Enlace inválido</h2>
                                <p className="text-forest/60 text-sm">Este enlace no contiene un token válido.</p>
                                <button onClick={() => navigate('/login')} className="mt-4 text-sage font-bold text-sm hover:underline">
                                    Volver al inicio de sesión
                                </button>
                            </div>
                        ) : success ? (
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="text-center py-8"
                            >
                                <motion.div
                                    animate={{ scale: [1, 1.15, 1] }}
                                    transition={{ duration: 0.5 }}
                                    className="w-16 h-16 bg-sage/20 rounded-full flex items-center justify-center mx-auto mb-4"
                                >
                                    <CheckCircle2 size={36} className="text-sage" />
                                </motion.div>
                                <h2 className="font-black text-forest text-2xl mb-2">¡Contraseña actualizada!</h2>
                                <p className="text-forest/60 text-sm">Redirigiendo al inicio de sesión...</p>
                            </motion.div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <h2 className="text-2xl font-black text-forest mb-1">Nueva Contraseña</h2>
                                    <p className="text-sm text-forest/60 mb-5">Elige una contraseña segura de al menos 6 caracteres.</p>
                                </div>

                                {error && (
                                    <div className="bg-red-50 border border-red-100 text-red-600 text-sm p-3 rounded-xl">
                                        {error}
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-bold text-forest/70 mb-1.5">Nueva contraseña</label>
                                    <div className="relative">
                                        <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-forest/40" />
                                        <input
                                            type={showPass ? 'text' : 'password'}
                                            required
                                            value={password}
                                            onChange={e => setPassword(e.target.value)}
                                            placeholder="Mínimo 6 caracteres"
                                            className="w-full bg-bone border border-sage/30 rounded-xl py-3 pl-10 pr-10 text-forest focus:ring-2 focus:ring-sage focus:outline-none"
                                        />
                                        <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-forest/40">
                                            {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-forest/70 mb-1.5">Confirmar contraseña</label>
                                    <div className="relative">
                                        <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-forest/40" />
                                        <input
                                            type={showPass ? 'text' : 'password'}
                                            required
                                            value={confirm}
                                            onChange={e => setConfirm(e.target.value)}
                                            placeholder="Repite la contraseña"
                                            className="w-full bg-bone border border-sage/30 rounded-xl py-3 pl-10 pr-4 text-forest focus:ring-2 focus:ring-sage focus:outline-none"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-forest text-white font-bold py-3.5 rounded-xl hover:bg-[#1A251B] disabled:opacity-50 transition-all shadow-lg shadow-forest/20 flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Actualizando...</>
                                    ) : (
                                        'Cambiar Contraseña'
                                    )}
                                </button>

                                <button type="button" onClick={() => navigate('/login')} className="w-full text-center text-sm text-forest/50 hover:text-forest transition-colors pt-1">
                                    Volver al inicio de sesión
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
