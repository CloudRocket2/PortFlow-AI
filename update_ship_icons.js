const fs = require('fs');
let mapCode = fs.readFileSync('src/components/GlobeWrapper.tsx', 'utf8');

mapCode = mapCode.replace(/color=\{isSelected \? "\#ffffff" : isHovered \? "var\(--route-active\)" : "\#aaaaaa"\}/g, 'color={isSelected ? "var(--map-text)" : isHovered ? "var(--route-active)" : "var(--map-stroke)"}');

fs.writeFileSync('src/components/GlobeWrapper.tsx', mapCode);
console.log("Updated ship icon colors");
