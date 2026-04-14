import React, { useState, useEffect, useRef } from 'react';
import { adminAPI } from '../services/api';
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
            showNotification('\u274C Error al cargar usuarios', 'error');
        } finally {
            setLoading(false);
        }
    };

    const toggleRole = async (userId, currentRole) => {
        const newRole = currentRole === 'admin' ? 'user' : 'admin';
        const confirmMsg = currentRole === 'admin' 
            ? '\u26A0\uFE0F \u00BFQuitar privilegios de administrador a este usuario?'
            : '\u2B50 \u00BFDar privilegios de administrador a este usuario?';
        
        if (!window.confirm(confirmMsg)) return;
        
        try {
            await adminAPI.updateUserRole(userId, newRole);
            setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
            showNotification(`\u2705 Rol actualizado a ${newRole === 'admin' ? 'Administrador' : 'Usuario'}`, 'success');
        } catch (err) {
            showNotification('\u274C Error al cambiar el rol', 'error');
        }
    };

    const deleteUser = async (userId, userName) => {
        if (!window.confirm(`\uD83D\uDEA8 ADVERTENCIA: \u00BFEst\u00E1s seguro de que quieres eliminar PERMANENTEMENTE al usuario "${userName}"? Esta acci\u00F3n no se puede deshacer y borrar\u00E1 todos sus pedidos.`)) {
            return;
        }

        try {
            await adminAPI.deleteUser(userId);
            setUsers(users.filter(u => u.id !== userId));
            showNotification(`\u2705 Usuario ${userName} eliminado exitosamente`, 'success');
        } catch (err) {
            console.error('Error delete:', err);
            showNotification(err.message || '\u274C Error al eliminar el usuario', 'error');
        }
    };

    const showNotification = (msg, type) => {
        setNotification({ msg, type });
        setTimeout(() => setNotification(null), 3000);
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            
            if (!res.ok) throw new Error(data.error || 'Error al crear usuario');
            
            const emailToVerify = data.email || formData.email;
            
            setPendingUser({
                email: emailToVerify,
                name: formData.name,
                phone: formData.phone,
                role: formData.role
            });
            
            setShowModal(false);
            setFormData({ name: '', email: '', password: '', phone: '', role: 'user' });
            setShowOtpModal(true);
            showNotification('\u2705 C\u00F3digo OTP enviado. Por favor verifica el usuario.', 'success');
            
        } catch (err) {
            showNotification(`\u274C ${err.message}`, 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const handleOtpDigit = (index, value) => {
        if (!/^\d*$/.test(value)) return;
        const newOtp = [...otpDigits];
        newOtp[index] = value;
        setOtpDigits(newOtp);

        if (value && index < 5) otpRefs.current[index + 1].focus();
    };

    const handleOtpKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
            otpRefs.current[index - 1].focus();
        }
    };

    const handleOtpPaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').slice(0, 6).split('');
        if (!/^\d+$/.test(pastedData.join(''))) return;
        
        const newOtp = [...otpDigits];
        pastedData.forEach((val, i) => { if (i < 6) newOtp[i] = val; });
        setOtpDigits(newOtp);
        if (pastedData.length < 6) otpRefs.current[pastedData.length].focus();
        else otpRefs.current[5].focus();
    };

    const handleVerifyOtp = async () => {
        const code = otpDigits.join('');
        if (code.length !== 6) {
            setOtpError('Ingresa los 6 d\u00EDgitos');
            return;
        }
        setOtpLoading(true);
        setOtpError('');
        try {
            const res = await fetch('/api/auth/verify-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: pendingUser.email, code })
            });
            const data = await res.json();
            
            if (!res.ok) throw new Error(data.error || 'C\u00F3digo incorrecto');

            if (pendingUser.role === 'admin' && data.user && data.user.id) {
                try {
                    await adminAPI.updateUserRole(data.user.id, 'admin');
                } catch (roleErr) {
                    console.error('Error escalando privilegios:', roleErr);
                }
            }
            
            setShowOtpModal(false);
            setPendingUser(null);
            setOtpDigits(['', '', '', '', '', '']);
            showNotification('\u2705 Nuevo usuario verificado y creado exitosamente', 'success');
            fetchUsers();
            
        } catch (err) {
            setOtpError(err.message);
            setOtpDigits(['', '', '', '', '', '']);
            otpRefs.current[0].focus();
        } finally {
            setOtpLoading(false);
        }
    };

    const handleResendCode = async () => {
        setResending(true);
        setResent(false);
        setOtpError('');
        try {
            const res = await fetch('/api/auth/resend-code', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: pendingUser.email })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Error al reenviar');
            setResent(true);
            setOtpDigits(['', '', '', '', '', '']);
            otpRefs.current[0].focus();
        } catch (err) {
            setOtpError(err.message);
        } finally {
            setResending(false);
        }
    };

    if (loading) return <div className="p-10 text-center font-bold text-green-800">Cargando usuarios...</div>;

    return (
        <div className="relative bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {notification && (
                <div className={`fixed top-20 right-10 z-50 px-6 py-3 rounded-lg shadow-lg transition-all animate-bounce ${
                    notification.type === 'success' ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'
                }`}>
                    {notification.msg}
                </div>
            )}

            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <div>
                    <h2 className="text-xl font-bold text-gray-800">Directorio de Usuarios</h2>
                    <p className="text-sm text-gray-500 mt-1">Gestiona los miembros de la comunidad y administradores</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-bold transition-colors flex items-center gap-2 shadow-md"
                >
                    <span className="text-xl">+</span> Nuevo Usuario
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-semibold">
                        <tr>
                            <th className="px-6 py-4">Usuario</th>
                            <th className="px-6 py-4">Contacto</th>
                            <th className="px-6 py-4">Estado</th>
                            <th className="px-6 py-4">Rol / Permisos</th>
                            <th className="px-6 py-4">Acciones Peligrosas</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                                            user.role === 'admin' ? 'bg-gradient-to-tr from-green-600 to-green-400 ring-2 ring-green-200' : 'bg-gradient-to-tr from-blue-500 to-blue-300'
                                        }`}>
                                            {user.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-800">{user.name}</p>
                                            <p className="text-xs text-gray-400">ID: {user.id.slice(-5)}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <p className="text-sm font-medium text-gray-600">{user.email}</p>
                                    <p className="text-xs text-gray-400">{user.phone || 'Sin tel\u00E9fono'}</p>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold flex w-fit items-center gap-1 ${
                                        user.emailVerified ? 'bg-emerald-100 text-emerald-700' : 'bg-yellow-100 text-yellow-700'
                                    }`}>
                                        {user.emailVerified ? '\u2714\uFE0F Verificado' : '\u23F3 Pendiente OTP'}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <button
                                        onClick={() => toggleRole(user.id, user.role)}
                                        className={`px-3 py-1.5 rounded-lg text-sm font-bold border transition-colors flex items-center gap-2 w-full justify-center ${
                                            user.role === 'admin' 
                                            ? 'bg-green-50 border-green-200 text-green-700 hover:bg-red-50 hover:border-red-200 hover:text-red-700' 
                                            : 'bg-white border-gray-200 text-gray-600 hover:bg-green-50 hover:border-green-200 hover:text-green-700'
                                        }`}
                                    >
                                        {user.role === 'admin' ? (
                                            <><span>\uD83D\uDC51</span> Admin</>
                                        ) : (
                                            <><span>\uD83D\uDC64</span> Usuario</>
                                        )}
                                    </button>
                                </td>
                                <td className="px-6 py-4">
                                    <button
                                        onClick={() => deleteUser(user.id, user.name)}
                                        className="text-red-500 hover:text-red-700 font-bold text-sm bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors border border-red-100 flex items-center w-max"
                                    >
                                        <span>\uD83D\uDDD1\uFE0F</span> <span className="ml-2 hidden lg:inline">Eliminar</span>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="p-4 border-t border-gray-100 bg-gray-50/30 text-sm text-gray-500">
                Total: {users.length} {users.length === 1 ? 'usuario' : 'usuarios'} registrados
            </div>

            {/* Modal para Nuevo Usuario */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                <span>\uD83D\uDC65</span> Registrar Nuevo Usuario
                            </h3>
                            <button 
                                onClick={() => setShowModal(false)}
                                className="text-gray-400 hover:text-red-500 transition-colors text-2xl font-light"
                            >
                                ×
                            </button>
                        </div>
                        <form onSubmit={handleCreateUser} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Nombre Completo *</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                                    placeholder="Ej: Juan P\u00E9rez"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Correo Electr\u00F3nico *</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                                    placeholder="juan@ejemplo.com"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Contrase\u00F1a Temporal *</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                                    placeholder="M\u00EDnimo 6 caracteres"
                                />
                                <p className="text-xs text-gray-400 mt-1">M\u00EDnimo 6 caracteres</p>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Tel\u00E9fono *</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                                    placeholder="+52 5512345678"
                                />
                                <p className="text-xs text-gray-400 mt-1">Se usar\u00E1 para enviar el c\u00F3digo de verificaci\u00F3n</p>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Rol</label>
                                <select
                                    name="role"
                                    value={formData.role}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                                >
                                    <option value="user">\uD83D\uDC64 Usuario normal</option>
                                    <option value="admin">\uD83D\uDC51 Administrador</option>
                                </select>
                                <p className="text-xs text-gray-400 mt-1">
                                    {formData.role === 'admin' 
                                        ? 'El usuario tendr\u00E1 acceso al panel de administraci\u00F3n despu\u00E9s de verificar' 
                                        : 'El usuario solo tendr\u00E1 acceso a la tienda despu\u00E9s de verificar'}
                                </p>
                            </div>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-bold transition-colors mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {submitting ? 'Creando usuario...' : 'Crear Usuario y Enviar C\u00F3digo'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {showOtpModal && pendingUser && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
                        <div className="p-6 border-b border-gray-100">
                            <h3 className="text-xl font-bold text-green-800 text-center">
                                \uD83D\uDD10 Verificar Usuario
                            </h3>
                            <p className="text-gray-500 text-sm text-center mt-1">
                                Se envi\u00F3 un c\u00F3digo de 6 d\u00EDgitos a:
                            </p>
                            <p className="text-center text-sm font-medium text-gray-700 mt-1">
                                \uD83D\uDCE7 {pendingUser.email}
                            </p>
                            {pendingUser.phone && (
                                <p className="text-center text-sm font-medium text-gray-700">
                                    \uD83D\uDCF1 {pendingUser.phone}
                                </p>
                            )}
                        </div>
                        <div className="p-6 space-y-5">
                            <div className="text-center">
                                <p className="text-xs text-gray-400 mb-3">
                                    Ingresa el c\u00F3digo que recibi\u00F3 <strong>{pendingUser.name}</strong>
                                </p>
                            </div>

                            {otpError && (
                                <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-2.5 rounded-xl text-center">
                                    \u274C {otpError}
                                </div>
                            )}
                            {resent && (
                                <div className="bg-green-50 border border-green-200 text-green-600 text-sm px-4 py-2.5 rounded-xl text-center">
                                    \u2705 C\u00F3digo reenviado correctamente
                                </div>
                            )}

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
                                    <>\uD83D\uDD13 Verificar y Activar Usuario</>
                                )}
                            </button>

                            <button
                                onClick={handleResendCode}
                                disabled={resending}
                                className="w-full text-center text-gray-400 hover:text-green-600 text-xs font-medium transition-colors flex items-center justify-center gap-1.5"
                            >
                                <RefreshCw size={13} className={resending ? 'animate-spin' : ''} />
                                {resending ? 'Reenviando...' : 'No recib\u00ED el c\u00F3digo \u2014 Reenviar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminUsers;
