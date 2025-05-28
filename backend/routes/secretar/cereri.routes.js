const express = require('express');
const router = express.Router();
const { authenticateSecretar } = require('../../middleware/auth');

const CerereAdeverinta = require('../../models/Cerere_adeverinta');
const Student = require('../../models/Student');

// ✅ GET: toate cererile de adeverință
router.get('/', authenticateSecretar, async (req, res) => {
    try {
        const cereri = await CerereAdeverinta.findAll({
            include: {
                model: Student,
                attributes: ['student_id', 'grupa']
            }
        });
        res.json(cereri);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Eroare la obținerea cererilor', error: error.message });
    }
});

// ✅ GET: cereri pentru un student
router.get('/student/:id', authenticateSecretar, async (req, res) => {
    try {
        const cereri = await CerereAdeverinta.findAll({
            where: { student_id: req.params.id },
            include: {
                model: Student,
                attributes: ['grupa']
            }
        });

        if (cereri.length === 0) {
            return res.status(404).json({ message: 'Studentul nu are cereri înregistrate' });
        }

        res.json(cereri);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Eroare de server', error: error.message });
    }
});

// ✅ POST: crează o cerere nouă
router.post('/', authenticateSecretar, async (req, res) => {
    try {
        const { student_id, tip_adeverinta } = req.body;

        if (!student_id || !tip_adeverinta) {
            return res.status(400).json({ message: 'Toate câmpurile sunt necesare' });
        }

        const cerere = await CerereAdeverinta.create({
            student_id,
            tip_adeverinta,
            data_cerere: new Date()
        });

        res.status(201).json({
            message: 'Cerere înregistrată cu succes',
            cerere
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Eroare la crearea cererii', error: error.message });
    }
});

// ✅ PUT: actualizează data emiterii (confirmare de eliberare)
router.put('/:id/emitere', authenticateSecretar, async (req, res) => {
    try {
        const cerere = await CerereAdeverinta.findByPk(req.params.id);

        if (!cerere) {
            return res.status(404).json({ message: 'Cererea nu a fost găsită' });
        }

        await cerere.update({ data_emitere: new Date() });

        res.json({
            message: 'Cererea a fost marcată ca emisă',
            cerere
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Eroare la actualizare', error: error.message });
    }
});

// ✅ DELETE: șterge o cerere
router.delete('/:id', authenticateSecretar, async (req, res) => {
    try {
        const cerere = await CerereAdeverinta.findByPk(req.params.id);

        if (!cerere) {
            return res.status(404).json({ message: 'Cererea nu există' });
        }

        await cerere.destroy();
        res.json({ message: 'Cerere ștearsă cu succes' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Eroare la ștergere', error: error.message });
    }
});

module.exports = router;
