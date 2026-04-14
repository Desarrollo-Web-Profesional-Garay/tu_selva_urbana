import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { GlobalContext } from './context/GlobalContext';

// Componentes de Estructura y Protección
import Layout from './components/Layout';
import AdminRoute from './components/AdminRoute';
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

// Flujo de Venta y Visualización
import AddPlant from './pages/PlantForm';
import PlantDetail from './pages/PlantDetail';

// Páginas de Administración
import AdminPanel from './pages/AdminPanel';
import UsersTable from './pages/UsersTable';

// Wrapper que protege rutas internas
function ProtectedRoute({ children }) {
    const { isAuthenticated } = useContext(GlobalContext);
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    return children;
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
                <Route path="/admin" element={<AdminRoute><AdminPanel /></AdminRoute>} />
                <Route path="/admin/usuarios" element={<AdminRoute><UsersTable /></AdminRoute>} />

                {/* 3. Rutas protegidas con layout principal */}
                <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                    <Route path="/feed" element={<><Feed /><QuizNudge /></>} />
                    <Route path="/recomendaciones" element={<Recommendations />} />
                    <Route path="/catalogo" element={<Catalog />} />
                    <Route path="/mis-plantas" element={<MyPlants />} />
                    <Route path="/mi-cuenta" element={<MyAccount />} />
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
