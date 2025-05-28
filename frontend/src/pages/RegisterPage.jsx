import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import imgStudent from './images/img_student.png';

function RegisterPage() {
    const [formData, setFormData] = useState({
        nume_utilizator: '',
        parola: '',
        email: '',
        grupa: '',
        facultate_id: '',
        rol: 'student'
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const endpoint = `http://localhost:3000/api/register/${formData.rol}`;
            const payload = { ...formData };
            if (formData.rol !== 'student') {
                delete payload.grupa;
                delete payload.facultate_id;
            }

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (response.ok) {
                alert(data.message);
                navigate('/login');
            } else {
                setError(data.message || 'Eroare la înregistrare');
            }
        } catch (err) {
            setError('Eroare la conectare cu serverul');
        }
    };

    return (
        <div style={{ display: 'flex', height: '100vh', background: 'linear-gradient(to right, #2c3e50, #4ca64c)' }}>
            <div style={{ width: '300px', backgroundColor: '#2c3e50', color: 'white', padding: '40px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <img src={imgStudent} alt="UPB Logo" style={{ maxWidth: '100%', marginBottom: '20px', borderRadius: '8px' }} />
                <h2 style={{ color: '#e07238', marginBottom: '20px' }}>Înregistrare utilizator</h2>

                {error && <div style={{ backgroundColor: '#ffcccc', color: 'red', padding: '10px', marginBottom: '10px', border: '1px solid red', width: '100%', textAlign: 'center' }}>{error}</div>}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                    <label style={{ marginBottom: '5px' }}>Rol:</label>
                    <select name="rol" value={formData.rol} onChange={handleChange} style={{ marginBottom: '15px', padding: '8px' }}>
                        <option value="student">Student</option>
                        <option value="secretar">Secretar</option>
                        <option value="admin">Admin</option>
                    </select>

                    <label style={{ marginBottom: '5px' }}>Nume utilizator:</label>
                    <input name="nume_utilizator" value={formData.nume_utilizator} onChange={handleChange} required style={{ marginBottom: '15px', padding: '8px' }} />

                    <label style={{ marginBottom: '5px' }}>Parolă:</label>
                    <input type="password" name="parola" value={formData.parola} onChange={handleChange} required style={{ marginBottom: '15px', padding: '8px' }} />

                    <label style={{ marginBottom: '5px' }}>Email:</label>
                    <input name="email" value={formData.email} onChange={handleChange} required style={{ marginBottom: '15px', padding: '8px' }} />

                    {formData.rol === 'student' && (
                        <>
                            <label style={{ marginBottom: '5px' }}>Grupă:</label>
                            <input name="grupa" value={formData.grupa} onChange={handleChange} required style={{ marginBottom: '15px', padding: '8px' }} />

                            <label style={{ marginBottom: '5px' }}>ID Facultate:</label>
                            <input name="facultate_id" value={formData.facultate_id} onChange={handleChange} required style={{ marginBottom: '15px', padding: '8px' }} />
                        </>
                    )}

                    <button type="submit" style={{ backgroundColor: '#e07238', border: 'none', padding: '10px', cursor: 'pointer', color: 'white', fontWeight: 'bold' }}>Înregistrare</button>
                </form>

                <div style={{ marginTop: '20px', width: '100%', textAlign: 'center' }}>
                    <Link to="/login" style={{ color: '#e07238', fontWeight: 'bold', textDecoration: 'none' }}>
                        Ai deja cont? Autentifică-te
                    </Link>
                </div>
            </div>

            <div style={{ flexGrow: 1, backgroundColor: '#fff' }}>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                    <div style={{ border: '3px solid #154c79', padding: '30px 40px', borderRadius: '10px', textAlign: 'center' }}>
                        <p style={{ color: '#e07238', fontSize: '24px', fontWeight: 'bold', margin: 0 }}>
                            Creează un cont nou
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;
