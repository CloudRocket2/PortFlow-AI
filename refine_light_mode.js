const fs = require('fs');

let cssCode = fs.readFileSync('src/app/globals.css', 'utf8');

const startTag = "/* ── Light Mode Overrides";
const startIdx = cssCode.indexOf(startTag);

if (startIdx !== -1) {
  cssCode = cssCode.substring(0, startIdx);
  
  cssCode += `/* ── Light Mode Overrides ─────────────────────────────── */
.light-mode {
  --background: #fdfbf7; /* Warm cream white / off-white */
  --foreground: #1c1917; /* Very dark warm gray (stone-900) */
  --sidebar-bg: #ffffff;
  --card-bg: #ffffff;
  --card-border: #e7e5e4; /* stone-200 */
}

.light-mode body {
  background: var(--background) !important;
  background-image: none !important;
}

/* App Shell & Main Background */
.light-mode .bg-\\[\\#000000\\],
.light-mode .bg-black {
  background-color: #fdfbf7 !important; /* Cream off-white */
}

/* Sidebar and Header Backgrounds */
.light-mode .bg-\\[\\#060606\\],
.light-mode .bg-\\[\\#050505\\] {
  background-color: #f5f5f4 !important; /* stone-100 */
  border-color: #e7e5e4 !important; /* stone-200 */
}

/* Cards and Panels */
.light-mode .bg-\\[\\#111111\\],
.light-mode .bg-neutral-900,
.light-mode .bg-neutral-900\\/50,
.light-mode .bg-neutral-900\\/80,
.light-mode .bg-neutral-900\\/90,
.light-mode .bg-neutral-950 {
  background-color: #ffffff !important;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  border-color: #e7e5e4 !important; /* stone-200 */
}

.light-mode .bg-black\\/60 {
  background-color: rgba(255, 255, 255, 0.85) !important;
}

/* Text Colors */
.light-mode .text-white,
.light-mode .text-neutral-200,
.light-mode .text-neutral-300 {
  color: #292524 !important; /* stone-800 */
}

.light-mode .text-neutral-400,
.light-mode .text-neutral-500,
.light-mode .text-neutral-600 {
  color: #78716c !important; /* stone-500 */
}

/* Borders */
.light-mode .border-\\[\\#111111\\],
.light-mode .border-\\[\\#222222\\],
.light-mode .border-neutral-800,
.light-mode .border-neutral-800\\/50,
.light-mode .border-neutral-800\\/60,
.light-mode .border-neutral-700,
.light-mode .border-neutral-700\\/60 {
  border-color: #e7e5e4 !important; /* stone-200 */
}

/* Minimal Panels (Modals, Popovers) */
.light-mode .minimal-panel {
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(250, 250, 249, 0.95) 100%) !important;
  border: 1px solid rgba(28, 25, 23, 0.1) !important;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01) !important;
}
.light-mode .minimal-panel::before {
  opacity: 0.02 !important;
}

/* Hover States for Interactive Elements */
.light-mode .hover\\:bg-white\\/\\[0\\.02\\]:hover,
.light-mode .hover\\:bg-white\\/\\[0\\.03\\]:hover,
.light-mode .hover\\:bg-white\\/\\[0\\.04\\]:hover,
.light-mode .hover\\:bg-neutral-900:hover,
.light-mode .hover\\:bg-neutral-800:hover {
  background-color: #f5f5f4 !important; /* stone-100 */
  color: #1c1917 !important;
}

/* Inputs */
.light-mode input,
.light-mode select,
.light-mode textarea {
  background-color: #ffffff !important;
  color: #1c1917 !important;
  border-color: #d6d3d1 !important; /* stone-300 */
}
.light-mode input:focus,
.light-mode select:focus,
.light-mode textarea:focus {
  border-color: #22d3ee !important;
  background-color: #ffffff !important;
  box-shadow: 0 0 0 1px rgba(34, 211, 238, 0.3) !important;
}

/* Dividers */
.light-mode .divide-neutral-800\\/60 > * + * {
  border-color: #e7e5e4 !important;
}

/* Icons */
.light-mode svg.text-white {
  color: #292524 !important;
}

/* Accents / Specifics */
.light-mode .bg-cyan-500\\/10 {
  background-color: rgba(34, 211, 238, 0.1) !important;
}
.light-mode .border-cyan-500\\/20 {
  border-color: rgba(34, 211, 238, 0.4) !important;
}

/* Map area */
.light-mode .bg-\\[\\#0a0a0a\\] {
  background-color: #fdfbf7 !important;
}
`;

  fs.writeFileSync('src/app/globals.css', cssCode);
  console.log("Updated globals.css with refined light mode colors");
} else {
  console.log("Could not find start index");
}
