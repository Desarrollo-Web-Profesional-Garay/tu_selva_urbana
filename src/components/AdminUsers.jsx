import React, { useState, useEffect, useRef } from 'react';
import { adminAPI, authAPI } from '../services/api';
import { RefreshCw } from 'lucide-react';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [notification, setNotification] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showOtpModal, setShowOtpModal] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        role: 'user'
    });
    const [submitting, setSubmitting] = useState(false);
    const [pendingUser, setPendingUser] = useState(null);
    const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
    const [otpError, setOtpError] = useState('');
    const [otpLoading, setOtpLoading] = useState(false);
    const [resending, setResending] = useState(false);
    const [resent, setResent] = useState(false);
    const otpRefs = useRef([]);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const data = await adminAPI.getUsers();
            setUsers(data);
        } catch (err) {
            console.error(err);
            showNotification('❌ Error al cargar usuarios', 'error');
        } finally {
            setLoading(false);
        }
    };

    const toggleRole = async (userId, currentRole) => {
        const newRole = currentRole === 'admin' ? 'user' : 'admin';
        const confirmMsg = currentRole === 'admin' 
            ? '⚠️ ¿Quitar privilegios de administrador a este usuario?'
            : '⭐ ¿Dar privilegios de administrador a este usuario?';
        
        if (!window.confirm(confirmMsg)) return;
        
        try {
            await adminAPI.updateUserRole(userId, newRole);
            setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
            showNotification(`✅ Rol actualizado a ${newRole === 'admin' ? 'Administrador' : 'Usuario'}`, 'success');
        } catch (err) {
            showNotification('❌ Error al cambiar el rol', 'error');
        }
    };

    const deleteUser = async (userId, userName) => {
        if (window.confirm(`🗑️ ¿Eliminar permanentemente a "${userName}"?\n\nEsta acción no se puede deshacer.`)) {
            try {
                await adminAPI.deleteUser(userId);
                setUsers(users.filter(u => u.id !== userId));
                showNotification(`✅ Usuario "${userName}" eliminado`, 'success');
            } catch (err) {
                showNotification('❌ Error al eliminar usuario', 'error');
            }
        }
    };

    // Paso 1: Crear usuario (envía código OTP)
    const handleCreateUser = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        
        try {
            if (formData.password.length < 6) {
                throw new Error('La contraseña debe tener al menos 6 caracteres');
            }
            
            if (!formData.phone) {
                throw new Error('El teléfono es obligatorio para la verificación');
            }
            
            // Usar el registro normal que envía el código OTP
            const result = await authAPI.register(
                formData.name,
                formData.email,
                formData.password,
                formData.phone
            );
            
            // Guardar datos del usuario creado y abrir modal OTP
            setPendingUser({
                id: result.user?.id,
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                desiredRole: formData.role,
                tempPassword: formData.password
            });
            setShowModal(false);
            setShowOtpModal(true);
            setOtpDigits(['', '', '', '', '', '']);
            setOtpError('');
            
        } catch (err) {
            showNotification(err.message || '❌ Error al crear usuario', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    // Paso 2: Verificar OTP y asignar rol si es admin
    const handleVerifyOtp = async () => {
        const code = otpDigits.join('');
        if (code.length < 6) {
            setOtpError('Ingresa los 6 dígitos del código');
            return;
        }
        
        setOtpLoading(true);
        setOtpError('');
        
        try {
            // Verificar email con el código OTP
            const verifyResult = await authAPI.verifyEmail(pendingUser.email, code);
            
            // Si la verificación es exitosa y el rol deseado es admin, actualizar rol
            if (pendingUser.desiredRole === 'admin') {
                await adminAPI.updateUserRole(verifyResult.user.id, 'admin');
            }
            
            showNotification(
                `✅ Usuario "${pendingUser.name}" verificado exitosamente. ${pendingUser.desiredRole === 'admin' ? 'Ahora es administrador.' : ''}`, 
                'success'
            );
            
            setShowOtpModal(false);
            setPendingUser(null);
            fetchUsers(); // Recargar lista
            
        } catch (err) {
            setOtpError(err.message || '❌ Código incorrecto');
            setOtpDigits(['', '', '', '', '', '']);
            if (otpRefs.current[0]) otpRefs.current[0].focus();
        } finally {
            setOtpLoading(false);
        }
    };

    const handleResendCode = async () => {
        setResending(true);
        try {
            await authAPI.resendCode(pendingUser.email);
            setResent(true);
            setTimeout(() => setResent(false), 4000);
        } catch (err) {
            setOtpError('Error al reenviar el código');
        }
        setResending(false);
    };

    const handleOtpDigit = (i, val) => {
        if (!/^\d?$/.test(val)) return;
        const next = [...otpDigits];
        next[i] = val;
        setOtpDigits(next);
        if (val && i < 5) otpRefs.current[i + 1]?.focus();
        if (!val && i > 0) otpRefs.current[i - 1]?.focus();
    };

    const handleOtpKeyDown = (i, e) => {
        if (e.key === 'Backspace' && !otpDigits[i] && i > 0) {
            otpRefs.current[i - 1]?.focus();
        }
    };

    const handleOtpPaste = (e) => {
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        if (pasted.length === 6) {
            setOtpDigits(pasted.split(''));
            otpRefs.current[5]?.focus();
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const showNotification = (msg, type) => {
        setNotification({ msg, type });
        setTimeout(() => setNotification(null), 5000);
    };

    if (loading) return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h2 className="text-xl font-bold text-gray-800">Control de Usuarios</h2>
                <button 
                    onClick={() => setShowModal(true)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 shadow-md"
                >
                    <span className="text-xl">+</span> Nuevo Usuario
                </button>
            </div>
            <div className="text-center p-10">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700 mx-auto mb-4"></div>
                <p className="text-green-800 font-bold">Cargando usuarios...</p>
            </div>
        </div>
    );

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Notificación flotante */}
            {notification && (
                <div className={`fixed top-20 right-10 z-50 px-6 py-3 rounded-lg shadow-lg animate-in fade-in slide-in-from-top-5 duration-300 max-w-md ${
                    notification.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
                }`}>
                    {notification.msg}
                </div>
            )}

            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <div>
                    <h2 className="text-xl font-bold text-gray-800">Control de Usuarios</h2>
                    <p className="text-sm text-gray-500 mt-1">Administra los usuarios de Tu Selva Urbana</p>
                </div>
                <div className="flex gap-3">
                    <span className="text-xs font-mono bg-gray-200 px-2 py-1 rounded text-gray-600 uppercase tracking-tighter">
                        Total: {users.length}
                    </span>
                    <button 
                        onClick={() => setShowModal(true)}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 shadow-md"
                    >
                        <span className="text-xl">+</span> Nuevo Usuario
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-500 uppercase text-[10px] font-black tracking-widest">
                        <tr>
                            <th className="px-6 py-4">USUARIO</th>
                            <th className="px-6 py-4">EMAIL</th>
                            <th className="px-6 py-4">ROL</th>
                            <th className="px-6 py-4">VERIFICADO</th>
                            <th className="px-6 py-4">TELÉFONO</th>
                            <th className="px-6 py-4">REGISTRO</th>
                            <th className="px-6 py-4 text-center">ACCIONES</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm">
                        {users.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="px-6 py-12 text-center text-gray-400">
                                    👥 No hay usuarios registrados
                                 </td>
                            </tr>
                        ) : (
                            users.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                                {user.name.charAt(0).toUpperCase()}
                                            </div>
                                            <span className="font-medium text-gray-800">{user.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">{user.email}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                                            user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                                        }`}>
                                            {user.role === 'admin' ? '👑 ADMIN' : '👤 USER'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {user.emailVerified ? (
                                            <span className="text-green-600">✅ Verificado</span>
                                        ) : (
                                            <span className="text-yellow-600">⏳ Pendiente</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-gray-500">{user.phone || '—'}</td>
                                    <td className="px-6 py-4 text-gray-500 text-xs">
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex justify-center gap-2">
                                            <button 
                                                onClick={() => toggleRole(user.id, user.role)}
                                                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                                                    user.role === 'admin' 
                                                    ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' 
                                                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                                                }`}
                                            >
                                                {user.role === 'admin' ? 'Quitar Admin' : 'Hacer Admin'}
                                            </button>
                                            <button 
                                                onClick={() => deleteUser(user.id, user.name)}
                                                className="p-1 text-red-400 hover:text-red-600 transition-colors"
                                                title="Eliminar usuario"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal para crear usuario */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-green-800">
                                👤 Crear Nuevo Usuario
                            </h3>
                            <button 
                                onClick={() => {
                                    setShowModal(false);
                                    setFormData({ name: '', email: '', password: '', phone: '', role: 'user' });
                                }} 
                                className="text-gray-400 hover:text-gray-600 text-2xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
                            >
                                ×
                            </button>
                        </div>
                        <form onSubmit={handleCreateUser} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Nombre completo *</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                                    placeholder="Ej: Juan Pérez"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Email *</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                                    placeholder="ejemplo@correo.com"
                                />
                                <p className="text-xs text-gray-400 mt-1">Se enviará un código de verificación al email</p>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Contraseña *</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                                    placeholder="Mínimo 6 caracteres"
                                />
                                <p className="text-xs text-gray-400 mt-1">Mínimo 6 caracteres</p>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Teléfono *</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                                    placeholder="+52 5512345678"
                                />
                                <p className="text-xs text-gray-400 mt-1">Se usará para enviar el código de verificación</p>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Rol</label>
                                <select
                                    name="role"
                                    value={formData.role}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                                >
                                    <option value="user">👤 Usuario normal</option>
                                    <option value="admin">👑 Administrador</option>
                                </select>
                                <p className="text-xs text-gray-400 mt-1">
                                    {formData.role === 'admin' 
                                        ? 'El usuario tendrá acceso al panel de administración después de verificar' 
                                        : 'El usuario solo tendrá acceso a la tienda después de verificar'}
                                </p>
                            </div>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-bold transition-colors mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {submitting ? 'Creando usuario...' : 'Crear Usuario y Enviar Código'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal OTP para ingresar el código de verificación */}
            {showOtpModal && pendingUser && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
                        <div className="p-6 border-b border-gray-100">
                            <h3 className="text-xl font-bold text-green-800 text-center">
                                🔐 Verificar Usuario
                            </h3>
                            <p className="text-gray-500 text-sm text-center mt-1">
                                Se envió un código de 6 dígitos a:
                            </p>
                            <p className="text-center text-sm font-medium text-gray-700 mt-1">
                                📧 {pendingUser.email}
                            </p>
                            {pendingUser.phone && (
                                <p className="text-center text-sm font-medium text-gray-700">
                                    📱 {pendingUser.phone}
                                </p>
                            )}
                        </div>
                        <div className="p-6 space-y-5">
                            <div className="text-center">
                                <p className="text-xs text-gray-400 mb-3">
                                    Ingresa el código que recibió <strong>{pendingUser.name}</strong>
                                </p>
                            </div>

                            {otpError && (
                                <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-2.5 rounded-xl text-center">
                                    ❌ {otpError}
                                </div>
                            )}
                            {resent && (
                                <div className="bg-green-50 border border-green-200 text-green-600 text-sm px-4 py-2.5 rounded-xl text-center">
                                    ✅ Código reenviado correctamente
                                </div>
                            )}

                            {/* 6 inputs OTP */}
                            <div className="flex justify-center gap-2.5" onPaste={handleOtpPaste}>
                                {otpDigits.map((d, i) => (
                                    <input
                                        key={i}
                                        ref={el => otpRefs.current[i] = el}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={1}
                                        value={d}
                                        onChange={e => handleOtpDigit(i, e.target.value)}
                                        onKeyDown={e => handleOtpKeyDown(i, e)}
                                        className="w-12 h-14 text-center text-2xl font-bold bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-800 focus:border-green-500 focus:outline-none focus:bg-white transition-all"
                                        autoFocus={i === 0}
                                    />
                                ))}
                            </div>

                            <button
                                onClick={handleVerifyOtp}
                                disabled={otpLoading || otpDigits.join('').length < 6}
                                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {otpLoading ? (
                                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>🔓 Verificar y Activar Usuario</>
                                )}
                            </button>

                            <button
                                onClick={handleResendCode}
                                disabled={resending}
                                className="w-full text-center text-gray-400 hover:text-green-600 text-xs font-medium transition-colors flex items-center justify-center gap-1.5"
                            >
                                <RefreshCw size={13} className={resending ? 'animate-spin' : ''} />
                                {resending ? 'Reenviando...' : 'No recibí el código — Reenviar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminUsers;