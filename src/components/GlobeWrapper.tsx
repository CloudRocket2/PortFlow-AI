"use client";

import React, { useState, useEffect, useRef } from "react";
import Globe from "react-globe.gl";
import * as THREE from "three";
// Import pure GeoJSON directly from src to guarantee Next.js parses it as an object
import geoJsonData from "../data/countries.json";

export default function GlobeWrapper() {
  const [mounted, setMounted] = useState(false);
  const globeRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 800 });
  const [countries, setCountries] = useState<any[]>([]);

  useEffect(() => {
    setMounted(true);

    if (!containerRef.current) return;
    
    // Create a ResizeObserver to perfectly fit the WebGL canvas to the container
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setDimensions({
          width: entry.contentRect.width,
          height: entry.contentRect.height
        });
      }
    });

    resizeObserver.observe(containerRef.current);
    
    // Load the raw GeoJSON features directly
    try {
      if (geoJsonData && geoJsonData.features) {
        setCountries(geoJsonData.features);
      }
    } catch (e) {
      console.error("Failed to load map data", e);
    }
    
    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    if (mounted && globeRef.current) {
      // Configure orbital controls
      const controls = globeRef.current.controls();
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.5;
      controls.enableZoom = false;

      // Point camera roughly at the Indian Ocean / Asia region
      globeRef.current.pointOfView({ lat: 15, lng: 90, altitude: 2.5 }, 4000);
    }
  }, [mounted]);

  if (!mounted) {
    return <div className="w-full h-full bg-[#020202] flex items-center justify-center animate-pulse text-xs font-mono text-[#00ff00]">Initializing WebGL Engine...</div>;
  }

  const [hoverD, setHoverD] = useState<any>(null);

  // --- Data Points ---
  const markers = [
    { id: "newcastle", lat: -32.9283, lng: 151.7817, name: "Newcastle", type: "origin", alt: 0.015 },
    { id: "norfolk", lat: 36.8508, lng: -76.2859, name: "Norfolk", type: "origin", alt: 0.015 },
    { id: "maputo", lat: -25.9692, lng: 32.5892, name: "Maputo", type: "origin", alt: 0.015 },
    { id: "vladivostok", lat: 43.1198, lng: 131.8869, name: "Vladivostok", type: "origin", alt: 0.015 },
    { id: "kalimantan", lat: -0.2787, lng: 116.0385, name: "Kalimantan", type: "origin", alt: 0.015 },
    
    // Visually spread out the clustered ports slightly to prevent text overlapping using altitude
    { id: "haldia", lat: 22.8, lng: 88.5, name: "Haldia", type: "dest", alt: 0.07 },
    { id: "sagar", lat: 21.65, lng: 88.03, name: "Sagar-Sandheads", type: "dest", alt: 0.015 },
    { id: "dhamra", lat: 20.81, lng: 87.2, name: "Dhamra", type: "dest", alt: 0.07 },
    { id: "paradip", lat: 20.26, lng: 86.68, name: "Paradip", type: "dest", alt: 0.015 },
    { id: "vizag", lat: 17.68, lng: 83.21, name: "Vizag", type: "dest", alt: 0.06 },
    { id: "gangavaram", lat: 17.0, lng: 82.5, name: "Gangavaram", type: "dest", alt: 0.015 },
    { id: "gopalpur", lat: 19.3, lng: 84.9, name: "Gopalpur", type: "dest", alt: 0.015 },
  ];

  const arcs = [
    { startLat: -32.9283, startLng: 151.7817, endLat: 21.6500, endLng: 88.0333, color: ['#00ff00', '#00ff00'], name: "Australia to Sagar" },
    { startLat: -25.9692, startLng: 32.5892, endLat: 20.2667, endLng: 86.6833, color: ['#00ff00', '#00ff00'], name: "Maputo to Paradip" },
    { startLat: 43.1198, startLng: 131.8869, endLat: 17.6868, endLng: 83.2185, color: ['#00ff00', '#00ff00'], name: "Russia to Vizag" },
    { startLat: 36.8508, startLng: -76.2859, endLat: 20.8167, endLng: 86.9667, color: ['#00ff00', '#00ff00'], name: "US to Dhamra" },
    { startLat: -0.2787, startLng: 116.0385, endLat: 17.6167, endLng: 83.2333, color: ['#00ff00', '#00ff00'], name: "Indonesia to Gangavaram" },
  ];

  // Highlight Destination Rings
  const rings = markers.filter(m => m.type === "dest").map(d => ({
    lat: d.lat,
    lng: d.lng,
    maxR: 3,
    propagationSpeed: 2,
    repeatPeriod: 1000
  }));

  const handleLabelClick = (label: any) => {
    if (globeRef.current) {
      // Rotate the camera to the clicked port, slightly zoomed in
      globeRef.current.pointOfView({ lat: label.lat, lng: label.lng, altitude: 1.2 }, 1500);
      
      // Stop auto rotation temporarily
      const controls = globeRef.current.controls();
      controls.autoRotate = false;
      
      // Resume rotation after 5 seconds
      setTimeout(() => {
        if (globeRef.current) {
          globeRef.current.controls().autoRotate = true;
        }
      }, 5000);
    }
  };

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing flex items-center justify-center overflow-hidden" style={{ background: 'radial-gradient(circle at center, #0a0a0a 0%, #000000 100%)' }}>
      
      {/* Cinematic Tech Overlay */}
      <div className="absolute inset-0 pointer-events-none border border-white/5 z-10" />
      <div className="absolute top-4 left-4 z-10 pointer-events-none">
        <h3 className="font-mono text-xs uppercase tracking-[0.3em] text-[#00ff00] font-bold drop-shadow-[0_0_8px_rgba(0,255,0,0.8)]">Live Orbital Tracking</h3>
        <p className="font-mono text-[9px] text-neutral-500 tracking-widest mt-1 uppercase">Sat-Com Link Active // Global Fleet</p>
      </div>

      <div className="absolute bottom-4 right-4 z-10 pointer-events-none bg-black/60 backdrop-blur-sm border border-neutral-800 p-3 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#00ff00] shadow-[0_0_8px_rgba(0,255,0,0.8)]" />
          <span className="font-mono text-[9px] text-neutral-400 uppercase tracking-widest">Active Multi-Voyage Route</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full border border-neutral-500 bg-black" />
          <span className="font-mono text-[9px] text-neutral-400 uppercase tracking-widest">Origin Port</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full border border-white bg-white/50" />
          <span className="font-mono text-[9px] text-neutral-400 uppercase tracking-widest">Destination (India)</span>
        </div>
      </div>

      <Globe
        ref={globeRef}
        width={dimensions.width}
        height={dimensions.height}
        backgroundColor="rgba(0,0,0,0)"
        showAtmosphere={false}
        globeMaterial={new THREE.MeshBasicMaterial({ color: 0x000000 })}
        
        // Vector Map (Restoring the original hacker aesthetic, brightened for WebGL lighting)
        polygonsData={countries}
        polygonCapColor={() => '#111111'}
        polygonSideColor={() => '#111111'}
        polygonStrokeColor={() => '#333333'}
        polygonAltitude={0.005}

        // Native WebGL labels (looks much cleaner, fades perfectly over horizon)
        labelsData={markers}
        labelLat={(d: any) => d.lat}
        labelLng={(d: any) => d.lng}
        labelText={(d: any) => d.name}
        labelSize={(d: any) => d === hoverD ? 2 : (d.type === 'dest' ? 1.5 : 1)}
        labelDotRadius={(d: any) => d.type === 'dest' ? 0.8 : 0.5}
        labelColor={(d: any) => d === hoverD ? '#00ff00' : (d.type === 'dest' ? '#ffffff' : '#aaaaaa')}
        labelResolution={2}
        labelAltitude={(d: any) => d === hoverD ? d.alt + 0.02 : d.alt}
        onLabelClick={handleLabelClick}
        onLabelHover={setHoverD}
        
        // Glowing Arcs
        arcsData={arcs}
        arcColor={(d: any) => d.color}
        arcDashLength={0.4}
        arcDashGap={0.2}
        arcDashAnimateTime={2500}
        arcStroke={0.7}
        arcAltitudeAutoScale={0.3}

        // Pulsing Rings for Destinations
        ringsData={rings}
        ringColor={() => '#ffffff'}
        ringMaxRadius="maxR"
        ringPropagationSpeed="propagationSpeed"
        ringRepeatPeriod="repeatPeriod"
      />
    </div>
  );
}
