"use client";

import React, { useState, useEffect } from "react";
import { ComposableMap, Geographies, Geography, Marker, Line, ZoomableGroup } from "react-simple-maps";
import geoJsonData from "../data/countries.json";
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react";

const markers = [
  // Origins
  { id: "newcastle", coordinates: [151.7817, -32.9283], name: "Newcastle", type: "origin", dx: 15, dy: 10, textAnchor: "start" },
  { id: "norfolk", coordinates: [-76.2859, 36.8508], name: "Norfolk", type: "origin", dx: 10, dy: 10, textAnchor: "start" },
  { id: "maputo", coordinates: [32.5892, -25.9692], name: "Maputo", type: "origin", dx: -15, dy: 10, textAnchor: "end" },
  { id: "vladivostok", coordinates: [131.8869, 43.1198], name: "Vladivostok", type: "origin", dx: 15, dy: -10, textAnchor: "start" },
  { id: "kalimantan", coordinates: [116.0385, -0.2787], name: "Kalimantan", type: "origin", dx: 15, dy: 10, textAnchor: "start" },
  
  // Destinations (East Coast India) - REAL COORDINATES
  // Paradip 20.317°N 86.611°E
  { id: "paradip", coordinates: [86.611, 20.317], name: "Paradip", type: "dest", dx: 25, dy: 15, textAnchor: "start" },
  // Vizag 17.686°N 83.218°E
  { id: "vizag", coordinates: [83.218, 17.686], name: "Vizag", type: "dest", dx: -25, dy: -10, textAnchor: "end" },
  // Gangavaram 17.616°N 83.238°E
  { id: "gangavaram", coordinates: [83.238, 17.616], name: "Gangavaram", type: "dest", dx: 25, dy: 15, textAnchor: "start" },
  // Gopalpur 19.281°N 84.906°E
  { id: "gopalpur", coordinates: [84.906, 19.281], name: "Gopalpur", type: "dest", dx: -25, dy: 0, textAnchor: "end" },
  // Dhamra 20.787°N 86.977°E
  { id: "dhamra", coordinates: [86.977, 20.787], name: "Dhamra", type: "dest", dx: -25, dy: -15, textAnchor: "end" },
  // Sagar-Sandheads 21.646°N 88.084°E
  { id: "sagar", coordinates: [88.084, 21.646], name: "Sagar", type: "dest", dx: 30, dy: 0, textAnchor: "start" },
  // Haldia 22.033°N 88.093°E
  { id: "haldia", coordinates: [88.093, 22.033], name: "Haldia", type: "dest", dx: 25, dy: -25, textAnchor: "start" },
];

const arcs = [
  { start: [151.7817, -32.9283], end: [88.084, 21.646], name: "Australia to Sagar" }, // Updated to exact dest coords
  { start: [32.5892, -25.9692], end: [86.611, 20.317], name: "Maputo to Paradip" },
  { start: [131.8869, 43.1198], end: [83.218, 17.686], name: "Russia to Vizag" },
];

