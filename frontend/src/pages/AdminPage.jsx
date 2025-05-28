import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import imgStudent from './images/img_student.png';

function AdminPage() {
    const [facultati, setFacultati] = useState([]);
    const [numeNou, setNumeNou] = useState('');
    const [decanNou, setDecanNou] = useState('');

    const token = localStorage.getItem('token');

    // Fetch facultati la incarcare
    useEffect(() => {
        const fetchFacultati = async () => {
            try {
                const res = await axios.get('http://localhost:3001/api/admin/faculties', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setFacultati(res.data);
            } catch (err) {
                console.error('Eroare la fetch facultăți:', err);
            }
        };

        fetchFacultati();
    }, [token]);

    const adaugaFacultate = async () => {
        if (!numeNou.trim() || !decanNou.trim()) return;

        try {
            const res = await axios.post(
                'http://localhost:3001/api/admin/faculties',
                { nume: numeNou, decan: decanNou },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setFacultati([...facultati, res.data.facultate]);
            setNumeNou('');
            setDecanNou('');
        } catch (err) {
            console.error('Eroare la adăugare:', err);
        }
    };

    const stergeFacultate = async (id) => {
        try {
            await axios.delete(`http://localhost:3001/api/admin/faculties/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setFacultati(facultati.filter(f => f.facultate_id !== id));
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

                <Link to="/admin/planuri" style={linkStyle}>Planuri de învățământ</Link>
                <Link to="/admin" style={linkStyle}>🏫 Manipulare facultăți</Link>
                <Link to="/admin/secretari" style={linkStyle}>Gestionează secretari</Link>

                <div style={{ borderTop: '1px solid #555', paddingTop: '15px', marginTop: '20px' }}>
                    <p style={{ color: '#e07238' }}>Facultăți existente:</p>
                    {facultati.map(f => (
                        <Link
                            key={f.facultate_id}
                            to={`/admin/facultate/${f.facultate_id}`}
                            style={{ ...linkStyle, fontSize: '14px', paddingLeft: '10px' }}
                        >
                            • {f.nume}
                        </Link>
                    ))}
                </div>

                <Link to="/" style={{ color: '#e07238', marginTop: 'auto', display: 'block' }}>🔙 Logout</Link>
            </div>

            {/* Conținut */}
            <div style={{ flexGrow: 1, backgroundColor: '#fff', padding: '40px', display: 'flex', justifyContent: 'center' }}>
                <div style={{ width: '100%', maxWidth: '700px', border: '3px solid #154c79', borderRadius: '10px', padding: '30px', background: '#f9f9f9' }}>
                    <h1 style={{ color: '#e07238', textAlign: 'center', marginBottom: '30px' }}>Manipulare Facultăți</h1>

                    <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                        <input
                            type="text"
                            value={numeNou}
                            onChange={(e) => setNumeNou(e.target.value)}
                            placeholder="Nume facultate"
                            style={inputStyle}
                        />
                        <input
                            type="text"
                            value={decanNou}
                            onChange={(e) => setDecanNou(e.target.value)}
                            placeholder="Nume decan"
                            style={inputStyle}
                        />
                        <button onClick={adaugaFacultate} style={buttonStyle}>Adaugă</button>
                    </div>

                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {facultati.map((f) => (
                            <li key={f.facultate_id} style={itemStyle}>
                                <span>{f.nume}</span>
                                <button onClick={() => stergeFacultate(f.facultate_id)} style={deleteButton}>Șterge</button>
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

const inputStyle = {
    flex: 1,
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontSize: '16px'
};

const buttonStyle = {
    backgroundColor: '#e07238',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    padding: '10px 20px',
    fontWeight: 'bold',
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

const deleteButton = {
    backgroundColor: '#e53935',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    padding: '6px 12px',
    cursor: 'pointer'
};

export default AdminPage;
