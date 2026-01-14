const express = require('express');
const router = express.Router();
const portfolioController = require('../controllers/portfolioController');
const { isAuthorized, isAdmin } = require('../middleware/authMiddleware');

// Public routes (for frontend display)
router.get('/portfolios', portfolioController.getAllPortfolios);
router.get('/portfolios/:id', portfolioController.getPortfolioById);

// Admin routes
router.post('/admin/portfolios', isAuthorized, isAdmin, portfolioController.createPortfolio);
router.put('/admin/portfolios/:id', isAuthorized, isAdmin, portfolioController.updatePortfolio);
router.delete('/admin/portfolios/:id', isAuthorized, isAdmin, portfolioController.deletePortfolio);

module.exports = router;
