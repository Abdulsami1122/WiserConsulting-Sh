const Portfolio = require('../models/Portfolio');
const asyncHandler = require('../utils/asyncHandler');
const apiResponse = require('../utils/apiResponse');
const logger = require('../utils/logger');

class PortfolioController {
  // Get all portfolio items
  getAllPortfolios = asyncHandler(async (req, res) => {
    const { category, isActive, isDeleted } = req.query;
    const filter = { isDeleted: false }; // Default: exclude deleted
    
    if (category) filter.category = category;
    if (isActive !== undefined) filter.isActive = isActive === 'true';
    if (isDeleted !== undefined) filter.isDeleted = isDeleted === 'true';
    
    const portfolios = await Portfolio.find(filter)
      .sort({ order: 1, createdAt: -1 });
    
    return apiResponse.success(res, portfolios, 'Portfolios retrieved successfully');
  });

  // Get single portfolio item
  getPortfolioById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const portfolio = await Portfolio.findById(id);
    
    if (!portfolio) {
      return apiResponse.error(res, 'Portfolio not found', 404);
    }
    
    return apiResponse.success(res, portfolio, 'Portfolio retrieved successfully');
  });

  // Create portfolio item
  createPortfolio = asyncHandler(async (req, res) => {
    const portfolio = await Portfolio.create(req.body);
    logger.info(`Portfolio created: ${portfolio._id}`);
    return apiResponse.success(res, portfolio, 'Portfolio created successfully', 201);
  });

  // Update portfolio item
  updatePortfolio = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const portfolio = await Portfolio.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!portfolio) {
      return apiResponse.error(res, 'Portfolio not found', 404);
    }
    
    logger.info(`Portfolio updated: ${id}`);
    return apiResponse.success(res, portfolio, 'Portfolio updated successfully');
  });

  // Delete portfolio item (soft delete)
  deletePortfolio = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const portfolio = await Portfolio.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    );
    
    if (!portfolio) {
      return apiResponse.error(res, 'Portfolio not found', 404);
    }
    
    logger.info(`Portfolio soft deleted: ${id}`);
    return apiResponse.success(res, portfolio, 'Portfolio deleted successfully');
  });
}

module.exports = new PortfolioController();
