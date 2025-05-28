const express = require('express');
const router = express.Router();
const { authenticateSecretar } = require('../../middleware/auth');

const Nota = require('../../models/Nota');
const Student = require('../../models/Student');
const Curs = require('../../models/Curs');

//  POST: Adăugare sau actualizare notă
router.post('/', authenticateSecretar, async (req, res) => {
    try {
        const { student_id, curs_id, valoare } = req.body;

        if (!student_id || !curs_id || valoare == null) {
            return res.status(400).json({ message: 'Toate câmpurile sunt obligatorii' });
        }

        // Caută dacă există deja o notă pentru acest student la acest curs
        const existingNota = await Nota.findOne({
            where: { student_id, curs_id }
        });

        if (existingNota) {
            await existingNota.update({ valoare });
            return res.json({ message: 'Notă actualizată cu succes', nota: existingNota });
        }

        // Dacă nu există, creează o notă nouă
        const notaNoua = await Nota.create({ student_id, curs_id, valoare });
        res.status(201).json({ message: 'Notă adăugată cu succes', nota: notaNoua });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Eroare de server', error: error.message });
    }
});

// GET: Toate notele pentru un student (cu denumirea cursului)
router.get('/student/:studentId', authenticateSecretar, async (req, res) => {
    try {
        const { studentId } = req.params;

        const note = await Nota.findAll({
            where: { student_id: studentId },
            include: [
                {
                    model: Curs,
                    attributes: ['nume', 'curs_id']
                }
            ]
        });

        if (!note || note.length === 0) {
            return res.status(404).json({ message: 'Studentul nu are note înregistrate' });
        }

        res.json({
            student_id: studentId,
            note: note.map(n => ({
                curs_id: n.curs_id,
                denumire_curs: n.Curs.nume,
                valoare: n.valoare
            }))
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Eroare de server', error: error.message });
    }
});

// GET: Toate notele din BD pentru toti studentii
router.get('/', authenticateSecretar, async (req, res) => {
    try {
        const note = await Nota.findAll({
            include: [
                { model: Student, attributes: ['student_id', 'grupa'] },
                { model: Curs, attributes: ['curs_id', 'nume'] }
            ]
        });

        res.json(note);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Eroare de server' });
    }
});

//  GET: Notă după ID
router.get('/:id', authenticateSecretar, async (req, res) => {
    try {
        const nota = await Nota.findByPk(req.params.id, {
            include: [
                { model: Student, attributes: ['student_id', 'grupa'] },
                { model: Curs, attributes: ['curs_id', 'nume'] }
            ]
        });

        if (!nota) {
            return res.status(404).json({ message: 'Nota nu a fost găsită' });
        }

        res.json(nota);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Eroare de server' });
    }
});

//  DELETE: Șterge notă
router.delete('/:id', authenticateSecretar, async (req, res) => {
    try {
        const nota = await Nota.findByPk(req.params.id);

        if (!nota) {
            return res.status(404).json({ message: 'Nota nu a fost găsită' });
        }

        await nota.destroy();
        res.json({ message: 'Nota a fost ștearsă cu succes' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Eroare de server' });
    }
});

module.exports = router;
