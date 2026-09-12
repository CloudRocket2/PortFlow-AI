const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'components', 'MultiVoyageLedger.tsx');
let content = fs.readFileSync(filePath, 'utf8');

if (!content.includes('voyage.carbonSaved ?')) {
  // Add the td block before the status td
  const searchStr = `<td className="py-3 px-4 text-right">\n                        <span className={\`inline-flex`;
  const replaceStr = `<td className="py-3 px-4">
                        {voyage.carbonSaved ? (
                          <div className="flex flex-col gap-0.5">
                            <span className="text-[10px] text-emerald-400 border border-emerald-400/20 bg-emerald-400/10 px-1.5 py-0.5 rounded w-fit">-{voyage.carbonSaved}T COâ‚‚</span>
                            <span className="text-[10px] text-neutral-500">Fuel: \${(voyage.fuelSaved! / 1000).toFixed(0)}k</span>
                          </div>
                        ) : (
                          <span className="text-[10px] text-neutral-600">-</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className={\`inline-flex`;
  
  content = content.replace(searchStr, replaceStr);

  fs.writeFileSync(filePath, content);
  console.log("Fixed missing td in MultiVoyageLedger.tsx");
} else {
  console.log("Already fixed");
}
