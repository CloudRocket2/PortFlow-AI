const fs = require('fs');

let cssCode = fs.readFileSync('src/app/globals.css', 'utf8');

// Add route variables
if (!cssCode.includes('--route-active')) {
  cssCode = cssCode.replace(':root {', `:root {
  --route-active: #22d3ee;
  --route-idle: #444444;`);

  cssCode = cssCode.replace('.light-mode {', `.light-mode {
  --route-active: #0891b2; /* cyan-600 */
  --route-idle: #d6d3d1; /* stone-300 */`);

  fs.writeFileSync('src/app/globals.css', cssCode);
  console.log("Added route variables to globals.css");
}

let mapCode = fs.readFileSync('src/components/GlobeWrapper.tsx', 'utf8');

if (!mapCode.includes('var(--route-active)')) {
  mapCode = mapCode.replace(/color: isSelected \? "#00ff00" : c\.status === "AI Executed" \? "#00ff00" : "#444444"/g, 'color: isSelected ? "var(--route-active)" : c.status === "AI Executed" ? "var(--route-active)" : "var(--route-idle)"');
  
  // Update #000000 background
  mapCode = mapCode.replace(/bg-\[\#000000\]/g, 'bg-black');
  
  fs.writeFileSync('src/components/GlobeWrapper.tsx', mapCode);
  console.log("Updated GlobeWrapper routes to use CSS variables");
}
