const express = require('express');
const router = express.Router();
const { authenticateStudent } = require('../../middleware/auth');
const { Sequelize } = require('sequelize');

const Cazare = require('../../models/Cazare');
const Student = require('../../models/Student');
const Camin = require('../../models/Camin');

// GET: Obtinem cazarea actuala a studentului
router.get('/', authenticateStudent, async (req, res) => {
    try {
        const student = await Student.findOne({
            where: { utilizator_id: req.user.utilizator_id }
        });

        if (!student) {
            return res.status(404).json({ message: 'Profilul de student nu a fost găsit' });
        }

        const cazare = await Cazare.findOne({
            where: { student_id: student.student_id },
            include: {
                model: Camin,
                attributes: ['nume', 'nr_locuri_total', 'nr_locuri_libere', 'nr_locuri_ocupate']
            }
        });

        if (!cazare) {
            return res.status(404).json({ message: 'Nu aveți nicio cazare înregistrată' });
        }

        res.json(cazare);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Eroare de server', error: error.message });
    }
});

// GET: Obtinem cazarile posibile
router.get('/camine', authenticateStudent, async (req, res) => {
    try {
        const camine = await Camin.findAll();
        res.json(camine);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Eroare de server', error: error.message });
    }
});

// POST: Aplicam pentru o cazare
router.post('/', authenticateStudent, async (req, res) => {
    try {
        const { camin_id, nr_camera, colegi_preferati } = req.body;

        if (!camin_id || !nr_camera) {
            return res.status(400).json({ message: 'Căminul și numărul camerei sunt obligatorii' });
        }

        const student = await Student.findOne({
            where: { utilizator_id: req.user.utilizator_id }
        });

        if (!student) {
            return res.status(404).json({ message: 'Profilul de student nu a fost găsit' });
        }

        // Check if student already has accommodation
        const existingCazare = await Cazare.findOne({
            where: { student_id: student.student_id }
        });

        if (existingCazare) {
            return res.status(400).json({
                message: 'Aveți deja o cerere de cazare înregistrată. O puteti doar modifica sau sterge.'
            });
        }

        // Check if dormitory exists and has available space
        const camin = await Camin.findByPk(camin_id);
        if (!camin) {
            return res.status(404).json({ message: 'Căminul specificat nu există' });
        }

        if (camin.nr_locuri_libere <= 0) {
            return res.status(400).json({ message: 'Nu mai există locuri disponibile în acest cămin' });
        }

        const nouaCazare = await Cazare.create({
            camin_id,
            student_id: student.student_id,
            nr_camera,
            colegi_camera: colegi_preferati || []
        });

        // Update dormitory occupancy
        await camin.update({
            nr_locuri_ocupate: camin.nr_locuri_ocupate + 1,
            nr_locuri_libere: camin.nr_locuri_libere - 1
        });

        res.status(201).json({
            message: 'Cerere de cazare înregistrată cu succes',
            cazare: nouaCazare
        });
    } catch (error) {
        console.error(error);
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({
                message: 'Camera este deja ocupată de alt student'
            });
        }
        res.status(500).json({ message: 'Eroare de server', error: error.message });
    }
});

// PUT: Update la cererea de cazare
router.put('/', authenticateStudent, async (req, res) => {
    try {
        const { camin_id, nr_camera, colegi_preferati } = req.body;

        if ((!camin_id && !nr_camera && !colegi_preferati) ||
            (camin_id && !nr_camera)) {
            return res.status(400).json({
                message: 'Specificați cel puțin un câmp pentru actualizare'
            });
        }

        const student = await Student.findOne({
            where: { utilizator_id: req.user.utilizator_id }
        });

        if (!student) {
            return res.status(404).json({ message: 'Profilul de student nu a fost găsit' });
        }

        const cazare = await Cazare.findOne({
            where: { student_id: student.student_id }
        });

        if (!cazare) {
            return res.status(404).json({
                message: 'Nu aveți o cazare înregistrată. Pentru a aplica, folosiți metoda POST'
            });
        }

        // If changing room or dormitory
        if (camin_id || nr_camera) {
            const oldCaminId = cazare.camin_id;
            const newCaminId = camin_id || oldCaminId;

            const targetCamin = await Camin.findByPk(newCaminId);
            if (!targetCamin) {
                return res.status(404).json({ message: 'Căminul specificat nu există' });
            }


            // If changing dormitory, update dormitory occupancy counts
            if (camin_id && camin_id !== oldCaminId) {
                if (targetCamin.nr_locuri_libere <= 0) {
                    return res.status(400).json({ message: 'Nu mai există locuri disponibile în noul cămin' });
                }

                const oldCamin = await Camin.findByPk(oldCaminId);
                if (oldCamin) {
                    await oldCamin.update({
                        nr_locuri_ocupate: oldCamin.nr_locuri_ocupate - 1,
                        nr_locuri_libere: oldCamin.nr_locuri_libere + 1
                    });
                }

                await targetCamin.update({
                    nr_locuri_ocupate: targetCamin.nr_locuri_ocupate + 1,
                    nr_locuri_libere: targetCamin.nr_locuri_libere - 1
                });
            }
        }

        await cazare.update({
            camin_id: camin_id || cazare.camin_id,
            nr_camera: nr_camera || cazare.nr_camera,
            colegi_camera: colegi_preferati || cazare.colegi_camera
        });

        // Get updated record with dormitory info
        const updatedCazare = await Cazare.findOne({
            where: { student_id: student.student_id },
            include: {
                model: Camin,
                attributes: ['nume', 'nr_locuri_total', 'nr_locuri_libere', 'nr_locuri_ocupate']
            }
        });

        res.json({
            message: 'Informații cazare actualizate cu succes',
            cazare: updatedCazare
        });
    } catch (error) {
        console.error(error);
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({
                message: 'Camera este deja ocupată de alt student'
            });
        }
        res.status(500).json({ message: 'Eroare de server', error: error.message });
    }
});

// DELETE: Cancel accommodation
router.delete('/', authenticateStudent, async (req, res) => {
    try {
        const student = await Student.findOne({
            where: { utilizator_id: req.user.utilizator_id }
        });

        if (!student) {
            return res.status(404).json({ message: 'Profilul de student nu a fost găsit' });
        }

        const cazare = await Cazare.findOne({
            where: { student_id: student.student_id }
        });

        if (!cazare) {
            return res.status(404).json({ message: 'Nu aveți nicio cazare înregistrată' });
        }

        // Update dormitory occupancy after cancellation
        const camin = await Camin.findByPk(cazare.camin_id);
        if (camin) {
            await camin.update({
                nr_locuri_ocupate: Math.max(0, camin.nr_locuri_ocupate - 1),
                nr_locuri_libere: camin.nr_locuri_libere + 1
            });
        }

        await cazare.destroy();
        res.json({ message: 'Cazare anulată cu succes' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Eroare de server', error: error.message });
    }
});

module.exports = router;