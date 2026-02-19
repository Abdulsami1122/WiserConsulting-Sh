const Portfolio = require('../models/Portfolio');
const asyncHandler = require('../utils/asyncHandler');
const apiResponse = require('../utils/apiResponse');
const logger = require('../utils/logger');

class PortfolioController {
  // Helper function to parse FormData arrays
  parseFormDataArrays(body) {
    const parsed = { ...body };
    
    // Parse technologies array if it exists
    if (body.technologies) {
      if (typeof body.technologies === 'string') {
        try {
          parsed.technologies = JSON.parse(body.technologies);
        } catch (e) {
          // If not JSON, treat as single value array
          parsed.technologies = [body.technologies];
        }
      } else if (Array.isArray(body.technologies)) {
        parsed.technologies = body.technologies;
      } else if (typeof body.technologies === 'object') {
        // Handle FormData array format: technologies[0], technologies[1], etc.
        parsed.technologies = Object.keys(body.technologies)
          .sort()
          .map(key => body.technologies[key])
          .filter(val => val);
      }
    }
    
    // Parse order and isActive as numbers/booleans
    if (body.order !== undefined) {
      parsed.order = parseInt(body.order) || 0;
    }
    if (body.isActive !== undefined) {
      parsed.isActive = body.isActive === 'true' || body.isActive === true;
    }
    
    return parsed;
  }

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
    // Parse FormData arrays and other fields
    const portfolioData = this.parseFormDataArrays(req.body);
    
    // If an image file was uploaded, use the Cloudinary URL
    if (req.file && req.file.path) {
      portfolioData.image = req.file.path; // Cloudinary URL
    } else if (!portfolioData.image) {
      // Default to emoji if no image provided
      portfolioData.image = '🛒';
    }
    
    const portfolio = await Portfolio.create(portfolioData);
    logger.info(`Portfolio created: ${portfolio._id}`);
    return apiResponse.success(res, portfolio, 'Portfolio created successfully', 201);
  });

  // Update portfolio item
  updatePortfolio = asyncHandler(async (req, res) => {
    const { id } = req.params;
    // Parse FormData arrays and other fields
    const updateData = this.parseFormDataArrays(req.body);
    
    // If an image file was uploaded, use the Cloudinary URL
    if (req.file && req.file.path) {
      updateData.image = req.file.path; // Cloudinary URL
    }
    // If no new image uploaded and image field is empty string, keep existing image
    // (don't update image field if it's not provided)
    if (updateData.image === '') {
      delete updateData.image;
    }
    
    const portfolio = await Portfolio.findByIdAndUpdate(
      id,
      updateData,
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
