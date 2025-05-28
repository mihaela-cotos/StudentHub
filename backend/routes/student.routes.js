const express = require('express');
const router = express.Router();
const adeverinteRoutes = require('./student/adeverinte.routes');
const cazareRoutes = require('./student/cazare.routes');

// Already registered:
router.use('/adeverinte', adeverinteRoutes);
router.use('/cazare', cazareRoutes);

module.exports = router;

