// Script untuk compress banner images
// Install terlebih dahulu: npm install -D sharp

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const INPUT_DIR = path.join(__dirname, 'src/assets/images');
const OUTPUT_DIR = path.join(__dirname, 'src/assets/images-optimized');

// Create output directory jika belum ada
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const compressImage = async (filename) => {
  const inputPath = path.join(INPUT_DIR, filename);
  const outputPath = path.join(OUTPUT_DIR, filename);
  
  try {
    const info = await sharp(inputPath)
      .resize(1200, 400, {
        fit: 'cover',
        position: 'center'
      })
      .jpeg({
        quality: 80,
        progressive: true,
        mozjpeg: true
      })
      .toFile(outputPath);
    
    const inputSize = fs.statSync(inputPath).size;
    const outputSize = info.size;
    const savings = ((inputSize - outputSize) / inputSize * 100).toFixed(2);
    
    console.log(`✅ ${filename}:`);
    console.log(`   Before: ${(inputSize / 1024).toFixed(2)} KB`);
    console.log(`   After: ${(outputSize / 1024).toFixed(2)} KB`);
    console.log(`   Saved: ${savings}%\n`);
  } catch (error) {
    console.error(`❌ Error compressing ${filename}:`, error.message);
  }
};

// Compress semua banner images
const banners = ['banner1.jpg', 'banner2.jpg', 'banner3.jpg'];

console.log('🖼️  Compressing banner images...\n');

Promise.all(banners.map(compressImage))
  .then(() => {
    console.log('✨ All images compressed!');
    console.log('\n📝 Next steps:');
    console.log('   1. Check images-optimized/ folder');
    console.log('   2. Replace original images if satisfied');
    console.log('   3. Delete images-optimized/ folder after backup');
  })
  .catch(error => {
    console.error('❌ Compression failed:', error);
  });
