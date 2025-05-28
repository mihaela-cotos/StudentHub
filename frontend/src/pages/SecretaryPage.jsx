import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import imgStudent from './images/img_student.png';

function SecretarPage() {
    const [activeTab, setActiveTab] = useState('cereri');
    const [cereri, setCereri] = useState([]);
    const [note, setNote] = useState([]);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [tipAdeverinta, setTipAdeverinta] = useState('');
    const [studentId, setStudentId] = useState('');
    const [notaNoua, setNotaNoua] = useState({ student_id: '', curs_id: '', valoare: '' });
    const [newStudent, setNewStudent] = useState({ nume: '', grupa: '' });
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    useEffect(() => {
        fetchCereri();
        fetchNote();
        fetchStudents();
    }, [token]);

    const logout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const fetchCereri = async () => {
        try {
            const res = await axios.get('http://localhost:3001/api/secretar/cereri', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCereri(res.data);
            setLoading(false);
        } catch (err) {
            setError('Eroare la încărcarea cererilor');
            setLoading(false);
        }
    };

    const fetchNote = async () => {
        try {
            const res = await axios.get('http://localhost:3001/api/secretar/grades', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNote(res.data);
        } catch (err) {
            console.error('Eroare la încărcarea notelor');
        }
    };

    const fetchStudents = async () => {
        try {
            const res = await axios.get('http://localhost:3001/api/secretar/students', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStudents(res.data);
        } catch (err) {
            console.error('Eroare la încărcarea studenților');
        }
    };

    const emitereCerere = async (id) => {
        try {
            await axios.put(`http://localhost:3001/api/secretar/cereri/${id}/emitere`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchCereri();
        } catch (err) {
            alert('Eroare la emiterea cererii');
        }
    };

    const stergeCerere = async (id) => {
        try {
            await axios.delete(`http://localhost:3001/api/secretar/cereri/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchCereri();
        } catch (err) {
            alert('Eroare la ștergere');
        }
    };

    const adaugaCerere = async () => {
        if (!studentId || !tipAdeverinta.trim()) {
            alert('Completează toate câmpurile');
            return;
        }
        try {
            await axios.post('http://localhost:3001/api/secretar/cereri', {
                student_id: studentId,
                tip_adeverinta: tipAdeverinta
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTipAdeverinta('');
            setStudentId('');
            fetchCereri();
        } catch (err) {
            alert('Eroare la adăugare');
        }
    };

    const adaugaNota = async () => {
        try {
            await axios.post('http://localhost:3001/api/secretar/grades', notaNoua, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotaNoua({ student_id: '', curs_id: '', valoare: '' });
            fetchNote();
        } catch (err) {
            alert('Eroare la adăugare/actualizare notă');
        }
    };

    const adaugaStudent = async () => {
        if (!newStudent.nume || !newStudent.grupa) {
            alert('Completează toate câmpurile');
            return;
        }
        try {
            await axios.post('http://localhost:3001/api/secretar/students', newStudent, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNewStudent({ nume: '', grupa: '' });
            fetchStudents();
        } catch (err) {
            alert('Eroare la adăugarea studentului');
        }
    };

    const stergeStudent = async (id) => {
        try {
            await axios.delete(`http://localhost:3001/api/secretar/students/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchStudents();
        } catch (err) {
            alert('Eroare la ștergerea studentului');
        }
    };

    return (
        <div style={{ display: 'flex', height: '100vh', background: 'linear-gradient(to right, #2c3e50, #4ca64c)' }}>
            <div style={{ width: '300px', backgroundColor: '#2c3e50', color: 'white', padding: '30px 20px', display: 'flex', flexDirection: 'column' }}>
                <img src={imgStudent} alt="Logo" style={{ maxWidth: '100%', borderRadius: '8px', marginBottom: '20px' }} />
                <h2 style={{ color: '#e07238', marginBottom: '20px' }}>Secretar Dashboard</h2>
                <button onClick={() => setActiveTab('cereri')} style={navBtn}>Cereri Adeverință</button>
                <button onClick={() => setActiveTab('note')} style={navBtn}>Note Studenți</button>
                <button onClick={() => setActiveTab('studenti')} style={navBtn}>Studenți</button>
                <button onClick={logout} style={{ ...navBtn, backgroundColor: '#e74c3c', marginTop: 'auto' }}>🔙 Logout</button>
            </div>

            <div style={{ flexGrow: 1, backgroundColor: '#fff', padding: '40px' }}>
                {activeTab === 'cereri' && <CereriSection {...{ cereri, studentId, tipAdeverinta, setStudentId, setTipAdeverinta, adaugaCerere, emitereCerere, stergeCerere }} />}
                {activeTab === 'note' && <NoteSection {...{ note, notaNoua, setNotaNoua, adaugaNota }} />}
                {activeTab === 'studenti' && <StudentSection {...{ students, newStudent, setNewStudent, adaugaStudent, stergeStudent }} />}
            </div>
        </div>
    );
}

function CereriSection({ cereri, studentId, tipAdeverinta, setStudentId, setTipAdeverinta, adaugaCerere, emitereCerere, stergeCerere }) {
    return (
        <div>
            <h1 style={{ color: '#2c3e50', textAlign: 'center', marginBottom: '30px' }}>Cereri Adeverință</h1>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <input type="number" placeholder="ID Student" value={studentId} onChange={e => setStudentId(e.target.value)} style={inputStyle} />
                <input type="text" placeholder="Tip Adeverință" value={tipAdeverinta} onChange={e => setTipAdeverinta(e.target.value)} style={inputStyle} />
                <button onClick={adaugaCerere} style={btnGreen}>➕ Adaugă cerere</button>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ backgroundColor: '#ecf0f1', textAlign: 'left' }}>
                        <th style={thStyle}>ID Cerere</th>
                        <th style={thStyle}>ID Student</th>
                        <th style={thStyle}>Grupă</th>
                        <th style={thStyle}>Tip Adeverință</th>
                        <th style={thStyle}>Data Cererii</th>
                        <th style={thStyle}>Data Emiterii</th>
                        <th style={thStyle}>Acțiuni</th>
                    </tr>
                </thead>
                <tbody>
                    {cereri.map(c => (
                        <tr key={c.cerere_id}>
                            <td style={tdStyle}>{c.cerere_id}</td>
                            <td style={tdStyle}>{c.student_id}</td>
                            <td style={tdStyle}>{c.Student?.grupa}</td>
                            <td style={tdStyle}>{c.tip_adeverinta}</td>
                            <td style={tdStyle}>{new Date(c.data_cerere).toLocaleDateString()}</td>
                            <td style={tdStyle}>{c.data_emitere ? new Date(c.data_emitere).toLocaleDateString() : '–'}</td>
                            <td style={tdStyle}>
                                {!c.data_emitere && <button onClick={() => emitereCerere(c.cerere_id)} style={btnBlue}>Emite</button>}
                                <button onClick={() => stergeCerere(c.cerere_id)} style={{ ...btnRed, marginLeft: '8px' }}>Șterge</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function NoteSection({ note, notaNoua, setNotaNoua, adaugaNota }) {
    return (
        <div>
            <h1 style={{ color: '#2c3e50', textAlign: 'center', marginBottom: '30px' }}>Note Studenți</h1>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <input placeholder="ID Student" value={notaNoua.student_id} onChange={e => setNotaNoua({ ...notaNoua, student_id: e.target.value })} style={inputStyle} />
                <input placeholder="ID Curs" value={notaNoua.curs_id} onChange={e => setNotaNoua({ ...notaNoua, curs_id: e.target.value })} style={inputStyle} />
                <input placeholder="Notă" value={notaNoua.valoare} onChange={e => setNotaNoua({ ...notaNoua, valoare: e.target.value })} style={inputStyle} />
                <button onClick={adaugaNota} style={btnGreen}>💾 Salvează</button>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ backgroundColor: '#ecf0f1', textAlign: 'left' }}>
                        <th style={thStyle}>ID Student</th>
                        <th style={thStyle}>Grupă</th>
                        <th style={thStyle}>Curs</th>
                        <th style={thStyle}>Notă</th>
                    </tr>
                </thead>
                <tbody>
                    {note.map(n => (
                        <tr key={n.id}>
                            <td style={tdStyle}>{n.student_id}</td>
                            <td style={tdStyle}>{n.Student?.grupa}</td>
                            <td style={tdStyle}>{n.Curs?.nume}</td>
                            <td style={tdStyle}>{n.valoare}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function StudentSection({ students, newStudent, setNewStudent, adaugaStudent, stergeStudent }) {
    return (
        <div>
            <h1 style={{ color: '#2c3e50', textAlign: 'center', marginBottom: '30px' }}>Studenți</h1>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <input placeholder="Nume" value={newStudent.nume} onChange={e => setNewStudent({ ...newStudent, nume: e.target.value })} style={inputStyle} />
                <input placeholder="Grupă" value={newStudent.grupa} onChange={e => setNewStudent({ ...newStudent, grupa: e.target.value })} style={inputStyle} />
                <button onClick={adaugaStudent} style={btnGreen}>➕ Adaugă Student</button>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ backgroundColor: '#ecf0f1', textAlign: 'left' }}>
                        <th style={thStyle}>ID</th>
                        <th style={thStyle}>Grupă</th>
                        <th style={thStyle}>Acțiuni</th>
                    </tr>
                </thead>
                <tbody>
                    {students.map(s => (
                        <tr key={s.student_id}>
                            <td style={tdStyle}>{s.student_id}</td>
                            <td style={tdStyle}>{s.grupa}</td>
                            <td style={tdStyle}><button onClick={() => stergeStudent(s.student_id)} style={btnRed}>Șterge</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

const thStyle = { padding: '10px', borderBottom: '2px solid #bdc3c7', fontWeight: 'bold' };
const tdStyle = { padding: '10px', borderBottom: '1px solid #ecf0f1' };
const inputStyle = { padding: '10px', borderRadius: '6px', border: '1px solid #ccc', flex: 1 };
const btnGreen = { padding: '10px 20px', backgroundColor: '#2ecc71', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold' };
const btnBlue = { padding: '6px 12px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' };
const btnRed = { padding: '6px 12px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' };
const navBtn = { display: 'block', width: '100%', padding: '10px', marginBottom: '10px', backgroundColor: '#34495e', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' };

export default SecretarPage;
