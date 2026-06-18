require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const Product = require('./models/Product');
const User = require('./models/User');
const Order = require('./models/Order');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/techgearhub';

app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('✓ Connected to MongoDB');
    insertSampleData();
  })
  .catch(err => {
    console.error('✗ MongoDB connection error:', err.message);
    process.exit(1);
  });

// Serve images with proper MIME type handling
const imgPath = path.join(__dirname, '../techgear-hub/src/assets/images');
console.log('Serving images from:', imgPath);
console.log('Images directory exists:', fs.existsSync(imgPath));

// Direct image handler BEFORE static middleware
app.get('/images/:filename', (req, res) => {
  const filename = req.params.filename;
  const decodedFilename = decodeURIComponent(filename);
  const filePath = path.join(imgPath, decodedFilename);
  
  // Security check
  if (!filePath.startsWith(imgPath)) {
    return res.status(403).json({ error: 'Access denied' });
  }
  
  // Check existence
  if (!fs.existsSync(filePath)) {
    console.warn('Image not found:', filePath);
    return res.status(404).json({ error: 'Image not found: ' + decodedFilename });
  }
  
  res.setHeader('Content-Type', 'image/png');
  res.setHeader('Cache-Control', 'public, max-age=3600');
  console.log('Serving image:', decodedFilename);
  fs.createReadStream(filePath).pipe(res);
});

// Fallback static middleware for direct access
app.use('/images', express.static(imgPath, {
  setHeaders: (res, filepath) => {
    res.setHeader('Cache-Control', 'public, max-age=3600');
  }
}));

app.get('/', (req, res) => {
  // Serve frontend if requested from browser, else return API message
  if (req.accepts('html')) {
    const buildPath = path.join(__dirname, '../techgear-hub/build');
    if (fs.existsSync(buildPath)) {
      return res.sendFile(path.join(buildPath, 'index.html'));
    }
  }
  res.json({ message: 'TechGear Hub API is running. Use /products to fetch the catalog.' });
});

