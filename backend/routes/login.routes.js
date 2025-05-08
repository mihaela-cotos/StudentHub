const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Import models
const Utilizator = require('../models/Utilizator');
const Student = require('../models/Student');
const Secretar = require('../models/Secretar');

// Student login with hashed password verification
router.post('/student', async (req, res) => {
    try {
        const { nume_utilizator, parola } = req.body;

        // Find the user
        const user = await Utilizator.findOne({
            where: {
                nume_utilizator,
                tip_utilizator: 'student'
            }
        });

        if (!user) {
            return res.status(401).json({ message: 'Credențiale invalide' });
        }

        // Compare password with hashed version in database
        const isMatch = await bcrypt.compare(parola, user.parola);

        if (!isMatch) {
            return res.status(401).json({ message: 'Credențiale invalide' });
        }

        // Find the student record
        const student = await Student.findOne({
            where: { utilizator_id: user.utilizator_id }
        });

        if (!student) {
            return res.status(404).json({ message: 'Student negăsit' });
        }

        // Generate JWT token
        const token = jwt.sign(
            {
                id: student.student_id,
                utilizator_id: user.utilizator_id,
                role: 'student'
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            token,
            student: {
                id: student.student_id,
                grupa: student.grupa,
                nume_utilizator: user.nume_utilizator
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Eroare de server' });
    }
});

// Secretar login with hashed password verification
router.post('/secretar', async (req, res) => {
    try {
        const { nume_utilizator, parola } = req.body;

        // Find the user
        const user = await Utilizator.findOne({
            where: {
                nume_utilizator,
                tip_utilizator: 'secretar'
            }
        });

        if (!user) {
            return res.status(401).json({ message: 'Credențiale invalide' });
        }

        // Compare password with hashed version in database
        const isMatch = await bcrypt.compare(parola, user.parola);

        if (!isMatch) {
            return res.status(401).json({ message: 'Credențiale invalide' });
        }

        // Find the secretar record
        const secretar = await Secretar.findOne({
            where: { utilizator_id: user.utilizator_id }
        });

        if (!secretar) {
            return res.status(404).json({ message: 'Secretar negăsit' });
        }

        if (!secretar.approved) {
            return res.status(401).json({ message: 'Va rugam asteptati validarea unui Administrator!'});
        }

        // Generate JWT token
        const token = jwt.sign(
            {
                id: secretar.secretar_id,
                utilizator_id: user.utilizator_id,
                role: 'secretar'
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            token,
            secretar: {
                id: secretar.secretar_id,
                nume_utilizator: user.nume_utilizator
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Eroare de server' });
    }
});


module.exports = router;