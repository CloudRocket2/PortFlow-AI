const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'components', 'DeckMap.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Import ColumnLayer and useEffect
content = content.replace(
  'import { IconLayer, ArcLayer, TextLayer, ScatterplotLayer } from "@deck.gl/layers";',
  'import { IconLayer, ArcLayer, TextLayer, ScatterplotLayer, ColumnLayer } from "@deck.gl/layers";'
);
content = content.replace(
  'import React, { useState, useMemo, useRef, useCallback } from "react";',
  'import React, { useState, useMemo, useRef, useCallback, useEffect } from "react";'
);

// 2. Add time state to DeckMap function
const stateStart = 'const { state, selectedVoyageId, setSelectedVoyageId, isRedSeaClosed } = usePortFlowData();';
const stateReplace = `const { state, selectedVoyageId, setSelectedVoyageId, isRedSeaClosed } = usePortFlowData();
  const [time, setTime] = useState(0);

  useEffect(() => {
    let animationFrame;
    const start = Date.now();
    const animate = () => {
      setTime((Date.now() - start) / 20); // speed coefficient
      animationFrame = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(animationFrame);
  }, []);`;
content = content.replace(stateStart, stateReplace);

// 3. Add Layers to the layers array
const layersEnd = 'onClick: (info) => {';
// We want to insert layers before or after ArcLayer
// Let's insert them at the start of the layers array
const layersStart = 'const layers = [';
const newLayers = `const layers = [
    // 1. Geopolitical Threat Zone (Red Sea Blockade)
    new ScatterplotLayer({
      id: 'threat-zone',
      data: [{ coordinates: [43.0, 14.0] }], // Gulf of Aden
      getPosition: d => d.coordinates,
      getRadius: d => isRedSeaClosed ? 800000 + Math.sin(time / 10) * 40000 : 0,
      getFillColor: [244, 63, 94, isRedSeaClosed ? 80 : 0],
      getLineColor: [244, 63, 94, isRedSeaClosed ? 200 : 0],
      stroked: true,
      lineWidthMinPixels: 2,
      updateTriggers: {
        getRadius: [isRedSeaClosed, time],
        getFillColor: [isRedSeaClosed],
        getLineColor: [isRedSeaClosed]
      }
    }),

    // 2. 3D Port Volume Pillars
    new ColumnLayer({
      id: 'port-pillars',
      data: state.ports,
      diskResolution: 12,
      radius: 35000,
      extruded: true,
      pickable: true,
      elevationScale: 5,
      getPosition: d => [d.lng, d.lat],
      getFillColor: d => d.legalStatus === 'Compliant' ? [16, 185, 129, 180] : [245, 158, 11, 180],
      getLineColor: [0, 0, 0],
      getElevation: d => d.handlingRate,
      onHover: info => setHoverInfo(info.object ? { ...info, type: 'port', object: { properties: info.object } } : null)
    }),

    // 3. Animated Radar Rings for Ships
    new ScatterplotLayer({
      id: 'ship-radar',
      data: ships,
      getPosition: d => d.coordinates,
      getRadius: d => (time % 100) * 3000,
      getFillColor: d => [52, 211, 153, Math.max(0, 80 - (time % 100))],
      getLineColor: d => [52, 211, 153, Math.max(0, 255 - (time % 100) * 2.5)],
      stroked: true,
      lineWidthMinPixels: 1,
      updateTriggers: {
        getRadius: [time],
        getFillColor: [time],
        getLineColor: [time]
      }
    }),
`;
content = content.replace(layersStart, newLayers);

fs.writeFileSync(filePath, content);
console.log("Updated DeckMap.tsx with 3D layers and animations");
