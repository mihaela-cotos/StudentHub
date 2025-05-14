import { useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import imgStudent from './img_student.png';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [parola, setParola] = useState('');
    const [error, setError] = useState('');

    // Funcția care se apelează la trimiterea formularului de autentificare
    const handleLogin = async (e) => {
        e.preventDefault();

        let role = '';
        // Determină rolul utilizatorului pe baza email-ului
        if (email.includes('@student.com')) role = 'student';
        else if (email.includes('@secretar.com')) role = 'secretar';
        else if (email.includes('@admin.com')) role = 'admin';
        else {
            setError('Email invalid');
            return;
        }

        try {
            // Trimite cererea POST către backend (student, secretar, admin)
            const res = await API.post(`/auth/${role}`, { nume_utilizator: email, parola });
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('rol', res.data.user.rol);

            // Redirect based on role
            if (res.data.user.rol === 'admin') window.location.href = '/admin';
            else if (res.data.user.rol === 'secretar') window.location.href = '/secretar';
            else window.location.href = '/student';
        } catch (err) {
            setError(err.response?.data?.message || 'Eroare la login');
        }
    };

    return (
        <div style={{
            display: 'flex',
            height: '100vh',
            background: 'linear-gradient(to right, #2c3e50, #4ca64c)',
        }}>
            <div style={{
                width: '300px',
                backgroundColor: '#2c3e50',
                color: 'white',
                padding: '40px 20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <img
                    src={imgStudent}
                    alt="UPB Logo"
                    style={{
                        maxWidth: '100%',
                        marginBottom: '20px',
                        borderRadius: '8px'
                    }}
                />
                
                <h2 style={{ marginBottom: '20px', color: '#e07238' }}>Autentificare utilizator</h2>

                {error && (
                    <div style={{
                        backgroundColor: '#ffcccc',
                        color: 'red',
                        padding: '10px',
                        marginBottom: '10px',
                        border: '1px solid red',
                        width: '100%',
                        textAlign: 'center'
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                    <button
                        onClick={() => window.location.href = '/admin'}
                        style={{
                            marginTop: '10px',
                            backgroundColor: '#2e7d32',
                            border: 'none',
                            padding: '10px',
                            cursor: 'pointer',
                            color: 'white',
                            fontWeight: 'bold',
                            width: '100%'
                        }}
                    >
                        Pagina Admin
                    </button>

                    <label style={{ marginBottom: '5px' }}>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                        style={{ marginBottom: '15px', padding: '8px' }}
                    />

                    <label style={{ marginBottom: '5px' }}>Parola:</label>
                    <input
                        type="password"
                        value={parola}
                        onChange={e => setParola(e.target.value)}
                        required
                        style={{ marginBottom: '15px', padding: '8px' }}
                    />

                    <button type="submit" style={{
                        backgroundColor: '#e07238',
                        border: 'none',
                        padding: '10px',
                        cursor: 'pointer',
                        color: 'white',
                        fontWeight: 'bold'
                    }}>Login</button>
                </form>

                <div style={{ marginTop: '20px', width: '100%' }}>
                    <Link to="/reset-password" style={{ color: '#e07238', display: 'block', marginBottom: '5px' }}>Resetare parola</Link>
                    <Link to="/home" style={{ color: '#e07238', display: 'block', marginBottom: '5px' }}>Home</Link>
                    <Link to="/info" style={{ color: '#e07238', display: 'block', marginBottom: '5px' }}>Informații generale</Link>
                    <Link to="/contact" style={{ color: '#e07238', display: 'block', marginBottom: '5px' }}>Contact</Link>
                </div>
            </div>

            <div style={{ flexGrow: 1, backgroundColor: '#fff' }}>
                <div style={{
                    flexGrow: 1,
                    backgroundColor: '#fff',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh'
                }}>
                    <div style={{
                        border: '3px solid #154c79',
                        padding: '30px 40px',
                        borderRadius: '10px',
                        textAlign: 'center'
                    }}>
                        <p style={{
                            color: '#e07238',
                            fontSize: '24px',
                            fontWeight: 'bold',
                            margin: 0
                        }}>
                            Vă rugăm să vă autentificați
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
