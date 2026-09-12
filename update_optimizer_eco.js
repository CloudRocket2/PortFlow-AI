const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'components', 'OptimizerPanel.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Add ecoMode state
if (!content.includes('ecoMode')) {
  content = content.replace(
    'const [successMsg, setSuccessMsg] = useState<string | null>(null);',
    'const [successMsg, setSuccessMsg] = useState<string | null>(null);\n  const [ecoMode, setEcoMode] = useState(false);'
  );

  // Add ecoMode to fetch body
  content = content.replace(
    'vessels: state.vessels',
    'vessels: state.vessels,\n          ecoMode'
  );

  // Update success message logic for eco mode
  content = content.replace(
    /setSuccessMsg\(`\$\{data\.optimizedContracts\.length\} CONTRACTS OPTIMIZED`\);/,
    `if (ecoMode) {
            const totalFuelSaved = data.optimizedContracts.reduce((acc, c) => acc + (c.fuelSaved || 0), 0);
            const totalCarbonSaved = data.optimizedContracts.reduce((acc, c) => acc + (c.carbonSaved || 0), 0);
            setSuccessMsg(\`\${data.optimizedContracts.length} OPTIMIZED | \${(totalFuelSaved/1000).toFixed(0)}K USD SAVED | \${totalCarbonSaved}T CARBON REDUCED\`);
          } else {
            setSuccessMsg(\`\${data.optimizedContracts.length} CONTRACTS OPTIMIZED\`);
          }`
  );

  // Add Eco Mode Toggle UI
  const originalUI = `          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 border border-neutral-800 text-white text-xs font-mono uppercase tracking-widest rounded-lg transition-all duration-200">
              <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
              Active
            </div>`;
  const newUI = `          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer group">
              <div className="relative inline-block w-8 h-4 transition-all duration-200">
                <input type="checkbox" checked={ecoMode} onChange={() => setEcoMode(!ecoMode)} className="opacity-0 w-0 h-0" />
                <span className={\`absolute cursor-pointer top-0 left-0 right-0 bottom-0 rounded-full transition-colors duration-300 \${ecoMode ? 'bg-emerald-500' : 'bg-neutral-700'}\`}></span>
                <span className={\`absolute left-0.5 bottom-0.5 bg-white w-3 h-3 rounded-full transition-transform duration-300 \${ecoMode ? 'transform translate-x-4' : ''}\`}></span>
              </div>
              <span className={\`text-xs font-mono uppercase tracking-widest transition-colors \${ecoMode ? 'text-emerald-400' : 'text-neutral-500 group-hover:text-neutral-400'}\`}>Eco-Mode (Slow Steaming)</span>
            </label>
            <div className="flex items-center gap-2 px-3 py-1.5 border border-neutral-800 text-white text-xs font-mono uppercase tracking-widest rounded-lg transition-all duration-200 ml-2">
              <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
              Active
            </div>`;
  content = content.replace(originalUI, newUI);

  fs.writeFileSync(filePath, content);
  console.log("Updated OptimizerPanel.tsx");
} else {
  console.log("Already updated OptimizerPanel");
}
