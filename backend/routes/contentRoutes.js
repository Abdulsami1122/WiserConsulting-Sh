const express = require('express');
const router = express.Router();
const contentController = require('../controllers/contentController');
const { isAuthorized, isAdmin } = require('../middleware/authMiddleware');

// Public routes (for frontend display)
router.get('/content/:page', contentController.getContentByPage);
router.get('/content', contentController.getAllContent);

// Admin routes
router.get('/admin/content', isAuthorized, isAdmin, contentController.getAllContent);
router.put('/admin/content/:page', isAuthorized, isAdmin, contentController.updateContent);

module.exports = router;
