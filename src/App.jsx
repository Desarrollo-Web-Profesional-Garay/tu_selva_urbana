import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { GlobalContext } from './context/GlobalContext';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Feed from './pages/Feed';
import Quiz from './pages/Quiz';
import Recommendations from './pages/Recommendations';
import MyPlants from './pages/MyPlants';
import MyAccount from './pages/MyAccount';
import Catalog from './pages/Catalog';

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
                {/* Landing Page pública */}
                <Route path="/" element={<LandingPage />} />

                {/* Login / Registro */}
                <Route path="/login" element={<Login />} />

                {/* Rutas protegidas con el layout principal */}
                <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                    <Route path="/feed" element={<Feed />} />
                    <Route path="/recomendaciones" element={<Recommendations />} />
                    <Route path="/catalogo" element={<Catalog />} />
                    <Route path="/mis-plantas" element={<MyPlants />} />
                    <Route path="/mi-cuenta" element={<MyAccount />} />
                </Route>

                {/* Quiz inmersivo (accesible sin auth para el flujo de la Landing) */}
                <Route path="/quiz" element={<Quiz />} />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
}

export default App;
