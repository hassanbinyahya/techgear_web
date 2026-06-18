const fs = require('fs');
const path = require('path');

const imagePath = path.join(__dirname, 'techgear-hub', 'src', 'assets', 'images');
console.log('Checking images at:', imagePath);
console.log('Images in directory:', fs.existsSync(imagePath) ? 'EXISTS' : 'DOES NOT EXIST');

if (fs.existsSync(imagePath)) {
  const files = fs.readdirSync(imagePath);
  console.log('Found files:', files);
}
