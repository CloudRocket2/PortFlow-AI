"use client";

import React, { useState, useEffect } from "react";
import { ComposableMap, Geographies, Geography, Marker, Line } from "react-simple-maps";
import geoJsonData from "../data/countries.json";

const markers = [
  // Origins
  { id: "newcastle", coordinates: [151.7817, -32.9283], name: "Newcastle", type: "origin", dx: 15, dy: 10, textAnchor: "start" },
  { id: "norfolk", coordinates: [-76.2859, 36.8508], name: "Norfolk", type: "origin", dx: 10, dy: 10, textAnchor: "start" },
  { id: "maputo", coordinates: [32.5892, -25.9692], name: "Maputo", type: "origin", dx: -15, dy: 10, textAnchor: "end" },
  { id: "vladivostok", coordinates: [131.8869, 43.1198], name: "Vladivostok", type: "origin", dx: 15, dy: -10, textAnchor: "start" },
  { id: "kalimantan", coordinates: [116.0385, -0.2787], name: "Kalimantan", type: "origin", dx: 15, dy: 10, textAnchor: "start" },
  
  // Destinations (East Coast India)
  // Geographically spacing them out using dx, dy offsets and leader lines
  { id: "haldia", coordinates: [88.5, 22.8], name: "Haldia", type: "dest", dx: 25, dy: -25, textAnchor: "start" },
  { id: "sagar", coordinates: [88.03, 21.65], name: "Sagar", type: "dest", dx: 30, dy: 0, textAnchor: "start" },
  { id: "dhamra", coordinates: [87.2, 20.81], name: "Dhamra", type: "dest", dx: -30, dy: -20, textAnchor: "end" },
  { id: "paradip", coordinates: [86.68, 20.26], name: "Paradip", type: "dest", dx: 25, dy: 15, textAnchor: "start" },
  { id: "gopalpur", coordinates: [84.9, 19.3], name: "Gopalpur", type: "dest", dx: -35, dy: 5, textAnchor: "end" },
  { id: "vizag", coordinates: [83.21, 17.68], name: "Vizag", type: "dest", dx: 30, dy: 10, textAnchor: "start" },
  { id: "gangavaram", coordinates: [82.5, 17.0], name: "Gangavaram", type: "dest", dx: -30, dy: 25, textAnchor: "end" },
];

const arcs = [
  { start: [151.7817, -32.9283], end: [88.0333, 21.6500], name: "Australia to Sagar" },
  { start: [32.5892, -25.9692], end: [86.6833, 20.2667], name: "Maputo to Paradip" },
  { start: [131.8869, 43.1198], end: [83.2185, 17.6868], name: "Russia to Vizag" },
];

export default function GlobeWrapper() {
  const [mounted, setMounted] = useState(false);
  const [hoveredMarker, setHoveredMarker] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-full h-full bg-[#020202] flex items-center justify-center animate-pulse text-xs font-mono text-[#00ff00]">Initializing Radar Array...</div>;
  }

  return (
    <div className="w-full h-full relative bg-[#000000] rounded-xl overflow-hidden shadow-[inset_0_0_50px_rgba(0,255,0,0.05)] border border-[#111111]">
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
          center: [90, 15] // Centered on Indian Ocean / Bay of Bengal
        }}
        style={{ width: "100%", height: "100%" }}
      >
        <Geographies geography={geoJsonData}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="#111111"
                stroke="#222222"
                strokeWidth={0.5}
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
            strokeWidth={1}
            strokeOpacity={0.4}
            strokeDasharray="4 4"
            className="animate-pulse"
          />
        ))}

        {/* Draw markers and labels */}
        {markers.map((marker) => (
          <Marker 
            key={marker.id} 
            coordinates={marker.coordinates as [number, number]}
            onMouseEnter={() => setHoveredMarker(marker.id)}
            onMouseLeave={() => setHoveredMarker(null)}
          >
            <circle 
              r={hoveredMarker === marker.id ? 6 : 4} 
              fill={marker.type === "dest" ? "#00ff00" : "#aaaaaa"} 
              className="transition-all duration-300 cursor-pointer"
            />
            
            {/* Pulsing ring for destinations */}
            {marker.type === "dest" && (
              <circle 
                r={10} 
                fill="none" 
                stroke="#00ff00" 
                strokeWidth={1} 
                className="animate-ping pointer-events-none"
                style={{ animationDuration: '3s' }}
              />
            )}
            
            {/* Label with leader line */}
            <g className="pointer-events-none transition-opacity duration-300">
              <line 
                x1={0} 
                y1={0} 
                x2={marker.dx * 0.9} 
                y2={marker.dy * 0.9} 
                stroke={marker.type === "dest" ? "#00ff00" : "#555555"} 
                strokeWidth={1} 
                opacity={0.6} 
              />
              <text
                textAnchor={marker.textAnchor as "start" | "middle" | "end"}
                x={marker.dx}
                y={marker.dy}
                style={{
                  fontFamily: "monospace",
                  fill: marker.type === "dest" ? "#ffffff" : "#aaaaaa",
                  fontSize: hoveredMarker === marker.id ? "13px" : "11px",
                  fontWeight: hoveredMarker === marker.id ? "bold" : "normal",
                  textShadow: "1px 1px 2px black, -1px -1px 2px black, 0px 0px 4px black",
                  transition: "all 0.2s ease-in-out",
                }}
              >
                {marker.name}
              </text>
            </g>
          </Marker>
        ))}
      </ComposableMap>
      
      {/* Decorative corners */}
      <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-[#00ff00]/50" />
      <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-[#00ff00]/50" />
      <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-[#00ff00]/50" />
      <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-[#00ff00]/50" />
      
      <div className="absolute bottom-4 left-8 text-[#00ff00]/70 font-mono text-[10px] uppercase tracking-widest flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-[#00ff00] animate-pulse" />
        Live Tracking: 12 Terminals
      </div>
    </div>
  );
}
