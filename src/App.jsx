import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import Feed from './pages/Feed';
import Quiz from './pages/Quiz';
import Recommendations from './pages/Recommendations';
import MyPlants from './pages/MyPlants';

function App() {
    return (
        <Router>
            <Routes>
                {/* Nueva Landing Page 3D Híbrida */}
                <Route path="/" element={<LandingPage />} />

                {/* Rutas con el layout principal (Sidebar Desktop / Bottom Nav Mobile) */}
                <Route element={<Layout />}>
                    <Route path="/feed" element={<Feed />} />
                    <Route path="/recomendaciones" element={<Recommendations />} />
                    <Route path="/mis-plantas" element={<MyPlants />} />
                </Route>

                {/* Ruta clásica sin Nav (Flujo inmersivo por si se accede directo /quiz) */}
                <Route path="/quiz" element={<Quiz />} />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
}

export default App;
