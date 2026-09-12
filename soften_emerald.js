const fs = require('fs');
let code = fs.readFileSync('src/app/globals.css', 'utf8');

// Replace the emerald background mapping
code = code.replace(
  /\.light-mode \.bg-emerald-500\\\/10,\s*\n\.light-mode \.bg-emerald-500\\\/20 \{\s*\n\s*background-color: rgba\(5, 150, 105, 0\.1\) !important;\s*\n\}/,
  `.light-mode .bg-emerald-500\\/10,\n.light-mode .bg-emerald-500\\/20 {\n  background-color: #ecfdf5 !important; /* emerald-50 */\n  border-color: #a7f3d0 !important; /* emerald-200 */\n  color: #047857 !important; /* emerald-700 */\n}`
);

// Also add a light mode override for the CSS variable itself
if (!code.includes('.light-mode {') && code.includes(':root {')) {
  // If we don't have a dedicated block for light mode variables, let's create one or append to body.light-mode
}

// Better yet, just append to the file
code += `\n\n/* Soften the emerald variable in light mode */\n.light-mode {\n  --accent-emerald: #059669;\n}\n`;

fs.writeFileSync('src/app/globals.css', code);
console.log("Softened emerald backgrounds in globals.css");
