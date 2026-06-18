const mongoose = require('mongoose');

const salesAnalyticSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    unique: true
  },
  totalSales: {
    type: Number,
    default: 0
  },
  totalOrders: {
    type: Number,
    default: 0
  },
  totalUnitsSold: {
    type: Number,
    default: 0
  },
  averageOrderValue: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('SalesAnalytic', salesAnalyticSchema);
