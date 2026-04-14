import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
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

// --- FLUJO DE VENTA Y VISUALIZACIÓN ---
import AddPlant from './pages/PlantForm';
import PlantDetail from './pages/PlantDetail';

// --- PÁGINAS DE ADMINISTRACIÓN ---
import AdminPanel from './pages/AdminPanel';
import UsersTable from './pages/UsersTable';

/**
 * Componente para proteger rutas que requieren autenticación general.
 * Soporta tanto children como Outlet para anidación flexible.
 */
function ProtectedRoute({ children }) {
    const { isAuthenticated } = useContext(GlobalContext);
    
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    
    // Si hay children, renderizarlos; si no, usar Outlet para rutas anidadas
    return children ? children : <Outlet />;
}

/**
 * Layout interno que incluye el Layout base, el Footer y el QuizNudge
 * usando Outlet para rutas anidadas (mejor práctica)
 */
function InnerLayout() {
    return (
        <div className="flex flex-col min-h-screen">
            <Layout />
            <main className="flex-grow">
                <Outlet /> {/* Aquí se renderizan las sub-rutas */}
            </main>
            <QuizNudge />
            <Footer />
        </div>
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

                {/* 2. RUTAS DE ADMINISTRACIÓN */}
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

                {/* 3. RUTAS PROTEGIDAS (Usando InnerLayout con Outlet) */}
                <Route 
                    element={
                        <ProtectedRoute>
                            <InnerLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route path="/feed" element={<Feed />} />
                    <Route path="/recomendaciones" element={<Recommendations />} />
                    <Route path="/catalogo" element={<Catalog />} />
                    <Route path="/mis-plantas" element={<MyPlants />} />
                    <Route path="/mi-cuenta" element={<MyAccount />} />
                    
                    {/* --- FLUJO DE VENTA Y VISUALIZACIÓN --- */}
                    <Route path="/vender" element={<AddPlant />} />
                    <Route path="/detalle-planta" element={<PlantDetail />} />
                </Route>

                {/* 4. FALLBACK - Página 404 */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Router>
    );
}

export default App;