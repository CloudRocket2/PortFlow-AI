const fs = require('fs');
let code = fs.readFileSync('src/app/legal/page.tsx', 'utf8');

// Replace the absolute overlay for Awaiting voyage particulars
code = code.replace(
  /<div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-black\/40 backdrop-blur-sm z-10">/g,
  '<div className="flex flex-col items-center justify-center text-center p-8 bg-neutral-900/10 border border-neutral-800 rounded-xl mb-6">'
);

fs.writeFileSync('src/app/legal/page.tsx', code);
console.log("Replaced absolute overlays with sibling containers with mb-6 gap in legal page");
