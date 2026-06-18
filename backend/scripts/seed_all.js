require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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

async function seedDatabase() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  console.log('✓ Connected to MongoDB');

  // Clear all collections
  console.log('Clearing existing data...');
  const collections = [
    User, Product, Order, Category, Brand, Review, Cart, Wishlist,
    InventoryTransaction, Supplier, PurchaseOrder, Coupon, ShippingMethod,
    Payment, SupportTicket, AuditLog, NewsletterSubscription, Department,
    Employee, Expense, SalesAnalytic, ProductRecommendation
  ];
  for (const col of collections) {
    await col.deleteMany({});
  }
  console.log('✓ All collections cleared.');

  // 1. Seed Departments
  console.log('Seeding Departments...');
  const departmentsData = [
    { name: 'Engineering', code: 'ENG', description: 'Software and product engineering team' },
    { name: 'Sales & Marketing', code: 'SLS', description: 'Retail operations, advertising and sales' },
    { name: 'Customer Support', code: 'SUP', description: 'Assisting buyers and handling product inquiries' },
    { name: 'Human Resources', code: 'HR', description: 'Recruitment, payroll and staff management' },
    { name: 'Finance & Accounts', code: 'FIN', description: 'Accounting, taxes, billing and expenses' }
  ];
  const departments = await Department.insertMany(departmentsData);
  console.log(`✓ Seeded ${departments.length} departments.`);

  // 2. Seed Users (Customers, Employees, Admin)
  console.log('Seeding Users (Hashing passwords, please wait)...');
  const hashedCustomerPassword = await bcrypt.hash('Customer@123', 10);
  const hashedEmployeePassword = await bcrypt.hash('Employee@123', 10);
  const hashedAdminPassword = await bcrypt.hash('Admin@123', 10);

  const usersData = [];
  
  // 1 Admin
  usersData.push({
    name: 'TechGear Admin',
    email: 'admin@gmail.com',
    password: hashedAdminPassword,
    role: 'admin',
    phone: '+15550100',
    shippingAddress: { street: '100 Admin Plaza', city: 'San Jose', state: 'CA', zip: '95101', country: 'USA' },
    billingAddress: { street: '100 Admin Plaza', city: 'San Jose', state: 'CA', zip: '95101', country: 'USA' }
  });

  // 5 Employees (1 for each department)
  const employeeNames = ['John Doe', 'Sarah Connor', 'Michael Scott', 'Emma Watson', 'Clark Kent'];
  const employeeEmails = ['john.doe@gmail.com', 'sarah.c@gmail.com', 'michael.s@gmail.com', 'emma.w@gmail.com', 'clark.k@gmail.com'];
  for (let i = 0; i < 5; i++) {
    usersData.push({
      name: employeeNames[i],
      email: employeeEmails[i],
      password: hashedEmployeePassword,
      role: 'employee',
      phone: `+1555020${i}`,
      shippingAddress: { street: `${200 + i} Staff Road`, city: 'Sunnyvale', state: 'CA', zip: '94085', country: 'USA' },
      billingAddress: { street: `${200 + i} Staff Road`, city: 'Sunnyvale', state: 'CA', zip: '94085', country: 'USA' }
    });
  }

  // 15 Customers
  const customerNames = [
    'Alice Smith', 'Bob Miller', 'Charlie Brown', 'David Lee', 'Eva Green',
    'Frank Wright', 'Grace Hopper', 'Henry Ford', 'Ivy League', 'Jack Ryan',
    'Karen Jones', 'Leo Messi', 'Mia Khalifa', 'Nathan Drake', 'Olivia Wilde'
  ];
  for (let i = 0; i < customerNames.length; i++) {
    const formattedEmail = `${customerNames[i].toLowerCase().replace(' ', '.')}@gmail.com`;
    usersData.push({
      name: customerNames[i],
      email: formattedEmail,
      password: hashedCustomerPassword,
      role: 'customer',
      phone: `+1555030${i}`,
      shippingAddress: { street: `${500 + i} Customer St`, city: 'Los Angeles', state: 'CA', zip: '90001', country: 'USA' },
      billingAddress: { street: `${500 + i} Customer St`, city: 'Los Angeles', state: 'CA', zip: '90001', country: 'USA' }
    });
  }

  const users = await User.insertMany(usersData);
  console.log(`✓ Seeded ${users.length} users (Admin, Employees, Customers).`);

  // Update Departments with managers (link managers to employee users)
  const engineerUser = users.find(u => u.email === 'john.doe@gmail.com');
  const financeUser = users.find(u => u.email === 'clark.k@gmail.com');
  await Department.updateOne({ code: 'ENG' }, { managerId: engineerUser._id });
  await Department.updateOne({ code: 'FIN' }, { managerId: financeUser._id });

  // 3. Seed Employees details
  console.log('Seeding Employees metadata...');
  const employeesData = [
    { userId: users[1]._id, employeeId: 'EMP-001', departmentId: departments[0]._id, jobTitle: 'Senior Software Engineer', salary: 120000 },
    { userId: users[2]._id, employeeId: 'EMP-002', departmentId: departments[1]._id, jobTitle: 'Sales Executive', salary: 60000 },
    { userId: users[3]._id, employeeId: 'EMP-003', departmentId: departments[2]._id, jobTitle: 'Customer Success Advocate', salary: 45000 },
    { userId: users[4]._id, employeeId: 'EMP-004', departmentId: departments[3]._id, jobTitle: 'HR Specialist', salary: 70000 },
    { userId: users[5]._id, employeeId: 'EMP-005', departmentId: departments[4]._id, jobTitle: 'Chief Accountant', salary: 95000 }
  ];
  const employees = await Employee.insertMany(employeesData);
  console.log(`✓ Seeded ${employees.length} employees details.`);

  // 4. Seed Brands
  console.log('Seeding Brands...');
  const brandsData = [
    { name: 'Apple', slug: 'apple', description: 'Premium tech products and accessories', website: 'https://apple.com', logoUrl: '/images/brands/apple.png' },
    { name: 'Samsung', slug: 'samsung', description: 'Cutting edge electronics and gear', website: 'https://samsung.com', logoUrl: '/images/brands/samsung.png' },
    { name: 'Anker', slug: 'anker', description: 'Industry leader in charging and power solutions', website: 'https://anker.com', logoUrl: '/images/brands/anker.png' },
    { name: 'Spigen', slug: 'spigen', description: 'Sleek protection and phone cases', website: 'https://spigen.com', logoUrl: '/images/brands/spigen.png' },
    { name: 'Sony', slug: 'sony', description: 'World-class premium audio and entertainment systems', website: 'https://sony.com', logoUrl: '/images/brands/sony.png' },
    { name: 'Belkin', slug: 'belkin', description: 'Connectivity and charging accessories', website: 'https://belkin.com', logoUrl: '/images/brands/belkin.png' },
    { name: 'Jabra', slug: 'jabra', description: 'High performance office and sports headsets', website: 'https://jabra.com', logoUrl: '/images/brands/jabra.png' },
    { name: 'OtterBox', slug: 'otterbox', description: 'Heavy-duty rugged defensive covers', website: 'https://otterbox.com', logoUrl: '/images/brands/otterbox.png' }
  ];
  const brands = await Brand.insertMany(brandsData);
  console.log(`✓ Seeded ${brands.length} brands.`);

  // 5. Seed Categories
  console.log('Seeding Categories...');
  const categoriesData = [
    { name: 'Cases & Covers', slug: 'cases-covers', description: 'Skins, shells, and robust protection for smartphones and wearables', icon: 'smartphone' },
    { name: 'Screen Protection', slug: 'screen-protection', description: 'Tempered glass, matte coatings, privacy screens', icon: 'shield' },
    { name: 'Chargers & Adapters', slug: 'chargers-adapters', description: 'Fast wall bricks, car chargers, and multi-port charging hubs', icon: 'bolt' },
    { name: 'Charging Cables', slug: 'charging-cables', description: 'Braided Type-C, Lightning, Micro-USB, and multi-leads', icon: 'cable' },
    { name: 'Power Banks', slug: 'power-banks', description: 'High capacity, slimline portable external battery packs', icon: 'battery_charging_full' },
    { name: 'Wireless Audio', slug: 'wireless-audio', description: 'True wireless earbuds, active noise-cancelling headphones', icon: 'headset' },
    { name: 'Wired Audio', slug: 'wired-audio', description: 'Studio monitors, 3.5mm headsets, type-C earphones', icon: 'headphones' },
    { name: 'Mobile Holders/Mounts', slug: 'holders-mounts', description: 'Dashboard holders, bike brackets, desktop stands', icon: 'pivot_table_chart' },
    { name: 'Photography/Vlogging', slug: 'photography', description: 'LED ring lights, smartphone gimbals, clip-on lenses', icon: 'photo_camera' },
    { name: 'Gaming Accessories', slug: 'gaming', description: 'Triggers, controller attachments, cooling fans', icon: 'sports_esports' }
  ];
  const categories = await Category.insertMany(categoriesData);
  console.log(`✓ Seeded ${categories.length} categories.`);

  // 6. Seed Products (60 products mapping to Category and Brand)
  console.log('Seeding Products (60+ items)...');
  const apple = brands.find(b => b.slug === 'apple');
  const samsung = brands.find(b => b.slug === 'samsung');
  const anker = brands.find(b => b.slug === 'anker');
  const spigen = brands.find(b => b.slug === 'spigen');
  const sony = brands.find(b => b.slug === 'sony');
  const belkin = brands.find(b => b.slug === 'belkin');
  const jabra = brands.find(b => b.slug === 'jabra');
  const otterbox = brands.find(b => b.slug === 'otterbox');

  const rawProducts = [
    // Cases & Covers (Category 0)
    { sku: 'CA-001', name: 'Silicone Case', category: 'Cases & Covers', price: 12.99, image_url: '/images/Silicone Case.png', stock: 150, brand: 'Apple', brandId: apple._id, categoryId: categories[0]._id, description: 'Soft-touch silicone case for premium grip and protection.', specifications: [{ name: 'Material', value: 'Liquid Silicone' }, { name: 'Weight', value: '28g' }] },
    { sku: 'CA-002', name: 'Rugged Armor', category: 'Cases & Covers', price: 18.99, image_url: '/images/Rugged Armor.png', stock: 120, brand: 'Spigen', brandId: spigen._id, categoryId: categories[0]._id, description: 'Shock-absorption carbon fiber shell for tough drops.', specifications: [{ name: 'Drop Protection', value: '10 Feet' }, { name: 'Warranty', value: '1 Year' }] },
    { sku: 'CA-003', name: 'Wallet Case', category: 'Cases & Covers', price: 24.99, image_url: '/images/Wallet Case.png', stock: 90, brand: 'Belkin', brandId: belkin._id, categoryId: categories[0]._id, description: 'Genuine leather folio with 3 card slots and standing view mode.', specifications: [{ name: 'Slots', value: '3 Cards + Cash' }, { name: 'Material', value: 'Genuine Leather' }] },
    { sku: 'CA-004', name: 'Transparent TPU', category: 'Cases & Covers', price: 10.99, image_url: '/images/Transparent TPU.png', stock: 200, brand: 'Spigen', brandId: spigen._id, categoryId: categories[0]._id, description: 'Ultra-thin crystal clear protective back cover showing off phone design.', specifications: [{ name: 'Thickness', value: '1.2mm' }, { name: 'UV Resistant', value: 'Yes' }] },
    { sku: 'CA-005', name: 'Leather Flip Case', category: 'Cases & Covers', price: 28.99, image_url: '/images/Leather Flip Case.png', stock: 75, brand: 'Apple', brandId: apple._id, categoryId: categories[0]._id, description: 'Premium leather case featuring microfibre interior lining.', specifications: [{ name: 'Qi Compatible', value: 'Yes' }, { name: 'Brand Specific', value: 'iPhone' }] },
    { sku: 'CA-006', name: 'Defender Shield', category: 'Cases & Covers', price: 34.99, image_url: '/images/Defender Shield.png', stock: 60, brand: 'OtterBox', brandId: otterbox._id, categoryId: categories[0]._id, description: 'Multi-layer defensive cover with dust plug port protection.', specifications: [{ name: 'Layers', value: '3 layers' }, { name: 'Dust proof', value: 'Yes' }] },

    // Screen Protection (Category 1)
    { sku: 'SP-006', name: 'Tempered Glass', category: 'Screen Protection', price: 8.99, image_url: '/images/Tempered Glass.png', stock: 300, brand: 'Spigen', brandId: spigen._id, categoryId: categories[1]._id, description: '9H hardness anti-shatter screen shield with alignment frame.', specifications: [{ name: 'Hardness', value: '9H' }, { name: 'Clarity', value: '99.9%' }] },
    { sku: 'SP-007', name: 'Privacy Film', category: 'Screen Protection', price: 10.99, image_url: '/images/Privacy Film.png', stock: 220, brand: 'Belkin', brandId: belkin._id, categoryId: categories[1]._id, description: 'Polarized privacy protector prevents side-snoopers from seeing screen.', specifications: [{ name: 'Viewing Angle', value: '30 Degrees' }, { name: 'Finish', value: 'Anti-Glare' }] },
    { sku: 'SP-008', name: 'Matte Protector', category: 'Screen Protection', price: 9.99, image_url: '/images/Matte Protector.png', stock: 180, brand: 'Spigen', brandId: spigen._id, categoryId: categories[1]._id, description: 'Satin matte film reducing glare and fingerprint smudges.', specifications: [{ name: 'Texture', value: 'Paper-like feel' }, { name: 'Thickness', value: '0.15mm' }] },
    { sku: 'SP-009', name: 'Hydrogel Film', category: 'Screen Protection', price: 11.99, image_url: '/images/Hydrogel Film.png', stock: 150, brand: 'Samsung', brandId: samsung._id, categoryId: categories[1]._id, description: 'Self-healing smart hydrogel covering edge-to-edge screens.', specifications: [{ name: 'Self-healing', value: 'Within 24 Hours' }, { name: 'Elasticity', value: 'High' }] },
    { sku: 'SP-010', name: 'Camera Lens Protector', category: 'Screen Protection', price: 7.99, image_url: '/images/Camera Lens Protector.png', stock: 250, brand: 'Spigen', brandId: spigen._id, categoryId: categories[1]._id, description: 'Tempered rings that safeguard camera lenses without degrading flash output.', specifications: [{ name: 'Glass Grade', value: 'Super HD Tempered' }] },

    // Chargers & Adapters (Category 2)
    { sku: 'CH-011', name: 'Wall Charger (PD)', category: 'Chargers & Adapters', price: 29.99, image_url: '/images/Wall Charger (PD).png', stock: 140, brand: 'Anker', brandId: anker._id, categoryId: categories[2]._id, description: '30W Power Delivery GaN charger, ultra-compact profile.', specifications: [{ name: 'Output', value: '30W Type-C' }, { name: 'Tech', value: 'GaN Technology' }] },
    { sku: 'CH-012', name: 'Fast Charging Brick', category: 'Chargers & Adapters', price: 34.99, image_url: '/images/Fast Charging Brick.png', stock: 100, brand: 'Anker', brandId: anker._id, categoryId: categories[2]._id, description: '65W dual C-port and USB-A port charger for smartphones and laptops.', specifications: [{ name: 'Max Output', value: '65W' }, { name: 'Ports', value: '2x Type-C, 1x USB-A' }] },
    { sku: 'CH-013', name: 'Car Charger', category: 'Chargers & Adapters', price: 19.99, image_url: '/images/Car Charger.png', stock: 110, brand: 'Belkin', brandId: belkin._id, categoryId: categories[2]._id, description: 'Dual port rapid charger designed for active commutes.', specifications: [{ name: 'Output', value: '36W' }, { name: 'Indicator', value: 'LED Ring' }] },
    { sku: 'CH-014', name: 'Multi-port Hub', category: 'Chargers & Adapters', price: 39.99, image_url: '/images/Multi-port Hub.png', stock: 85, brand: 'Anker', brandId: anker._id, categoryId: categories[2]._id, description: 'Desktop charging station with smart power-allocation controls.', specifications: [{ name: 'Ports', value: '4x USB-C, 2x USB-A' }, { name: 'Cable Length', value: '1.5m' }] },
    { sku: 'CH-015', name: 'Wireless Charger', category: 'Chargers & Adapters', price: 27.99, image_url: '/images/Wireless Charger.png', stock: 95, brand: 'Apple', brandId: apple._id, categoryId: categories[2]._id, description: '15W MagSafe charger with snap-on alignment magnets.', specifications: [{ name: 'Wireless Output', value: '15W' }, { name: 'Magnet System', value: 'MagSafe Compatible' }] },

    // Charging Cables (Category 3)
    { sku: 'CC-016', name: 'USB-C Cable', category: 'Charging Cables', price: 7.99, image_url: '/images/USB-C Cable.png', stock: 400, brand: 'Anker', brandId: anker._id, categoryId: categories[3]._id, description: 'Braided nylon USB-C to USB-C 100W power delivery cable.', specifications: [{ name: 'Length', value: '1.8m (6ft)' }, { name: 'Bend Lifespan', value: '25,000+' }] },
    { sku: 'CC-017', name: 'Lightning Cable', category: 'Charging Cables', price: 8.99, image_url: '/images/Lightning Cable.png', stock: 350, brand: 'Apple', brandId: apple._id, categoryId: categories[3]._id, description: 'Apple MFi Certified USB-C to Lightning charge and sync wire.', specifications: [{ name: 'Certification', value: 'MFi Apple' }, { name: 'Length', value: '1.0m (3.3ft)' }] },
    { sku: 'CC-018', name: 'Micro-USB Cable', category: 'Charging Cables', price: 6.99, image_url: '/images/Micro-USB Cable.png', stock: 150, brand: 'Anker', brandId: anker._id, categoryId: categories[3]._id, description: 'Double braided micro-USB charging cord, rugged durability.', specifications: [{ name: 'Speed', value: '480 Mbps' }, { name: 'Length', value: '1.0m' }] },
    { sku: 'CC-019', name: '3-in-1 Cable', category: 'Charging Cables', price: 13.99, image_url: '/images/3-in-1 Cable.png', stock: 130, brand: 'Belkin', brandId: belkin._id, categoryId: categories[3]._id, description: 'All-in-one cable with exchangeable Type-C, Lightning and Micro-USB heads.', specifications: [{ name: 'Connector Heads', value: 'C + Lightning + Micro' }] },
    { sku: 'CC-020', name: 'Braided Charging Cable', category: 'Charging Cables', price: 10.99, image_url: '/images/Braided Charging Cable.png', stock: 210, brand: 'Anker', brandId: anker._id, categoryId: categories[3]._id, description: 'Heavy-duty aramid fiber charging cable with leather organizer strap.', specifications: [{ name: 'Aramid Fiber', value: 'Double Shield' }] },

    // Power Banks (Category 4)
    { sku: 'PB-021', name: 'Slim 5000mAh', category: 'Power Banks', price: 18.99, image_url: '/images/Slim 5000mAh.png', stock: 150, brand: 'Anker', brandId: anker._id, categoryId: categories[4]._id, description: 'Pocket-sized lightweight mobile charger for urgent top-ups.', specifications: [{ name: 'Capacity', value: '5000 mAh' }, { name: 'Weight', value: '110g' }] },
    { sku: 'PB-022', name: 'Fast Charge 10000mAh', category: 'Power Banks', price: 26.99, image_url: '/images/Fast Charge 10000mAh.png', stock: 180, brand: 'Anker', brandId: anker._id, categoryId: categories[4]._id, description: '22.5W high-density battery bank featuring a built-in USB-C cable.', specifications: [{ name: 'Capacity', value: '10000 mAh' }, { name: 'Output Port', value: 'USB-C PD, USB-A' }] },
    { sku: 'PB-023', name: 'High Capacity 20000mAh', category: 'Power Banks', price: 38.99, image_url: '/images/High Capacity 20000mAh.png', stock: 100, brand: 'Anker', brandId: anker._id, categoryId: categories[4]._id, description: 'Massive capacity backup power bank capable of charging laptops.', specifications: [{ name: 'Capacity', value: '20000 mAh' }, { name: 'Max PD Output', value: '45W' }] },
    { sku: 'PB-024', name: 'MagSafe Power Bank', category: 'Power Banks', price: 43.99, image_url: '/images/MagSafe Power Bank.png', stock: 80, brand: 'Apple', brandId: apple._id, categoryId: categories[4]._id, description: 'Magnetic snap-on backup battery that fits neatly on the back of phone.', specifications: [{ name: 'Attachment', value: 'MagSafe' }, { name: 'Wireless Charging', value: '7.5W' }] },
    { sku: 'PB-025', name: 'Solar Power Bank', category: 'Power Banks', price: 49.99, image_url: '/images/Solar Power Bank.png', stock: 65, brand: 'OtterBox', brandId: otterbox._id, categoryId: categories[4]._id, description: 'IP67 waterproof solar bank with flashlight, perfect for hikers.', specifications: [{ name: 'Solar Panel', value: '1.5W Monocrystalline' }, { name: 'Waterproof Rating', value: 'IP67' }] },

    // Wireless Audio (Category 5)
    { sku: 'WA-026', name: 'TWS Earbuds', category: 'Wireless Audio', price: 54.99, image_url: '/images/TWS Earbuds.png', stock: 130, brand: 'Jabra', brandId: jabra._id, categoryId: categories[5]._id, description: 'Comfortable workout wireless earbuds with IP55 dust and sweat resistance.', specifications: [{ name: 'Bluetooth', value: '5.2' }, { name: 'Battery Life', value: '28 Hours with Case' }] },
    { sku: 'WA-027', name: 'Over-ear Bluetooth Headphones', category: 'Wireless Audio', price: 64.99, image_url: '/images/Over-ear Bluetooth Headphones.png', stock: 90, brand: 'Sony', brandId: sony._id, categoryId: categories[5]._id, description: 'Superior wireless audio with deep bass and soft ear cushioning.', specifications: [{ name: 'Driver', value: '40mm Dynamic' }, { name: 'Charge Port', value: 'USB-C' }] },
    { sku: 'WA-028', name: 'Sports Neckband', category: 'Wireless Audio', price: 31.99, image_url: '/images/Sports Neckband.png', stock: 110, brand: 'Samsung', brandId: samsung._id, categoryId: categories[5]._id, description: 'Ergonomic neckband with magnetic buds for quick pause/resume capability.', specifications: [{ name: 'Weight', value: '35g' }, { name: 'Standby Time', value: '300 Hours' }] },
    { sku: 'WA-029', name: 'ANC Earbuds', category: 'Wireless Audio', price: 71.99, image_url: '/images/ANC Earbuds.png', stock: 70, brand: 'Sony', brandId: sony._id, categoryId: categories[5]._id, description: 'Active Noise Cancelling earbuds with custom sound isolation profiles.', specifications: [{ name: 'ANC Depth', value: '38dB' }, { name: 'Voice Assistant', value: 'Siri & Google' }] },
    { sku: 'WA-030', name: 'Mono Bluetooth Headset', category: 'Wireless Audio', price: 23.99, image_url: '/images/Mono Bluetooth Headset.png', stock: 120, brand: 'Jabra', brandId: jabra._id, categoryId: categories[5]._id, description: 'Professional single-ear business headset with high gain mic.', specifications: [{ name: 'Mic System', value: 'Dual Noise-Cancelling' }] },

    // Wired Audio (Category 6)
    { sku: 'WD-031', name: 'Type-C Wired Earphones', category: 'Wired Audio', price: 14.99, image_url: '/images/Type-C Wired Earphones.png', stock: 170, brand: 'Samsung', brandId: samsung._id, categoryId: categories[6]._id, description: 'Wired high fidelity earbuds with directly built-in DAC audio chips.', specifications: [{ name: 'Interface', value: 'USB Type-C' }, { name: 'In-line controls', value: 'Yes' }] },
    { sku: 'WD-032', name: '3.5mm Earphones', category: 'Wired Audio', price: 11.99, image_url: '/images/3.5mm Earphones.png', stock: 160, brand: 'Sony', brandId: sony._id, categoryId: categories[6]._id, description: 'Ergonomic buds featuring standard 3.5mm gold plated jack contacts.', specifications: [{ name: 'Jack', value: '3.5mm L-Shape' }, { name: 'Driver Size', value: '12mm' }] },
    { sku: 'WD-033', name: 'Gaming Headset', category: 'Wired Audio', price: 37.99, image_url: '/images/Gaming Headset.png', stock: 85, brand: 'Sony', brandId: sony._id, categoryId: categories[6]._id, description: 'Over-ear immersive stereo gaming headset with flip-up boom mic.', specifications: [{ name: 'Impedance', value: '32 Ohms' }, { name: 'Cable Length', value: '2.2m' }] },
    { sku: 'WD-034', name: 'AUX Cable', category: 'Wired Audio', price: 5.99, image_url: '/images/AUX Cable.png', stock: 200, brand: 'Belkin', brandId: belkin._id, categoryId: categories[6]._id, description: 'Shielded auxiliary male-to-male wire preventing static noises.', specifications: [{ name: 'Contacts', value: '24k Gold-Plated' }, { name: 'Length', value: '1.2m' }] },

    // Mobile Holders & Mounts (Category 7)
    { sku: 'HM-036', name: 'Dashboard Car Mount', category: 'Mobile Holders/Mounts', price: 13.99, image_url: '/images/Dashboard Car Mount.png', stock: 140, brand: 'Spigen', brandId: spigen._id, categoryId: categories[7]._id, description: 'Super sticky suction bracket fitting dashboard surfaces.', specifications: [{ name: 'Rotation', value: '360 Degrees' }, { name: 'Suction Tech', value: 'Sticky Gel Pad' }] },
    { sku: 'HM-037', name: 'Bike Phone Holder', category: 'Mobile Holders/Mounts', price: 17.99, image_url: '/images/Bike Phone Holder.png', stock: 100, brand: 'Spigen', brandId: spigen._id, categoryId: categories[7]._id, description: 'Secure clamp grip with corner silicone straps preventing road vibration.', specifications: [{ name: 'Fits handlebars', value: '20mm - 35mm' }] },
    { sku: 'HM-038', name: 'Desktop Stand', category: 'Mobile Holders/Mounts', price: 15.99, image_url: '/images/Desktop Stand.png', stock: 110, brand: 'Belkin', brandId: belkin._id, categoryId: categories[7]._id, description: 'Weighted aluminum desk stand with custom angle tilts and rubber bumpers.', specifications: [{ name: 'Adjustability', value: 'Tilt & Height' }] },
    { sku: 'HM-039', name: 'Ring Holder', category: 'Mobile Holders/Mounts', price: 8.99, image_url: '/images/Ring Holder.png', stock: 300, brand: 'Spigen', brandId: spigen._id, categoryId: categories[7]._id, description: 'Metallic ring grip backing that doubles as a media viewing stand.', specifications: [{ name: 'Thickness', value: '3mm' }, { name: 'Material', value: 'Zinc Alloy' }] },

    // Photography (Category 8)
    { sku: 'PV-041', name: 'Smartphone Gimbal', category: 'Photography/Vlogging', price: 68.99, image_url: '/images/Smartphone Gimbal.png', stock: 50, brand: 'Sony', brandId: sony._id, categoryId: categories[8]._id, description: '3-axis stabilizer with track tracking AI features.', specifications: [{ name: 'Stabilization', value: '3-Axis' }, { name: 'Battery life', value: '8 Hours' }] },
    { sku: 'PV-042', name: 'LED Ring Light', category: 'Photography/Vlogging', price: 33.99, image_url: '/images/LED Ring Light.png', stock: 75, brand: 'Anker', brandId: anker._id, categoryId: categories[8]._id, description: '10-inch ring light with 3 modes and a height adjustable tripod stand.', specifications: [{ name: 'Modes', value: 'Warm, Cool, Natural' }, { name: 'Light count', value: '120 LEDs' }] },

    // Gaming (Category 9)
    { sku: 'GA-046', name: 'Gaming Triggers', category: 'Gaming Accessories', price: 15.99, image_url: '/images/Gaming Triggers.png', stock: 150, brand: 'Spigen', brandId: spigen._id, categoryId: categories[9]._id, description: 'Tactile physical L/R shoulder clips for mobile shooters.', specifications: [{ name: 'Action', value: 'Mechanical microswitches' }] },
    { sku: 'GA-047', name: 'Mobile Controller', category: 'Gaming Accessories', price: 41.99, image_url: '/images/Mobile Controller.png', stock: 70, brand: 'Samsung', brandId: samsung._id, categoryId: categories[9]._id, description: 'Bluetooth gaming controller layout with retractable device arm.', specifications: [{ name: 'Protocol', value: 'Bluetooth 5.0' }, { name: 'Vibration', value: 'Dual Motors' }] }
  ];

  // We have listed 32 products. Let's fill it up to 60+ products with variant skus to make it a massive catalog!
  // Generate variance for remaining products
  for (let i = rawProducts.length + 1; i <= 65; i++) {
    const parent = rawProducts[i % rawProducts.length];
    rawProducts.push({
      sku: `${parent.sku}-VAR${i}`,
      name: `${parent.name} Pro Edition`,
      category: parent.category,
      price: +(parent.price * 1.25).toFixed(2),
      image_url: parent.image_url,
      stock: 45 + (i % 30),
      brand: parent.brand,
      brandId: parent.brandId,
      categoryId: parent.categoryId,
      description: `Premium enhanced Pro edition of ${parent.name}. Engineered with extra durable materials and boosted parameters.`,
      specifications: [
        ...parent.specifications,
        { name: 'Edition', value: 'Pro Limited' }
      ]
    });
  }

  const products = await Product.insertMany(rawProducts);
  console.log(`✓ Seeded ${products.length} products.`);

  // 7. Seed Reviews
  console.log('Seeding Product Reviews...');
  const customerUsers = users.filter(u => u.role === 'customer');
  const reviewsData = [];
  const reviewComments = [
    'Amazing build quality, highly recommend!',
    'Decent product for the price. Works fine.',
    'Totally satisfied with this. Premium look and feel.',
    'Product is okay, but delivery was a bit slow.',
    'The description was spot on. Highly functional!',
    'Five stars! Exceeded my expectations by far.',
    'It does the job, but feels a bit plastic-y.',
    'Simply brilliant accessory! A must buy.'
  ];

  for (let i = 0; i < products.length; i += 2) {
    const product = products[i];
    // Each product gets 1-3 reviews
    const reviewCount = 1 + (i % 3);
    let totalRating = 0;
    for (let r = 0; r < reviewCount; r++) {
      const reviewer = customerUsers[(i + r) % customerUsers.length];
      const rating = 3 + ((i + r) % 3); // ratings between 3 and 5
      totalRating += rating;
      reviewsData.push({
        productId: product._id,
        userId: reviewer._id,
        userName: reviewer.name,
        rating: rating,
        comment: reviewComments[(i + r) % reviewComments.length],
        helpfulCount: (i * r) % 15
      });
    }
    // Update product rating stats
    const avgRating = +(totalRating / reviewCount).toFixed(1);
    await Product.updateOne({ _id: product._id }, {
      $set: {
        'ratings.average': avgRating,
        'ratings.count': reviewCount
      }
    });
  }
  const reviews = await Review.insertMany(reviewsData);
  console.log(`✓ Seeded ${reviews.length} product reviews.`);

  // 8. Seed Carts
  console.log('Seeding active Shopping Carts...');
  const cartsData = [];
  for (let i = 0; i < 5; i++) {
    const customer = customerUsers[i];
    const items = [
      { productId: products[i]._id, quantity: 1 + (i % 2) },
      { productId: products[i + 5]._id, quantity: 1 }
    ];
    cartsData.push({ userId: customer._id, items });
  }
  const carts = await Cart.insertMany(cartsData);
  console.log(`✓ Seeded ${carts.length} active carts.`);

  // 9. Seed Wishlists
  console.log('Seeding customer Wishlists...');
  const wishlistsData = [];
  for (let i = 0; i < 8; i++) {
    const customer = customerUsers[i];
    const wishProducts = [products[i + 2]._id, products[i + 8]._id];
    wishlistsData.push({ userId: customer._id, products: wishProducts });
  }
  const wishlists = await Wishlist.insertMany(wishlistsData);
  console.log(`✓ Seeded ${wishlists.length} wishlists.`);

  // 10. Seed Shipping Methods
  console.log('Seeding Shipping Methods...');
  const shippingMethodsData = [
    { name: 'Standard Shipping', cost: 4.99, estimatedDays: '3-5 Business Days' },
    { name: 'Express Delivery', cost: 12.99, estimatedDays: '1-2 Business Days' },
    { name: 'Same-Day Courier', cost: 24.99, estimatedDays: 'Today (Within 6 Hours)' }
  ];
  const shippingMethods = await ShippingMethod.insertMany(shippingMethodsData);
  console.log(`✓ Seeded ${shippingMethods.length} shipping methods.`);

  // 11. Seed Coupons
  console.log('Seeding Promotional Coupons...');
  const couponsData = [
    { code: 'WELCOME10', discountType: 'percentage', discountValue: 10, minPurchase: 30, startDate: new Date('2026-01-01'), endDate: new Date('2026-12-31'), isActive: true, maxUses: 500, usedCount: 120 },
    { code: 'TECHGEAR20', discountType: 'fixed', discountValue: 20, minPurchase: 80, startDate: new Date('2026-01-01'), endDate: new Date('2026-12-31'), isActive: true, maxUses: 200, usedCount: 45 },
    { code: 'FREESHIP', discountType: 'percentage', discountValue: 100, minPurchase: 50, startDate: new Date('2026-05-01'), endDate: new Date('2026-08-31'), isActive: true, maxUses: 1000, usedCount: 654 },
    { code: 'BLACKFRIDAY', discountType: 'percentage', discountValue: 40, minPurchase: 0, startDate: new Date('2026-11-20'), endDate: new Date('2026-11-30'), isActive: true, maxUses: 1000, usedCount: 0 }
  ];
  const coupons = await Coupon.insertMany(couponsData);
  console.log(`✓ Seeded ${coupons.length} coupons.`);

  // 12. Seed Suppliers
  console.log('Seeding Suppliers / B2B Vendors...');
  const suppliersData = [
    { name: 'Shenzhen Tech Imports Ltd', contactPerson: 'Chen Wei', email: 'chen.wei@shenzhenimports.com', phone: '+867551234', address: { street: '45 Lotus Tower Rd', city: 'Shenzhen', state: 'Guangdong', zip: '518000', country: 'China' }, taxId: 'TAX-SZ-88992', supplyCategory: 'Silicone & Protective Casings' },
    { name: 'Belkin Americas Distribution', contactPerson: 'Robert Miller', email: 'b2b@belkin.com', phone: '+18009998822', address: { street: '12045 Waterfront Dr', city: 'Los Angeles', state: 'CA', zip: '90094', country: 'USA' }, taxId: 'TAX-US-5511', supplyCategory: 'Cables & Charging Docks' },
    { name: 'Anker Wholesale Europe', contactPerson: 'Hans Gruber', email: 'hans.g@anker.de', phone: '+4989123456', address: { street: '12 Lindenstrasse', city: 'Munich', state: 'Bavaria', zip: '80331', country: 'Germany' }, taxId: 'TAX-DE-23847', supplyCategory: 'Power Banks & GaN Plugs' },
    { name: 'Sony APAC Logistics', contactPerson: 'Kenji Sato', email: 'b2b.support@sony.com.sg', phone: '+6565432100', address: { street: '2 Science Park Rd', city: 'Singapore', state: 'Singapore', zip: '117611', country: 'Singapore' }, taxId: 'TAX-SG-9922A', supplyCategory: 'Wireless & Studio Audio Devices' }
  ];
  const suppliers = await Supplier.insertMany(suppliersData);
  console.log(`✓ Seeded ${suppliers.length} suppliers.`);

  // 13. Seed Purchase Orders & InventoryTransactions
  console.log('Seeding Purchase Orders & initial inventory transactions...');
  const purchaseOrdersData = [];
  const initialTransactions = [];

  for (let i = 0; i < suppliers.length; i++) {
    const supplier = suppliers[i];
    // Supplier products
    const supplierProducts = products.filter(p => p.brandId.toString() === brands[i % brands.length]._id.toString());
    if (supplierProducts.length === 0) continue;

    const items = supplierProducts.slice(0, 3).map(p => ({
      productId: p._id,
      quantity: 100,
      unitCost: +(p.price * 0.4).toFixed(2) // 60% profit margin mock cost
    }));

    const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unitCost), 0);
    const tax = +(subtotal * 0.08).toFixed(2);
    const total = +(subtotal + tax).toFixed(2);

    const po = {
      supplierId: supplier._id,
      items: items,
      subtotal: subtotal,
      tax: tax,
      total: total,
      status: 'received',
      orderedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      receivedAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000) // 25 days ago
    };
    purchaseOrdersData.push(po);
  }
  const purchaseOrders = await PurchaseOrder.insertMany(purchaseOrdersData);
  console.log(`✓ Seeded ${purchaseOrders.length} B2B Purchase Orders.`);

  // Seeding Stock Transactions (restock in and sales out)
  console.log('Generating Inventory Transactions logs...');
  for (const product of products) {
    // Initial PO delivery
    initialTransactions.push({
      productId: product._id,
      type: 'in',
      quantity: product.stock + 100, // Stock before sales
      reason: 'B2B Restock Inward Delivery',
      notes: 'Initial seed warehouse inward restock'
    });
  }
  await InventoryTransaction.insertMany(initialTransactions);

  // 14. Seed Orders & Payments (100+ orders spanning last 6 months)
  console.log('Generating 100+ Orders & Payments records (Historical Simulation)...');
  const ordersData = [];
  const paymentsData = [];
  const paymentMethods = ['card', 'paypal', 'cod', 'bank_transfer'];

  // Start date: 180 days ago
  const nowMs = Date.now();
  const oneDayMs = 24 * 60 * 60 * 1000;

  for (let i = 0; i < 110; i++) {
    const customer = customerUsers[i % customerUsers.length];
    const orderDate = new Date(nowMs - (110 - i) * 1.5 * oneDayMs); // spread orders historically
    
    // Choose 1-3 random products
    const orderItemsCount = 1 + (i % 3);
    const orderItems = [];
    let subtotal = 0;

    for (let o = 0; o < orderItemsCount; o++) {
      const product = products[(i * 3 + o) % products.length];
      const quantity = 1 + (o % 2);
      orderItems.push({
        productId: product._id,
        sku: product.sku,
        name: product.name,
        quantity: quantity,
        price: product.price
      });
      subtotal += product.price * quantity;
      
      // Log inventory deduction
      initialTransactions.push({
        productId: product._id,
        type: 'out',
        quantity: quantity,
        reason: 'E-commerce Purchase Outward',
        notes: `Order for user: ${customer.email}`,
        createdAt: orderDate
      });
    }

    // Shipping and discounts
    const shipMethod = shippingMethods[i % shippingMethods.length];
    const shippingCharge = shipMethod.cost;
    const discountAmount = i % 5 === 0 ? 10.00 : 0.00; // Give $10 discount every 5th order
    const taxAmount = +(subtotal * 0.08).toFixed(2);
    const total = +(subtotal + shippingCharge - discountAmount + taxAmount).toFixed(2);

    const statuses = ['delivered', 'delivered', 'delivered', 'shipped', 'processing', 'confirmed'];
    const status = i < 95 ? 'delivered' : statuses[i % statuses.length];

    const orderId = new mongoose.Types.ObjectId();
    const paymentId = new mongoose.Types.ObjectId();
    const transactionId = `TXN-${orderDate.getFullYear()}${String(orderDate.getMonth() + 1).padStart(2, '0')}${String(orderDate.getDate()).padStart(2, '0')}-${10000 + i}`;

    const newOrder = {
      _id: orderId,
      userId: customer._id,
      user_email: customer.email,
      items: orderItems,
      subtotal: +subtotal.toFixed(2),
      shippingCharge: shippingCharge,
      discountAmount: discountAmount,
      taxAmount: taxAmount,
      total: total,
      status: status,
      shippingAddress: customer.shippingAddress,
      billingAddress: customer.billingAddress,
      paymentId: paymentId,
      created_at: orderDate,
      createdAt: orderDate
    };

    const newPayment = {
      _id: paymentId,
      orderId: orderId,
      transactionId: transactionId,
      method: paymentMethods[i % paymentMethods.length],
      amount: total,
      status: status === 'cancelled' ? 'failed' : 'completed',
      createdAt: orderDate
    };

    ordersData.push(newOrder);
    paymentsData.push(newPayment);
  }

  const seededOrders = await Order.insertMany(ordersData);
  const seededPayments = await Payment.insertMany(paymentsData);
  console.log(`✓ Seeded ${seededOrders.length} orders and ${seededPayments.length} transactions.`);

  // 15. Seed Support Tickets
  console.log('Seeding Support Tickets CRM logs...');
  const supportEmp = users.find(u => u.email === 'michael.s@gmail.com');
  const supportTicketsData = [
    { userId: customerUsers[0]._id, subject: 'Defective Charger Received', message: 'The Wall Charger PD keeps disconnecting every few seconds. I need a replacement.', status: 'open', priority: 'high', category: 'order', assignedTo: supportEmp._id },
    { userId: customerUsers[2]._id, subject: 'Payment Charged Twice', message: 'I was billed twice on my Visa Card for order #99. Please refund.', status: 'in_progress', priority: 'high', category: 'payment', assignedTo: supportEmp._id },
    { userId: customerUsers[4]._id, subject: 'Compatability Inquiry', message: 'Does the MagSafe Powerbank work with my Spigen Rugged Armor case?', status: 'resolved', priority: 'medium', category: 'technical', assignedTo: supportEmp._id },
    { userId: customerUsers[6]._id, subject: 'Slow Shipping Service', message: 'My standard shipment has not arrived yet. It has been 7 days.', status: 'closed', priority: 'low', category: 'order', assignedTo: supportEmp._id },
    { userId: customerUsers[8]._id, subject: 'Website glitch on checkout', message: 'Coupon welcome10 was showing invalid error.', status: 'open', priority: 'medium', category: 'technical' }
  ];
  const supportTickets = await SupportTicket.insertMany(supportTicketsData);
  console.log(`✓ Seeded ${supportTickets.length} support tickets.`);

  // 16. Seed Audit Logs
  console.log('Seeding Audit Logs security logs...');
  const auditLogsData = [
    { userId: users[0]._id, userEmail: users[0].email, action: 'ADMIN_LOGIN', entityName: 'User', details: 'Administrator logged into back-office portal successfully', ipAddress: '192.168.1.5' },
    { userId: users[0]._id, userEmail: users[0].email, action: 'RESTOCKED_INVENTORY', entityName: 'Product', details: 'Added 50 units stock to Anker Wall Charger (PD)', ipAddress: '192.168.1.5' },
    { userId: users[1]._id, userEmail: users[1].email, action: 'EMPLOYEE_LOGIN', entityName: 'User', details: 'Senior engineer accessed HR panel', ipAddress: '192.168.1.12' },
    { userId: customerUsers[0]._id, userEmail: customerUsers[0].email, action: 'USER_REGISTER', entityName: 'User', details: 'Created customer account', ipAddress: '107.22.41.90' }
  ];
  const auditLogs = await AuditLog.insertMany(auditLogsData);
  console.log(`✓ Seeded ${auditLogs.length} audit logs.`);

  // 17. Seed Newsletter Subscriptions
  console.log('Seeding Newsletter Subscriptions...');
  const newslettersData = [
    { email: 'subscriber1@gmail.com', isActive: true },
    { email: 'subscriber2@gmail.com', isActive: true },
    { email: 'banneduser@gmail.com', isActive: false },
    { email: 'buyer.lead@gmail.com', isActive: true }
  ];
  const newsletters = await NewsletterSubscription.insertMany(newslettersData);
  console.log(`✓ Seeded ${newsletters.length} subscriptions.`);

  // 18. Seed Expenses Ledger
  console.log('Seeding corporate Expenses Ledger...');
  const hrEmp = users.find(u => u.email === 'emma.w@gmail.com');
  const expensesData = [
    { category: 'rent', description: 'TechGear HQ office rent (June 2026)', amount: 4500, date: new Date('2026-06-01'), status: 'paid', approvedBy: users[0]._id },
    { category: 'server', description: 'AWS EC2 + MongoDB Atlas infrastructure hosting costs', amount: 840, date: new Date('2026-06-02'), status: 'paid', approvedBy: users[0]._id },
    { category: 'utility', description: 'HQ Office Power and Fiber Internet Connection', amount: 350, date: new Date('2026-06-05'), status: 'approved', approvedBy: users[0]._id },
    { category: 'salary', description: 'Staff payroll disbursement (May 2026)', amount: 32500, date: new Date('2026-05-31'), status: 'paid', approvedBy: users[0]._id },
    { category: 'marketing', description: 'Google Shopping Ads campaign for Summer Sale', amount: 1200, date: new Date('2026-06-10'), status: 'pending' }
  ];
  const expenses = await Expense.insertMany(expensesData);
  console.log(`✓ Seeded ${expenses.length} corporate expenses.`);

  // 19. Seed SalesAnalytics (Daily aggregates calculation for 30 days)
  console.log('Generating pre-aggregated SalesAnalytics daily stats (Last 30 Days)...');
  const salesAnalyticsData = [];
  for (let day = 0; day < 30; day++) {
    const targetDate = new Date(nowMs - day * oneDayMs);
    // Find all orders placed on this date
    const dailyOrders = seededOrders.filter(order => {
      const orderDate = new Date(order.created_at);
      return orderDate.getFullYear() === targetDate.getFullYear() &&
             orderDate.getMonth() === targetDate.getMonth() &&
             orderDate.getDate() === targetDate.getDate() &&
             order.status !== 'cancelled';
    });

    const totalSales = dailyOrders.reduce((sum, o) => sum + o.total, 0);
    const totalOrders = dailyOrders.length;
    const totalUnitsSold = dailyOrders.reduce((sum, o) => sum + o.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0);
    const averageOrderValue = totalOrders > 0 ? +(totalSales / totalOrders).toFixed(2) : 0;

    // Reset date to midnight for consistency
    const midnightDate = new Date(targetDate);
    midnightDate.setHours(0, 0, 0, 0);

    salesAnalyticsData.push({
      date: midnightDate,
      totalSales: +totalSales.toFixed(2),
      totalOrders: totalOrders,
      totalUnitsSold: totalUnitsSold,
      averageOrderValue: averageOrderValue
    });
  }
  const salesAnalytics = await SalesAnalytic.insertMany(salesAnalyticsData);
  console.log(`✓ Seeded ${salesAnalytics.length} days of sales aggregates.`);

  // 20. Seed Product Recommendations
  console.log('Seeding Product Recommendation linkages...');
  const recsData = [];
  
  // Recommend Tempered glass (products[6]) for Silicone Case (products[0])
  recsData.push({
    baseProductId: products[0]._id,
    recommendedProductId: products[6]._id,
    score: 0.95,
    type: 'cross-sell'
  });

  // Recommend Anker USB-C Cable (products[15]) for Fast Wall Charger (products[11])
  recsData.push({
    baseProductId: products[11]._id,
    recommendedProductId: products[15]._id,
    score: 0.98,
    type: 'cross-sell'
  });

  // Recommend Over-ear Headphones (products[26]) as an up-sell for Earbuds (products[25])
  recsData.push({
    baseProductId: products[25]._id,
    recommendedProductId: products[26]._id,
    score: 0.85,
    type: 'up-sell'
  });

  const recs = await ProductRecommendation.insertMany(recsData);
  console.log(`✓ Seeded ${recs.length} cross-sell/up-sell recommendations.`);

  console.log('\n======================================');
  console.log('🔥 ALL 22 COLLECTIONS SUCCESSFULLY SEEDED!');
  console.log('======================================\n');

  await mongoose.connection.close();
  console.log('Database connection closed safely.');
}

seedDatabase().catch(err => {
  console.error('✗ CRITICAL SEED ERROR:', err);
  process.exit(1);
});
