const mongoose = require('mongoose');
require('dotenv').config();
const Product = require('./models/Product');
const MONGO_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/techgearhub';
async function run() {
  try {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB at', MONGO_URI);
    const count = await Product.countDocuments();
    console.log('Products count in MongoDB:', count);
    if (count > 0) {
      const sample = await Product.find().limit(5).select('sku name price category');
      console.log('Sample products:');
      console.table(sample.map(p => ({ sku: p.sku, name: p.name, price: p.price, category: p.category })));
    }
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Error checking MongoDB:', err.message);
    process.exit(1);
  }
}
run();
