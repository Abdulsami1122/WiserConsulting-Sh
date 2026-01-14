const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');
const { isAuthorized, isAdmin } = require('../middleware/authMiddleware');

// Public routes (for frontend display)
router.get('/services', serviceController.getAllServices);
router.get('/services/:id', serviceController.getServiceById);

// Admin routes
router.post('/admin/services', isAuthorized, isAdmin, serviceController.createService);
router.put('/admin/services/:id', isAuthorized, isAdmin, serviceController.updateService);
router.delete('/admin/services/:id', isAuthorized, isAdmin, serviceController.deleteService);

module.exports = router;