const sampleProducts = [
      { sku: 'CA-001', name: 'Silicone Case', category: 'Cases & Covers', price: 12.99, image_url: '/images/Silicone Case.png', stock: 50 },
      { sku: 'CA-002', name: 'Rugged Armor', category: 'Cases & Covers', price: 18.99, image_url: '/images/Rugged Armor.png', stock: 50 },
      { sku: 'CA-003', name: 'Wallet Case', category: 'Cases & Covers', price: 24.99, image_url: '/images/Wallet Case.png', stock: 50 },
      { sku: 'CA-004', name: 'Transparent TPU', category: 'Cases & Covers', price: 10.99, image_url: '/images/Transparent TPU.png', stock: 50 },
      { sku: 'CA-005', name: 'Leather Flip Case', category: 'Cases & Covers', price: 28.99, image_url: '/images/Leather Flip Case.png', stock: 50 },
      { sku: 'SP-006', name: 'Tempered Glass', category: 'Screen Protection', price: 8.99, image_url: '/images/Tempered Glass.png', stock: 50 },
      { sku: 'SP-007', name: 'Privacy Film', category: 'Screen Protection', price: 10.99, image_url: '/images/Privacy Film.png', stock: 50 },
      { sku: 'SP-008', name: 'Matte Protector', category: 'Screen Protection', price: 9.99, image_url: '/images/Matte Protector.png', stock: 50 },
      { sku: 'SP-009', name: 'Hydrogel Film', category: 'Screen Protection', price: 11.99, image_url: '/images/Hydrogel Film.png', stock: 50 },
      { sku: 'SP-010', name: 'Camera Lens Protector', category: 'Screen Protection', price: 7.99, image_url: '/images/Camera Lens Protector.png', stock: 50 },
      { sku: 'CH-011', name: 'Wall Charger (PD)', category: 'Chargers & Adapters', price: 29.99, image_url: '/images/Wall Charger (PD).png', stock: 50 },
      { sku: 'CH-012', name: 'Fast Charging Brick', category: 'Chargers & Adapters', price: 34.99, image_url: '/images/Fast Charging Brick.png', stock: 50 },
      { sku: 'CH-013', name: 'Car Charger', category: 'Chargers & Adapters', price: 19.99, image_url: '/images/Car Charger.png', stock: 50 },
      { sku: 'CH-014', name: 'Multi-port Hub', category: 'Chargers & Adapters', price: 39.99, image_url: '/images/Multi-port Hub.png', stock: 50 },
      { sku: 'CH-015', name: 'Wireless Charger', category: 'Chargers & Adapters', price: 27.99, image_url: '/images/Wireless Charger.png', stock: 50 },
      { sku: 'CC-016', name: 'USB-C Cable', category: 'Charging Cables', price: 7.99, image_url: '/images/USB-C Cable.png', stock: 50 },
      { sku: 'CC-017', name: 'Lightning Cable', category: 'Charging Cables', price: 8.99, image_url: '/images/Lightning Cable.png', stock: 50 },
      { sku: 'CC-018', name: 'Micro-USB Cable', category: 'Charging Cables', price: 6.99, image_url: '/images/Micro-USB Cable.png', stock: 50 },
      { sku: 'CC-019', name: '3-in-1 Cable', category: 'Charging Cables', price: 13.99, image_url: '/images/3-in-1 Cable.png', stock: 50 },
      { sku: 'CC-020', name: 'Braided Charging Cable', category: 'Charging Cables', price: 10.99, image_url: '/images/Braided Charging Cable.png', stock: 50 },
      { sku: 'PB-021', name: 'Slim 5000mAh', category: 'Power Banks', price: 18.99, image_url: '/images/Slim 5000mAh.png', stock: 50 },
      { sku: 'PB-022', name: 'Fast Charge 10000mAh', category: 'Power Banks', price: 26.99, image_url: '/images/Fast Charge 10000mAh.png', stock: 50 },
      { sku: 'PB-023', name: 'High Capacity 20000mAh', category: 'Power Banks', price: 38.99, image_url: '/images/High Capacity 20000mAh.png', stock: 50 },
      { sku: 'PB-024', name: 'MagSafe Power Bank', category: 'Power Banks', price: 43.99, image_url: '/images/MagSafe Power Bank.png', stock: 50 },
      { sku: 'PB-025', name: 'Solar Power Bank', category: 'Power Banks', price: 49.99, image_url: '/images/Solar Power Bank.png', stock: 50 },
      { sku: 'WA-026', name: 'TWS Earbuds', category: 'Wireless Audio', price: 54.99, image_url: '/images/TWS Earbuds.png', stock: 50 },
      { sku: 'WA-027', name: 'Over-ear Bluetooth Headphones', category: 'Wireless Audio', price: 64.99, image_url: '/images/Over-ear Bluetooth Headphones.png', stock: 50 },
      { sku: 'WA-028', name: 'Sports Neckband', category: 'Wireless Audio', price: 31.99, image_url: '/images/Sports Neckband.png', stock: 50 },
      { sku: 'WA-029', name: 'ANC Earbuds', category: 'Wireless Audio', price: 71.99, image_url: '/images/ANC Earbuds.png', stock: 50 },
      { sku: 'WA-030', name: 'Mono Bluetooth Headset', category: 'Wireless Audio', price: 23.99, image_url: '/images/Mono Bluetooth Headset.png', stock: 50 },
      { sku: 'WD-031', name: 'Type-C Wired Earphones', category: 'Wired Audio', price: 14.99, image_url: '/images/Type-C Wired Earphones.png', stock: 50 },
      { sku: 'WD-032', name: '3.5mm Earphones', category: 'Wired Audio', price: 11.99, image_url: '/images/3.5mm Earphones.png', stock: 50 },
      { sku: 'WD-033', name: 'Gaming Headset', category: 'Wired Audio', price: 37.99, image_url: '/images/Gaming Headset.png', stock: 50 },
      { sku: 'WD-034', name: 'AUX Cable', category: 'Wired Audio', price: 5.99, image_url: '/images/AUX Cable.png', stock: 50 },
      { sku: 'WD-035', name: 'Audio Splitter', category: 'Wired Audio', price: 6.99, image_url: '/images/Audio Splitter.png', stock: 50 },
      { sku: 'HM-036', name: 'Dashboard Car Mount', category: 'Mobile Holders/Mounts', price: 13.99, image_url: '/images/Dashboard Car Mount.png', stock: 50 },
      { sku: 'HM-037', name: 'Bike Phone Holder', category: 'Mobile Holders/Mounts', price: 17.99, image_url: '/images/Bike Phone Holder.png', stock: 50 },
      { sku: 'HM-038', name: 'Desktop Stand', category: 'Mobile Holders/Mounts', price: 15.99, image_url: '/images/Desktop Stand.png', stock: 50 },
      { sku: 'HM-039', name: 'Ring Holder', category: 'Mobile Holders/Mounts', price: 8.99, image_url: '/images/Ring Holder.png', stock: 50 },
      { sku: 'HM-040', name: 'Tripod Mount', category: 'Mobile Holders/Mounts', price: 20.99, image_url: '/images/Tripod Mount.png', stock: 50 },
      { sku: 'PV-041', name: 'Smartphone Gimbal', category: 'Photography/Vlogging', price: 68.99, image_url: '/images/Smartphone Gimbal.png', stock: 50 },
      { sku: 'PV-042', name: 'LED Ring Light', category: 'Photography/Vlogging', price: 33.99, image_url: '/images/LED Ring Light.png', stock: 50 },
      { sku: 'PV-043', name: 'Clip-on Macro Lens', category: 'Photography/Vlogging', price: 16.99, image_url: '/images/Clip-on Macro Lens.png', stock: 50 },
      { sku: 'PV-044', name: 'Bluetooth Remote Shutter', category: 'Photography/Vlogging', price: 11.99, image_url: '/images/Bluetooth Remote Shutter.png', stock: 50 },
      { sku: 'PV-045', name: 'Selfie Stick', category: 'Photography/Vlogging', price: 13.99, image_url: '/images/Selfie Stick.png', stock: 50 },
      { sku: 'GA-046', name: 'Gaming Triggers', category: 'Gaming Accessories', price: 15.99, image_url: '/images/Gaming Triggers.png', stock: 50 },
      { sku: 'GA-047', name: 'Mobile Controller', category: 'Gaming Accessories', price: 41.99, image_url: '/images/Mobile Controller.png', stock: 50 },
      { sku: 'GA-048', name: 'Phone Cooler Fan', category: 'Gaming Accessories', price: 27.99, image_url: '/images/Phone Cooler Fan.png', stock: 50 },
      { sku: 'GA-049', name: 'Finger Sleeves', category: 'Gaming Accessories', price: 7.99, image_url: '/images/Finger Sleeves.png', stock: 50 },
      { sku: 'GA-050', name: 'Joystick Attachments', category: 'Gaming Accessories', price: 10.99, image_url: '/images/Joystick Attachments.png', stock: 50 },
      { sku: 'WT-051', name: 'Smartwatch Straps', category: 'Wearable Tech', price: 17.99, image_url: '/images/Smartwatch Straps.png', stock: 50 },
      { sku: 'WT-052', name: 'Protective Watch Case', category: 'Wearable Tech', price: 11.99, image_url: '/images/Protective Watch Case.png', stock: 50 },
      { sku: 'WT-053', name: 'Screen Protector for Watch', category: 'Wearable Tech', price: 7.99, image_url: '/images/Screen Protector for Watch.png', stock: 50 },
      { sku: 'WT-054', name: 'Wireless Charging Dock for Watch', category: 'Wearable Tech', price: 35.99, image_url: '/images/Wireless Charging Dock for Watch.png', stock: 50 },
      { sku: 'ST-055', name: 'MicroSD Card', category: 'Storage Solutions', price: 14.99, image_url: '/images/MicroSD Card.png', stock: 50 },
      { sku: 'ST-056', name: 'OTG USB Flash Drive', category: 'Storage Solutions', price: 16.99, image_url: '/images/OTG USB Flash Drive.png', stock: 50 },
      { sku: 'ST-057', name: 'Card Reader', category: 'Storage Solutions', price: 12.99, image_url: '/images/Card Reader.png', stock: 50 },
      { sku: 'ST-058', name: 'Phone Memory Expander', category: 'Storage Solutions', price: 21.99, image_url: '/images/Phone Memory Expander.png', stock: 50 },
      { sku: 'PS-059', name: 'Vinyl Skins', category: 'Personalization', price: 10.99, image_url: '/images/Vinyl Skins.png', stock: 50 },
      { sku: 'PS-060', name: 'PopSockets', category: 'Personalization', price: 8.99, image_url: '/images/PopSockets.png', stock: 50 },
      { sku: 'PS-061', name: 'Lanyard Straps', category: 'Personalization', price: 6.99, image_url: '/images/Lanyard Straps.png', stock: 50 },
      { sku: 'PS-062', name: 'Charms', category: 'Personalization', price: 5.99, image_url: '/images/Charms.png', stock: 50 },
      { sku: 'PS-063', name: 'Personalized Decals', category: 'Personalization', price: 9.99, image_url: '/images/Personalized Decals.png', stock: 50 },
      { sku: 'CL-064', name: 'Microfiber Cloth', category: 'Cleaning & Maintenance', price: 5.99, image_url: '/images/Microfiber Cloth.png', stock: 50 },
      { sku: 'CL-065', name: 'Screen Cleaning Solution', category: 'Cleaning & Maintenance', price: 11.99, image_url: '/images/Screen Cleaning Solution.png', stock: 50 },
      { sku: 'CL-066', name: 'Port Cleaning Brush', category: 'Cleaning & Maintenance', price: 7.99, image_url: '/images/Port Cleaning Brush.png', stock: 50 },
      { sku: 'CL-067', name: 'UV Sanitizer Box', category: 'Cleaning & Maintenance', price: 44.99, image_url: '/images/UV Sanitizer Box.png', stock: 50 },
      { sku: 'CL-068', name: 'Air Blower', category: 'Cleaning & Maintenance', price: 8.99, image_url: '/images/Air Blower.png', stock: 50 },
      { sku: 'BS-069', name: 'Portable Mini Speaker', category: 'Bluetooth Speakers', price: 24.99, image_url: '/images/Portable Mini Speaker.png', stock: 50 },
      { sku: 'BS-070', name: 'Rugged Waterproof Speaker', category: 'Bluetooth Speakers', price: 47.99, image_url: '/images/Rugged Waterproof Speaker.png', stock: 50 },
      { sku: 'BS-071', name: 'RGB Light Speaker', category: 'Bluetooth Speakers', price: 33.99, image_url: '/images/RGB Light Speaker.png', stock: 50 },
      { sku: 'BS-072', name: 'Desk Speaker', category: 'Bluetooth Speakers', price: 21.99, image_url: '/images/Desk Speaker.png', stock: 50 },
      { sku: 'SM-073', name: 'Smart Plug', category: 'Smart Home (App Controlled)', price: 18.99, image_url: '/images/Smart Plug.png', stock: 50 },
      { sku: 'SM-074', name: 'Smart Bulb', category: 'Smart Home (App Controlled)', price: 15.99, image_url: '/images/Smart Bulb.png', stock: 50 },
      { sku: 'SM-075', name: 'Smart IR Remote', category: 'Smart Home (App Controlled)', price: 23.99, image_url: '/images/Smart IR Remote.png', stock: 50 },
      { sku: 'SM-076', name: 'Door Sensor', category: 'Smart Home (App Controlled)', price: 17.99, image_url: '/images/Door Sensor.png', stock: 50 },
      { sku: 'SM-077', name: 'Motion Sensor', category: 'Smart Home (App Controlled)', price: 20.99, image_url: '/images/Motion Sensor.png', stock: 50 },
      { sku: 'RP-078', name: 'Replacement Battery', category: 'Replacement Parts', price: 21.99, image_url: '/images/Replacement Battery.png', stock: 50 },
      { sku: 'RP-079', name: 'Replacement Back Housing', category: 'Replacement Parts', price: 25.99, image_url: '/images/Replacement Back Housing.png', stock: 50 },
      { sku: 'RP-080', name: 'Side Button Set', category: 'Replacement Parts', price: 14.99, image_url: '/images/Side Button Set.png', stock: 50 },
      { sku: 'RP-081', name: 'SIM Tray', category: 'Replacement Parts', price: 7.99, image_url: '/images/SIM Tray.png', stock: 50 },
      { sku: 'RP-082', name: 'Speaker Module', category: 'Replacement Parts', price: 19.99, image_url: '/images/Speaker Module.png', stock: 50 },
      { sku: 'CI-083', name: 'AUX to Bluetooth Adapter', category: 'Car Integration', price: 17.99, image_url: '/images/AUX to Bluetooth Adapter.png', stock: 50 },
      { sku: 'CI-084', name: 'FM Transmitter', category: 'Car Integration', price: 20.99, image_url: '/images/FM Transmitter.png', stock: 50 },
      { sku: 'CI-085', name: 'Magnetic Dash Plate', category: 'Car Integration', price: 13.99, image_url: '/images/Magnetic Dash Plate.png', stock: 50 },
      { sku: 'CI-086', name: 'Headrest Tablet/Phone Mount', category: 'Car Integration', price: 31.99, image_url: '/images/Headrest Tablet-Phone Mount.png', stock: 50 },
      { sku: 'FL-087', name: 'Designer Phone Pouch', category: 'Fashion/Lifestyle', price: 21.99, image_url: '/images/Designer Phone Pouch.png', stock: 50 },
      { sku: 'FL-088', name: 'Wallet/Card Holder (Stick-on)', category: 'Fashion/Lifestyle', price: 11.99, image_url: '/images/Wallet-Card Holder (Stick-on).png', stock: 50 },
      { sku: 'FL-089', name: 'Smartphone Armband', category: 'Fashion/Lifestyle', price: 13.99, image_url: '/images/Smartphone Armband.png', stock: 50 },
      { sku: 'FL-090', name: 'Hand-free Neck Strap', category: 'Fashion/Lifestyle', price: 10.99, image_url: '/images/Hand-free Neck Strap.png', stock: 50 },
      { sku: 'AD-091', name: 'Type-C to 3.5mm Adapter', category: 'Cables & Adapters (Converters)', price: 10.99, image_url: '/images/Type-C to 3.5mm Adapter.png', stock: 50 },
      { sku: 'AD-092', name: 'USB to Ethernet Adapter', category: 'Cables & Adapters (Converters)', price: 19.99, image_url: '/images/USB to Ethernet Adapter.png', stock: 50 },
      { sku: 'AD-093', name: 'OTG Converter', category: 'Cables & Adapters (Converters)', price: 12.99, image_url: '/images/OTG Converter.png', stock: 50 },
      { sku: 'AD-094', name: 'Lightning to Type-C Adapter', category: 'Cables & Adapters (Converters)', price: 11.99, image_url: '/images/Lightning to Type-C Adapter.png', stock: 50 }
    ];

