const mongoose = require('mongoose');

const inventoryTransactionSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  type: {
    type: String,
    enum: ['in', 'out', 'adjustment', 'audit_loss', 'audit_gain'],
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  reason: String,
  notes: String,
  performedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

module.exports = mongoose.model('InventoryTransaction', inventoryTransactionSchema);
