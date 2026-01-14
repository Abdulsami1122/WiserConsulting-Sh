const Team = require('../models/Team');
const asyncHandler = require('../utils/asyncHandler');
const apiResponse = require('../utils/apiResponse');
const logger = require('../utils/logger');

class TeamController {
  // Get all team members
  getAllTeamMembers = asyncHandler(async (req, res) => {
    const { isActive, isDeleted } = req.query;
    const filter = { isDeleted: false }; // Default: exclude deleted
    
    if (isActive !== undefined) filter.isActive = isActive === 'true';
    if (isDeleted !== undefined) filter.isDeleted = isDeleted === 'true';
    
    const teamMembers = await Team.find(filter)
      .sort({ order: 1, createdAt: -1 });
    
    return apiResponse.success(res, teamMembers, 'Team members retrieved successfully');
  });

  // Get single team member
  getTeamMemberById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const member = await Team.findById(id);
    
    if (!member) {
      return apiResponse.error(res, 'Team member not found', 404);
    }
    
    return apiResponse.success(res, member, 'Team member retrieved successfully');
  });

  // Create team member
  createTeamMember = asyncHandler(async (req, res) => {
    const member = await Team.create(req.body);
    logger.info(`Team member created: ${member._id}`);
    return apiResponse.success(res, member, 'Team member created successfully', 201);
  });

  // Update team member
  updateTeamMember = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const member = await Team.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!member) {
      return apiResponse.error(res, 'Team member not found', 404);
    }
    
    logger.info(`Team member updated: ${id}`);
    return apiResponse.success(res, member, 'Team member updated successfully');
  });

  // Delete team member (soft delete)
  deleteTeamMember = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const member = await Team.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    );
    
    if (!member) {
      return apiResponse.error(res, 'Team member not found', 404);
    }
    
    logger.info(`Team member soft deleted: ${id}`);
    return apiResponse.success(res, member, 'Team member deleted successfully');
  });
}

module.exports = new TeamController();
