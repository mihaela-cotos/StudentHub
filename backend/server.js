const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Import middleware
const authenticateStudent = require('./middleware/auth').authenticateStudent;
const authenticateSecretar = require('./middleware/auth').authenticateSecretar;

// Import routes
const loginRoutes = require('./routes/login.routes');
const registerRoutes = require('./routes/register.routes');

// Apply routes
app.use('/api/login', loginRoutes);
app.use('/api/register', registerRoutes);

// Protected route example for student profile
app.get('/api/student/profile', authenticateStudent, async (req, res) => {
    try {
        const student = await Student.findByPk(req.user.id, {
            include: {
                model: Utilizator,
                attributes: ['nume_utilizator', 'email']
            }
        });

        if (!student) {
            return res.status(404).json({ message: 'Student negăsit' });
        }

        res.json({
            id: student.student_id,
            grupa: student.grupa,
            nume_utilizator: student.Utilizator.nume_utilizator,
            email: student.Utilizator.email
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Eroare de server' });
    }
});

// Protected route example for student profile
app.get('/api/secretar/profile', authenticateSecretar, async (req, res) => {
    try {
        const secretar = await Secretar.findByPk(req.user.id, {
            include: {
                model: Utilizator,
                attributes: ['nume_utilizator', 'email']
            }
        });

        if (!secretar) {
            return res.status(404).json({ message: 'Secretar negăsit' });
        }

        res.json({
            id: secretar.secretar_id,
            nume_utilizator: secretar.Utilizator.nume_utilizator,
            email: secretar.Utilizator.email
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Eroare de server' });
    }
});

// Basic route
app.get('/', (req, res) => {
    res.send('StudentHub API');
});

// Database connection
const sequelize = require('./config/database');

// Import models
const Student = require('./models/Student');
const Secretar = require('./models/Secretar');
const Cerere_adeverinta = require('./models/Cerere_adeverinta');
const Cazare = require('./models/Cazare');
const Camin = require('./models/Camin');
const Utilizator = require('./models/Utilizator');

sequelize.authenticate()
    .then(() => console.log('✅ Conectat la baza de date'))
    .catch(err => console.error('❌ Eroare la conectare:', err));

app.listen(PORT, () => {
    console.log(`✅ Serverul rulează pe http://localhost:${PORT}`);
});
