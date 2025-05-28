import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import FacultyPage from './pages/FacultyPage';
import SecretaryPage from './pages/SecretaryPage';


const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/admin/facultate/:id" element={<FacultyPage />} />
            <Route path="/secretar" element={<SecretaryPage />} />
            <Route path="/Dima" element={<h1>Asta e site-ul meu, fac ce vreu."</h1>} />
            <Route path="*" element={<h1>405 - Pagina nu există</h1>} />
        </Routes>
    );
};

export default AppRoutes;
