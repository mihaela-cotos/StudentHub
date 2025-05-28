const express = require('express');
const router = express.Router();
const { authenticateStudent } = require('../../middleware/auth');
const { Op } = require('sequelize');

const Student = require('../../models/Student');
const Curs = require('../../models/Curs');
const Nota = require('../../models/Nota');
const OrarCurs = require('../../models/Orar_curs');
const Facultate = require('../../models/Facultate');

// GET: Obține toate cursurile studentului (bazat pe facultate și an)
router.get('/cursuri', authenticateStudent, async (req, res) => {
    try {
        const student = await Student.findOne({
            where: { utilizator_id: req.user.utilizator_id }
        });

        if (!student) {
            return res.status(404).json({ message: 'Profilul de student nu a fost găsit' });
        }

        if (!student.facultate_id) {
            return res.status(400).json({ message: 'Nu sunteți înscris la o facultate' });
        }

        // Determinăm anul de studiu din grupa (presupunând că grupa începe cu anul)
        const anStudiu = parseInt(student.grupa.charAt(0));

        const cursuri = await Curs.findAll({
            where: {
                facultate_id: student.facultate_id,
                an_invatamant: anStudiu
            },
            include: {
                model: Facultate,
                attributes: ['nume']
            }
        });

        res.json(cursuri);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Eroare de server', error: error.message });
    }
});

// GET: Obține orarul pentru toate cursurile studentului
router.get('/orar', authenticateStudent, async (req, res) => {
    try {
        const student = await Student.findOne({
            where: { utilizator_id: req.user.utilizator_id }
        });

        if (!student) {
            return res.status(404).json({ message: 'Profilul de student nu a fost găsit' });
        }

        if (!student.facultate_id) {
            return res.status(400).json({ message: 'Nu sunteți înscris la o facultate' });
        }

        // Determinăm anul de studiu din grupa
        const anStudiu = parseInt(student.grupa.charAt(0));

        // Obținem cursurile pentru facultatea și anul studentului
        const cursuri = await Curs.findAll({
            where: {
                facultate_id: student.facultate_id,
                an_invatamant: anStudiu
            },
            attributes: ['curs_id', 'nume', 'sala', 'profesor']
        });

        if (cursuri.length === 0) {
            return res.status(404).json({ message: 'Nu există cursuri pentru anul și facultatea dumneavoastră' });
        }

        // Obținem IDs ale cursurilor
        const cursIds = cursuri.map(curs => curs.curs_id);

        // Obținem orarul pentru aceste cursuri
        const orar = await OrarCurs.findAll({
            where: {
                curs_id: {
                    [Op.in]: cursIds
                }
            },
            include: {
                model: Curs,
                attributes: ['nume', 'sala', 'profesor']
            },
            order: [
                ['ziua_saptamanii', 'ASC'],
                ['ora', 'ASC']
            ]
        });

        // Grupăm orarul după zile
        const orarGrupatPeZile = {
            luni: [],
            marti: [],
            miercuri: [],
            joi: [],
            vineri: [],
            sambata: [],
            duminica: []
        };

        orar.forEach(entry => {
            orarGrupatPeZile[entry.ziua_saptamanii].push({
                id: entry.orar_id,
                ora: entry.ora,
                curs: {
                    id: entry.curs_id,
                    nume: entry.Curs.nume,
                    sala: entry.Curs.sala,
                    profesor: entry.Curs.profesor
                }
            });
        });

        res.json(orarGrupatPeZile);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Eroare de server', error: error.message });
    }
});

// GET: Obține toate notele studentului
router.get('/note', authenticateStudent, async (req, res) => {
    try {
        const student = await Student.findOne({
            where: { utilizator_id: req.user.utilizator_id }
        });

        if (!student) {
            return res.status(404).json({ message: 'Profilul de student nu a fost găsit' });
        }

        const note = await Nota.findAll({
            where: { student_id: student.student_id },
            include: {
                model: Curs,
                attributes: ['nume', 'profesor']
            },
            order: [['valoare', 'DESC']]
        });

        res.json(note);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Eroare de server', error: error.message });
    }
});

// GET: Obține notele pentru un curs specific
router.get('/note/:cursId', authenticateStudent, async (req, res) => {
    try {
        const cursId = req.params.cursId;
        const student = await Student.findOne({
            where: { utilizator_id: req.user.utilizator_id }
        });

        if (!student) {
            return res.status(404).json({ message: 'Profilul de student nu a fost găsit' });
        }

        const note = await Nota.findAll({
            where: {
                student_id: student.student_id,
                curs_id: cursId
            },
            include: {
                model: Curs,
                attributes: ['nume', 'profesor']
            }
        });

        if (note.length === 0) {
            return res.status(404).json({ message: 'Nu există note pentru acest curs' });
        }

        res.json(note);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Eroare de server', error: error.message });
    }
});

// GET: Calculează media generală a studentului
router.get('/media', authenticateStudent, async (req, res) => {
    try {
        const student = await Student.findOne({
            where: { utilizator_id: req.user.utilizator_id }
        });

        if (!student) {
            return res.status(404).json({ message: 'Profilul de student nu a fost găsit' });
        }

        const note = await Nota.findAll({
            where: { student_id: student.student_id },
            attributes: ['valoare']
        });

        if (note.length === 0) {
            return res.status(404).json({ message: 'Nu există note înregistrate pentru calculul mediei' });
        }

        // Calculăm media notelor
        const suma = note.reduce((total, nota) => total + nota.valoare, 0);
        const media = suma / note.length;

        res.json({
            student_id: student.student_id,
            grupa: student.grupa,
            numar_note: note.length,
            media: parseFloat(media.toFixed(2))
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Eroare de server', error: error.message });
    }
});

module.exports = router;