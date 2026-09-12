const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'components', 'MultiVoyageLedger.tsx');
let content = fs.readFileSync(filePath, 'utf8');

if (!content.includes('isRedSeaClosed } = usePortFlowData();')) {
  content = content.replace(
    'const { state, selectedVoyageId, setSelectedVoyageId } = usePortFlowData();',
    'const { state, selectedVoyageId, setSelectedVoyageId, isRedSeaClosed } = usePortFlowData();'
  );
}

// Add the badge
const searchStr = `<span className="text-white">{voyage.destination}</span>`;
const replaceStr = `<span className="text-white flex items-center gap-2">
                            {voyage.destination}
                            {isRedSeaClosed && voyage.origin === "Norfolk, US" && (
                              <span className="text-[9px] bg-rose-500/20 text-rose-400 border border-rose-500/30 px-1 py-0.5 rounded uppercase tracking-widest whitespace-nowrap">
                                Cape of Good Hope Reroute (+14 Days)
                              </span>
                            )}
                          </span>`;

content = content.replace(searchStr, replaceStr);

fs.writeFileSync(filePath, content);
console.log("Updated MultiVoyageLedger.tsx");
