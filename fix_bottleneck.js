const fs = require('fs');
let code = fs.readFileSync('src/components/BottleneckAlerts.tsx', 'utf8');

code = code.replace(
  /<div className="flex items-center gap-2">/g,
  '<div className="flex items-center gap-2 min-w-0">'
);
code = code.replace(
  /<span className={`text-\[10px\] font-mono px-1.5 py-0.5 rounded border \${config.badge} \${config.border} \${config.text} uppercase tracking-widest`}>/g,
  '<span className={`shrink-0 text-[10px] font-mono px-1.5 py-0.5 rounded border ${config.badge} ${config.border} ${config.text} uppercase tracking-widest`}>'
);

fs.writeFileSync('src/components/BottleneckAlerts.tsx', code);
console.log("Fixed overflow in BottleneckAlerts.tsx");
