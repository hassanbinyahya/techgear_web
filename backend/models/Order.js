const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user_email: { 
    type: String, 
    required: true 
  },
  items: { 
    type: Array, 
    required: true 
  },
  total: Number,
  status: { 
    type: String, 
    default: 'pending' 
  },
  created_at: { 
    type: Date, 
    default: Date.now 
  }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
