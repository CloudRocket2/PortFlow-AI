const fs = require('fs');
let cssCode = fs.readFileSync('src/app/globals.css', 'utf8');

const accentOverrides = `
/* Accent Colors - Darken for Legibility in Light Mode */
.light-mode .text-cyan-400,
.light-mode .text-cyan-500 {
  color: #0891b2 !important; /* cyan-600 */
}
.light-mode .hover\\:text-cyan-300:hover,
.light-mode .hover\\:text-cyan-400:hover {
  color: #0e7490 !important; /* cyan-700 */
}

.light-mode .text-emerald-400,
.light-mode .text-emerald-500 {
  color: #059669 !important; /* emerald-600 */
}
.light-mode .hover\\:text-emerald-300:hover,
.light-mode .hover\\:text-emerald-400:hover {
  color: #047857 !important; /* emerald-700 */
}

.light-mode .text-amber-400,
.light-mode .text-amber-500 {
  color: #d97706 !important; /* amber-600 */
}
.light-mode .hover\\:text-amber-300:hover,
.light-mode .hover\\:text-amber-400:hover {
  color: #b45309 !important; /* amber-700 */
}

.light-mode .text-rose-400,
.light-mode .text-rose-500 {
  color: #e11d48 !important; /* rose-600 */
}
.light-mode .hover\\:text-rose-300:hover,
.light-mode .hover\\:text-rose-400:hover {
  color: #be123c !important; /* rose-700 */
}

.light-mode .text-violet-400,
.light-mode .text-violet-500 {
  color: #7c3aed !important; /* violet-600 */
}
.light-mode .hover\\:text-violet-300:hover,
.light-mode .hover\\:text-violet-400:hover {
  color: #6d28d9 !important; /* violet-700 */
}

.light-mode .text-blue-400,
.light-mode .text-blue-500 {
  color: #2563eb !important; /* blue-600 */
}
.light-mode .hover\\:text-blue-300:hover,
.light-mode .hover\\:text-blue-400:hover {
  color: #1d4ed8 !important; /* blue-700 */
}

/* Background Accents (like bg-cyan-500/10) */
.light-mode .bg-cyan-500\\/10,
.light-mode .bg-cyan-500\\/20 {
  background-color: rgba(8, 145, 178, 0.1) !important;
}
.light-mode .hover\\:bg-cyan-500\\/10:hover,
.light-mode .hover\\:bg-cyan-500\\/20:hover {
  background-color: rgba(8, 145, 178, 0.15) !important;
}

.light-mode .bg-emerald-500\\/10,
.light-mode .bg-emerald-500\\/20 {
  background-color: rgba(5, 150, 105, 0.1) !important;
}
.light-mode .bg-rose-500\\/10,
.light-mode .bg-rose-500\\/20 {
  background-color: rgba(225, 29, 72, 0.1) !important;
}
`;

if (!cssCode.includes('text-emerald-400')) {
  cssCode += accentOverrides;
  fs.writeFileSync('src/app/globals.css', cssCode);
  console.log("Updated globals.css with accent color adjustments");
} else {
  console.log("Already updated");
}
