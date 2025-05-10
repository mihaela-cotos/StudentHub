// Manipulare facultati - adaugare, stergere, modificare

const express = require('express');
const router = express.Router();
const { authenticateAdmin } = require('../../middleware/auth');
const Facultate = require('../../models/Facultate');

// GET toate facultatile
router.get('/', authenticateAdmin, async (req, res) => {
    try {
        const facultati = await Facultate.findAll();
        res.json(facultati);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Eroare de server', error: error.message });
    }
});

// GET facultate dupa ID
router.get('/:id', authenticateAdmin, async (req, res) => {
    try {
        const facultate = await Facultate.findByPk(req.params.id);

        if (!facultate) {
            return res.status(404).json({ message: 'Facultatea nu a fost găsită' });
        }

        res.json(facultate);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Eroare de server', error: error.message });
    }
});

// POST adaugare facultate noua
router.post('/', authenticateAdmin, async (req, res) => {
    try {
        const { nume, decan } = req.body;

        if (!nume || !decan) {
            return res.status(400).json({ message: 'Numele și decanul sunt obligatorii' });
        }

        const facultate = await Facultate.create({
            nume,
            decan
        });

        res.status(201).json({
            message: 'Facultate adăugată cu succes',
            facultate
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Eroare de server', error: error.message });
    }
});

// PUT actualizare facultate
router.put('/:id', authenticateAdmin, async (req, res) => {
    try {
        const { nume, decan } = req.body;
        const facultate = await Facultate.findByPk(req.params.id);

        if (!facultate) {
            return res.status(404).json({ message: 'Facultatea nu a fost găsită' });
        }

        await facultate.update({
            nume: nume || facultate.nume,
            decan: decan || facultate.decan
        });

        res.json({
            message: 'Facultate actualizată cu succes',
            facultate
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Eroare de server', error: error.message });
    }
});

// DELETE stergere facultate
router.delete('/:id', authenticateAdmin, async (req, res) => {
    try {
        const facultate = await Facultate.findByPk(req.params.id);

        if (!facultate) {
            return res.status(404).json({ message: 'Facultatea nu a fost găsită' });
        }

        await facultate.destroy();

        res.json({ message: 'Facultate ștearsă cu succes' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Eroare de server', error: error.message });
    }
});

module.exports = router;