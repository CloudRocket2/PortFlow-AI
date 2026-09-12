const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'components', 'DeckMap.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add isRedSeaClosed to the usePortFlowData hook extraction
if (!content.includes('isRedSeaClosed } = usePortFlowData();')) {
  content = content.replace(
    'const { state, selectedVoyageId } = usePortFlowData();',
    'const { state, selectedVoyageId, isRedSeaClosed } = usePortFlowData();'
  );
}

// 2. Map route replacement
if (!content.includes('if (isRedSeaClosed && origin.name === "Norfolk, US")')) {
  content = content.replace(
    'const intermediate = WAYPOINTS[origin.name] || [];',
    `let intermediate = WAYPOINTS[origin.name] || [];
        if (isRedSeaClosed && origin.name === "Norfolk, US") {
          // Reroute around Cape of Good Hope
          intermediate = [[-40.0, 30.0], [-25.0, 0.0], [-5.0, -20.0], [20.0, -40.0], [50.0, -25.0], [70.0, -10.0]];
        }`
  );
}

// 3. Dependency array for mapRoutes
content = content.replace(
  'selectedVoyageId]);',
  'selectedVoyageId, isRedSeaClosed]);'
);

fs.writeFileSync(filePath, content);
console.log("Updated DeckMap.tsx");
