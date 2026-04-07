import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useContext } from 'react';
import { GlobalContext } from './context/GlobalContext';
import Layout from './components/Layout';
import Footer from './components/Footer';
import QuizNudge from './components/QuizNudge';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Feed from './pages/Feed';
import Quiz from './pages/Quiz';
import Recommendations from './pages/Recommendations';
import MyPlants from './pages/MyPlants';
import MyAccount from './pages/MyAccount';
import Catalog from './pages/Catalog';
import NotFound from './pages/NotFound';
import ResetPassword from './pages/ResetPassword';

// Wrapper que protege rutas internas
function ProtectedRoute({ children }) {
    const { isAuthenticated } = useContext(GlobalContext);
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    return children;
}

// Layout interno con Footer y QuizNudge
function InnerLayout() {
    return (
        <>
            <Layout />
            <QuizNudge />
        </>
    );
}

function App() {
    return (
        <Router>
            <Routes>
                {/* Landing Page pública */}
                <Route path="/" element={<LandingPage />} />

                {/* Login / Registro / Verificación */}
                <Route path="/login" element={<Login />} />
                <Route path="/registro" element={<Login />} />

                {/* Recuperación de contraseña */}
                <Route path="/reset-password" element={<ResetPassword />} />

                {/* Quiz (accesible sin auth para flujo de landing) */}
                <Route path="/quiz" element={<Quiz />} />

                {/* Rutas protegidas con layout principal */}
                <Route element={<ProtectedRoute><InnerLayout /></ProtectedRoute>}>
                    <Route path="/feed" element={<Feed />} />
                    <Route path="/recomendaciones" element={<Recommendations />} />
                    <Route path="/catalogo" element={<Catalog />} />
                    <Route path="/mis-plantas" element={<MyPlants />} />
                    <Route path="/mi-cuenta" element={<MyAccount />} />
                </Route>

                {/* 404 — NO redirige, mantiene la sesión */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Router>
    );
}

export default App;
