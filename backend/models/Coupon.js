const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  discountType: {
    type: String,
    enum: ['percentage', 'fixed'],
    required: true
  },
  discountValue: {
    type: Number,
    required: true
  },
  minPurchase: {
    type: Number,
    default: 0
  },
  startDate: Date,
  endDate: Date,
  isActive: {
    type: Boolean,
    default: true
  },
  maxUses: Number,
  usedCount: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('Coupon', couponSchema);
