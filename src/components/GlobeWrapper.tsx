"use client";

import React, { useState, useEffect, useRef } from "react";
import Globe from "react-globe.gl";
import * as topojson from "topojson-client";
import * as THREE from "three";

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
    
    // Fetch and parse the TopoJSON for minimalist vector landmasses
    fetch('/world-110m.json')
      .then(res => res.json())
      .then(topoData => {
        const geoJson = topojson.feature(topoData, topoData.objects.countries as any);
        setCountries((geoJson as any).features);
      });
    
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

  // --- Data Points ---
  const markers = [
    { id: "newcastle", lat: -32.9283, lng: 151.7817, name: "Newcastle", type: "origin" },
    { id: "norfolk", lat: 36.8508, lng: -76.2859, name: "Norfolk", type: "origin" },
    { id: "maputo", lat: -25.9692, lng: 32.5892, name: "Maputo", type: "origin" },
    { id: "vladivostok", lat: 43.1198, lng: 131.8869, name: "Vladivostok", type: "origin" },
    { id: "kalimantan", lat: -0.2787, lng: 116.0385, name: "Kalimantan", type: "origin" },
    
    { id: "haldia", lat: 22.0257, lng: 88.0561, name: "Haldia", type: "dest" },
    { id: "sagar", lat: 21.6500, lng: 88.0333, name: "Sagar-Sandheads", type: "dest" },
    { id: "paradip", lat: 20.2667, lng: 86.6833, name: "Paradip", type: "dest" },
    { id: "dhamra", lat: 20.8167, lng: 86.9667, name: "Dhamra", type: "dest" },
    { id: "vizag", lat: 17.6868, lng: 83.2185, name: "Vizag", type: "dest" },
    { id: "gangavaram", lat: 17.6167, lng: 83.2333, name: "Gangavaram", type: "dest" },
    { id: "gopalpur", lat: 19.3000, lng: 84.9000, name: "Gopalpur", type: "dest" },
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
        
        // Vector Map (Restoring the original hacker aesthetic)
        polygonsData={countries}
        polygonCapColor={() => '#0f0f0f'}
        polygonSideColor={() => '#0f0f0f'}
        polygonStrokeColor={() => '#222222'}
        polygonAltitude={0.005}

        // Native WebGL labels (looks much cleaner, fades perfectly over horizon)
        labelsData={markers}
        labelLat={(d: any) => d.lat}
        labelLng={(d: any) => d.lng}
        labelText={(d: any) => d.name}
        labelSize={(d: any) => d.type === 'dest' ? 1.5 : 1}
        labelDotRadius={(d: any) => d.type === 'dest' ? 0.8 : 0.5}
        labelColor={(d: any) => d.type === 'dest' ? '#ffffff' : '#aaaaaa'}
        labelResolution={2}
        labelAltitude={0.015}
        
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