async function insertSampleData() {
  try {
    const results = await Promise.all(sampleProducts.map(product =>
      Product.updateOne({ sku: product.sku }, { $set: product }, { upsert: true })
    ));

    const insertedCount = results.reduce((count, result) => count + (result.upserted ? 1 : 0), 0);
    if (insertedCount > 0) {
      console.log(`✓ Sample products seeded or updated (${insertedCount} new items inserted)`);
    } else {
      console.log('✓ Sample products already exist and are up to date');
    }
  } catch (err) {
    console.error('✗ Error inserting sample data:', err.message);
  }
}

// ===== PRODUCT ROUTES =====
app.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/products', async (req, res) => {
  try {
    const { sku, name, category, price, image_url } = req.body;
    const product = new Product({ sku, name, category, price, image_url });
    const saved = await product.save();
    res.json({ id: saved._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===== USER REGISTRATION & LOGIN =====
app.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }
    
    // Email validation (@gmail.com)
    if (!email.endsWith('@gmail.com')) {
      return res.status(400).json({ success: false, message: 'Only @gmail.com emails are accepted.' });
    }
    
    // Password validation: at least 8 chars, 1 uppercase, 1 lowercase, 1 special char (@,#,$,&), 1 number
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[@#$&])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Password must be at least 8 characters with 1 uppercase, 1 lowercase, 1 special char (@,#,$,&), and 1 number.' 
      });
    }

    // Hash password before saving
    const saltRounds = 10;
    const hashed = await bcrypt.hash(password, saltRounds);

    const user = new User({ name, email, password: hashed });
    const saved = await user.save();
    res.json({ success: true, user: { id: saved._id, name, email } });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ success: false, message: 'Email already registered.' });
    }
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    // Admin fixed credentials
    if (email === 'Admin123@gmail.com' && password === '123$567*9') {
      return res.json({
        user: { _id: 'admin', name: 'Admin', email: 'Admin123@gmail.com', role: 'admin' },
        token: 'admin-auth-token',
      });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    // return user info without password
    const safeUser = { _id: user._id, name: user.name, email: user.email };
    res.json({ user: safeUser, token: 'mock-auth-token' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ===== USER MANAGEMENT =====
app.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('name email created_at');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===== ORDER MANAGEMENT =====
app.post('/orders/confirm', async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { user_email, items, total } = req.body;
    
    if (!items || items.length === 0) {
      await session.abortTransaction();
      return res.status(400).json({ success: false, message: 'No items in order.' });
    }

    // Update product stocks
    for (const item of items) {
      await Product.updateOne(
        { _id: item.id },
        { $inc: { stock: -item.quantity } },
        { session }
      );
    }

    // Create order
    const order = new Order({ 
      user_email, 
      items, 
      total, 
      status: 'confirmed' 
    });
    const savedOrder = await order.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.json({ 
      success: true, 
      order_id: savedOrder._id, 
      message: 'Order confirmed and stock updated.' 
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ success: false, message: err.message });
  }
});

// Debug endpoint to check what images are available
app.get('/debug/images', (req, res) => {
  try {
    if (fs.existsSync(imgPath)) {
      const files = fs.readdirSync(imgPath);
      res.json({ 
        path: imgPath,
        exists: true,
        count: files.length,
        files: files.filter(f => f.endsWith('.png'))
      });
    } else {
      res.json({ path: imgPath, exists: false });
    }
  } catch (error) {
    res.json({ error: error.message });
  }
});

// Serve React build (frontend) if available
const buildPath = path.join(__dirname, '../techgear-hub/build');
console.log('Frontend build path:', buildPath);
if (fs.existsSync(buildPath)) {
  console.log('Frontend build exists:', true);
  app.use(express.static(buildPath));

  // Send index.html for all non-API GET requests that accept HTML
  app.get('*', (req, res, next) => {
    // Allow API and image routes to continue to their handlers
    const apiPrefixes = ['/products', '/register', '/login', '/users', '/orders', '/images', '/debug'];
    if (apiPrefixes.some(p => req.path.startsWith(p))) return next();
    if (!req.accepts || !req.accepts('html')) return next();
    res.sendFile(path.join(buildPath, 'index.html'));
  });
} else {
  console.log('Frontend build exists:', false);
}

// Start server with retry on EADDRINUSE
function startServer(port, retries = 10) {
  const server = app.listen(port, () => {
    console.log(`\n🚀 Server running on http://localhost:${port}`);
    console.log(`📊 Database: MongoDB (${MONGO_URI})`);
    console.log(`\nAvailable routes:`);
    console.log(`  GET  /products`);
    console.log(`  POST /products`);
    console.log(`  POST /register`);
    console.log(`  POST /login`);
    console.log(`  GET  /users`);
    console.log(`  POST /orders/confirm\n`);
  });

  server.on('error', (err) => {
    if (err && err.code === 'EADDRINUSE') {
      console.warn(`Port ${port} is already in use.`);
      if (retries > 0) {
        const nextPort = port + 1;
        console.log(`Trying next port: ${nextPort} (retries left: ${retries - 1})`);
        // Small delay before retrying to avoid tight loop
        setTimeout(() => startServer(nextPort, retries - 1), 200);
      } else {
        console.error('No available ports found. Exiting.');
        process.exit(1);
      }
    } else {
      console.error('Server error:', err);
      process.exit(1);
    }
  });

  return server;
}

startServer(Number(PORT));