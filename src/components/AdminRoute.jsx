import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { GlobalContext } from '../context/GlobalContext';

/**
 * Componente para proteger rutas de administrador.
 * Verifica autenticación Y que el rol sea "admin" o el usuario de pruebas.
 */
const AdminRoute = ({ children }) => {
    const { isAuthenticated, user, loading } = useContext(GlobalContext);

    // 1. IMPORTANTE: Si tienes un estado "loading" en tu context, 
    // hay que esperar a que termine de leer el localStorage.
    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-ivory">
                <div className="text-center">
                    <p className="text-forest-green font-semibold animate-pulse">
                        Verificando credenciales en la selva...
                    </p>
                </div>
            </div>
        );
    }

    // 2. Si no está logueado, al login
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // 3. Verificamos el acceso administrativo:
    // Pasa si el rol es "admin" O si el email coincide con nuestro admin de pruebas.
    const isMasterAdmin = user?.email === 'admin@test.com';
    const hasAdminRole = user?.role === 'admin';

    if (!isMasterAdmin && !hasAdminRole) {
        console.warn("⚠️ Intento de acceso no autorizado a ruta administrativa.");
        return <Navigate to="/feed" replace />;
    }

    // 4. Si es admin, adelante
    return children;
};

export default AdminRoute;