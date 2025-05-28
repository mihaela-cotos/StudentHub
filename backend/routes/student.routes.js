const express = require('express');
const router = express.Router();
const adeverinteRoutes = require('./student/adeverinte.routes');

// Already registered:
router.use('/adeverinte', adeverinteRoutes);

module.exports = router;

