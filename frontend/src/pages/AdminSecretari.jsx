import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import imgStudent from './images/img_student.png';

function AdminSecretari() {
    const [secretari, setSecretari] = useState([]);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchSecretari = async () => {
            try {
                const res = await axios.get('http://localhost:3001/api/admin/secretaries', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setSecretari(res.data);
            } catch (err) {
                console.error('Eroare la obținerea secretarilor:', err);
            }
        };
        fetchSecretari();
    }, [token]);
    

    const fetchSecretari = async () => {
        try {
            const res = await axios.get('http://localhost:3001/api/admin/secretaries', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSecretari(res.data);
        } catch (err) {
            console.error('Eroare la obținerea secretarilor:', err);
        }
    };

    const aprobaSecretar = async (id) => {
        try {
            await axios.put(`http://localhost:3001/api/admin/secretaries/${id}/approve`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchSecretari(); // refresh
        } catch (err) {
            console.error('Eroare la aprobare:', err);
        }
    };

    const stergeSecretar = async (id) => {
        try {
            await axios.delete(`http://localhost:3001/api/admin/secretaries/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSecretari(secretari.filter(s => s.secretar_id !== id));
        } catch (err) {
            console.error('Eroare la ștergere:', err);
        }
    };

    return (
        <div style={{ display: 'flex', height: '100vh', background: 'linear-gradient(to right, #2c3e50, #4ca64c)' }}>
            {/* Sidebar */}
            <div style={{ width: '300px', backgroundColor: '#2c3e50', color: 'white', padding: '30px 20px' }}>
                <img src={imgStudent} alt="Logo" style={{ maxWidth: '100%', borderRadius: '8px', marginBottom: '20px' }} />
                <h2 style={{ color: '#e07238', marginBottom: '20px' }}>Admin Dashboard</h2>

                <Link to="/admin/plans" style={linkStyle}>Planuri de învățământ</Link>
                <Link to="/admin" style={linkStyle}>Manipulare facultăți</Link>
                <Link to="/admin/secretaries" style={linkStyle}>Gestionează secretari</Link>
                <Link to="/" style={{ color: '#e07238', marginTop: 'auto', display: 'block' }}>🔙 Logout</Link>
            </div>

            <div style={{ flexGrow: 1, backgroundColor: '#fff', padding: '40px', display: 'flex', justifyContent: 'center' }}>
                <div style={{ width: '100%', maxWidth: '900px', border: '3px solid #154c79', borderRadius: '10px', padding: '30px', background: '#f9f9f9' }}>
                    <h1 style={{ color: '#e07238', textAlign: 'center', marginBottom: '30px' }}>Gestionează Secretari</h1>

                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {secretari.map(secretar => (
                            <li key={secretar.secretar_id} style={itemStyle}>
                                <span>
                                    👤 {secretar.Utilizator?.nume_utilizator} — 📧 {secretar.Utilizator?.email} 
                                    {secretar.approved ? ' ✅ Aprobat' : ' ❌ Neaprobat'}
                                </span>
                                <div>
                                    {!secretar.approved && (
                                        <button
                                            onClick={() => aprobaSecretar(secretar.secretar_id)}
                                            style={{ ...buttonStyle, backgroundColor: '#28a745', marginRight: '10px' }}
                                        >
                                            ✅ Approve
                                        </button>
                                    )}
                                    <button
                                        onClick={() => stergeSecretar(secretar.secretar_id)}
                                        style={deleteButton}
                                    >
                                        🗑️ Șterge
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}

const linkStyle = {
    display: 'block',
    color: '#fff',
    padding: '8px 0',
    textDecoration: 'none',
    fontWeight: 'bold',
};

const buttonStyle = {
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    padding: '6px 12px',
    cursor: 'pointer'
};

const deleteButton = {
    backgroundColor: '#e53935',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    padding: '6px 12px',
    cursor: 'pointer'
};

const itemStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: '#fff',
    border: '1px solid #ccc',
    padding: '12px 20px',
    borderRadius: '8px',
    marginBottom: '10px'
};

export default AdminSecretari;
