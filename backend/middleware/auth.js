// middleware/auth.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

// Verificare daca este autentificat un student sau
const authenticateStudent = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Token lipsă' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;

        if (decoded.role !== 'student') {
            return res.status(403).json({ message: 'Nu aveți permisiunea necesară' });
        }

        next();
    } catch (error) {
        res.status(401).json({ message: 'Token invalid' });
    }
};

// Verificare daca este autentificat un secretar
const authenticateSecretar = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Token lipsă' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;

        if (decoded.role !== 'secretar') {
            return res.status(403).json({ message: 'Nu aveți permisiunea necesară' });
        }

        next();
    } catch (error) {
        res.status(401).json({ message: 'Token invalid' });
    }
};


module.exports = { authenticateStudent, authenticateSecretar};