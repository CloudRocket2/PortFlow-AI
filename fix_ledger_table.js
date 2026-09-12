const fs = require('fs');
let code = fs.readFileSync('src/components/MultiVoyageLedger.tsx', 'utf8');

// Fix the td flex issues by replacing them with normal tds containing flex divs
code = code.replace(
  /<td className="py-3 px-4 flex items-center gap-2">/g,
  '<td className="py-3 px-4"><div className="flex items-center gap-2">'
);

// Close the divs. Wait, it's safer to use regex replacement for the specific blocks.
// Block 1:
// <td className="py-3 px-4 flex items-center gap-2">
//   <span className="text-white font-bold">{voyage.id}</span>
// </td>
code = code.replace(
  /<td className="py-3 px-4 flex items-center gap-2">\s*<span className="text-white font-bold">\{voyage\.id\}<\/span>\s*<\/td>/g,
  '<td className="py-3 px-4"><div className="flex items-center gap-2"><span className="text-white font-bold">{voyage.id}</span></div></td>'
);

// Block 2:
// <td className="py-3 px-4 flex items-center gap-2">
//   <Ship className="w-3 h-3 text-neutral-500" />
//   {voyage.vessel}
// </td>
code = code.replace(
  /<td className="py-3 px-4 flex items-center gap-2">\s*<Ship className="w-3 h-3 text-neutral-500" \/>\s*\{voyage\.vessel\}\s*<\/td>/g,
  '<td className="py-3 px-4"><div className="flex items-center gap-2"><Ship className="w-3 h-3 text-neutral-500" />{voyage.vessel}</div></td>'
);

fs.writeFileSync('src/components/MultiVoyageLedger.tsx', code);
console.log("Fixed flex tds in MultiVoyageLedger");
