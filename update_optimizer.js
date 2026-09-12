const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'components', 'OptimizerPanel.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Update imports if needed
if (!content.includes('applyAiOptimization')) {
  content = content.replace(
    'const { runFleetOptimization } = usePortFlowData();',
    'const { state, runFleetOptimization, applyAiOptimization } = usePortFlowData();'
  );
}

// Rewrite handleOptimize
content = content.replace(
  /const handleOptimize = async \(\) => {[\s\S]*?};/m,
  `const handleOptimize = async () => {
    setIsOptimizing(true);
    setSuccessMsg(null);
    
    try {
      // Find pending contracts
      const pendingContracts = state.contracts.filter(c => c.status !== "AI Executed");
      
      if (pendingContracts.length === 0) {
        setIsOptimizing(false);
        setSuccessMsg("FLEET ALREADY OPTIMAL");
        setTimeout(() => setSuccessMsg(null), 3000);
        return;
      }

      const res = await fetch("/api/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pendingContracts,
          ports: state.ports,
          vessels: state.vessels
        })
      });

      const data = await res.json();
      
      if (data.optimizedContracts && data.optimizedContracts.length > 0) {
        applyAiOptimization(data.optimizedContracts);
        setSuccessMsg(\`\${data.optimizedContracts.length} CONTRACTS OPTIMIZED\`);
      } else {
        // Fallback to local optimization if API fails to return valid format
        const result = runFleetOptimization();
        setSuccessMsg(\`\${result.updatedCount} CONTRACTS OPTIMIZED (FALLBACK)\`);
      }
    } catch (e) {
      console.error(e);
      const result = runFleetOptimization();
      setSuccessMsg(\`\${result.updatedCount} CONTRACTS OPTIMIZED (FALLBACK)\`);
    }

    setIsOptimizing(false);
    setTimeout(() => setSuccessMsg(null), 3000);
  };`
);

fs.writeFileSync(filePath, content);
console.log("Updated OptimizerPanel.tsx");
