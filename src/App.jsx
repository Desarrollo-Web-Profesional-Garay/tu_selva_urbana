import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { GlobalContext } from './context/GlobalContext';

// Componentes de Estructura
import Layout from './components/Layout';

// Páginas Públicas
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Quiz from './pages/Quiz';

// Páginas Privadas (Dentro del App con Layout)
import Feed from './pages/Feed';
import Recommendations from './pages/Recommendations';
import Catalog from './pages/Catalog';
import MyPlants from './pages/MyPlants';
import MyAccount from './pages/MyAccount';

// --- NUEVAS PÁGINAS DEL FLUJO DE VENTA ---
import AddPlant from './pages/PlantForm';
import PlantDetail from './pages/PlantDetail';

// --- PÁGINA DE ADMINISTRACIÓN ---
import AdminPanel from './pages/AdminPanel';

/**
 * Componente para proteger rutas que requieren autenticación.
 * Redirige al login si el usuario no ha iniciado sesión.
 */
function ProtectedRoute({ children }) {
    const { isAuthenticated } = useContext(GlobalContext);
    
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    
    return children;
}

function App() {
    return (
        <Router>
            <Routes>
                {/* 1. RUTAS PÚBLICAS */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/quiz" element={<Quiz />} />

                {/* 2. RUTA DE ADMINISTRACIÓN (Protegida, pero sin el Layout estándar) */}
                <Route 
                    path="/admin" 
                    element={
                        <ProtectedRoute>
                            <AdminPanel />
                        </ProtectedRoute>
                    } 
                />

                {/* 3. RUTAS PROTEGIDAS (Envueltas en el Layout de usuario) */}
                <Route 
                    element={
                        <ProtectedRoute>
                            <Layout />
                        </ProtectedRoute>
                    }
                >
                    {/* Navegación Principal */}
                    <Route path="/feed" element={<Feed />} />
                    <Route path="/recomendaciones" element={<Recommendations />} />
                    <Route path="/catalogo" element={<Catalog />} />
                    <Route path="/mis-plantas" element={<MyPlants />} />
                    <Route path="/mi-cuenta" element={<MyAccount />} />

                    {/* --- FLUJO DE VENTA Y VISUALIZACIÓN --- */}
                    <Route path="/vender" element={<AddPlant />} />
                    <Route path="/detalle-planta" element={<PlantDetail />} />
                </Route>

                {/* 4. FALLBACK (Redirección por defecto) */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
}

export default App;