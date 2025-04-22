import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="*" element={<h2>404 - Pagina nu există</h2>} />
        </Routes>
    );
};

export default AppRoutes;

