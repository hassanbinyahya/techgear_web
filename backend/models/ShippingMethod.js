const mongoose = require('mongoose');

const shippingMethodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  cost: {
    type: Number,
    required: true
  },
  estimatedDays: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('ShippingMethod', shippingMethodSchema);
