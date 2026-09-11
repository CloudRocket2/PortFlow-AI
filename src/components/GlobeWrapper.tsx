"use client";

import React, { useState, useEffect, useMemo } from "react";
import { ComposableMap, Geographies, Geography, Marker, Line, ZoomableGroup } from "react-simple-maps";
import geoJsonData from "../data/countries.json";
import { ZoomIn, ZoomOut, RotateCcw, X, Anchor, ShieldAlert, Ship, Search } from "lucide-react";
import { usePortFlowData } from "@/context/PortFlowContext";

// Pre-calculated intermediate waypoints so lines don't cross landmasses
const WAYPOINTS: Record<string, [number, number][]> = {
  "Vladivostok, Russia": [[129.0, 34.0], [120.0, 20.0], [104.0, 1.5]],
  "Newcastle, Australia": [[153.0, -20.0], [142.0, -10.0], [115.0, -8.0]],
  "Kalimantan, Indonesia": [[104.0, 1.5]],
  "Maputo, Mozambique": [[50.0, -15.0], [75.0, 0.0]],
  "Norfolk, US": [[-30.0, 35.0], [-5.0, 36.0], [15.0, 35.0], [32.0, 31.0], [43.0, 12.0], [60.0, 15.0]]
};

export default function GlobeWrapper() {
  const { state, selectedVoyageId, setSelectedVoyageId } = usePortFlowData();
  
  const [mounted, setMounted] = useState(false);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedPortId, setSelectedPortId] = useState<string | null>(null);
  
  // Controlled zoom state - initialize wider to see origins
  const [position, setPosition] = useState({ coordinates: [80, 20] as [number, number], zoom: 2 });

  useEffect(() => {
    setMounted(true);
  }, []);

  // Map state to markers
  const markers = useMemo(() => {
    return state.ports.map(p => ({
      id: p.id,
      coordinates: [p.lng, p.lat] as [number, number],
      name: p.name,
      type: p.type.toLowerCase(),
      legalStatus: p.legalStatus,
      legalIssues: p.legalIssues
    }));
  }, [state.ports]);

  // Map state to routes
  const mapRoutes = useMemo(() => {
    return state.contracts.map(c => {
      const route = state.routes.find(r => r.id === c.routeId);
      if (!route) return null;
      
      const origin = state.ports.find(p => p.id === route.originId);
      const dest = state.ports.find(p => p.id === route.destinationId);
      if (!origin || !dest) return null;

      const vessel = state.vessels.find(v => v.id === route.vesselId);

      const intermediate = WAYPOINTS[origin.name] || [];
      const isSelected = selectedVoyageId === c.id;

      return {
        id: c.id,
        contractId: c.id,
        vesselName: vessel?.name,
        cargo: route.cargo,
        eta: route.eta,
        originName: origin.name,
        destName: dest.name,
        waypoints: [[origin.lng, origin.lat] as [number, number], ...intermediate, [dest.lng, dest.lat] as [number, number]],
        color: isSelected ? "var(--route-active)" : c.status === "AI Executed" ? "var(--route-active)" : "var(--route-idle)",
        isSelected
      };
    }).filter(Boolean) as any[];
  }, [state.contracts, state.routes, state.ports, state.vessels, selectedVoyageId]);

  // Derived ships based on routes
  const ships = useMemo(() => {
    return mapRoutes.map((r, i) => {
      // Pick a midpoint or first waypoint for the ship
      const shipCoord = r.waypoints.length > 2 ? r.waypoints[1] : [
        (r.waypoints[0][0] + r.waypoints[1][0]) / 2,
        (r.waypoints[0][1] + r.waypoints[1][1]) / 2
      ];
      
      return {
        id: `ship-${r.id}`,
        contractId: r.contractId,
        name: r.vesselName,
        coords: shipCoord as [number, number],
        routeStr: `${r.originName} -> ${r.destName}`,
        cargo: r.cargo,
        eta: r.eta,
        isSelected: r.isSelected
      };
    });
  }, [mapRoutes]);

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

  const handleMoveEnd = (pos: { coordinates: [number, number]; zoom: number }) => {
    let [lng, lat] = pos.coordinates;
    lng = Math.max(-180, Math.min(180, lng));
    lat = Math.max(-80, Math.min(80, lat));
    setPosition({ coordinates: [lng, lat], zoom: pos.zoom });
  };

  if (!mounted) {
    return <div className="w-full h-full bg-[#020202] flex items-center justify-center animate-pulse text-sm font-mono text-cyan-400">Initializing Radar Array...</div>;
  }

  const SHOW_LABELS_ZOOM_THRESHOLD = 3;
  const isZoomedIn = position.zoom >= SHOW_LABELS_ZOOM_THRESHOLD;

  // Selected Node can be derived from selectedVoyageId
  const selectedRouteInfo = mapRoutes.find(r => r.isSelected);
  const selectedShipInfo = ships.find(s => s.isSelected);

  const selectedPortInfo = markers.find(m => m.id === selectedPortId);

  return (
    <div className="w-full h-full relative bg-black rounded-xl overflow-hidden shadow-inner border border-[#111111] group">
      
      
      {/* Search Toggle Button */}
      <button 
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className={`absolute top-4 left-4 z-20 bg-neutral-900/90 backdrop-blur border ${isSidebarOpen ? 'border-cyan-500/50 text-cyan-400' : 'border-neutral-800 text-neutral-400'} hover:text-cyan-400 hover:border-cyan-500/50 rounded-lg p-2.5 shadow-xl transition-all focus-ring focus:outline-none`}
        title="Toggle Tracked Vessels"
      >
        <Search className="w-5 h-5" />
      </button>

      {/* Slide-out Panel */}
      <div 
        className={`absolute top-4 left-[3.5rem] z-10 w-64 flex flex-col gap-2 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] origin-left ${
          isSidebarOpen ? "translate-x-0 opacity-100 scale-100" : "-translate-x-4 opacity-0 scale-95 pointer-events-none"
        }`}
      >
        {/* Search & Filter Bar */}
        <div className="w-full bg-neutral-900/90 backdrop-blur border border-neutral-800 rounded-lg p-2.5 shadow-xl flex items-center gap-2">
          <input 
            type="text" 
            placeholder="Search vessels or ports..." 
            className="bg-transparent border-none text-sm text-white w-full focus:outline-none placeholder-neutral-600"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Persistent Legend / Mini Side-List */}
        <div className="w-full max-h-[400px] overflow-y-auto bg-neutral-900/90 backdrop-blur border border-neutral-800 rounded-lg p-3 shadow-xl flex flex-col gap-2 minimal-scrollbar">
          <h3 className="text-xs font-mono uppercase text-neutral-500 mb-2">Tracked Vessels</h3>
          {ships.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase())).map(ship => (
            <div 
              key={ship.id}
              onClick={() => {
                setSelectedVoyageId(ship.contractId);
                setPosition({ coordinates: ship.coords, zoom: 4 });
              }}
              className={`p-2 rounded cursor-pointer transition-colors text-sm ${ship.isSelected ? 'bg-cyan-500/20 text-cyan-400' : 'bg-black/50 text-neutral-300 hover:bg-neutral-800'}`}
            >
              <div className="font-semibold">{ship.name}</div>
              <div className="text-xs text-neutral-500">{ship.routeStr}</div>
            </div>
          ))}
          {ships.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
            <div className="text-sm text-neutral-500 text-center py-4">No vessels found.</div>
          )}
        </div>
      </div>

      {/* Live Entity Badge (Unobtrusive) */}
      <div className="absolute bottom-4 right-4 z-10 bg-black/60 backdrop-blur border border-cyan-500/30 px-3 py-1.5 rounded-full flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
        <span className="text-xs font-mono text-cyan-400">LIVE TRACKING: {ships.length} VESSELS</span>
      </div>

      {/* Zoom / Pan Controls (moved down to avoid overlap with popup) */}
      <div className="absolute bottom-16 right-4 z-10 flex flex-col gap-2">
        <button 
          onClick={handleZoomIn}
          className="p-2 bg-neutral-900/80 border border-neutral-700 text-neutral-400 hover:text-white hover:border-cyan-400 transition-colors rounded shadow-lg"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button 
          onClick={handleReset}
          className="p-2 bg-neutral-900/80 border border-neutral-700 text-neutral-400 hover:text-white hover:border-cyan-400 transition-colors rounded shadow-lg"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
        <button 
          onClick={handleZoomOut}
          className="p-2 bg-neutral-900/80 border border-neutral-700 text-neutral-400 hover:text-white hover:border-cyan-400 transition-colors rounded shadow-lg"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
      </div>

      {/* Docked Detail Panel for Selected Port */}
      {selectedPortInfo && (
        <div className="absolute top-4 right-4 z-20 w-80 bg-neutral-900 border border-cyan-500/50 rounded-xl p-5 shadow-2xl animate-slide-in">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Anchor className="w-5 h-5 text-cyan-400" />
              {selectedPortInfo.name}
            </h3>
            <button onClick={() => setSelectedPortId(null)} className="text-neutral-500 hover:text-white"><X className="w-4 h-4" /></button>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between border-b border-neutral-800 pb-2">
              <span className="text-xs text-neutral-500 uppercase font-mono">Type</span>
              <span className="text-sm text-neutral-300 capitalize">{selectedPortInfo.type}</span>
            </div>
            <div className="flex justify-between border-b border-neutral-800 pb-2">
              <span className="text-xs text-neutral-500 uppercase font-mono">Status</span>
              <span className={`text-sm font-mono ${selectedPortInfo.legalStatus !== 'Compliant' ? 'text-amber-400' : 'text-emerald-400'}`}>
                {selectedPortInfo.legalStatus || 'Compliant'}
              </span>
            </div>
            {selectedPortInfo.legalIssues && selectedPortInfo.legalIssues.length > 0 && (
              <div className="flex flex-col border-b border-neutral-800 pb-2">
                <span className="text-xs text-neutral-500 uppercase font-mono mb-1">Active Issues</span>
                <ul className="text-xs text-neutral-300 list-disc list-inside">
                  {selectedPortInfo.legalIssues.map((issue, i) => (
                    <li key={i} className="truncate" title={issue}>{issue}</li>
                  ))}
                </ul>
              </div>
            )}
            <div className="flex justify-between border-b border-neutral-800 pb-2">
              <span className="text-xs text-neutral-500 uppercase font-mono">Coordinates</span>
              <span className="text-sm text-cyan-400 font-mono">
                {selectedPortInfo.coordinates[1].toFixed(2)}&deg;N, {selectedPortInfo.coordinates[0].toFixed(2)}&deg;E
              </span>
            </div>
          </div>
        </div>
      )}

      {/* The Map */}
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ scale: 140 }}
        style={{ width: "100%", height: "100%", outline: "none" }}
      >
        <ZoomableGroup 
          zoom={position.zoom} 
          center={position.coordinates} 
          onMoveEnd={handleMoveEnd}
          minZoom={1}
          maxZoom={12}
        >
          <Geographies geography={geoJsonData}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="var(--map-fill)"
                  stroke="var(--map-stroke)"
                  strokeWidth={0.5}
                  style={{
                    default: { outline: "none" },
                    hover: { fill: "var(--map-hover)", outline: "none" },
                    pressed: { fill: "var(--map-hover)", outline: "none" },
                  }}
                />
              ))
            }
          </Geographies>

          {/* Render Routes */}
          {mapRoutes.map((r) => {
            const lines = [];
            for (let i = 0; i < r.waypoints.length - 1; i++) {
              lines.push(
                <Line
                  key={`${r.id}-line-${i}`}
                  from={r.waypoints[i]}
                  to={r.waypoints[i + 1]}
                  stroke={r.color}
                  strokeWidth={r.isSelected ? 2 : 1}
                  strokeLinecap="round"
                  style={{ pointerEvents: "none", opacity: r.isSelected ? 1 : 0.3 }}
                />
              );
            }
            return <React.Fragment key={r.id}>{lines}</React.Fragment>;
          })}

          {/* Render Ports */}
          {markers.map((marker) => {
            const isHovered = hoveredNode === marker.id;
            const hasIssue = marker.legalStatus && marker.legalStatus !== "Compliant";
            const iconColor = hasIssue ? "#f59e0b" : "var(--route-active)";

            return (
              <Marker 
                key={marker.id} 
                coordinates={marker.coordinates}
                onMouseEnter={() => setHoveredNode(marker.id)}
                onMouseLeave={() => setHoveredNode(null)}
                onClick={() => setSelectedPortId(marker.id)}
                className="cursor-pointer"
              >
                <circle r={2.5 / position.zoom} fill={iconColor} className={hasIssue ? "animate-pulse" : ""} />
                <circle r={8 / position.zoom} fill="transparent" stroke={iconColor} strokeWidth={0.5 / position.zoom} opacity={0.5} />
                
                {hasIssue && isHovered && (
                  <g transform={`translate(${10 / position.zoom}, ${-10 / position.zoom})`}>
                    <ShieldAlert color="#f59e0b" size={16 / position.zoom} />
                  </g>
                )}

                {(isHovered || isZoomedIn || selectedPortId === marker.id) && (() => {
                  const isGangavaram = marker.name.includes("Gangavaram");
                  const yOffset = isGangavaram ? (12 / position.zoom) : (-12 / position.zoom);
                  
                  return (
                    <text
                      textAnchor="middle"
                      y={yOffset}
                      style={{
                        fontFamily: "monospace",
                        fontSize: `${10 / position.zoom}px`,
                        fill: "var(--map-text)",
                        pointerEvents: "none",
                        textShadow: "0 2px 4px rgba(0,0,0,0.8)"
                      }}
                    >
                      {marker.name}
                    </text>
                  );
                })()}
              </Marker>
            );
          })}

          {/* Render Ships */}
          {ships.map((ship) => {
            const isHovered = hoveredNode === ship.id;
            const isSelected = ship.isSelected;
            return (
              <Marker 
                key={ship.id} 
                coordinates={ship.coords}
                onMouseEnter={() => setHoveredNode(ship.id)}
                onMouseLeave={() => setHoveredNode(null)}
                onClick={() => setSelectedVoyageId(isSelected ? null : ship.contractId)}
                className="cursor-pointer outline-none"
              >
                <g transform={`translate(${-6 / position.zoom}, ${-6 / position.zoom})`}>
                  <Ship 
                    color={isSelected ? "var(--map-text)" : isHovered ? "var(--route-active)" : "var(--map-stroke)"} 
                    size={12 / position.zoom} 
                  />
                </g>
                
                {(isHovered || isSelected) && (
                  <text
                    textAnchor="middle"
                    y={14 / position.zoom}
                    style={{
                      fontFamily: "monospace",
                      fontSize: `${8 / position.zoom}px`,
                      fill: isSelected ? "var(--route-active)" : "var(--map-text)",
                      pointerEvents: "none",
                      textShadow: "0 1px 2px rgba(0,0,0,0.9)"
                    }}
                  >
                    {ship.name}
                  </text>
                )}
              </Marker>
            );
          })}

        </ZoomableGroup>
      </ComposableMap>
    </div>
  );
}
