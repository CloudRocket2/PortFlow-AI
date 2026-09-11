const fs = require('fs');

let cssCode = fs.readFileSync('src/app/globals.css', 'utf8');

// Add variables to :root
if (!cssCode.includes('--map-fill')) {
  cssCode = cssCode.replace(':root {', `:root {
  --map-fill: #0a150f;
  --map-stroke: #1a3324;
  --map-hover: #0f1f16;
  --map-ocean: transparent;`);

  // Add variables to .light-mode
  cssCode = cssCode.replace('.light-mode {', `.light-mode {
  --map-fill: #e7e5e4; /* stone-200 for land */
  --map-stroke: #d6d3d1; /* stone-300 for borders */
  --map-hover: #d6d3d1; /* stone-300 for hover */
  --map-ocean: #fdfbf7; /* match cream background for seamless look */`);

  fs.writeFileSync('src/app/globals.css', cssCode);
  console.log("Updated globals.css with map variables");
}

let mapCode = fs.readFileSync('src/components/GlobeWrapper.tsx', 'utf8');

if (!mapCode.includes('var(--map-fill)')) {
  mapCode = mapCode.replace(/fill="#0a150f"/g, 'fill="var(--map-fill)"');
  mapCode = mapCode.replace(/stroke="#1a3324"/g, 'stroke="var(--map-stroke)"');
  mapCode = mapCode.replace(/fill: "#0f1f16"/g, 'fill: "var(--map-hover)"');
  
  // Also we should change the sea color if there is one. 
  // It's mostly transparent but let's check
  fs.writeFileSync('src/components/GlobeWrapper.tsx', mapCode);
  console.log("Updated GlobeWrapper.tsx to use CSS variables for map colors");
}
