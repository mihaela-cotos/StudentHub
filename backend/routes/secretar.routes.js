const express = require('express');
const router = express.Router();

const gradesRoutes = require('./secretar/grades.routes');
// const contractsRoutes = require('./contracts.routes');
const studentsRoutes = require('./secretar/students.routes');
const cereriRoutes = require('./secretar/cereri.routes');
// const accommodationRoutes = require('./accommodation.routes');

router.use('/grades', gradesRoutes);
// router.use('/contracts', contractsRoutes);
router.use('/students', studentsRoutes);
router.use('/cereri', cereriRoutes);
// router.use('/accommodation', accommodationRoutes);

module.exports = router;