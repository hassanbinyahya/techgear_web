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
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  },
  brand: String,
  brandId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Brand'
  },
  description: String,
  price: Number,
  image_url: String,
  stock: { 
    type: Number, 
    default: 50 
  },
  specifications: [{
    name: String,
    value: String
  }],
  ratings: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);

