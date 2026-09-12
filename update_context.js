const fs = require('fs');
const path = require('path');

const contextPath = path.join(__dirname, 'src', 'context', 'PortFlowContext.tsx');
let content = fs.readFileSync(contextPath, 'utf8');

// 1. Add applyAiOptimization to PortFlowContextType
content = content.replace(
  'runFleetOptimization: () => { updatedCount: number, totalAdded: number };',
  `runFleetOptimization: () => { updatedCount: number, totalAdded: number };
  applyAiOptimization: (optimizedContracts: Partial<Contract>[]) => void;`
);

// 2. Add applyAiOptimization function body
content = content.replace(
  /const runFleetOptimization = \(\) => {[\s\S]*?return { updatedCount, totalAdded };\n  };/,
  `const runFleetOptimization = () => {
    let updatedCount = 0;
    let totalAdded = 0;

    const newContracts = state.contracts.map(c => {
      if (c.status === "Commercial Approval" || c.status === "Legal Review Req." || c.status === "Mgt Approval Pending") {
        updatedCount++;
        const newRaw = c.predictedSavings * 1.15;
        totalAdded += (newRaw - c.predictedSavings);
        
        // Mock realized savings +/- 10%
        const variancePct = (Math.random() * 0.2) - 0.1;
        const realized = newRaw * (1 + variancePct);

        return { 
          ...c, 
          status: "AI Executed" as Contract["status"], 
          predictedSavings: newRaw,
          realizedSavings: realized,
        };
      }
      return c;
    });

    if (updatedCount > 0) {
      setState(prev => ({ ...prev, contracts: newContracts }));
    }

    return { updatedCount, totalAdded };
  };

  const applyAiOptimization = (optimizedContracts: Partial<Contract>[]) => {
    setState(prev => {
      const newContracts = prev.contracts.map(c => {
        const optimizedData = optimizedContracts.find(opt => opt.id === c.id);
        if (optimizedData) {
          return {
            ...c,
            status: "AI Executed" as Contract["status"],
            predictedSavings: optimizedData.predictedSavings || c.predictedSavings,
            realizedSavings: optimizedData.realizedSavings || c.predictedSavings * 1.05,
            commercialScore: 99,
            operationalScore: 99
          };
        }
        return c;
      });
      return { ...prev, contracts: newContracts };
    });
  };`
);

// 3. Export it in Provider value
content = content.replace(
  '<PortFlowContext.Provider value={{ state, selectedVoyageId, setSelectedVoyageId, updateContractStatus, runFleetOptimization }}>',
  '<PortFlowContext.Provider value={{ state, selectedVoyageId, setSelectedVoyageId, updateContractStatus, runFleetOptimization, applyAiOptimization }}>'
);

fs.writeFileSync(contextPath, content);
console.log("Updated context");
