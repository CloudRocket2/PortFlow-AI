const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'components', 'MultiVoyageLedger.tsx');
let content = fs.readFileSync(filePath, 'utf8');

if (!content.includes('carbonSaved')) {
  content = content.replace(
    'operationalScore: c.operationalScore,',
    'operationalScore: c.operationalScore,\n          carbonSaved: c.carbonSaved,\n          fuelSaved: c.fuelSaved,'
  );

  content = content.replace(
    '<th className="py-3 px-4 font-normal text-right">Status</th>',
    '<th className="py-3 px-4 font-normal">Eco Impact</th>\n                  <th className="py-3 px-4 font-normal text-right">Status</th>'
  );

  content = content.replace(
    '<td className="py-4 px-4 text-right">',
    `<td className="py-4 px-4">
                        {voyage.carbonSaved ? (
                          <div className="flex flex-col gap-0.5">
                            <span className="text-[10px] text-emerald-400 border border-emerald-400/20 bg-emerald-400/10 px-1.5 py-0.5 rounded w-fit">-{voyage.carbonSaved}T CO₂</span>
                            <span className="text-[10px] text-neutral-500">Fuel: $\{(voyage.fuelSaved! / 1000).toFixed(0)}k</span>
                          </div>
                        ) : (
                          <span className="text-[10px] text-neutral-600">-</span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-right">`
  );

  fs.writeFileSync(filePath, content);
  console.log("Updated MultiVoyageLedger.tsx");
} else {
  console.log("Already updated ledger");
}
