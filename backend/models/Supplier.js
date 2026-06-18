const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  contactPerson: String,
  email: {
    type: String,
    required: true
  },
  phone: String,
  address: {
    street: String,
    city: String,
    state: String,
    zip: String,
    country: String
  },
  taxId: String,
  supplyCategory: String
}, { timestamps: true });

module.exports = mongoose.model('Supplier', supplierSchema);
