#!/usr/bin/env node

/**
 * Migration script to replace gradient backgrounds with solid colors
 * This ensures visual consistency across the application
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Gradient patterns to replace
const gradientReplacements = [
  // Background gradients
  { 
    pattern: /bg-gradient-to-[a-z]+\s+from-\S+\s+(via-\S+\s+)?to-\S+/g,
    replacement: 'bg-background',
    description: 'Replace gradient backgrounds with solid background'
  },
  
  // Specific component gradients
  {
    pattern: /bg-gradient-to-br from-\[#F5F5FF\] via-\[#FAFAF9\] to-\[#FFF5F5\]/g,
    replacement: 'bg-background',
    description: 'Replace dashboard gradient with solid background'
  },
  
  // Blue gradients
  {
    pattern: /bg-gradient-to-[a-z]+\s+from-blue-\d+(\s+to-\S+)?/g,
    replacement: 'bg-primary/10',
    description: 'Replace blue gradients with primary color'
  },
  
  // Purple gradients  
  {
    pattern: /bg-gradient-to-[a-z]+\s+from-purple-\d+(\s+to-\S+)?/g,
    replacement: 'bg-accent/10',
    description: 'Replace purple gradients with accent color'
  },
  
  // Gray gradients
  {
    pattern: /bg-gradient-to-[a-z]+\s+from-gray-\d+(\s+to-\S+)?/g,
    replacement: 'bg-muted',
    description: 'Replace gray gradients with muted color'
  },
  
  // Text gradients (convert to solid colors)
  {
    pattern: /bg-gradient-to-[a-z]+\s+from-\S+\s+(via-\S+\s+)?to-\S+\s+bg-clip-text\s+text-transparent/g,
    replacement: 'text-primary',
    description: 'Replace gradient text with solid primary color'
  }
];

// Color mapping for specific cases
const colorMap = {
  'from-blue-600 to-cyan-600': 'bg-primary',
  'from-purple-600 to-pink-600': 'bg-accent',
  'from-orange-600 to-red-600': 'bg-destructive',
  'from-green-600 to-teal-600': 'bg-green-600',
  'from-stone-50 to-orange-50': 'bg-secondary',
  'from-stone-900 to-gray-800': 'bg-foreground',
  'from-blue-50 to-purple-50': 'bg-primary/5',
  'from-indigo-50 via-white to-purple-50': 'bg-background',
  'from-gray-50 to-white': 'bg-card',
  'from-blue-500 to-purple-500': 'bg-primary',
  'from-purple-500 to-pink-500': 'bg-accent',
};

// Files to process
const filePatterns = [
  'components/**/*.tsx',
  'app/**/*.tsx',
  'lib/**/*.ts'
];

// Summary statistics
let totalReplacements = 0;
let filesModified = 0;
const modifiedFiles = [];

// Function to process a single file
function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  let fileReplacements = 0;
  
  // First, replace specific color mappings
  for (const [gradient, solidColor] of Object.entries(colorMap)) {
    const regex = new RegExp(gradient.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
    const matches = content.match(regex);
    if (matches) {
      content = content.replace(regex, solidColor);
      fileReplacements += matches.length;
      modified = true;
    }
  }
  
  // Then apply general gradient replacements
  for (const { pattern, replacement, description } of gradientReplacements) {
    const matches = content.match(pattern);
    if (matches) {
      // Skip if it's a legitimate use case (like progress bars)
      const skipPatterns = [
        'progress',
        'loading',
        'slider',
        'range'
      ];
      
      let shouldReplace = true;
      for (const skip of skipPatterns) {
        if (filePath.toLowerCase().includes(skip)) {
          shouldReplace = false;
          break;
        }
      }
      
      if (shouldReplace) {
        content = content.replace(pattern, replacement);
        fileReplacements += matches.length;
        modified = true;
      }
    }
  }
  
  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    filesModified++;
    totalReplacements += fileReplacements;
    modifiedFiles.push({
      path: filePath,
      replacements: fileReplacements
    });
    console.log(`✓ Modified ${filePath} (${fileReplacements} replacements)`);
  }
}

// Main execution
console.log('🎨 Starting gradient migration...\n');

filePatterns.forEach(pattern => {
  const files = glob.sync(pattern, { 
    ignore: ['**/node_modules/**', '**/.next/**', '**/dist/**']
  });
  
  files.forEach(file => {
    processFile(path.resolve(file));
  });
});

// Print summary
console.log('\n' + '='.repeat(60));
console.log('📊 Migration Summary:');
console.log('='.repeat(60));
console.log(`Total files modified: ${filesModified}`);
console.log(`Total replacements made: ${totalReplacements}`);

if (modifiedFiles.length > 0) {
  console.log('\n📝 Modified files:');
  modifiedFiles.forEach(({ path, replacements }) => {
    console.log(`  - ${path.replace(process.cwd() + '/', '')} (${replacements} changes)`);
  });
}

console.log('\n✅ Gradient migration complete!');
console.log('💡 Remember to:');
console.log('  1. Review the changes manually');
console.log('  2. Test the application visually');
console.log('  3. Commit the changes');
console.log('  4. Consider adding visual regression tests');