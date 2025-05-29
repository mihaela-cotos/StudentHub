const express = require('express');
const router = express.Router();

const adeverinteRoutes = require('./student/adeverinte.routes');
const cazareRoutes = require('./student/cazare.routes');
const cursNoteRoutes = require('./student/cursuri_note.routes');


router.use('/adeverinte', adeverinteRoutes);
router.use('/cazare', cazareRoutes);
router.use('/cursuri', cursNoteRoutes);

module.exports = router;

