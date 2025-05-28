const express = require('express');
const router = express.Router();
const { authenticateSecretar } = require('../../middleware/auth');
const { Op } = require('sequelize');
const bcrypt = require('bcrypt');

// Modele
const Utilizator = require('../../models/Utilizator');
const Student = require('../../models/Student');
const Facultate = require('../../models/Facultate');

// POST: Înregistrare student
router.post('/', authenticateSecretar, async (req, res) => {
    console.log("📥 POST /students triggered");
    try {
        console.log('✅ students.routes.js loaded');

        const { nume_utilizator, parola, grupa, facultate_id, email } = req.body;

        if (!nume_utilizator || !parola || !grupa || !facultate_id || !email) {
            return res.status(400).json({ message: 'Toate câmpurile sunt obligatorii' });
        }

        // Verificare duplicat username sau email
        const existing = await Utilizator.findOne({
            where: {
                [Op.or]: [{ nume_utilizator }, { email }]
            }
        });

        if (existing) {
            const field = existing.nume_utilizator === nume_utilizator ? 'nume_utilizator' : 'email';
            return res.status(409).json({ message: `Un utilizator cu acest ${field} există deja` });
        }

        // Verificare existență facultate
        const facultate = await Facultate.findByPk(facultate_id);
        if (!facultate) {
            return res.status(404).json({ message: 'Facultatea nu există' });
        }

        // Hash parola
        const hashedPassword = await bcrypt.hash(parola, 10);

        // Creare Utilizator
        const newUser = await Utilizator.create({
            nume_utilizator,
            parola: hashedPassword,
            tip_utilizator: 'student',
            email
        });

        // Creare Student
        const newStudent = await Student.create({
            grupa,
            facultate_id,
            utilizator_id: newUser.utilizator_id
        });

        res.status(201).json({
            message: 'Student înregistrat cu succes',
            student: {
                id: newStudent.student_id,
                grupa: newStudent.grupa,
                nume_utilizator: newUser.nume_utilizator,
                email: newUser.email
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Eroare de server', error: error.message });
    }
});

// ✅ GET: Toți studenții
router.get('/', authenticateSecretar, async (req, res) => {
    try {
        console.log('📥 GET /students triggered');
        const studenti = await Student.findAll({
            include: [
                {
                    model: Utilizator,
                    attributes: ['nume_utilizator', 'email']
                },
                {
                    model: Facultate,
                    attributes: ['nume']
                }
            ]
        });

        res.json(studenti);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Eroare de server' });
    }
});

// ✅ GET: Student după ID
router.get('/:id', authenticateSecretar, async (req, res) => {
    try {
        const student = await Student.findByPk(req.params.id, {
            include: [
                {
                    model: Utilizator,
                    attributes: ['nume_utilizator', 'email']
                },
                {
                    model: Facultate,
                    attributes: ['nume']
                }
            ]
        });

        if (!student) {
            return res.status(404).json({ message: 'Studentul nu a fost găsit' });
        }

        res.json(student);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Eroare de server' });
    }
});

// ✅ PUT: Actualizare student
router.put('/:id', authenticateSecretar, async (req, res) => {
    try {
        const { grupa, facultate_id } = req.body;
        const student = await Student.findByPk(req.params.id);

        if (!student) {
            return res.status(404).json({ message: 'Studentul nu a fost găsit' });
        }

        if (facultate_id) {
            const facultate = await Facultate.findByPk(facultate_id);
            if (!facultate) {
                return res.status(404).json({ message: 'Facultatea nu există' });
            }
        }

        await student.update({
            grupa: grupa || student.grupa,
            facultate_id: facultate_id || student.facultate_id
        });

        res.json({ message: 'Student actualizat cu succes', student });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Eroare de server' });
    }
});

// ✅ DELETE: Ștergere student
router.delete('/:id', authenticateSecretar, async (req, res) => {
    try {
        const student = await Student.findByPk(req.params.id);

        if (!student) {
            return res.status(404).json({ message: 'Studentul nu a fost găsit' });
        }

        const utilizatorId = student.utilizator_id;
        await student.destroy();

        const utilizator = await Utilizator.findByPk(utilizatorId);
        if (utilizator) {
            await utilizator.destroy();
        }

        res.json({ message: 'Student șters cu succes' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Eroare de server' });
    }
});

module.exports = router;
