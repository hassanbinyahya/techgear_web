const mongoose = require('mongoose');

const purchaseOrderSchema = new mongoose.Schema({
  supplierId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Supplier',
    required: true
  },
  items: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true
    },
    unitCost: {
      type: Number,
      required: true
    }
  }],
  subtotal: Number,
  tax: Number,
  total: Number,
  status: {
    type: String,
    enum: ['draft', 'ordered', 'received', 'cancelled'],
    default: 'draft'
  },
  orderedAt: Date,
  receivedAt: Date
}, { timestamps: true });

module.exports = mongoose.model('PurchaseOrder', purchaseOrderSchema);
