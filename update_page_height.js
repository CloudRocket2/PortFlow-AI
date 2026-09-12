const fs = require('fs');
let code = fs.readFileSync('src/app/page.tsx', 'utf8');

code = code.replace(
  /<div className="flex-1 min-h-\[500px\]">/,
  '<div className="flex-1">'
);

fs.writeFileSync('src/app/page.tsx', code);
console.log("Removed min-h-[500px] from page.tsx");
