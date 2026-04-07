import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { GlobalContext } from '../context/GlobalContext';

/**
 * Componente para proteger rutas de administrador.
 * Verifica autenticación Y que el rol sea "admin".
 */
const AdminRoute = ({ children }) => {
    const { isAuthenticated, user } = useContext(GlobalContext);

    // 1. Si no está logueado, al login
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // 2. Si está logueado pero NO es admin, al feed
    if (user?.role !== 'admin') {
        return <Navigate to="/feed" replace />;
    }

    // 3. Si es admin, adelante
    return children;
};

export default AdminRoute;