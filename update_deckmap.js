const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'components', 'DeckMap.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Update Ship Glow Size
content = content.replace(
  /radiusMinPixels: 10,\s*radiusMaxPixels: 50,/,
  'radiusMinPixels: 20,\n        radiusMaxPixels: 70,'
);

// Update Ship Size & Colors
content = content.replace(
  /getSize: d => d\.isSelected \? 35 : 25,\s*getColor: d => d\.isSelected \? \[0, 255, 0\] : \[0, 200, 255\],/,
  'getSize: d => d.isSelected ? 55 : 40,\n        getColor: d => d.isSelected ? [52, 211, 153] : [255, 255, 255],'
);

// Optional: enhance the glow color to be more visible
content = content.replace(
  /getFillColor: d => d\.isSelected \? \[0, 255, 0, 100\] : \[0, 255, 255, 50\],/,
  'getFillColor: d => d.isSelected ? [52, 211, 153, 150] : [0, 255, 255, 100],'
);

fs.writeFileSync(filePath, content);
console.log("Updated DeckMap.tsx sizes");
