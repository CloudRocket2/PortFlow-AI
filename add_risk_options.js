const fs = require('fs');
let code = fs.readFileSync('src/app/risk/page.tsx', 'utf8');

// Inject options into Vessel Search
const vesselSearchFormRegex = /(<form onSubmit=\{handleVesselSearch\}.*?<\/form>)/s;
const vesselOptions = `
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="text-xs text-neutral-500 mr-1 mt-1">Quick Filters:</span>
              <button type="button" onClick={() => setVesselQuery('High-Risk Flags')} className="px-2.5 py-1 rounded border border-neutral-800 bg-black/20 text-xs text-neutral-400 hover:text-cyan-400 hover:border-cyan-500/30 transition-colors">High-Risk Flags</button>
              <button type="button" onClick={() => setVesselQuery('Sanctions Check')} className="px-2.5 py-1 rounded border border-neutral-800 bg-black/20 text-xs text-neutral-400 hover:text-cyan-400 hover:border-cyan-500/30 transition-colors">Sanctions Check</button>
              <button type="button" onClick={() => setVesselQuery('Recent Arrests')} className="px-2.5 py-1 rounded border border-neutral-800 bg-black/20 text-xs text-neutral-400 hover:text-cyan-400 hover:border-cyan-500/30 transition-colors">Recent Arrests</button>
            </div>`;
code = code.replace(vesselSearchFormRegex, `$1\n${vesselOptions}`);

// Inject options into Law Search
const lawSearchFormRegex = /(<form onSubmit=\{handleLawSearch\}.*?<\/form>)/s;
const lawOptions = `
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="text-xs text-neutral-500 mr-1 mt-1">Suggested:</span>
              <button type="button" onClick={() => setLawQuery('Force Majeure')} className="px-2.5 py-1 rounded border border-neutral-800 bg-black/20 text-xs text-neutral-400 hover:text-violet-400 hover:border-violet-500/30 transition-colors">Force Majeure</button>
              <button type="button" onClick={() => setLawQuery('Demurrage Exceptions')} className="px-2.5 py-1 rounded border border-neutral-800 bg-black/20 text-xs text-neutral-400 hover:text-violet-400 hover:border-violet-500/30 transition-colors">Demurrage Exceptions</button>
              <button type="button" onClick={() => setLawQuery('Safe Port Warranty')} className="px-2.5 py-1 rounded border border-neutral-800 bg-black/20 text-xs text-neutral-400 hover:text-violet-400 hover:border-violet-500/30 transition-colors">Safe Port Warranty</button>
            </div>`;
code = code.replace(lawSearchFormRegex, `$1\n${lawOptions}`);

fs.writeFileSync('src/app/risk/page.tsx', code);
console.log("Added quick options to risk page");
