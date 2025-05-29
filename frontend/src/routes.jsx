import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import SecretaryPage from './pages/SecretaryPage';
import AdminSecretari from './pages/AdminSecretari';
import AdminPlans from './pages/AdminPlans';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/secretar" element={<SecretaryPage />} />
            <Route path="/admin/plans" element={<AdminPlans />} />
            <Route path="/admin/secretaries" element={<AdminSecretari />} />
            <Route path="/Dima" element={<h1>Asta e site-ul meu, fac ce vreu."</h1>} />
            <Route path="*" element={<h1>404 - Pagina nu există</h1>} />
        </Routes>
    );
};

export default AppRoutes;

