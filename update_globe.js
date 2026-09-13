const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'components', 'GlobeWrapper.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add Threat Zone (Red Sea)
const geographiesEndStr = '          </Geographies>';
const threatZoneStr = `          </Geographies>

          {/* 1. Geopolitical Threat Zone */}
          <Marker coordinates={[43.0, 14.0]}>
            <circle 
              r={25 / position.zoom} 
              fill="#f43f5e" 
              opacity={isRedSeaClosed ? 0.2 : 0} 
              className={isRedSeaClosed ? "animate-pulse" : ""}
              style={{ pointerEvents: "none", transition: "opacity 0.5s ease" }}
            />
            <circle 
              r={25 / position.zoom} 
              fill="transparent" 
              stroke="#f43f5e" 
              strokeWidth={1.5 / position.zoom}
              opacity={isRedSeaClosed ? 0.8 : 0}
              style={{ pointerEvents: "none", transition: "opacity 0.5s ease" }}
            />
            {isRedSeaClosed && (
              <circle r="0" fill="none" stroke="#f43f5e" strokeWidth={1 / position.zoom} style={{ pointerEvents: "none" }}>
                <animate attributeName="r" from="0" to={45 / position.zoom} dur="3s" repeatCount="indefinite" />
                <animate attributeName="opacity" from="0.5" to="0" dur="3s" repeatCount="indefinite" />
              </circle>
            )}
          </Marker>
`;
content = content.replace(geographiesEndStr, threatZoneStr);

// 2. Add Port Volume Bubbles
const portCirclesRegex = /<circle r=\{2\.5 \/ position\.zoom\}[\s\S]*?<circle r=\{8 \/ position\.zoom\} fill="transparent" stroke=\{iconColor\} strokeWidth=\{0\.5 \/ position\.zoom\} opacity=\{0\.5\} \/>/;

const newPortCircles = `<circle r={2.5 / position.zoom} fill={iconColor} className={hasIssue ? "animate-pulse" : ""} />
                {/* 2. Port Volume Bubbles */}
                <circle 
                  r={(marker.handlingRate / 2000) / position.zoom} 
                  fill={iconColor} 
                  opacity={0.1} 
                />
                <circle 
                  r={(marker.handlingRate / 2000) / position.zoom} 
                  fill="transparent" 
                  stroke={iconColor} 
                  strokeWidth={0.5 / position.zoom} 
                  opacity={0.4} 
                />`;
content = content.replace(portCirclesRegex, newPortCircles);

// 3. Add Animated Radar Rings for Ships
const shipIconGroupRegex = /<g transform=\{`translate\(\$\{-6 \/ position\.zoom\}, \$\{-6 \/ position\.zoom\}\)`\}>[\s\S]*?<\/g>/;

const newShipIconGroup = `<g transform={\`translate(\${-6 / position.zoom}, \${-6 / position.zoom})\`}>
                  <Ship 
                    color={isSelected ? "var(--map-text)" : isHovered ? "var(--route-active)" : "var(--map-stroke)"} 
                    size={12 / position.zoom} 
                  />
                </g>
                
                {/* 3. Animated Radar Rings */}
                <circle r="0" fill="none" stroke={isSelected ? "var(--route-active)" : "var(--map-stroke)"} strokeWidth={0.5 / position.zoom} style={{ pointerEvents: "none" }}>
                  <animate attributeName="r" from="0" to={20 / position.zoom} dur="2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" from="0.8" to="0" dur="2s" repeatCount="indefinite" />
                </circle>
                {isSelected && (
                  <circle r="0" fill="none" stroke="var(--route-active)" strokeWidth={0.5 / position.zoom} style={{ pointerEvents: "none" }}>
                    <animate attributeName="r" from="0" to={20 / position.zoom} dur="2s" begin="1s" repeatCount="indefinite" />
                    <animate attributeName="opacity" from="0.8" to="0" dur="2s" begin="1s" repeatCount="indefinite" />
                  </circle>
                )}`;
content = content.replace(shipIconGroupRegex, newShipIconGroup);

// Need to make sure `isRedSeaClosed` is destructured!
// const { state, selectedVoyageId, setSelectedVoyageId } = usePortFlowData();
content = content.replace(
  'const { state, selectedVoyageId, setSelectedVoyageId } = usePortFlowData();',
  'const { state, selectedVoyageId, setSelectedVoyageId, isRedSeaClosed } = usePortFlowData();'
);

fs.writeFileSync(filePath, content);
console.log("Updated GlobeWrapper.tsx successfully");
