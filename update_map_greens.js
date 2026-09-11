const fs = require('fs');

let mapCode = fs.readFileSync('src/components/GlobeWrapper.tsx', 'utf8');

// Replace hardcoded #00ff00 with text-cyan-400 or var(--route-active)
mapCode = mapCode.replace(/text-\[\#00ff00\]/g, 'text-cyan-400');
mapCode = mapCode.replace(/hover:border-\[\#00ff00\]/g, 'hover:border-cyan-400');
mapCode = mapCode.replace(/iconColor = hasIssue \? "\#f59e0b" : "\#00ff00"/g, 'iconColor = hasIssue ? "#f59e0b" : "var(--route-active)"');
mapCode = mapCode.replace(/isHovered \? "\#00ff00"/g, 'isHovered ? "var(--route-active)"');
mapCode = mapCode.replace(/isSelected \? "\#00ff00"/g, 'isSelected ? "var(--route-active)"');

// Remove the green inner shadow which looks weird on light mode
mapCode = mapCode.replace(/shadow-\[inset_0_0_50px_rgba\(0,255,0,0\.05\)\]/g, 'shadow-inner');

fs.writeFileSync('src/components/GlobeWrapper.tsx', mapCode);
console.log("Updated GlobeWrapper hardcoded colors");
