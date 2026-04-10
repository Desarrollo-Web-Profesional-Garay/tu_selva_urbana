import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { GlobalContext } from './context/GlobalContext';

// Componentes de Estructura y Protección
import Layout from './components/Layout';
import AdminRoute from './components/AdminRoute'; 
import Footer from './components/Footer';
import QuizNudge from './components/QuizNudge';

// Páginas Públicas
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Quiz from './pages/Quiz';
import NotFound from './pages/NotFound';
import ResetPassword from './pages/ResetPassword';

// Páginas Privadas (Dentro del App con Layout)
import Feed from './pages/Feed';
import Recommendations from './pages/Recommendations';
import Catalog from './pages/Catalog';
import MyPlants from './pages/MyPlants';
import MyAccount from './pages/MyAccount';

// --- NUEVAS PÁGINAS DEL FLUJO DE VENTA ---
import AddPlant from './pages/PlantForm';
import PlantDetail from './pages/PlantDetail';

// --- PÁGINAS DE ADMINISTRACIÓN ---
import AdminPanel from './pages/AdminPanel';
import UsersTable from './pages/UsersTable';

/**
 * Componente para proteger rutas que requieren autenticación general.
 */
function ProtectedRoute({ children }) {
    const { isAuthenticated } = useContext(GlobalContext);
    
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    
    return children;
}

/**
 * Layout interno que incluye el Layout base, el Footer y el QuizNudge
 * que trajeron tus compañeros de la rama main.
 */
function InnerLayout() {
    return (
        <>
            <Layout />
            <QuizNudge />
            <Footer />
        </>
    );
}

function App() {
    return (
        <Router>
            <Routes>
                {/* 1. RUTAS PÚBLICAS */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/registro" element={<Login />} />
                <Route path="/quiz" element={<Quiz />} />
                <Route path="/reset-password" element={<ResetPassword />} />

                {/* 2. RUTAS DE ADMINISTRACIÓN (Tus cambios de Admin) */}
                <Route 
                    path="/admin" 
                    element={
                        <AdminRoute>
                            <AdminPanel />
                        </AdminRoute>
                    } 
                />
                <Route 
                    path="/admin/usuarios" 
                    element={
                        <AdminRoute>
                            <UsersTable />
                        </AdminRoute>
                    } 
                />

                {/* 3. RUTAS PROTEGIDAS (Usando el InnerLayout actualizado) */}
                <Route element={<ProtectedRoute><InnerLayout /></ProtectedRoute>}>
                    <Route path="/feed" element={<Feed />} />
                    <Route path="/recomendaciones" element={<Recommendations />} />
                    <Route path="/catalogo" element={<Catalog />} />
                    <Route path="/mis-plantas" element={<MyPlants />} />
                    <Route path="/mi-cuenta" element={<MyAccount />} />

                    {/* --- FLUJO DE VENTA Y VISUALIZACIÓN --- */}
                    <Route path="/vender" element={<AddPlant />} />
                    <Route path="/detalle-planta" element={<PlantDetail />} />
                </Route>

                {/* 4. FALLBACK - Página 404 de tus compañeros */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Router>
    );
}

export default App;