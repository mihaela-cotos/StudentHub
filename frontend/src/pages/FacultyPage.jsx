import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

function FacultyPage() {
    const { id } = useParams(); // get faculty id from URL
    const [faculty, setFaculty] = useState(null);
    const [error, setError] = useState('');
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchFaculty = async () => {
            try {
                const res = await axios.get(`http://localhost:3001/api/admin/faculties/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setFaculty(res.data);
            } catch (err) {
                console.error(err);
                setError('Eroare la încărcarea facultății');
            }
        };

        fetchFaculty();
    }, [id, token]);

    if (error) {
        return <div style={{ color: 'red', padding: '20px' }}>{error}</div>;
    }

    if (!faculty) {
        return <div style={{ padding: '20px' }}>Se încarcă facultatea...</div>;
    }

    return (
        <div style={{ padding: '40px' }}>
            <h1 style={{ color: '#e07238' }}>{faculty.nume}</h1>
            <p><strong>Decan:</strong> {faculty.decan}</p>
            {/* Add more details or actions if needed */}
        </div>
    );
}

export default FacultyPage;
