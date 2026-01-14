const express = require('express');
const router = express.Router();
const teamController = require('../controllers/teamController');
const { isAuthorized, isAdmin } = require('../middleware/authMiddleware');

// Public routes (for frontend display)
router.get('/team', teamController.getAllTeamMembers);
router.get('/team/:id', teamController.getTeamMemberById);

// Admin routes
router.post('/admin/team', isAuthorized, isAdmin, teamController.createTeamMember);
router.put('/admin/team/:id', isAuthorized, isAdmin, teamController.updateTeamMember);
router.delete('/admin/team/:id', isAuthorized, isAdmin, teamController.deleteTeamMember);

module.exports = router;
