"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import DeckGL from "@deck.gl/react";
import { Map, useControl } from "react-map-gl/maplibre";
import * as maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { IconLayer, ArcLayer, TextLayer, ScatterplotLayer, ColumnLayer } from "@deck.gl/layers";
import { FlyToInterpolator } from "@deck.gl/core";
import Supercluster from "supercluster";
import { usePortFlowData } from "@/context/PortFlowContext";
import { Search, X, Ship, Navigation } from "lucide-react";

// Pre-calculated intermediate waypoints so lines don't cross landmasses
const WAYPOINTS: Record<string, [number, number][]> = {
  "Vladivostok, Russia": [[129.0, 34.0], [120.0, 20.0], [104.0, 1.5]],
  "Newcastle, Australia": [[153.0, -20.0], [142.0, -10.0], [115.0, -8.0]],
  "Kalimantan, Indonesia": [[104.0, 1.5]],
  "Maputo, Mozambique": [[50.0, -15.0], [75.0, 0.0]],
  "Norfolk, US": [[-30.0, 35.0], [-5.0, 36.0], [15.0, 35.0], [32.0, 31.0], [43.0, 12.0], [60.0, 15.0]]
};

const INITIAL_VIEW_STATE: any = {
  longitude: 80,
  latitude: 20,
  zoom: 2,
  pitch: 30,
  bearing: 0
};

// Calculate bearing between two points
function getBearing(start: [number, number], end: [number, number]) {
  const startLat = (start[1] * Math.PI) / 180;
  const startLng = (start[0] * Math.PI) / 180;
  const endLat = (end[1] * Math.PI) / 180;
  const endLng = (end[0] * Math.PI) / 180;

  const y = Math.sin(endLng - startLng) * Math.cos(endLat);
  const x = Math.cos(startLat) * Math.sin(endLat) - Math.sin(startLat) * Math.cos(endLat) * Math.cos(endLng - startLng);
  const bearing = (Math.atan2(y, x) * 180) / Math.PI;
  return (bearing + 360) % 360;
}

