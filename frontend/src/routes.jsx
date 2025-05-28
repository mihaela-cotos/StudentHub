import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import SecretaryPage from './pages/SecretaryPage';
import RegisterPage from './pages/RegisterPage';
import FacultyPage from './pages/FacultyPage';
import StudentPage from './pages/StudentPage';



const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/secretar" element={<SecretaryPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/facultate" element={<FacultyPage />} />
            <Route path="/student" element={<StudentPage />} />
            <Route path="/Dima" element={<h1>Asta e site-ul meu, fac ce vreu."</h1>} />
            <Route path="*" element={<h1>404 - Pagina nu există</h1>} />
        </Routes>
    );
};

export default AppRoutes;

