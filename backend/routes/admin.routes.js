// Toate rutele specifice Adminului impreuna
const express = require('express');
const router = express.Router();
const facultiesRoutes = require('./admin/faculties.routes');
const plansRoutes = require('./admin/plans.routes');

router.use('/faculties', facultiesRoutes);
router.use('/plans', plansRoutes);

module.exports = router;