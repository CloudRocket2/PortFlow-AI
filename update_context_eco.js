const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'context', 'PortFlowContext.tsx');
let content = fs.readFileSync(filePath, 'utf8');

if (!content.includes('carbonSaved?: number;')) {
  content = content.replace(
    'operationalScore?: number;',
    'operationalScore?: number;\n  carbonSaved?: number;\n  fuelSaved?: number;'
  );

  content = content.replace(
    'operationalScore: 99',
    'operationalScore: 99,\n            carbonSaved: optimizedData.carbonSaved,\n            fuelSaved: optimizedData.fuelSaved'
  );

  fs.writeFileSync(filePath, content);
  console.log("Updated PortFlowContext.tsx");
} else {
  console.log("Already updated context");
}
