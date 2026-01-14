const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema(
  {
    page: {
      type: String,
      required: true,
      enum: ['home', 'about', 'services'],
      unique: true,
    },
    heroTitle: {
      type: String,
      trim: true,
    },
    heroSubtitle: {
      type: String,
      trim: true,
    },
    heroDescription: {
      type: String,
      trim: true,
    },
    sections: [{
      type: {
        type: String,
        enum: ['text', 'stats', 'features', 'process', 'testimonials'],
      },
      title: String,
      content: mongoose.Schema.Types.Mixed, // Can be string, array, or object
    }],
    metadata: {
      type: mongoose.Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  }
);

// page field already indexed via unique: true

module.exports = mongoose.model('Content', contentSchema);
