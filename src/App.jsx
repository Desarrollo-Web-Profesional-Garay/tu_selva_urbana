import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import Feed from './pages/Feed';
import Quiz from './pages/Quiz';
import Recommendations from './pages/Recommendations';
import MyPlants from './pages/MyPlants';

// Importamos las nuevas vistas de administración
import AdminPanel from './pages/AdminPanel'; 
import AdminPlantDetail from './pages/AdminPlantDetail'; 

function App() {
    return (
        <Router>
            <Routes>
                {/* Landing Page inicial */}
                <Route path="/" element={<LandingPage />} />

                {/* Rutas que comparten el Sidebar y diseño principal */}
                <Route element={<Layout />}>
                    <Route path="/feed" element={<Feed />} />
                    <Route path="/recomendaciones" element={<Recommendations />} />
                    <Route path="/mis-plantas" element={<MyPlants />} />
                    
                    {/* Sección de Administración */}
                    <Route path="/admin" element={<AdminPanel />} />
                    
                    {/* Vista de detalle profundo para el admin */}
                    <Route path="/admin/detalle" element={<AdminPlantDetail />} />
                </Route>

                {/* Flujos sin navegación lateral */}
                <Route path="/quiz" element={<Quiz />} />

                {/* Redirección por defecto */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
}

export default App;