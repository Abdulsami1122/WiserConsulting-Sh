const Content = require('../models/Content');
const asyncHandler = require('../utils/asyncHandler');
const apiResponse = require('../utils/apiResponse');
const logger = require('../utils/logger');

class ContentController {
  // Get content by page
  getContentByPage = asyncHandler(async (req, res) => {
    const { page } = req.params;
    let content = await Content.findOne({ page });
    
    if (!content) {
      // Create default content if doesn't exist
      content = await Content.create({ page, sections: [] });
    }
    
    return apiResponse.success(res, content, 'Content retrieved successfully');
  });

  // Update content by page
  updateContent = asyncHandler(async (req, res) => {
    const { page } = req.params;
    let content = await Content.findOne({ page });
    
    if (!content) {
      content = await Content.create({ page, ...req.body });
      logger.info(`Content created for page: ${page}`);
    } else {
      content = await Content.findOneAndUpdate(
        { page },
        req.body,
        { new: true, runValidators: true }
      );
      logger.info(`Content updated for page: ${page}`);
    }
    
    return apiResponse.success(res, content, 'Content updated successfully');
  });

  // Get all content
  getAllContent = asyncHandler(async (req, res) => {
    const contents = await Content.find().sort({ page: 1 });
    return apiResponse.success(res, contents, 'All content retrieved successfully');
  });
}

module.exports = new ContentController();
