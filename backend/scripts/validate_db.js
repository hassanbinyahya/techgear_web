require('dotenv').config();
const mongoose = require('mongoose');

// Import all models
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Category = require('../models/Category');
const Brand = require('../models/Brand');
const Review = require('../models/Review');
const Cart = require('../models/Cart');
const Wishlist = require('../models/Wishlist');
const InventoryTransaction = require('../models/InventoryTransaction');
const Supplier = require('../models/Supplier');
const PurchaseOrder = require('../models/PurchaseOrder');
const Coupon = require('../models/Coupon');
const ShippingMethod = require('../models/ShippingMethod');
const Payment = require('../models/Payment');
const SupportTicket = require('../models/SupportTicket');
const AuditLog = require('../models/AuditLog');
const NewsletterSubscription = require('../models/NewsletterSubscription');
const Department = require('../models/Department');
const Employee = require('../models/Employee');
const Expense = require('../models/Expense');
const SalesAnalytic = require('../models/SalesAnalytic');
const ProductRecommendation = require('../models/ProductRecommendation');

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/techgearhub';

async function validateDatabase() {
  console.log('Connecting to MongoDB for Validation...');
  await mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  
  const modelsMap = {
    Department, User, Employee, Brand, Category, Product, Review, Cart, Wishlist,
    ShippingMethod, Coupon, Supplier, PurchaseOrder, InventoryTransaction, Order,
    Payment, SupportTicket, AuditLog, NewsletterSubscription, Expense, SalesAnalytic,
    ProductRecommendation
  };

  console.log('\n======================================================');
  console.log('📊 DATABASE COLLECTION SUMMARY STATISTICS');
  console.log('======================================================');
  
  const stats = [];
  for (const [name, model] of Object.entries(modelsMap)) {
    try {
      const count = await model.countDocuments({});
      stats.push({ Collection: name, 'Document Count': count, Status: count > 0 ? '✓ Seeding Valid' : '✗ Empty' });
    } catch (err) {
      stats.push({ Collection: name, 'Document Count': 'ERROR', Status: `✗ Error: ${err.message}` });
    }
  }
  
  console.table(stats);

  // Cross reference validation checks
  console.log('\n======================================================');
  console.log('🔍 RELATIONAL INTEGRITY CHECKS');
  console.log('======================================================');

  // Check 1: Do products correctly reference Brand and Category?
  const singleProduct = await Product.findOne({ brandId: { $ne: null }, categoryId: { $ne: null } }).populate('brandId categoryId');
  if (singleProduct && singleProduct.brandId && singleProduct.categoryId) {
    console.log(`✓ Product referencing Brand & Category works. Product: "${singleProduct.name}" -> Brand: "${singleProduct.brandId.name}", Category: "${singleProduct.categoryId.name}"`);
  } else {
    console.log('✗ Product referencing checks failed.');
  }

  // Check 2: Do employees map to departments?
  const singleEmployee = await Employee.findOne({}).populate('userId departmentId');
  if (singleEmployee && singleEmployee.userId && singleEmployee.departmentId) {
    console.log(`✓ Employee referencing works. Staff Name: "${singleEmployee.userId.name}" -> Role: "${singleEmployee.jobTitle}" in Dept: "${singleEmployee.departmentId.name}"`);
  } else {
    console.log('✗ Employee referencing checks failed.');
  }

  // Check 3: Do orders map to payments and users?
  const singleOrder = await Order.findOne({}).populate('userId paymentId');
  if (singleOrder && singleOrder.userId && singleOrder.paymentId) {
    console.log(`✓ Order referencing works. Order for: "${singleOrder.userId.name}" (Total: $${singleOrder.total}) -> Payment Txn: "${singleOrder.paymentId.transactionId}" (Status: ${singleOrder.paymentId.status})`);
  } else {
    console.log('✗ Order referencing checks failed.');
  }

  // Check 4: Check if total sales aggregates are seeded
  const aggregateSum = await SalesAnalytic.aggregate([{ $group: { _id: null, sum: { $sum: '$totalSales' } } }]);
  if (aggregateSum.length > 0) {
    console.log(`✓ Sales Analytics aggregations check out. Cumulative daily sales tracked: $${aggregateSum[0].sum.toLocaleString()}`);
  } else {
    console.log('✗ Sales Analytics check failed.');
  }

  console.log('\n======================================================');
  console.log('🎉 VALIDATION COMPLETED!');
  console.log('======================================================\n');

  await mongoose.connection.close();
}

validateDatabase().catch(err => {
  console.error('Validation script failed:', err);
  process.exit(1);
});
