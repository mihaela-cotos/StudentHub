import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import imgStudent from './images/img_student.png';

function LoginPage() {
    // Stări pentru nume utilizator, parolă, eroare și rol selectat
    const [numeUtilizator, setNumeUtilizator] = useState('');
    const [parola, setParola] = useState('');
    const [error, setError] = useState('');
    const [selectedRole, setSelectedRole] = useState('');

    // Funcția apelată la trimiterea formularului de login
    const handleLogin = async (e) => {
        e.preventDefault();

        // Verifică dacă s-a selectat un rol
        if (!selectedRole) {
            setError('Selectați un rol pentru autentificare');
            return;
        }

        try {
            // Trimitere cerere POST către endpoint-ul de autentificare
            const response = await fetch(`http://localhost:3000/api/login/${selectedRole}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nume_utilizator: numeUtilizator,
                    parola: parola,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                // Salvare token și rol în localStorage
                localStorage.setItem('token', data.token);
                localStorage.setItem('rol', selectedRole);
                alert('Autentificare reușită!');

                // Redirecționare către dashboard-ul corespunzător
                if (selectedRole === 'admin') window.location.href = '/admin';
                else if (selectedRole === 'secretar') window.location.href = '/secretar';
                else window.location.href = '/student';
            } else {
                // Afișare mesaj de eroare primit de la server
                setError(data.message || 'Eroare la autentificare');
            }
        } catch (err) {
            // Afișare eroare generală la eșecul conectării
            setError('Eroare la conectare cu serverul');
        }
    };

    return (
        <div style={{
            display: 'flex',
            height: '100vh',
            background: 'linear-gradient(to right, #2c3e50, #4ca64c)',
            overflow: 'auto'
        }}>
            {/* Bara laterală de login */}
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
                {/* Logo */}
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

                {/* Mesaj de eroare */}
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

                {/* Formular de autentificare */}
                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                    <label style={{ marginBottom: '5px' }}>Rol:</label>
                    {/* Butoane pentru alegerea rolului */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                        {['student', 'secretar', 'admin'].map((role, index) => (
                            <button
                                key={role}
                                type="button"
                                onClick={() => setSelectedRole(role)}
                                style={{
                                    flex: 1,
                                    marginRight: index < 2 ? '5px' : '0',
                                    backgroundColor: selectedRole === role ? '#e07238' : '#fff',
                                    color: selectedRole === role ? '#fff' : '#000',
                                    border: '1px solid #ccc',
                                    padding: '8px',
                                    cursor: 'pointer'
                                }}
                            >
                                {role.charAt(0).toUpperCase() + role.slice(1)}
                            </button>
                        ))}
                    </div>

                    {/* Câmpuri pentru nume utilizator și parolă */}
                    <label style={{ marginBottom: '5px' }}>Nume utilizator:</label>
                    <input
                        type="text"
                        value={numeUtilizator}
                        onChange={e => setNumeUtilizator(e.target.value)}
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

                    {/* Buton de login */}
                    <button type="submit" style={{
                        backgroundColor: '#e07238',
                        border: 'none',
                        padding: '10px',
                        cursor: 'pointer',
                        color: 'white',
                        fontWeight: 'bold'
                    }}>Login</button>
                </form>

                {/* Linkuri utile */}
                <div style={{ marginTop: '20px', width: '100%' }}>
                    <Link to="/reset-password" style={{ color: '#e07238', display: 'block', marginBottom: '5px' }}>Resetare parolă</Link>
                    <Link to="/home" style={{ color: '#e07238', display: 'block', marginBottom: '5px' }}>Home</Link>
                    <Link to="/info" style={{ color: '#e07238', display: 'block', marginBottom: '5px' }}>Informații generale</Link>
                    <Link to="/contact" style={{ color: '#e07238', display: 'block', marginBottom: '5px' }}>Contact</Link>
                    <Link to="/register" style={{ color: '#e07238', display: 'block', marginTop: '15px', fontWeight: 'bold' }}>
                        Nu ai cont? Înregistrează-te
                    </Link>
                </div>
            </div>

            {/* Zona centrală de întâmpinare */}
            <div style={{ flexGrow: 1, backgroundColor: '#fff' }}>
                <div style={{
                    flexGrow: 1,
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
