// Sectiunea "gestioneaza secretari" - dam approve la secretari/ obtinem/stergem secretarii
const express = require('express');
const router = express.Router();
const { authenticateAdmin } = require('../../middleware/auth');
const Secretar = require('../../models/Secretar');
const Utilizator = require('../../models/Utilizator');


// GET obtinem toti secretarii
router.get('/', authenticateAdmin, async (req, res) => {
    try {
        const secretari = await Secretar.findAll({
            include: {
                model: Utilizator,
                attributes: ['nume_utilizator', 'email']
            }
        });
        res.json(secretari);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Eroare de server', error: error.message });
    }
});

// GET secretar dupa id
router.get('/:id', authenticateAdmin, async (req, res) => {
    try {
        const secretar = await Secretar.findByPk(req.params.id, {
            include: {
                model: Utilizator,
                attributes: ['nume_utilizator', 'email']
            }
        });

        if (!secretar) {
            return res.status(404).json({ message: 'Secretarul nu a fost găsit' });
        }

        res.json(secretar);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Eroare de server', error: error.message });
    }
});

// PUT Dam approve la secretar
router.put('/:id/approve', authenticateAdmin, async (req, res) => {
    try {
        const secretar = await Secretar.findByPk(req.params.id, {
            include: {
                model: Utilizator,
                attributes: ['nume_utilizator', 'email']
            }
        });

        if (!secretar) {
            return res.status(404).json({ message: 'Secretarul nu a fost găsit' });
        }

        await secretar.update({
            approved: true
        });

        res.json({
            message: 'Secretar aprobat cu succes',
            secretar
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Eroare de server', error: error.message });
    }
});

// DELETE Stergem secretar
router.delete('/:id', authenticateAdmin, async (req, res) => {
    try {
        const secretar = await Secretar.findByPk(req.params.id, {
            include: {
                model: Utilizator
            }
        });

        if (!secretar) {
            return res.status(404).json({ message: 'Secretarul nu a fost găsit' });
        }

        // Obtinem ID-ul secretarului inainte de stergere
        const utilizatorId = secretar.utilizator_id;

        // Stergem secretarul
        await secretar.destroy();

        // Cautam si stergem datele secretarului din tabela Utilizator
        const utilizator = await Utilizator.findByPk(utilizatorId);
        if (utilizator) {
            await utilizator.destroy();
        }

        res.json({ message: 'Secretar șters cu succes' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Eroare de server', error: error.message });
    }
});

module.exports = router;