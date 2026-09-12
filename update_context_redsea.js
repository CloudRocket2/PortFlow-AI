const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'context', 'PortFlowContext.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Update PortFlowContextType
if (!content.includes('isRedSeaClosed: boolean;')) {
  content = content.replace(
    'executeVoyage: (id: string) => void;',
    'executeVoyage: (id: string) => void;\n  isRedSeaClosed: boolean;\n  toggleRedSeaReroute: () => void;'
  );
}

// Update SEED_ROUTES
content = content.replace(
  '{ id: "R-904", vesselId: "V-GLOBAL", originId: "P-MAPUTO", destinationId: "P-GANGAVARAM", cargo: "Iron Ore", volume: 160000, eta: "in 2h" }',
  '{ id: "R-904", vesselId: "V-STELLAR", originId: "P-NORFOLK", destinationId: "P-DHAMRA", cargo: "Coking Coal", volume: 35000, eta: "in 18 days" }'
);

// Update PortFlowProvider
if (!content.includes('const [isRedSeaClosed, setIsRedSeaClosed] = useState(false);')) {
  content = content.replace(
    'const [selectedVoyageId, setSelectedVoyageId] = useState<string | null>(null);',
    'const [selectedVoyageId, setSelectedVoyageId] = useState<string | null>(null);\n  const [isRedSeaClosed, setIsRedSeaClosed] = useState(false);\n\n  const toggleRedSeaReroute = () => {\n    setIsRedSeaClosed(prev => !prev);\n  };\n'
  );

  content = content.replace(
    'executeVoyage,',
    'executeVoyage,\n        isRedSeaClosed,\n        toggleRedSeaReroute,'
  );
}

fs.writeFileSync(filePath, content);
console.log("Updated PortFlowContext.tsx");
