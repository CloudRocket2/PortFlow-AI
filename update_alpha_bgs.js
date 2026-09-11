const fs = require('fs');

let cssCode = fs.readFileSync('src/app/globals.css', 'utf8');

// The block to replace:
// /* Cards and Panels */
// .light-mode .bg-\[\#111111\],
// ... up to .light-mode .bg-black\/60 { ... }

const replacement = `/* Cards and Panels (Solid) */
.light-mode .bg-\\[\\#111111\\],
.light-mode .bg-neutral-900,
.light-mode .bg-neutral-950 {
  background-color: #ffffff !important;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  border-color: #e7e5e4 !important; /* stone-200 */
}

/* Modal / Slide-out Backdrops */
.light-mode .bg-neutral-900\\/80,
.light-mode .bg-neutral-900\\/90,
.light-mode .bg-black\\/80,
.light-mode .bg-black\\/90 {
  background-color: rgba(255, 255, 255, 0.95) !important;
  backdrop-filter: blur(12px) !important;
  border-color: #e7e5e4 !important;
}

/* Inset Boxes (Grey boxes inside panels) */
.light-mode .bg-black\\/10,
.light-mode .bg-black\\/20,
.light-mode .bg-black\\/30,
.light-mode .bg-black\\/40,
.light-mode .bg-black\\/50,
.light-mode .bg-black\\/60,
.light-mode .bg-neutral-900\\/10,
.light-mode .bg-neutral-900\\/20,
.light-mode .bg-neutral-900\\/30,
.light-mode .bg-neutral-900\\/40,
.light-mode .bg-neutral-900\\/50,
.light-mode .bg-neutral-800,
.light-mode .bg-neutral-800\\/50,
.light-mode .bg-neutral-800\\/60,
.light-mode .bg-neutral-800\\/80 {
  background-color: #f5f5f4 !important; /* stone-100 */
  border-color: #e7e5e4 !important; /* stone-200 */
  box-shadow: none !important;
}`;

// I will use regex to find the block
const regex = /\/\*\s*Cards and Panels\s*\*\/[\s\S]*?\.light-mode \.bg-black\\\/60\s*\{\s*background-color:\s*rgba\(255,\s*255,\s*255,\s*0\.85\)\s*!important;\s*\}/m;

if (regex.test(cssCode)) {
  cssCode = cssCode.replace(regex, replacement);
  fs.writeFileSync('src/app/globals.css', cssCode);
  console.log("Updated globals.css alpha background maps");
} else {
  console.log("Could not find the block to replace.");
}
