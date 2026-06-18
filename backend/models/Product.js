const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  sku: { 
    type: String, 
    unique: true, 
    required: true 
  },
  name: { 
    type: String, 
    required: true 
  },
  category: String,
  price: Number,
  image_url: String,
  stock: { 
    type: Number, 
    default: 50 
  }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
