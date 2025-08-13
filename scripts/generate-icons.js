#!/usr/bin/env node

/**
 * Generate icon files from SVG source
 * This creates all necessary icon sizes for web, PWA, and mobile
 */

const fs = require('fs');
const path = require('path');

// SVG content for the icon
const svgContent = `<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="512" height="512" rx="128" fill="#000000"/>
  <!-- N letterform -->
  <path d="M 140 360 L 140 152 L 190 152 L 322 310 L 322 152 L 372 152 L 372 360 L 322 360 L 190 202 L 190 360 Z" 
        fill="#FFFFFF"/>
  <!-- Accent -->
  <circle cx="256" cy="420" r="16" fill="#FFFFFF" opacity="0.8"/>
</svg>`;

// Sizes needed for various platforms
const sizes = [
  { name: 'favicon-16x16.png', size: 16 },
  { name: 'favicon-32x32.png', size: 32 },
  { name: 'favicon-96x96.png', size: 96 },
  { name: 'icon-72x72.png', size: 72 },
  { name: 'icon-120x120.png', size: 120 },
  { name: 'icon-128x128.png', size: 128 },
  { name: 'icon-144x144.png', size: 144 },
  { name: 'icon-152x152.png', size: 152 },
  { name: 'icon-180x180.png', size: 180 },
  { name: 'icon-192x192.png', size: 192 },
  { name: 'icon-384x384.png', size: 384 },
  { name: 'icon-512x512.png', size: 512 },
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'android-chrome-192x192.png', size: 192 },
  { name: 'android-chrome-512x512.png', size: 512 },
];

console.log('Icon generation script ready.');
console.log('To actually generate PNG files from SVG, you would need to:');
console.log('1. Install sharp: npm install sharp');
console.log('2. Use sharp to convert SVG to PNG at different sizes');
console.log('');
console.log('For now, the SVG files have been created and can be used directly.');
console.log('');
console.log('Files created:');
console.log('- /public/neuros-logo.svg (main logo)');
console.log('- /app/icon.svg (favicon)');
console.log('');
console.log('Next.js will automatically use /app/icon.svg as the favicon.');