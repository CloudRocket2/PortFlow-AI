const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'context', 'PortFlowContext.tsx');
let content = fs.readFileSync(filePath, 'utf8');

if (!content.includes('isSpoofed?: boolean;')) {
  // Update Vessel Interface
  content = content.replace(
    'legalIssues?: string[];',
    'legalIssues?: string[];\n  isSpoofed?: boolean;'
  );

  // Replace Oceanic Pioneer with MV Shadow Trader
  content = content.replace(
    '{ id: "V-OCEANIC", name: "Oceanic Pioneer", class: "Supramax", status: "In Transit", currentDraft: 11.2, capacity: 55000, legalScore: 71, imo: "9218529", flag: "Marshall Islands", owner: "Oceanic Fleet", classSociety: "ClassNK", pni: "NorthStandard", legalIssues: ["Pending maritime claim - Cargo damage 2024", "Foreign vessel charter licence required"] }',
    '{ id: "V-OCEANIC", name: "MV Shadow Trader", class: "Supramax", status: "In Transit", currentDraft: 11.2, capacity: 55000, legalScore: 12, imo: "9345112", flag: "Comoros", owner: "Unknown Shell Corp", classSociety: "Unknown", pni: "Unknown", legalIssues: ["AIS Signal Lost for 72h", "GPS Spoofing Detected", "Possible Sanctions Violation"], isSpoofed: true }'
  );

  content = content.replace(
    'MV Oceanic Pioneer needs',
    'MV Shadow Trader needs'
  );

  fs.writeFileSync(filePath, content);
  console.log("Updated PortFlowContext.tsx");
} else {
  console.log("Already updated context");
}
