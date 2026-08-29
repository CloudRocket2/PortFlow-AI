"use client";

import React, { useState, useEffect } from "react";
import { ComposableMap, Geographies, Geography, Marker, Line, ZoomableGroup } from "react-simple-maps";
import geoJsonData from "../data/countries.json";
import { ZoomIn, ZoomOut, RotateCcw, X, Anchor, ShieldAlert, Ship } from "lucide-react";
import { ORIGIN_PORTS, INDIAN_EAST_COAST_PORTS } from "../lib/maritime-data";

// Extract origin markers
const originMarkers = Object.entries(ORIGIN_PORTS).map(([id, data]) => ({
  id,
  coordinates: data.coordinates,
  name: data.name,
  type: "origin",
  data
}));

// Extract destination markers
const destMarkers = Object.entries(INDIAN_EAST_COAST_PORTS).map(([id, data]) => ({
  id,
  coordinates: data.coordinates,
  name: data.name,
  type: "dest",
  data
}));

const allMarkers = [...originMarkers, ...destMarkers];

// Realistic paths (waypoints to avoid landmasses where simple lines cross)
// Coordinates format: [longitude, latitude]
const routes = [
  {
    id: "russia-vizag", origin: "Russia", destination: "Vizag", color: "#ff3333",
    waypoints: [
      ORIGIN_PORTS["Russia"].coordinates,
      [129.0, 34.0], // Sea of Japan
      [120.0, 20.0], // South China Sea
      [104.0, 1.5],  // Malacca
      INDIAN_EAST_COAST_PORTS["Vizag"].coordinates
    ]
  },
  {
    id: "aus-sagar", origin: "Australia", destination: "Sagar", color: "#00ff00",
    waypoints: [
      ORIGIN_PORTS["Australia"].coordinates,
      [153.0, -20.0], // Coral Sea
      [142.0, -10.0], // Torres Strait
      [115.0, -8.0], // South of Java
      INDIAN_EAST_COAST_PORTS["Sagar-Sandheads"].coordinates
    ]
  },
  {
    id: "indo-paradip", origin: "Indonesia", destination: "Paradip", color: "#00ff00",
    waypoints: [
      ORIGIN_PORTS["Indonesia"].coordinates,
      [104.0, 1.5], // Malacca
      INDIAN_EAST_COAST_PORTS["Paradip"].coordinates
    ]
  },
  {
    id: "moz-gangavaram", origin: "Mozambique", destination: "Gangavaram", color: "#00ff00",
    waypoints: [
      ORIGIN_PORTS["Mozambique"].coordinates,
      [50.0, -15.0], // Madagascar North
      [75.0, 0.0], // Maldives
      INDIAN_EAST_COAST_PORTS["Gangavaram"].coordinates
    ]
  },
  {
    id: "us-haldia", origin: "US", destination: "Haldia", color: "#00ff00",
    waypoints: [
      ORIGIN_PORTS["US"].coordinates,
      [-30.0, 35.0], // Atlantic
      [-5.0, 36.0], // Gibraltar
      [15.0, 35.0], // Med
      [32.0, 31.0], // Suez
      [43.0, 12.0], // Bab el Mandeb
      [60.0, 15.0], // Arabian Sea
      INDIAN_EAST_COAST_PORTS["Haldia"].coordinates
    ]
  }
];

const ships = [
  { id: "ship1", name: "MV Oceanic", vesselType: "Capesize", coords: [104.0, 1.5], route: "Vladivostok → Vizag", heading: 270, cargo: "Coal", eta: "Nov 12", type: "ship" },
  { id: "ship2", name: "MV Iron Maiden", vesselType: "Panamax", coords: [50.0, -15.0], route: "Maputo → Gangavaram", heading: 45, cargo: "Iron Ore", eta: "Nov 15", type: "ship" },
  { id: "ship3", name: "MV Pacific", vesselType: "Supramax", coords: [-5.0, 36.0], route: "Norfolk → Haldia", heading: 90, cargo: "Thermal Coal", eta: "Nov 22", type: "ship" },
  { id: "ship4", name: "MV Asian", vesselType: "Panamax", coords: [115.0, -8.0], route: "Newcastle → Sagar", heading: 300, cargo: "Coking Coal", eta: "Nov 10", type: "ship" },
  { id: "ship5", name: "MV Nusantara", vesselType: "Supramax", coords: [95.0, 10.0], route: "Kalimantan → Paradip", heading: 320, cargo: "Thermal Coal", eta: "Nov 08", type: "ship" }
];

