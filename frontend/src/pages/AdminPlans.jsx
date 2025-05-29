// AdminPlanuri.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import imgStudent from './images/img_student.png';

function AdminPlanuri() {
    const [plans, setPlans] = useState([]);
    const [nume, setNume] = useState('');
    const [sala, setSala] = useState('');
    const [profesor, setProfesor] = useState('');
    const [facultateId, setFacultateId] = useState('');
    const [anInvatamant, setAnInvatamant] = useState('');
    const [facultati, setFacultati] = useState([]);
    const [editingId, setEditingId] = useState(null);

    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [resPlans, resFacultati] = await Promise.all([
                    axios.get('http://localhost:3001/api/admin/plans', {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                    axios.get('http://localhost:3001/api/admin/faculties', {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                ]);

                setPlans(resPlans.data);
                setFacultati(resFacultati.data);
            } catch (err) {
                console.error('Eroare la fetch:', err);
            }
        };

        fetchData();
    }, [token]);

    const adaugaSauActualizeazaCurs = async () => {
        if (!nume.trim() || !facultateId.trim()) return;

        const payload = {
            nume,
            sala,
            profesor,
            facultate_id: facultateId,
            an_invatamant: anInvatamant
        };

        try {
            if (editingId) {
                const res = await axios.put(`http://localhost:3001/api/admin/plans/${editingId}`, payload, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setPlans(plans.map(p => (p.curs_id === editingId ? res.data.curs : p)));
                setEditingId(null);
            } else {
                const res = await axios.post('http://localhost:3001/api/admin/plans', payload, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setPlans([...plans, res.data.curs]);
            }

            setNume('');
            setSala('');
            setProfesor('');
            setFacultateId('');
            setAnInvatamant('');
        } catch (err) {
            console.error('Eroare la adăugare/actualizare curs:', err);
        }
    };

    const stergeCurs = async (id) => {
        try {
            await axios.delete(`http://localhost:3001/api/admin/plans/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPlans(plans.filter(c => c.curs_id !== id));
        } catch (err) {
            console.error('Eroare la ștergere curs:', err);
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
                    <h1 style={{ color: '#e07238', textAlign: 'center', marginBottom: '30px' }}>Planuri de Învățământ</h1>

                    <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
                        <input value={nume} onChange={(e) => setNume(e.target.value)} placeholder="Nume curs" style={inputStyle} />
                        <input value={sala} onChange={(e) => setSala(e.target.value)} placeholder="Sala" style={inputStyle} />
                        <input value={profesor} onChange={(e) => setProfesor(e.target.value)} placeholder="Profesor" style={inputStyle} />
                        <select value={facultateId} onChange={(e) => setFacultateId(e.target.value)} style={inputStyle}>
                            <option value="">Select faculty</option>
                            {facultati.map(f => (
                                <option key={f.facultate_id} value={f.facultate_id}>{f.nume}</option>
                            ))}
                        </select>
                        <input value={anInvatamant} onChange={(e) => setAnInvatamant(e.target.value)} placeholder="An" style={inputStyle} />
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                        <button onClick={adaugaSauActualizeazaCurs} style={buttonStyle}>
                            {editingId ? 'Salvează' : 'Adaugă'}
                        </button>
                        </div>

                    </div>

                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {plans.map((c) => (
                            <li key={c.curs_id} style={itemStyle}>
                                <span>{c.nume} (Prof: {c.profesor || '-'}) - {c.Facultate?.nume || `Fac ID ${c.facultate_id}`}</span>
                                <div>
                                    <button onClick={() => {
                                        setEditingId(c.curs_id);
                                        setNume(c.nume);
                                        setSala(c.sala || '');
                                        setProfesor(c.profesor || '');
                                        setFacultateId(c.facultate_id.toString());
                                        setAnInvatamant(c.an_invatamant || '');
                                    }} style={{ ...deleteButton, backgroundColor: '#B9B291', marginRight: '10px' }}>Editează</button>
                                    <button onClick={() => stergeCurs(c.curs_id)} style={{...deleteButton, backgroundColor: '#2c3e50'}}>Șterge</button>
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

export default AdminPlanuri;
