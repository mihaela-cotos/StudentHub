import { useState } from 'react';

function AdminPage() {
    const [facultati] = useState([
        { id: 1, nume: 'Facultatea de Automatică și Calculatoare' },
        { id: 2, nume: 'Facultatea de Inginerie Electrică' },
        { id: 3, nume: 'Facultatea de Electronică, Telecomunicații și Tehnologia Informației' },
    ]);

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(to right,rgb(20, 188, 218),rgb(35, 186, 206))',
            padding: '40px',
            fontFamily: 'Segoe UI, sans-serif'
        }}>
            <div style={{
                maxWidth: '800px',
                margin: '0 auto',
                background: 'white',
                borderRadius: '12px',
                padding: '30px',
                boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
            }}>
                <h1 style={{
                    color: '#2e7d32',
                    textAlign: 'center',
                    marginBottom: '30px'
                }}>
                    Panou Administrativ – Facultăți
                </h1>

                <div style={{
                    display: 'flex',
                    gap: '10px',
                    marginBottom: '30px'
                }}>
                    <input
                        type="text"
                        placeholder="Introduceți numele facultății"
                        style={{
                            flex: 1,
                            padding: '10px',
                            borderRadius: '8px',
                            border: '1px solid #ccc',
                            fontSize: '16px'
                        }}
                    />
                    <button style={{
                        backgroundColor: '#43a047',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '10px 20px',
                        fontWeight: 'bold',
                        cursor: 'pointer'
                    }}>
                        Adaugă
                    </button>
                </div>

                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {facultati.map((facultate) => (
                        <li key={facultate.id} style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            background: '#f1f8e9',
                            padding: '12px 20px',
                            borderRadius: '8px',
                            marginBottom: '10px'
                        }}>
                            <span style={{ fontSize: '16px', color: '#33691e' }}>{facultate.nume}</span>
                            <button style={{
                                backgroundColor: '#e53935',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                padding: '6px 12px',
                                cursor: 'pointer'
                            }}>
                                Șterge
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default AdminPage;
