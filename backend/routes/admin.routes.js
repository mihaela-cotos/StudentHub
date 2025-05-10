// Toate rutele specifice Adminului impreuna
const express = require('express');
const router = express.Router();
const facultiesRoutes = require('./admin/faculties.routes');

router.use('/faculties', facultiesRoutes);

module.exports = router;