export default function DeckMap() {
  const { state, selectedVoyageId, setSelectedVoyageId, isRedSeaClosed } = usePortFlowData();
  const [time, setTime] = useState(0);

  useEffect(() => {
    let animationFrame: number;
    const start = Date.now();
    const animate = () => {
      setTime((Date.now() - start) / 20); // speed coefficient
      animationFrame = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(animationFrame);
  }, []);
  const [viewState, setViewState] = useState<any>(INITIAL_VIEW_STATE);
  const [hoverInfo, setHoverInfo] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const deckRef = useRef<any>(null);

  // 1. Process Ports for Clustering
  const portPoints = useMemo(() => {
    return state.ports.map(p => ({
      type: "Feature" as const,
      properties: { ...p, isPort: true },
      geometry: { type: "Point" as const, coordinates: [p.lng, p.lat] }
    }));
  }, [state.ports]);

  const supercluster = useMemo(() => {
    const cluster = new Supercluster({ radius: 60, maxZoom: 16 });
    cluster.load(portPoints);
    return cluster;
  }, [portPoints]);

  const clusters = useMemo(() => {
    return supercluster.getClusters(
      [-180, -90, 180, 90], // Global bounding box
      Math.floor(viewState.zoom)
    );
  }, [supercluster, viewState.zoom]);

  // 2. Process Routes & Arcs
  const mapRoutes = useMemo(() => {
    return state.contracts.map(c => {
      const route = state.routes.find(r => r.id === c.routeId);
      if (!route) return null;
      
      const origin = state.ports.find(p => p.id === route.originId);
      const dest = state.ports.find(p => p.id === route.destinationId);
      if (!origin || !dest) return null;

      const vessel = state.vessels.find(v => v.id === route.vesselId);
      let intermediate = WAYPOINTS[origin.name] || [];
        if (isRedSeaClosed && origin.name === "Norfolk, US") {
          // Reroute around Cape of Good Hope
          intermediate = [[-40.0, 30.0], [-25.0, 0.0], [-5.0, -20.0], [20.0, -40.0], [50.0, -25.0], [70.0, -10.0]];
        }
      const isSelected = selectedVoyageId === c.id;
      
      const waypoints = [[origin.lng, origin.lat] as [number, number], ...intermediate, [dest.lng, dest.lat] as [number, number]];

      // Create arc segments between each consecutive pair of waypoints
      const arcs = [];
      for (let i = 0; i < waypoints.length - 1; i++) {
        arcs.push({
          source: waypoints[i],
          target: waypoints[i+1],
          color: isSelected ? [0, 255, 0] : c.status === "AI Executed" ? [0, 255, 0] : [100, 100, 100],
        });
      }

      return {
        id: c.id,
        contractId: c.id,
        vesselName: vessel?.name,
        cargo: route.cargo,
        eta: route.eta,
          isSpoofed: vessel?.isSpoofed || false,
        originName: origin.name,
        destName: dest.name,
        waypoints,
        arcs,
        isSelected
      };
    }).filter(Boolean) as any[];
  }, [state.contracts, state.routes, state.ports, state.vessels, selectedVoyageId, isRedSeaClosed]);

  const allArcs = useMemo(() => mapRoutes.flatMap(r => r.arcs), [mapRoutes]);

  // 3. Process Ships
  const ships = useMemo(() => {
    return mapRoutes.map((r) => {
      const wp = r.waypoints;
      let shipCoord = wp[0];
      let nextCoord = wp[1] || wp[0];
      
      if (wp.length > 2) {
        shipCoord = wp[1];
        nextCoord = wp[2];
      } else {
        shipCoord = [(wp[0][0] + wp[1][0]) / 2, (wp[0][1] + wp[1][1]) / 2];
        nextCoord = wp[1];
      }

      const bearing = getBearing(shipCoord, nextCoord);

      return {
        id: r.id,
        contractId: r.contractId,
        name: r.vesselName,
        coordinates: shipCoord as [number, number],
        bearing,
        routeStr: `${r.originName} -> ${r.destName}`,
        cargo: r.cargo,
        eta: r.eta,
        isSelected: r.isSelected,
          isSpoofed: r.isSpoofed
      };
    });
  }, [mapRoutes]);

  // Handle Zooming/Camera Animation
  const flyTo = (longitude: number, latitude: number, zoom: number) => {
    setViewState({
      ...viewState,
      longitude,
      latitude,
      zoom,
      transitionDuration: 1500,
      transitionInterpolator: new FlyToInterpolator()
    });
  };

  const handleClusterClick = (clusterId: number, lng: number, lat: number) => {
    const expansionZoom = supercluster.getClusterExpansionZoom(clusterId);
    flyTo(lng, lat, expansionZoom);
  };

  // Layers
  const layers = [
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

    // Pulse animation beneath ships (mocked with Scatterplot for glowing effect)
    new ScatterplotLayer({
      id: 'ship-glow',
      data: ships,
      getPosition: d => d.coordinates,
      getFillColor: d => d.isSelected ? [52, 211, 153, 150] : [0, 255, 255, 100],
      getRadius: 50000,
      radiusScale: 1,
      radiusMinPixels: 20,
        radiusMaxPixels: 70,
      stroked: true,
      getLineColor: [0, 255, 255, 255],
      lineWidthMinPixels: 2,
      updateTriggers: {
        getFillColor: selectedVoyageId
      }
    }),
    
    // Route Arcs
    new ArcLayer({
      id: 'routes',
      data: allArcs,
      getSourcePosition: d => d.source,
      getTargetPosition: d => d.target,
      getSourceColor: d => d.color,
      getTargetColor: d => d.color,
      getWidth: 2,
      greatCircle: true, // curved geodesic arcs
    }),

    // Ports & Clusters (IconLayer)
    new IconLayer({
      id: 'ports',
      data: clusters,
      pickable: true,
      getPosition: d => d.geometry.coordinates as [number, number],
      iconAtlas: 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/icon-atlas.png',
      iconMapping: {
        marker: { x: 0, y: 0, width: 128, height: 128, mask: true }
      },
      getIcon: () => 'marker',
      getSize: d => d.properties.cluster ? 40 : 30,
      getColor: d => {
        if (d.properties.cluster) return [100, 150, 250]; // Cluster color
        if (d.properties.legalStatus && d.properties.legalStatus !== "Compliant") return [245, 158, 11]; // Amber
        return [0, 255, 0]; // Green
      },
      onClick: (info) => {
        if (!info.object) return;
        const { cluster, cluster_id } = info.object.properties;
        if (cluster) {
          handleClusterClick(cluster_id, info.object.geometry.coordinates[0], info.object.geometry.coordinates[1]);
        }
      },
      onHover: info => setHoverInfo(info.object ? { ...info, type: 'port' } : null)
    }),

    // Cluster Counts Text
    new TextLayer({
      id: 'cluster-counts',
      data: clusters.filter(c => c.properties.cluster),
      getPosition: d => d.geometry.coordinates as [number, number],
      getText: d => d.properties.point_count_abbreviated,
      getSize: 14,
      getColor: [255, 255, 255],
      getAlignmentBaseline: 'center',
      getTextAnchor: 'middle',
    }),

    // Individual Port Labels (Only show when zoomed in > 4)
    new TextLayer({
      id: 'port-labels',
      data: viewState.zoom > 4 ? clusters.filter(c => !c.properties.cluster) : [],
      getPosition: d => d.geometry.coordinates as [number, number],
      getText: d => d.properties.name,
      getSize: 12,
      getColor: [255, 255, 255],
      getPixelOffset: [0, 20],
      getAlignmentBaseline: 'top',
      getTextAnchor: 'middle',
    }),

    // Ships IconLayer
    new IconLayer({
      id: 'ships',
      data: ships,
      pickable: true,
      getPosition: d => d.coordinates,
      iconAtlas: 'data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMjQgMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEyIDJMMiAyMkwxMiAxOEwyMiAyMkwxMiAyWiIgZmlsbD0id2hpdGUiLz48L3N2Zz4=',
      iconMapping: {
        ship: { x: 0, y: 0, width: 24, height: 24, mask: true }
      },
      getIcon: () => 'ship',
      sizeScale: 1,
      getSize: d => d.isSelected ? 55 : 40,
        getColor: d => d.isSpoofed ? [244, 63, 94] : d.isSelected ? [52, 211, 153] : [255, 255, 255],
      getAngle: d => -d.bearing, // Rotate marker to face heading
      onClick: (info) => {
        if (info.object) setSelectedVoyageId(info.object.contractId);
      },
      onHover: info => setHoverInfo(info.object ? { ...info, type: 'ship' } : null)
    }),
  ];

  return (
    <div className="relative w-full h-[600px] bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden group">
      
      {/* Search & Filter Bar */}
      <div className="absolute top-4 left-4 z-10 w-64 bg-neutral-900/90 backdrop-blur border border-neutral-800 rounded-lg p-2 shadow-xl flex items-center gap-2">
        <Search className="w-4 h-4 text-neutral-500" />
        <input 
          type="text" 
          placeholder="Search vessels or ports..." 
          className="bg-transparent border-none text-sm text-white w-full focus:outline-none placeholder-neutral-600"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Persistent Legend / Mini Side-List */}
      <div className="absolute top-16 left-4 z-10 w-64 max-h-[400px] overflow-y-auto bg-neutral-900/90 backdrop-blur border border-neutral-800 rounded-lg p-3 shadow-xl flex flex-col gap-2">
        <h3 className="text-xs font-mono uppercase text-neutral-500 mb-2">Tracked Vessels</h3>
        {ships.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase())).map(ship => (
          <div 
            key={ship.id}
            onClick={() => {
              setSelectedVoyageId(ship.contractId);
              flyTo(ship.coordinates[0], ship.coordinates[1], 5);
            }}
            className={`p-2 rounded cursor-pointer transition-colors text-sm ${ship.isSelected ? 'bg-cyan-500/20 text-cyan-400' : 'bg-black/50 text-neutral-300 hover:bg-neutral-800'}`}
          >
            <div className="font-semibold">{ship.name}</div>
            <div className="text-xs text-neutral-500">{ship.routeStr}</div>
          </div>
        ))}
      </div>

      {/* Live Entity Badge (Unobtrusive) */}
      <div className="absolute bottom-4 right-4 z-10 bg-black/60 backdrop-blur border border-cyan-500/30 px-3 py-1.5 rounded-full flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
        <span className="text-xs font-mono text-cyan-400">LIVE TRACKING: {ships.length} VESSELS</span>
      </div>

      {/* Docked Detail Panel for Selected Vessel */}
      {selectedVoyageId && (
        <div className="absolute top-4 right-4 z-10 w-80 bg-neutral-900 border border-cyan-500/50 rounded-xl p-5 shadow-2xl animate-slide-in">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Ship className="w-5 h-5 text-cyan-400" />
              {ships.find(s => s.contractId === selectedVoyageId)?.name}
            </h3>
            <button onClick={() => setSelectedVoyageId(null)} className="text-neutral-500 hover:text-white"><X className="w-4 h-4" /></button>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between border-b border-neutral-800 pb-2">
              <span className="text-xs text-neutral-500 uppercase font-mono">Route</span>
              <span className="text-sm text-neutral-300">{ships.find(s => s.contractId === selectedVoyageId)?.routeStr}</span>
            </div>
            <div className="flex justify-between border-b border-neutral-800 pb-2">
              <span className="text-xs text-neutral-500 uppercase font-mono">Cargo</span>
              <span className="text-sm text-neutral-300">{ships.find(s => s.contractId === selectedVoyageId)?.cargo}</span>
            </div>
            <div className="flex justify-between border-b border-neutral-800 pb-2">
              <span className="text-xs text-neutral-500 uppercase font-mono">ETA</span>
              <span className="text-sm text-cyan-400 font-mono">{ships.find(s => s.contractId === selectedVoyageId)?.eta}</span>
            </div>
          </div>
          <button className="w-full mt-4 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 py-2 rounded-lg text-sm font-bold uppercase tracking-wider transition-colors">
            View Contract Details
          </button>
        </div>
      )}

      {/* Tooltip for Port Hover */}
      {hoverInfo?.type === 'port' && hoverInfo.object?.properties?.name && !hoverInfo.object?.properties?.cluster && (
        <div 
          className="absolute z-10 bg-black/90 border border-neutral-700 text-white px-3 py-2 rounded text-sm pointer-events-none transform -translate-x-1/2 -translate-y-[120%]"
          style={{ left: hoverInfo.x, top: hoverInfo.y }}
        >
          <div className="font-bold">{hoverInfo.object.properties.name}</div>
          <div className="text-xs text-neutral-400 font-mono">Handling: {hoverInfo.object.properties.handlingRate} MT/d</div>
          {hoverInfo.object.properties.legalStatus !== 'Compliant' && (
            <div className="text-xs text-amber-400 mt-1">{hoverInfo.object.properties.legalStatus}</div>
          )}
        </div>
      )}

      {/* Tooltip for Ship Hover */}
      {hoverInfo?.type === 'ship' && hoverInfo.object && (
        <div 
          className="absolute z-10 bg-black/90 border border-cyan-700 text-cyan-400 px-3 py-1.5 rounded text-sm pointer-events-none transform -translate-x-1/2 -translate-y-[140%]"
          style={{ left: hoverInfo.x, top: hoverInfo.y }}
        >
          <div className="font-bold">{hoverInfo.object.name}</div>
        </div>
      )}

      {/* DeckGL Canvas overlaying MapLibre base map */}
      <DeckGL
        ref={deckRef}
        initialViewState={viewState}
        onViewStateChange={({ viewState }) => setViewState(viewState)}
        controller={true}
        layers={layers}
        getCursor={({ isDragging, isHovering }) => isDragging ? 'grabbing' : isHovering ? 'pointer' : 'grab'}
      >
        {/* CARTO Dark Matter vector tile basemap (Free, no API key) */}
        <Map
          mapLib={maplibregl as any}
          mapStyle="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
          reuseMaps
          style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}
        />
      </DeckGL>
    </div>
  );
}
