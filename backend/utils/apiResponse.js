/**
 * Standard API Response Utility
 * Ensures consistent response format across all endpoints
 */

class ApiResponse {
  static success(res, data = null, message = 'Success', statusCode = 200) {
    // Convert Mongoose documents to plain objects if needed
    let processedData = data;
    if (data) {
      if (Array.isArray(data)) {
        processedData = data.map(item => {
          if (item && typeof item.toObject === 'function') {
            return item.toObject();
          }
          return item;
        });
      } else if (data && typeof data.toObject === 'function') {
        processedData = data.toObject();
      }
    }
    
    return res.status(statusCode).json({
      success: true,
      message,
      ...(processedData && { data: processedData })
    });
  }

  static error(res, message = 'Error', statusCode = 500, errors = null) {
    return res.status(statusCode).json({
      success: false,
      message,
      ...(errors && { errors })
    });
  }

  static paginated(res, data, meta, message = 'Success', statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
      meta
    });
  }
}

module.exports = ApiResponse;

