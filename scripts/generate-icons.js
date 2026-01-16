/**
 * Generate PWA icons from existing logo
 * Requires: sharp package (npm install sharp --save-dev)
 * 
 * Run: node scripts/generate-icons.js
 */

const fs = require('fs');
const path = require('path');

// Check if sharp is available
let sharp;
try {
  sharp = require('sharp');
} catch (error) {
  console.error('Error: sharp package not found.');
  console.log('Please install it first: npm install sharp --save-dev');
  process.exit(1);
}

const publicDir = path.join(__dirname, '..', 'public');
const logoPath = path.join(publicDir, 'pearl-logo.png');
const icon192Path = path.join(publicDir, 'icon-192.png');
const icon512Path = path.join(publicDir, 'icon-512.png');

// Check if logo exists
if (!fs.existsSync(logoPath)) {
  console.error(`Error: Logo not found at ${logoPath}`);
  console.log('Please ensure pearl-logo.png exists in the public folder');
  process.exit(1);
}

async function generateIcons() {
  try {
    console.log('Generating PWA icons...');
    
    // Generate 192x192 icon
    await sharp(logoPath)
      .resize(192, 192, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 1 }
      })
      .png()
      .toFile(icon192Path);
    
    console.log('✓ Generated icon-192.png');
    
    // Generate 512x512 icon
    await sharp(logoPath)
      .resize(512, 512, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 1 }
      })
      .png()
      .toFile(icon512Path);
    
    console.log('✓ Generated icon-512.png');
    console.log('\n✅ PWA icons generated successfully!');
    console.log('Icons are ready for PWA installation.');
    
  } catch (error) {
    console.error('Error generating icons:', error);
    process.exit(1);
  }
}

generateIcons();

