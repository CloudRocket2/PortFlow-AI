const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'components', 'DeckMap.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Update mapRoutes to include isSpoofed
content = content.replace(
  'isSelected: selectedVoyageId === c.id,',
  'isSelected: selectedVoyageId === c.id,\n          isSpoofed: vessel?.isSpoofed || false,'
);
// wait, the line is `const isSelected = selectedVoyageId === c.id;` and then it returns `isSelected: r.isSelected`? Let's do it safely.

content = content.replace(
  'eta: route.eta,',
  'eta: route.eta,\n          isSpoofed: vessel?.isSpoofed || false,'
);

// Update ships to include isSpoofed
content = content.replace(
  'isSelected: r.isSelected',
  'isSelected: r.isSelected,\n          isSpoofed: r.isSpoofed'
);

// Update getIcon to use a different icon if spoofed, or update getColor
content = content.replace(
  'getColor: d => d.isSelected ? [52, 211, 153] : [255, 255, 255],',
  'getColor: d => d.isSpoofed ? [244, 63, 94] : d.isSelected ? [52, 211, 153] : [255, 255, 255],'
);

// Update glow color
content = content.replace(
  'getFillColor: d => d.isSelected ? [52, 211, 153, 200] : [0, 200, 255, 100],',
  'getFillColor: d => d.isSpoofed ? [244, 63, 94, 200] : d.isSelected ? [52, 211, 153, 200] : [0, 200, 255, 100],'
);

fs.writeFileSync(filePath, content);
console.log("Updated DeckMap.tsx");
