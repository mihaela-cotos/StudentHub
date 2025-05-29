const express = require('express');
const router = express.Router();
const { authenticateStudent } = require('../../middleware/auth');

const CerereAdeverinta = require('../../models/Cerere_adeverinta');
const Student = require('../../models/Student');
const Utilizator = require('../../models/Utilizator');

// GET: Lista cererilor de adeverinte pentru studentul autentificat
router.get('/', authenticateStudent, async (req, res) => {
    try {
        const student = await Student.findOne({
            where: { utilizator_id: req.user.utilizator_id }
        });

        if (!student) {
            return res.status(404).json({ message: 'Profilul de student nu a fost găsit' });
        }

        const cereri = await CerereAdeverinta.findAll({
            where: { student_id: student.student_id },
            order: [['data_cerere', 'DESC']]
        });

        res.json(cereri);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Eroare de server', error: error.message });
    }
});

// GET: Detalii cerere adeverinta specifica
router.get('/:id', authenticateStudent, async (req, res) => {
    try {
        const student = await Student.findOne({
            where: { utilizator_id: req.user.utilizator_id }
        });

        if (!student) {
            return res.status(404).json({ message: 'Profilul de student nu a fost găsit' });
        }

        const cerere = await CerereAdeverinta.findOne({
            where: {
                cerere_id: req.params.id,
                student_id: student.student_id
            }
        });

        if (!cerere) {
            return res.status(404).json({ message: 'Cererea nu a fost găsită' });
        }

        res.json(cerere);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Eroare de server', error: error.message });
    }
});

// POST: Creare cerere adeverinta noua
router.post('/', authenticateStudent, async (req, res) => {
    try {
        const { tip_adeverinta } = req.body;

        if (!tip_adeverinta) {
            return res.status(400).json({ message: 'Tipul adeverinței este obligatoriu' });
        }

        const student = await Student.findOne({
            where: { utilizator_id: req.user.utilizator_id },
            include: [
                {
                    model: Utilizator,
                    attributes: ['nume_utilizator', 'email']
                }
            ]
        });

        if (!student) {
            return res.status(404).json({ message: 'Profilul de student nu a fost găsit' });
        }

        const nouaCerere = await CerereAdeverinta.create({
            student_id: student.student_id,
            tip_adeverinta,
            data_cerere: new Date()
        });

        res.status(201).json({
            message: 'Cerere creată cu succes',
            cerere: nouaCerere
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Eroare de server', error: error.message });
    }
});

// DELETE: Anulare cerere de adeverinta (doar daca nu a fost inca emisa)
router.delete('/:id', authenticateStudent, async (req, res) => {
    try {
        const student = await Student.findOne({
            where: { utilizator_id: req.user.utilizator_id }
        });

        if (!student) {
            return res.status(404).json({ message: 'Profilul de student nu a fost găsit' });
        }

        const cerere = await CerereAdeverinta.findOne({
            where: {
                cerere_id: req.params.id,
                student_id: student.student_id
            }
        });

        if (!cerere) {
            return res.status(404).json({ message: 'Cererea nu a fost găsită' });
        }

        if (cerere.data_emitere) {
            return res.status(400).json({ message: 'Nu puteți anula o cerere deja emisă' });
        }

        await cerere.destroy();
        res.json({ message: 'Cerere anulată cu succes' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Eroare de server', error: error.message });
    }
});

module.exports = router;