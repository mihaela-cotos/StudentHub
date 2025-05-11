// Toate rutele specifice Adminului impreuna
const express = require('express');
const router = express.Router();
const facultiesRoutes = require('./admin/faculties.routes');
const plansRoutes = require('./admin/plans.routes');
const secretariesRoutes = require('./admin/secretaries.routes');

router.use('/faculties', facultiesRoutes);
router.use('/plans', plansRoutes);
router.use('/secretaries', secretariesRoutes);

module.exports = router;