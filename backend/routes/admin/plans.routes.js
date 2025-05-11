// Manipulare planuri de invatamant(cursuri) - adaugare, stergere, modificare
const express = require('express');
const router = express.Router();
const { authenticateAdmin } = require('../../middleware/auth');
const Curs = require('../../models/Curs');
const Facultate = require('../../models/Facultate');

// GET toate cursurile (planuri de invatamant)
router.get('/', authenticateAdmin, async (req, res) => {
    try {
        const cursuri = await Curs.findAll({
            include: [
                {
                    // Se face JOIN cu Facultate si luam din acest JOIN doar coloana cu 'nume'
                    model: Facultate,
                    attributes: ['nume']
                }
            ]
        });
        res.json(cursuri);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Eroare de server', error: error.message });
    }
});

// GET curs dupa ID
router.get('/:id', authenticateAdmin, async (req, res) => {
    try {
        const curs = await Curs.findByPk(req.params.id, {
            include: [
                {
                    model: Facultate,
                    attributes: ['nume']
                }
            ]
        });

        if (!curs) {
            return res.status(404).json({ message: 'Cursul nu a fost găsit' });
        }

        res.json(curs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Eroare de server', error: error.message });
    }
});

// POST adaugare curs nou
router.post('/', authenticateAdmin, async (req, res) => {
    try {
        const { nume, sala, profesor, facultate_id, an_invatamant } = req.body;

        if (!nume || !facultate_id) {
            return res.status(400).json({ message: 'Numele, și facultate_id sunt obligatorii' });
        }

        // Verificam daca facultatea exista
        const facultate = await Facultate.findByPk(facultate_id);
        if (!facultate) {
            return res.status(404).json({ message: 'Facultatea specificată nu există' });
        }

        const curs = await Curs.create({
            nume,
            sala,
            profesor,
            facultate_id,
            an_invatamant
        });

        res.status(201).json({
            message: 'Curs adăugat cu succes',
            curs
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Eroare de server', error: error.message });
    }
});

// PUT actualizare curs
router.put('/:id', authenticateAdmin, async (req, res) => {
    try {
        const { nume, sala, profesor, facultate_id, an_invatamant } = req.body;
        const curs = await Curs.findByPk(req.params.id);

        if (!curs) {
            return res.status(404).json({ message: 'Cursul nu a fost găsit' });
        }

        // Verificam daca facultatea exista daca a fost furnizata
        if (facultate_id) {
            const facultate = await Facultate.findByPk(facultate_id);
            if (!facultate) {
                return res.status(404).json({ message: 'Facultatea specificată nu există' });
            }
        }

        await curs.update({
            nume: nume || curs.nume,
            sala: sala || curs.sala,
            profesor: profesor || curs.profesor,
            facultate_id: facultate_id || curs.facultate_id,
            an_invatamant: an_invatamant !== undefined ? an_invatamant : curs.an_invatamant
        });

        res.json({
            message: 'Curs actualizat cu succes',
            curs
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Eroare de server', error: error.message });
    }
});

// DELETE stergere curs
router.delete('/:id', authenticateAdmin, async (req, res) => {
    try {
        const curs = await Curs.findByPk(req.params.id);

        if (!curs) {
            return res.status(404).json({ message: 'Cursul nu a fost găsit' });
        }

        await curs.destroy();

        res.json({ message: 'Curs șters cu succes' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Eroare de server', error: error.message });
    }
});

module.exports = router;