import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import imgStudent from './images/img_student.png';

function StudentPage() {
    const [cereri, setCereri] = useState([]);
    const [tipAdeverinta, setTipAdeverinta] = useState('');
    const [error, setError] = useState('');
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    useEffect(() => {
        fetchCereri();
    }, []);

    const fetchCereri = async () => {
        try {
            const res = await axios.get('http://localhost:3001/api/student/adeverinte', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCereri(res.data);
        } catch (err) {
            setError('Eroare la încărcarea cererilor');
        }
    };

    const adaugaCerere = async () => {
        if (!tipAdeverinta.trim()) {
            setError('Introduceți tipul adeverinței');
            return;
        }
        try {
            await axios.post('http://localhost:3001/api/student/adeverinte', {
                tip_adeverinta: tipAdeverinta
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTipAdeverinta('');
            fetchCereri();
        } catch (err) {
            setError('Eroare la trimiterea cererii');
        }
    };

    const stergeCerere = async (id) => {
        try {
            await axios.delete(`http://localhost:3001/api/student/adeverinte/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchCereri();
        } catch (err) {
            setError('Nu puteți șterge o cerere deja emisă sau a apărut o eroare');
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('rol');
        navigate('/login');
    };

    return (
        <div style={{ display: 'flex', height: '100vh', background: 'linear-gradient(to right, #2c3e50, #4ca64c)' }}>
            <div style={{ width: '300px', backgroundColor: '#2c3e50', color: 'white', padding: '30px 20px' }}>
                <img src={imgStudent} alt="Student" style={{ maxWidth: '100%', borderRadius: '8px', marginBottom: '20px' }} />
                <h2 style={{ color: '#e07238', marginBottom: '20px' }}>Student Dashboard</h2>
                <button onClick={logout} style={{ ...navBtn, backgroundColor: '#e74c3c' }}>🔙 Logout</button>
            </div>

            <div style={{ flexGrow: 1, backgroundColor: '#fff', padding: '40px' }}>
                <h1 style={{ color: '#2c3e50', textAlign: 'center', marginBottom: '30px' }}>Cereri Adeverință</h1>
                {error && <p style={{ color: 'red', marginBottom: '10px' }}>{error}</p>}
                <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                    <input
                        type="text"
                        placeholder="Tip Adeverință"
                        value={tipAdeverinta}
                        onChange={e => setTipAdeverinta(e.target.value)}
                        style={inputStyle}
                    />
                    <button onClick={adaugaCerere} style={btnGreen}>➕ Trimite cerere</button>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#ecf0f1', textAlign: 'left' }}>
                            <th style={thStyle}>ID</th>
                            <th style={thStyle}>Tip</th>
                            <th style={thStyle}>Data Cererii</th>
                            <th style={thStyle}>Data Emiterii</th>
                            <th style={thStyle}>Acțiuni</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cereri.map(c => (
                            <tr key={c.cerere_id}>
                                <td style={tdStyle}>{c.cerere_id}</td>
                                <td style={tdStyle}>{c.tip_adeverinta}</td>
                                <td style={tdStyle}>{new Date(c.data_cerere).toLocaleDateString()}</td>
                                <td style={tdStyle}>{c.data_emitere ? new Date(c.data_emitere).toLocaleDateString() : '–'}</td>
                                <td style={tdStyle}>
                                    {!c.data_emitere && <button onClick={() => stergeCerere(c.cerere_id)} style={btnRed}>Șterge</button>}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

const thStyle = { padding: '10px', borderBottom: '2px solid #bdc3c7', fontWeight: 'bold' };
const tdStyle = { padding: '10px', borderBottom: '1px solid #ecf0f1' };
const inputStyle = { padding: '10px', borderRadius: '6px', border: '1px solid #ccc', flex: 1 };
const btnGreen = { padding: '10px 20px', backgroundColor: '#2ecc71', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold' };
const btnRed = { padding: '6px 12px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' };
const navBtn = { display: 'block', width: '100%', padding: '10px', marginTop: '20px', backgroundColor: '#34495e', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' };

export default StudentPage;
