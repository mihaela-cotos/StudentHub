const express = require('express');
const bcrypt = require('bcrypt');
const { Op } = require('sequelize');
const router = express.Router();

// Import models
const Utilizator = require('../models/Utilizator');
const Student = require('../models/Student');
const Secretar = require('../models/Secretar');
const Administrator = require('../models/Administrator');

// Inregistrare student + hash la parola
router.post('/student', async (req, res) => {
    try {
        const { nume_utilizator, parola, grupa, facultate_id, email } = req.body;

        // Verificare daca username-ul exista deja
        const existingUser = await Utilizator.findOne({
            where: {
                [Op.or]: [
                    { nume_utilizator },
                    { email }
                ]
            }
        });

        if (existingUser) {
            if (existingUser.nume_utilizator === nume_utilizator) {
                return res.status(400).json({ message: 'Un utilizator cu acest nume există deja' });
            } else {
                return res.status(400).json({ message: 'Un utilizator cu acest email există deja' });
            }
        }

        // Hashuim parola
        const hashedPassword = await bcrypt.hash(parola, 10);

        // Cream user nou
        const newUser = await Utilizator.create({
            nume_utilizator,
            parola: hashedPassword,
            tip_utilizator: 'student',
            email
        });

        // Cream student nou
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
                nume_utilizator: newUser.nume_utilizator
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Eroare de server', error: error.message });
    }
});

// Inregistrare secretar + hash la parola
router.post('/secretar', async (req, res) => {
    try {
        const { nume_utilizator, parola, email } = req.body;

        // Verificam daca username-ul exista deja
        const existingUser = await Utilizator.findOne({
            where: {
                [Op.or]: [
                    { nume_utilizator },
                    { email }
                ]
            }
        });

        if (existingUser) {
            if (existingUser.nume_utilizator === nume_utilizator) {
                return res.status(400).json({ message: 'Un utilizator cu acest nume există deja' });
            } else {
                return res.status(400).json({ message: 'Un utilizator cu acest email există deja' });
            }
        }

        // Hashuim parola
        const hashedPassword = await bcrypt.hash(parola, 10);

        // Creare user nou cu parola hash
        const newUser = await Utilizator.create({
            nume_utilizator,
            parola: hashedPassword,
            tip_utilizator: 'secretar',
            email
        });

        // Creare secretar nou
        const newSecretar = await Secretar.create({
            utilizator_id: newUser.utilizator_id,
            approved: false
        });

        res.status(201).json({
            message: 'Secretar înregistrat cu succes! Asteptati validare de catre un Administrator!',
            secretar: {
                id: newSecretar.secretar_id,
                nume_utilizator: newUser.nume_utilizator
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Eroare de server', error: error.message });
    }
});

// Inregistrare administrator + hash la parola
router.post('/admin', async (req, res) => {
    try {
        const { nume_utilizator, parola, email } = req.body;

        // Verificam daca username-ul sau email-ul exista deja
        const existingUser = await Utilizator.findOne({
            where: {
                [Op.or]: [
                    { nume_utilizator },
                    { email }
                ]
            }
        });

        if (existingUser) {
            if (existingUser.nume_utilizator === nume_utilizator) {
                return res.status(400).json({ message: 'Un utilizator cu acest nume există deja' });
            } else {
                return res.status(400).json({ message: 'Un utilizator cu acest email există deja' });
            }
        }

        // Hashuim parola
        const hashedPassword = await bcrypt.hash(parola, 10);

        // Creare user nou cu parola hash
        const newUser = await Utilizator.create({
            nume_utilizator,
            parola: hashedPassword,
            tip_utilizator: 'admin',
            email
        });

        // Creare administrator nou
        const newAdmin = await Administrator.create({
            utilizator_id: newUser.utilizator_id,
            approved_by_system: false
        });

        res.status(201).json({
            message: 'Administrator înregistrat cu succes! Contul necesită aprobare de sistem.',
            administrator: {
                id: newAdmin.admin_id,
                nume_utilizator: newUser.nume_utilizator
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Eroare de server', error: error.message });
    }
});

module.exports = router;