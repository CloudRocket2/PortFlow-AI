const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'app', 'scenarios', 'page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Fix 1: Header overlap
content = content.replace(
  '<div className="flex items-start justify-between">',
  '<div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">'
);

content = content.replace(
  'className={`px-6 py-3 rounded-lg text-xs font-mono font-bold uppercase tracking-widest transition-all duration-300 flex items-center gap-2 border focus-ring active:scale-95 ${',
  'className={`px-6 py-3 shrink-0 rounded-lg text-xs font-mono font-bold uppercase tracking-widest transition-all duration-300 flex items-center gap-2 border focus-ring active:scale-95 whitespace-nowrap ${'
);

// Fix 2: Missing Scenario grids
// Scenario A
const scenarioA_search = `<div className="text-lg leading-tight font-mono text-white">Oct 12-18</div>
              </div>
            </div>`;

const scenarioA_replace = `<div className="text-lg leading-tight font-mono text-white">Oct 12-18</div>
              </div>
              <div className="p-3 bg-neutral-900/50 rounded-lg border border-neutral-800">
                <div className="text-xs text-neutral-500 mb-1">Avg Freight Rate</div>
                <div className="text-xl font-mono tabular-nums flex items-center gap-1.5 truncate text-white">
                  $18.50/MT
                </div>
              </div>
              <div className="p-3 rounded-lg border flex flex-col justify-center bg-blue-500/10 border-blue-500/20">
                <div className="text-xs mb-1 leading-tight text-blue-400">Total Logistics Cost</div>
                <div className="text-xl font-mono tabular-nums truncate text-blue-400">$3.05M</div>
              </div>
            </div>`;

content = content.replace(scenarioA_search, scenarioA_replace);

// Scenario B
const scenarioB_search = `<div className="text-lg leading-tight font-mono text-emerald-400">Oct 20-22</div>
              </div>
            </div>`;

const scenarioB_replace = `<div className="text-lg leading-tight font-mono text-emerald-400">Oct 20-22</div>
              </div>
              <div className="p-3 bg-neutral-900/50 rounded-lg border border-neutral-800">
                <div className="text-xs text-neutral-500 mb-1">Avg Freight Rate</div>
                <div className="text-xl font-mono tabular-nums flex items-center gap-1.5 truncate text-emerald-400">
                  <TrendingDown className="w-4 h-4 shrink-0" /> $10.20/MT
                </div>
              </div>
              <div className="p-3 rounded-lg border flex flex-col justify-center bg-emerald-500/10 border-emerald-500/20">
                <div className="text-xs mb-1 leading-tight text-emerald-400">Total Logistics Cost</div>
                <div className="text-xl font-mono tabular-nums truncate text-emerald-400">$1.68M</div>
              </div>
            </div>`;

content = content.replace(scenarioB_search, scenarioB_replace);

fs.writeFileSync(filePath, content);
console.log("Fixed layout and missing scenario boxes");
