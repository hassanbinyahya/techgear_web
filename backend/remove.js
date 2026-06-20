const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/techgearhub').then(async () => {
    const Product = mongoose.model('Product', new mongoose.Schema({}, {strict:false}));
    const res = await Product.deleteMany({
        name: { $in: ['Headrest Tablet/Phone Mount', 'Wallet/Card Holder (Stick-on)', 'Rugged Armor'] }
    });
    console.log('Deleted:', res.deletedCount);
    mongoose.disconnect();
}).catch(console.error);
