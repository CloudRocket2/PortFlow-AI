const fs = require('fs');

let cssCode = fs.readFileSync('src/app/globals.css', 'utf8');

if (!cssCode.includes('--map-text')) {
  cssCode = cssCode.replace(':root {', `:root {
  --map-text: #ffffff;`);

  cssCode = cssCode.replace('.light-mode {', `.light-mode {
  --map-text: #1c1917; /* stone-900 */`);

  fs.writeFileSync('src/app/globals.css', cssCode);
  console.log("Added --map-text to globals.css");
}

let mapCode = fs.readFileSync('src/components/GlobeWrapper.tsx', 'utf8');
mapCode = mapCode.replace(/fill: "white"/g, 'fill: "var(--map-text)"');
mapCode = mapCode.replace(/fill: isSelected \? "var\(--route-active\)" : "\#ffffff"/g, 'fill: isSelected ? "var(--route-active)" : "var(--map-text)"');

fs.writeFileSync('src/components/GlobeWrapper.tsx', mapCode);
console.log("Updated map text colors to use CSS variables");