export default function GlobeWrapper() {
  const [mounted, setMounted] = useState(false);
  const [hoveredMarker, setHoveredMarker] = useState<string | null>(null);
  
  // Controlled zoom state
  const [position, setPosition] = useState({ coordinates: [90, 15] as [number, number], zoom: 1 });

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleZoomIn = () => {
    if (position.zoom >= 8) return;
    setPosition((pos) => ({ ...pos, zoom: pos.zoom * 1.5 }));
  };

  const handleZoomOut = () => {
    if (position.zoom <= 1) return;
    setPosition((pos) => ({ ...pos, zoom: pos.zoom / 1.5 }));
  };

  const handleReset = () => {
    setPosition({ coordinates: [90, 15], zoom: 1 });
  };

  const handleMoveEnd = (position: { coordinates: [number, number], zoom: number }) => {
    setPosition(position);
  };

  if (!mounted) {
    return <div className="w-full h-full bg-[#020202] flex items-center justify-center animate-pulse text-xs font-mono text-[#00ff00]">Initializing Radar Array...</div>;
  }

  // Hide labels if zoom is below 3 (unless hovered)
  const SHOW_LABELS_ZOOM_THRESHOLD = 3;
  const isZoomedIn = position.zoom >= SHOW_LABELS_ZOOM_THRESHOLD;

  return (
    <div className="w-full h-full relative bg-[#000000] rounded-xl overflow-hidden shadow-[inset_0_0_50px_rgba(0,255,0,0.05)] border border-[#111111]">
      {/* Zoom / Pan Controls */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        <button 
          onClick={handleZoomIn}
          className="bg-neutral-900/80 border border-neutral-700 text-neutral-300 p-2 hover:bg-neutral-800 hover:text-white transition-colors"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button 
          onClick={handleZoomOut}
          className="bg-neutral-900/80 border border-neutral-700 text-neutral-300 p-2 hover:bg-neutral-800 hover:text-white transition-colors"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button 
          onClick={handleReset}
          className="bg-neutral-900/80 border border-neutral-700 text-neutral-300 p-2 hover:bg-neutral-800 hover:text-white transition-colors"
          title="Reset View"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Radar grid overlay */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, #00ff00 1px, transparent 1px),
            linear-gradient(to bottom, #00ff00 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />
      
      {/* Radar scanning sweep */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="w-[200%] h-[200%] absolute top-[-50%] left-[-50%] border-r-[2px] border-[#00ff00]/40 rotate-180 animate-spin-slow origin-center" 
             style={{ 
               animationDuration: '10s', 
               background: 'conic-gradient(from 0deg, transparent 0deg, transparent 270deg, rgba(0,255,0,0.2) 360deg)' 
             }} 
        />
      </div>

      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 350,
        }}
        style={{ width: "100%", height: "100%" }}
      >
        <ZoomableGroup 
          zoom={position.zoom}
          center={position.coordinates}
          onMoveEnd={handleMoveEnd}
          maxZoom={12}
        >
          <Geographies geography={geoJsonData}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="#111111"
                  stroke="#333333"
                  strokeWidth={0.5 / position.zoom} // keep stroke consistent on zoom
                  style={{
                    default: { outline: "none" },
                    hover: { fill: "#1a1a1a", outline: "none" },
                    pressed: { outline: "none" },
                  }}
                />
              ))
            }
          </Geographies>

          {/* Draw shipping lanes */}
          {arcs.map((arc, i) => (
            <Line
              key={`line-${i}`}
              from={arc.start as [number, number]}
              to={arc.end as [number, number]}
              stroke="#00ff00"
              strokeWidth={1 / position.zoom}
              strokeOpacity={0.4}
              strokeDasharray={`${4 / position.zoom} ${4 / position.zoom}`}
              className="animate-pulse"
            />
          ))}

          {/* Draw markers and labels */}
          {markers.map((marker) => {
            const isHovered = hoveredMarker === marker.id;
            // Only show the label if we are zoomed in enough, OR if the user is hovering over the marker
            const shouldShowLabel = isZoomedIn || isHovered;

            return (
              <Marker 
                key={marker.id} 
                coordinates={marker.coordinates as [number, number]}
                onMouseEnter={() => setHoveredMarker(marker.id)}
                onMouseLeave={() => setHoveredMarker(null)}
              >
                <circle 
                  r={isHovered ? (6 / position.zoom) : (4 / position.zoom)} 
                  fill={marker.type === "dest" ? "#00ff00" : "#aaaaaa"} 
                  className="transition-all duration-300 cursor-pointer"
                />
                
                {/* Pulsing ring for destinations */}
                {marker.type === "dest" && (
                  <circle 
                    r={10 / position.zoom} 
                    fill="none" 
                    stroke="#00ff00" 
                    strokeWidth={1 / position.zoom} 
                    className="animate-ping pointer-events-none"
                    style={{ animationDuration: '3s' }}
                  />
                )}
                
                {/* Label with leader line */}
                <g 
                  className="pointer-events-none transition-opacity duration-300"
                  style={{ opacity: shouldShowLabel ? 1 : 0 }}
                >
                  <line 
                    x1={0} 
                    y1={0} 
                    x2={marker.dx / position.zoom * 0.9} 
                    y2={marker.dy / position.zoom * 0.9} 
                    stroke={marker.type === "dest" ? "#00ff00" : "#555555"} 
                    strokeWidth={1 / position.zoom} 
                    opacity={0.6} 
                  />
                  <text
                    textAnchor={marker.textAnchor as "start" | "middle" | "end"}
                    x={marker.dx / position.zoom}
                    y={marker.dy / position.zoom}
                    style={{
                      fontFamily: "monospace",
                      fill: marker.type === "dest" ? "#ffffff" : "#aaaaaa",
                      fontSize: `${(isHovered ? 13 : 11) / Math.max(1, position.zoom * 0.5)}px`,
                      fontWeight: isHovered ? "bold" : "normal",
                      textShadow: "1px 1px 2px black, -1px -1px 2px black, 0px 0px 4px black",
                      transition: "all 0.2s ease-in-out",
                    }}
                  >
                    {marker.name}
                  </text>
                </g>
              </Marker>
            );
          })}
        </ZoomableGroup>
      </ComposableMap>
      
      {/* Decorative corners */}
      <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-[#00ff00]/50" />
      <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-[#00ff00]/50" />
      <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-[#00ff00]/50" />
      
      <div className="absolute bottom-4 left-8 text-[#00ff00]/70 font-mono text-[10px] uppercase tracking-widest flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-[#00ff00] animate-pulse" />
        Live Tracking: {markers.length} Terminals
      </div>
      
      {!isZoomedIn && (
        <div className="absolute bottom-8 left-8 text-neutral-500 font-mono text-[9px] uppercase tracking-widest">
          (Zoom in or hover to view terminal identities)
        </div>
      )}
    </div>
  );
}
