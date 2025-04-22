import { useState } from 'react';
import API from '../services/api';

// function LoginPage() {
//     return (
//         <div>
//             <h1>Salut, aceasta este pagina de login!</h1>
//         </div>
//     );
// }

function LoginPage() {
    const [email, setEmail] = useState('');
    const [parola, setParola] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await API.post('/auth/login', { email, parola });
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('rol', res.data.user.rol);
            // Redirectează către dashboard-ul potrivit
            if (res.data.user.rol === 'admin') window.location.href = '/admin';
            else if (res.data.user.rol === 'secretar') window.location.href = '/secretar';
            else window.location.href = '/student';
        } catch (err) {
            setError(err.response?.data?.msg || 'Eroare la login');
        }
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
            {error && <p style={{color: 'red'}}>{error}</p>}
            <form onSubmit={handleLogin}>
                <input type="email" placeholder="Email" value={email}
                       onChange={e => setEmail(e.target.value)} required />
                <input type="password" placeholder="Parola" value={parola}
                       onChange={e => setParola(e.target.value)} required />
                <button type="submit">Autentificare</button>
            </form>
        </div>
    );
}

export default LoginPage;
