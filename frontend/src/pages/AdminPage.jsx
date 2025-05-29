import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import imgStudent from './images/img_student.png';

function AdminPage() {
    const [facultati, setFacultati] = useState([]);
    const [nume, setNume] = useState('');
    const [decan, setDecan] = useState('');
    const [editingId, setEditingId] = useState(null);

    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchFacultati = async () => {
            try {
                const res = await axios.get('http://localhost:3001/api/admin/faculties', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = res.data.map(f => ({
                    id: f.id || f.facultate_id,
                    nume: f.nume,
                    decan: f.decan || ''
                }));
                setFacultati(data);
            } catch (err) {
                console.error('Eroare la fetch facultăți:', err);
            }
        };

        fetchFacultati();
    }, [token]);

    const adaugaSauActualizeazaFacultate = async () => {
        if (!nume.trim() || !decan.trim()) return;

        try {
            if (editingId) {
                const res = await axios.put(
                    `http://localhost:3001/api/admin/faculties/${editingId}`,
                    { nume, decan },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setFacultati(facultati.map(f => (f.id === editingId ? res.data.facultate : f)));
                setEditingId(null);
            } else {
                const res = await axios.post(
                    'http://localhost:3001/api/admin/faculties',
                    { nume, decan },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                const newFac = res.data.facultate;
                setFacultati([...facultati, {
                    id: newFac.id || newFac.facultate_id,
                    nume: newFac.nume,
                    decan: newFac.decan
                }]);
            }

            setNume('');
            setDecan('');
        } catch (err) {
            console.error('Eroare la salvare facultate:', err);
        }
    };

    const stergeFacultate = async (id) => {
        try {
            await axios.delete(`http://localhost:3001/api/admin/faculties/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setFacultati(facultati.filter(f => f.id !== id));
        } catch (err) {
            console.error('Eroare la ștergere:', err);
        }
    };

    const startEditare = (f) => {
        setEditingId(f.id);
        setNume(f.nume);
        setDecan(f.decan);
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

            {/* Content */}
            <div style={{ flexGrow: 1, backgroundColor: '#fff', padding: '40px', display: 'flex', justifyContent: 'center' }}>
                <div style={{ width: '100%', maxWidth: '700px', border: '3px solid #154c79', borderRadius: '10px', padding: '30px', background: '#f9f9f9' }}>
                    <h1 style={{ color: '#e07238', textAlign: 'center', marginBottom: '30px' }}>Manipulare Facultăți</h1>

                    <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
                        <input
                            type="text"
                            value={nume}
                            onChange={(e) => setNume(e.target.value)}
                            placeholder="Nume facultate"
                            style={inputStyle}
                        />
                        <input
                            type="text"
                            value={decan}
                            onChange={(e) => setDecan(e.target.value)}
                            placeholder="Nume decan"
                            style={inputStyle}
                        />
                        <button onClick={adaugaSauActualizeazaFacultate} style={buttonStyle}>
                            {editingId ? 'Salvează' : 'Adaugă'}
                        </button>
                        {editingId && (
                            <button onClick={() => {
                                setEditingId(null);
                                setNume('');
                                setDecan('');
                            }} style={{ ...buttonStyle, backgroundColor: '#9E9E9E' }}>Anulează</button>
                        )}
                    </div>

                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {facultati.map((f) => (
                            <li key={f.id} style={itemStyle}>
                                <span>{f.nume} – {f.decan}</span>
                                <div>
                                    <button onClick={() => startEditare(f)} style={{ ...deleteButton, backgroundColor: '#B9B291', marginRight: '10px' }}>Editează</button>
                                    <button onClick={() => stergeFacultate(f.id)} style={{...deleteButton, backgroundColor: '#2c3e50'}}>Șterge</button>
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

const inputStyle = {
    flex: 1,
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontSize: '16px',
    minWidth: '150px'
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
    marginBottom: '10px',
    flexWrap: 'wrap',
    gap: '10px'
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
