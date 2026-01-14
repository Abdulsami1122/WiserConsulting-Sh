const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const { isAuthorized, isAdmin } = require('../middleware/authMiddleware');

// Public route (for contact form submission)
router.post('/contact', contactController.createContact);

// Admin routes
router.get('/admin/contacts', isAuthorized, isAdmin, contactController.getAllContacts);
router.get('/admin/contacts/:id', isAuthorized, isAdmin, contactController.getContactById);
router.put('/admin/contacts/:id', isAuthorized, isAdmin, contactController.updateContact);
router.delete('/admin/contacts/:id', isAuthorized, isAdmin, contactController.deleteContact);

module.exports = router;
