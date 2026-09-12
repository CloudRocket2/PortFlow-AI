const fs = require('fs');
let code = fs.readFileSync('src/app/legal/page.tsx', 'utf8');

// Replace icon colors for better visibility
code = code.replace(
  /<Scale className="w-12 h-12 text-neutral-800 mb-4" \/>/g,
  '<Scale className="w-12 h-12 text-neutral-400 mb-4" />'
);

fs.writeFileSync('src/app/legal/page.tsx', code);
console.log("Fixed icon colors");
