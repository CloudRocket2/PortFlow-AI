"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  Line,
  Sphere,
  Graticule
} from "react-simple-maps";

const geoUrl = "/world-110m.json";

export default function GlobeWrapper() {
  const [mounted, setMounted] = useState(false);
  const [rotation, setRotation] = useState([-85, -15, 0]);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState([0, 0]);
  const [selectedVessel, setSelectedVessel] = useState<any>(null);
  
  const userInteracted = useRef(false);
  const rotationRef = useRef([-85, -15, 0]);

  useEffect(() => {
    setMounted(true);
    
    // Smoother auto-rotation (30ms = ~33fps)
    const interval = setInterval(() => {
      if (!userInteracted.current) {
        rotationRef.current = [rotationRef.current[0] - 0.2, rotationRef.current[1], rotationRef.current[2]];
        setRotation([...rotationRef.current]);
      }
    }, 30);

    return () => clearInterval(interval);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    userInteracted.current = true;
    setDragStart([e.clientX, e.clientY]);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStart[0];
    const dy = e.clientY - dragStart[1];
    
    // Apply rotation immediately via ref to avoid React state batching lag on fast drags
    rotationRef.current = [
      rotationRef.current[0] + dx * 0.4,
      Math.min(Math.max(rotationRef.current[1] - dy * 0.4, -90), 90),
      rotationRef.current[2]
    ];
    setRotation([...rotationRef.current]);
    setDragStart([e.clientX, e.clientY]);
  };

  const handleMouseUp = () => setIsDragging(false);
  const handleMouseLeave = () => setIsDragging(false);

  const markers = [
    { 
      id: "mv-pacific",
      coordinates: [83.2185, 17.6868], 
      name: "MV PACIFIC HORIZON", 
      type: "ship",
      info: {
        loc: "Vizag Port (IN VTZ)",
        status: "Discharging Cargo",
        cargo: "Coal (120k MT)",
        eta: "Arrived",
        draft: "14.2m (Deep Water)"
      }
    },
    { 
      id: "maersk-sentinel",
      coordinates: [88.0561, 22.0257], 
      name: "MAERSK SENTINEL", 
      type: "ship",
      info: {
        loc: "Approaching Haldia (IN HAL)",
        status: "En Route / Slow Steaming",
        cargo: "Iron Ore (80k MT)",
        eta: "T-Minus 4 Hours",
        draft: "7.8m (Shallow Constraint)"
      }
    },
    { coordinates: [113.2644, 23.1291], name: "GUANGZHOU (AI ROUTE)", type: "dest" },
    { coordinates: [151.7817, -32.9283], name: "NEWCASTLE", type: "dest" },
    { coordinates: [103.8519, 1.2903], name: "SINGAPORE (AI ROUTE)", type: "dest" }
  ];

  // Memoize the map geographies so React doesn't recreate the JSX nodes on every single frame
  const MapGeographies = React.useMemo(() => (
    <Geographies geography={geoUrl}>
      {({ geographies }) =>
        geographies.map((geo) => (
          <Geography
            key={geo.rsmKey}
            geography={geo}
            fill="#111118"
            stroke="#333"
            strokeWidth={0.5}
            style={{
              default: { outline: "none" },
              hover: { outline: "none" },
              pressed: { outline: "none" },
            }}
          />
        ))
      }
    </Geographies>
  ), []);

  if (!mounted) return <div className="w-full h-[400px] xl:h-[430px] bg-[#050505]" />;

  return (
    <div 
      className={`w-full h-[400px] xl:h-[430px] relative bg-[#050505] flex items-center justify-center overflow-hidden ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >
      {/* Top Left Labels */}
      <div className="absolute top-4 left-4 z-10 pointer-events-none">
        <h3 className="text-white font-mono text-sm uppercase tracking-widest font-bold flex items-center gap-2">
          <div className="w-2 h-2 bg-[#00ff00] animate-pulse rounded-full" />
          Global Fleet Radar
        </h3>
        <p className="text-neutral-500 font-mono text-[10px] uppercase tracking-widest mt-1">Multi-Voyage AI Forecasting</p>
        <p className="text-neutral-600 font-mono text-[9px] uppercase tracking-widest mt-1">(Click & Drag to Rotate)</p>
      </div>

      {/* Bottom Left Legend */}
      <div className="absolute bottom-4 left-4 z-10 pointer-events-none bg-black/80 p-3 border border-neutral-800 backdrop-blur-sm">
        <div className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full bg-[#00ff00] animate-pulse" /> Active Vessels (Clickable)
        </div>
        <div className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest flex items-center gap-2 mt-3 pt-2 border-t border-neutral-800">
          <div className="w-4 h-[1px] bg-[#00ff00]" /> Proposed AI Contracts
        </div>
      </div>

      {/* Vessel Info Popup Panel */}
      {selectedVessel && (
        <div className="absolute top-4 right-4 w-64 bg-black/90 border border-[#00ff00]/30 p-3 z-20 shadow-[0_0_15px_rgba(0,255,0,0.1)] backdrop-blur-md">
          <div className="flex justify-between items-start mb-2 border-b border-neutral-800 pb-2">
            <h4 className="text-[#00ff00] font-mono text-xs font-bold tracking-widest">
              {selectedVessel.name}
            </h4>
            <button 
              onClick={(e) => { e.stopPropagation(); setSelectedVessel(null); }}
              className="text-neutral-500 hover:text-white transition-colors text-xs font-mono"
            >
              [X]
            </button>
          </div>
          <div className="space-y-1.5 font-mono text-[9px] text-neutral-300 uppercase tracking-wider">
            <div className="flex justify-between">
              <span className="text-neutral-500">Location:</span>
              <span className="text-right">{selectedVessel.info.loc}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Status:</span>
              <span className="text-right text-[#00ff00]">{selectedVessel.info.status}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Cargo:</span>
              <span className="text-right">{selectedVessel.info.cargo}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Draft:</span>
              <span className="text-right">{selectedVessel.info.draft}</span>
            </div>
            <div className="flex justify-between pt-1 border-t border-neutral-800/50 mt-1">
              <span className="text-neutral-500">ETA:</span>
              <span className="text-right">{selectedVessel.info.eta}</span>
            </div>
          </div>
        </div>
      )}

      {/* SVG Map Engine */}
      <div className="w-full max-w-[600px] aspect-square mx-auto">
        <ComposableMap
          projection="geoOrthographic"
          projectionConfig={{
            rotate: rotation as [number, number, number],
            scale: 220
          }}
          style={{ width: "100%", height: "100%" }}
        >
          {/* Ocean Background */}
          <Sphere id="sphere" stroke="#111" strokeWidth={1} fill="#020202" />
          
          {/* Grid lines */}
          <Graticule stroke="#0a0a0a" strokeWidth={0.5} />
          
          {/* Render Memoized Landmasses */}
          {MapGeographies}

          {/* Vizag to China Trajectory */}
          <Line
            from={[83.2185, 17.6868]}
            to={[113.2644, 23.1291]}
            stroke="#00ff00"
            strokeWidth={1.5}
            strokeLinecap="round"
            style={{ strokeDasharray: "4 4" }}
          />

          {/* Haldia to Singapore Trajectory */}
          <Line
            from={[88.0561, 22.0257]}
            to={[103.8519, 1.2903]}
            stroke="#00ff00"
            strokeWidth={1.5}
            strokeLinecap="round"
            style={{ strokeDasharray: "4 4" }}
          />

          {/* Interactive Markers with Labels */}
          {markers.map((marker) => (
            <Marker key={marker.name} coordinates={marker.coordinates as [number, number]}>
              {marker.type === "ship" && (
                <g 
                  className="pointer-events-auto cursor-pointer"
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    setSelectedVessel(marker); 
                    userInteracted.current = true; // Stop auto-rotate on click
                  }}
                >
                  <circle r={10} fill="transparent" /> {/* Invisible hit area for easier clicking */}
                  <circle r={3} fill="#00ff00" />
                  <circle r={8} fill="#00ff00" opacity={0.3} className="animate-ping" />
                </g>
              )}
              {marker.type === "dest" && (
                <circle r={3} fill="#ffffff" />
              )}
              <text
                textAnchor="middle"
                y={marker.type === "ship" ? -12 : 12}
                style={{
                  fontFamily: "monospace",
                  fontSize: "8px",
                  fill: marker.type === "ship" ? "#00ff00" : "#888",
                  fontWeight: marker.type === "ship" ? "bold" : "normal",
                  letterSpacing: "1px",
                  pointerEvents: "none"
                }}
              >
                {marker.name}
              </text>
            </Marker>
          ))}
        </ComposableMap>
      </div>
    </div>
  );
}