export default function GlobeWrapper() {
  const [mounted, setMounted] = useState(false);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<any | null>(null);
  
  // Controlled zoom state - initialize wider to see origins
  const [position, setPosition] = useState({ coordinates: [80, 20] as [number, number], zoom: 2 });

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleZoomIn = () => {
    if (position.zoom >= 12) return;
    setPosition((pos) => ({ ...pos, zoom: pos.zoom * 1.5 }));
  };

  const handleZoomOut = () => {
    if (position.zoom <= 1) return;
    setPosition((pos) => ({ ...pos, zoom: pos.zoom / 1.5 }));
  };

  const handleReset = () => {
    setPosition({ coordinates: [80, 20], zoom: 2 });
  };

  const handleMoveEnd = (pos: { coordinates: [number, number], zoom: number }) => {
    setPosition(pos);
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
          className="p-2 bg-neutral-900/80 border border-neutral-700 text-neutral-400 hover:text-white hover:border-[#00ff00] transition-colors rounded shadow-lg"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button 
          onClick={handleReset}
          className="p-2 bg-neutral-900/80 border border-neutral-700 text-neutral-400 hover:text-white hover:border-[#00ff00] transition-colors rounded shadow-lg"
          title="Reset View"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
        <button 
          onClick={handleZoomOut}
          className="p-2 bg-neutral-900/80 border border-neutral-700 text-neutral-400 hover:text-white hover:border-[#00ff00] transition-colors rounded shadow-lg"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
      </div>

      {/* Selected Node Details Popup */}
      {selectedNode && (
        <div className="absolute top-4 left-4 z-20 w-72 bg-black/90 border border-[#00ff00]/40 p-4 shadow-2xl backdrop-blur-md">
          <div className="flex justify-between items-start mb-3 border-b border-neutral-800 pb-2">
            <div>
              <h3 className="text-white font-mono font-bold uppercase tracking-wider">{selectedNode.name}</h3>
              <p className="text-[#00ff00] text-[10px] font-mono uppercase tracking-widest mt-1">
                {selectedNode.type === "ship" ? "Vessel in Transit" : selectedNode.data?.region}
              </p>
            </div>
            <button onClick={() => setSelectedNode(null)} className="text-neutral-500 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <div className="space-y-2 text-xs font-mono text-neutral-300">
            {selectedNode.type === "dest" && selectedNode.data && (
              <>
                <div className="flex justify-between border-b border-neutral-900 pb-1"><span>Max Draft:</span> <span className="text-white">{selectedNode.data.maxDraftMeters}m</span></div>
                <div className="flex justify-between border-b border-neutral-900 pb-1"><span>Max LOA:</span> <span className="text-white">{selectedNode.data.maxLoaMeters}m</span></div>
                <div className="flex justify-between border-b border-neutral-900 pb-1"><span>Beam:</span> <span className="text-white">{selectedNode.data.maxBeamMeters}m</span></div>
                <div className="flex justify-between border-b border-neutral-900 pb-1"><span>Handling Rate:</span> <span className="text-white">{selectedNode.data.cargoHandlingRateTpd} TPD</span></div>
                {selectedNode.data.cycloneWarning && (
                  <div className="flex items-center gap-1 text-red-500 mt-2 bg-red-500/10 p-1 border border-red-500/30">
                    <ShieldAlert className="w-3 h-3" /> ACTIVE WEATHER THREAT
                  </div>
                )}
              </>
            )}
            {selectedNode.type === "origin" && selectedNode.data && (
              <>
                <div className="flex justify-between border-b border-neutral-900 pb-1"><span>Handling Rate:</span> <span className="text-white">{selectedNode.data.cargoHandlingRateTpd} TPD</span></div>
                <div className="flex justify-between border-b border-neutral-900 pb-1"><span>Status:</span> <span className="text-[#00ff00]">Loading Active</span></div>
              </>
            )}
            {selectedNode.type === "ship" && (
              <>
                <div className="flex justify-between border-b border-neutral-900 pb-1"><span>Type:</span> <span className="text-white">{selectedNode.vesselType}</span></div>
                <div className="flex justify-between border-b border-neutral-900 pb-1"><span>Route:</span> <span className="text-[#00ff00]">{selectedNode.route}</span></div>
                <div className="flex justify-between border-b border-neutral-900 pb-1"><span>Cargo:</span> <span className="text-white">{selectedNode.cargo}</span></div>
                <div className="flex justify-between border-b border-neutral-900 pb-1"><span>ETA:</span> <span className="text-white">{selectedNode.eta}</span></div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Map Content */}
      <ComposableMap 
        projection="geoMercator" 
        projectionConfig={{ scale: 150 }}
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
                  stroke="#222222" 
                  strokeWidth={0.5 / position.zoom}
                  style={{
                    default: { outline: "none" },
                    hover: { fill: "#1a1a1a", outline: "none" },
                    pressed: { outline: "none" }
                  }}
                />
              ))
            }
          </Geographies>

          {/* Waypoint Routes */}
          {routes.map((route, i) => {
            // Draw lines between each waypoint sequentially
            const lines = [];
            for (let w = 0; w < route.waypoints.length - 1; w++) {
              lines.push(
                <Line
                  key={`${route.id}-${w}`}
                  from={route.waypoints[w] as [number, number]}
                  to={route.waypoints[w+1] as [number, number]}
                  stroke={route.color}
                  strokeWidth={1 / position.zoom}
                  strokeDasharray={`${3 / position.zoom} ${2 / position.zoom}`}
                  style={{ opacity: 0.6 }}
                />
              );
            }
            return <React.Fragment key={route.id}>{lines}</React.Fragment>;
          })}

          {/* Port Markers */}
          {allMarkers.map((marker) => {
            const isHovered = hoveredNode === marker.id;
            const isSelected = selectedNode?.id === marker.id;
            const shouldShowLabel = isZoomedIn || isHovered || isSelected;

            return (
              <Marker 
                key={marker.id} 
                coordinates={marker.coordinates as [number, number]}
                onMouseEnter={() => setHoveredNode(marker.id)}
                onMouseLeave={() => setHoveredNode(null)}
                onClick={() => setSelectedNode(marker)}
              >
                <circle 
                  r={(isHovered || isSelected ? 6 : 4) / position.zoom} 
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
                
                {/* Label */}
                <g 
                  className="pointer-events-none transition-opacity duration-300"
                  style={{ opacity: shouldShowLabel ? 1 : 0 }}
                >
                  <text
                    textAnchor="middle"
                    y={-10 / position.zoom}
                    style={{
                      fontFamily: "monospace",
                      fill: marker.type === "dest" ? "#ffffff" : "#aaaaaa",
                      fontSize: `${(isHovered || isSelected ? 13 : 11) / Math.max(1, position.zoom * 0.5)}px`,
                      fontWeight: isHovered || isSelected ? "bold" : "normal",
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

          {/* Ships in Transit */}
          {ships.map((ship) => {
            const isHovered = hoveredNode === ship.id;
            const isSelected = selectedNode?.id === ship.id;
            const shouldShowLabel = isZoomedIn || isHovered || isSelected;
            
            return (
              <Marker 
                key={ship.id} 
                coordinates={ship.coords as [number, number]}
                onMouseEnter={() => setHoveredNode(ship.id)}
                onMouseLeave={() => setHoveredNode(null)}
                onClick={() => setSelectedNode(ship)}
              >
                {/* Rotate the icon based on heading */}
                <g transform={`rotate(${ship.heading})`} className="cursor-pointer">
                  <path 
                    d="M-4,-2 L0,-6 L4,-2 L3,5 L-3,5 Z" 
                    fill="#00ffff" 
                    stroke="#000"
                    strokeWidth={0.5 / position.zoom}
                    transform={`scale(${1.5 / position.zoom})`}
                  />
                </g>

                <g 
                  className="pointer-events-none transition-opacity duration-300"
                  style={{ opacity: shouldShowLabel ? 1 : 0 }}
                >
                  <text
                    textAnchor="middle"
                    y={15 / position.zoom}
                    style={{
                      fontFamily: "monospace",
                      fill: "#00ffff",
                      fontSize: `${9 / Math.max(1, position.zoom * 0.5)}px`,
                      textShadow: "1px 1px 2px black, -1px -1px 2px black, 0px 0px 4px black",
                    }}
                  >
                    {ship.name}
                  </text>
                </g>
              </Marker>
            );
          })}
        </ZoomableGroup>
      </ComposableMap>
      
      {/* Decorative corners */}
      <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-[#00ff00]/50 pointer-events-none" />
      <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-[#00ff00]/50 pointer-events-none" />
      <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-[#00ff00]/50 pointer-events-none" />
      
      <div className="absolute bottom-4 left-8 text-[#00ff00]/70 font-mono text-[10px] uppercase tracking-widest flex items-center gap-2 pointer-events-none">
        <div className="w-1.5 h-1.5 rounded-full bg-[#00ff00] animate-pulse" />
        Live Tracking: {allMarkers.length + ships.length} Entities
      </div>
      
      {!isZoomedIn && !selectedNode && (
        <div className="absolute bottom-8 left-8 text-neutral-500 font-mono text-[9px] uppercase tracking-widest pointer-events-none">
          (Scroll to zoom. Click terminals or vessels for details)
        </div>
      )}
    </div>
  );
}
