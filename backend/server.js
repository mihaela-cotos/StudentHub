// Import models
const Student = require('./models/Student');
const Secretar = require('./models/Secretar');
const Administrator = require('./models/Administrator');
const Utilizator = require('./models/Utilizator');
// const Utilizator = require('./models/Facultate');

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
const authenticateAdmin = require('./middleware/auth').authenticateAdmin;

// Import routes
const loginRoutes = require('./routes/login.routes');
const registerRoutes = require('./routes/register.routes');
const adminRoutes = require('./routes/admin.routes')
// const facultatiRoutes = require('./routes/faculties.routes');

// Apply routes
app.use('/api/login', loginRoutes);
app.use('/api/register', registerRoutes);
app.use('/api/admin', adminRoutes);
// app.use('/api/admin/faculties', facultatiRoutes);

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

// Protected route example for student profile
app.get('/api/admin/profile', authenticateAdmin, async (req, res) => {
    try {
        const admin = await Administrator.findByPk(req.user.id, {
            include: {
                model: Utilizator,
                attributes: ['nume_utilizator', 'email']
            }
        });

        if (!admin) {
            return res.status(404).json({ message: 'Admin negăsit' });
        }

        res.json({
            id: admin.admin_id,
            nume_utilizator: admin.Utilizator.nume_utilizator,
            email: admin.Utilizator.email
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

sequelize.authenticate()
    .then(() => console.log('✅ Conectat la baza de date'))
    .catch(err => console.error('❌ Eroare la conectare:', err));


// Global error handler
app.use((err, req, res, next) => {
    console.error("Unhandled error:", err);
    res.status(500).json({
        message: 'Eroare de server',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    // Log the error but don't exit the process to keep the server running
    // process.exit(1);  // Uncomment if you want to exit on uncaught exceptions
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

app.listen(PORT, () => {
    console.log(`✅ Serverul rulează pe http://localhost:${PORT}`);
});
