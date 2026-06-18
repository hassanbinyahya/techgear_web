const mongoose = require('mongoose');

const productRecommendationSchema = new mongoose.Schema({
  baseProductId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  recommendedProductId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  score: {
    type: Number,
    default: 0.9
  },
  type: {
    type: String,
    enum: ['cross-sell', 'up-sell'],
    default: 'cross-sell'
  }
}, { timestamps: true });

// Prevent duplicate recommendations for the same pair
productRecommendationSchema.index({ baseProductId: 1, recommendedProductId: 1 }, { unique: true });

module.exports = mongoose.model('ProductRecommendation', productRecommendationSchema);
