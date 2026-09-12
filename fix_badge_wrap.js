const fs = require('fs');
let code = fs.readFileSync('src/app/scenarios/page.tsx', 'utf8');

// Fix badgeStyle wrapping for Scenario B
code = code.replace(
  /badgeStyle: "text-emerald-400 bg-emerald-500\/10 border border-emerald-500\/20",/g,
  'badgeStyle: "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 whitespace-nowrap",'
);

fs.writeFileSync('src/app/scenarios/page.tsx', code);
console.log("Fixed badge wrapping in Scenarios page");
