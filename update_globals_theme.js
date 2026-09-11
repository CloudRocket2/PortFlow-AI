const fs = require('fs');
let cssCode = fs.readFileSync('src/app/globals.css', 'utf8');

if (!cssCode.includes('.light-mode')) {
  cssCode += `

/* ── Light Mode Overrides ─────────────────────────────── */
.light-mode {
  --background: #f8fafc;
  --foreground: #0f172a;
  --sidebar-bg: #ffffff;
  --card-bg: #ffffff;
  --card-border: #e2e8f0;
}

.light-mode body {
  background: var(--background);
  background-image: radial-gradient(circle at 50% 0%, #f1f5f9 0%, #f8fafc 70%);
}

.light-mode .bg-\\[\\#000000\\],
.light-mode .bg-\\[\\#060606\\],
.light-mode .bg-\\[\\#050505\\],
.light-mode .bg-\\[\\#111111\\],
.light-mode .bg-neutral-900,
.light-mode .bg-neutral-900\\/50,
.light-mode .bg-neutral-900\\/80,
.light-mode .bg-neutral-900\\/90,
.light-mode .bg-neutral-950,
.light-mode .bg-black {
  background-color: #ffffff !important;
}

.light-mode .bg-black\\/60 {
  background-color: rgba(255,255,255,0.8) !important;
}

.light-mode .text-white,
.light-mode .text-neutral-200,
.light-mode .text-neutral-300 {
  color: #0f172a !important;
}

.light-mode .text-neutral-400,
.light-mode .text-neutral-500,
.light-mode .text-neutral-600 {
  color: #475569 !important;
}

.light-mode .border-\\[\\#111111\\],
.light-mode .border-\\[\\#222222\\],
.light-mode .border-neutral-800,
.light-mode .border-neutral-800\\/50,
.light-mode .border-neutral-800\\/60,
.light-mode .border-neutral-700,
.light-mode .border-neutral-700\\/60 {
  border-color: #e2e8f0 !important;
}

.light-mode .minimal-panel {
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.95) 100%) !important;
  border: 1px solid rgba(0, 0, 0, 0.1) !important;
  box-shadow: 0 4px 24px -2px rgba(0, 0, 0, 0.1) !important;
}
.light-mode .minimal-panel::before {
  opacity: 0.03 !important;
}

.light-mode .hover\\:bg-white\\/\\[0\\.02\\]:hover,
.light-mode .hover\\:bg-white\\/\\[0\\.03\\]:hover,
.light-mode .hover\\:bg-white\\/\\[0\\.04\\]:hover,
.light-mode .hover\\:bg-neutral-900:hover,
.light-mode .hover\\:bg-neutral-800:hover {
  background-color: #f1f5f9 !important;
}

.light-mode input,
.light-mode select {
  background-color: #f8fafc !important;
  color: #0f172a !important;
  border-color: #cbd5e1 !important;
}

.light-mode .divide-neutral-800\\/60 > * + * {
  border-color: #e2e8f0 !important;
}

.light-mode svg.text-white {
  color: #0f172a !important;
}

.light-mode .bg-cyan-500\\/10 {
  background-color: rgba(34, 211, 238, 0.15) !important;
}
.light-mode .border-cyan-500\\/20 {
  border-color: rgba(34, 211, 238, 0.3) !important;
}
`;
  fs.writeFileSync('src/app/globals.css', cssCode);
  console.log("Updated globals.css with light-mode overrides");
} else {
  console.log("Globals already updated");
}
