"use client";

import React, { useRef, useMemo, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Text, Grid, Environment, Html } from "@react-three/drei";
import * as THREE from "three";
import { useTelemetry, Container3DData } from "@/hooks/useTelemetry";
import { Clock, Package, Weight } from "lucide-react";

// Standard ISO Container Dimensions
const C_WIDTH = 2.4;
const C_HEIGHT = 2.6;
const C_DEPTH = 6.1;

// Colors
const BRAND_COLORS = {
  DryBulk: "#3b82f6", // Blue
  Reefer: "#10b981",  // Green
  Hazardous: "#ef4444",// Red
  Standard: "#64748b"  // Slate
};

const HEATMAP_COLORS = {
  Low: "#22c55e",
  Medium: "#eab308",
  High: "#ef4444"
};

// -------------------------------------------------------------------------------------------------
// Scenery & Environment
// -------------------------------------------------------------------------------------------------

function StaticEnvironment() {
  return (
    <group>
      <mesh position={[0, -0.25, -12.5]} receiveShadow>
        <boxGeometry args={[200, 0.5, 6]} />
        <meshStandardMaterial color="#334155" roughness={0.8} /> 
      </mesh>
      
      <mesh position={[0, -0.6, -50]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[200, 70]} />
        <meshPhysicalMaterial 
          color="#0f172a" 
          metalness={0.9} 
          roughness={0.1} 
          envMapIntensity={1}
          clearcoat={1}
        />
      </mesh>

      <Grid 
        infiniteGrid 
        fadeDistance={100} 
        sectionSize={C_DEPTH} 
        sectionColor="#3b82f6" 
        sectionThickness={1.5}
        cellSize={C_WIDTH} 
        cellColor="#1e293b" 
        position={[0, 0.05, 0]} 
      />
      
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, 0, 0]}>
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial color="#0f172a" roughness={0.9} />
      </mesh>

      {/* Painted Floor Labels (Bays 1-10) */}
      {Array.from({ length: 10 }).map((_, i) => {
        const bayNum = i + 1;
        const xPos = (bayNum - 5) * (C_WIDTH + 0.1);
        const zPos = -1.5 * C_DEPTH; // Front of the bay
        return (
          <group key={`bay-label-${bayNum}`} position={[xPos, 0.06, zPos]}>
            {/* Painted Yellow Rectangle */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
              <planeGeometry args={[C_WIDTH * 0.8, 1.2]} />
              <meshBasicMaterial color="#eab308" />
            </mesh>
            {/* Dark Text */}
            <Text 
              rotation={[-Math.PI / 2, 0, 0]} 
              position={[0, 0.01, 0]} 
              fontSize={0.6} 
              color="#0f172a" 
              anchorX="center" 
              anchorY="middle"
              fontWeight="bold"
            >
              BAY {bayNum.toString().padStart(2, '0')}
            </Text>
          </group>
        );
      })}
    </group>
  );
}

// -------------------------------------------------------------------------------------------------
// Interactive Container Mesh
// -------------------------------------------------------------------------------------------------

function ContainerMesh({ 
  data, 
  targetPos, 
  heatmapMode,
  onClick,
  isSelected
}: { 
  data: Container3DData; 
  targetPos: {x: number, y: number, z: number};
  heatmapMode: "Standard" | "DwellTime" | "Weight";
  onClick: (id: string, pos: THREE.Vector3) => void;
  isSelected: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);

  React.useEffect(() => {
    if (groupRef.current) {
      groupRef.current.position.set(targetPos.x, targetPos.y + 10, targetPos.z); // Drop in effect
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetPos.x, delta * 5);
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetPos.y, delta * 5);
      groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, targetPos.z, delta * 5);
    }
  });

  const color = useMemo(() => {
    if (heatmapMode === "DwellTime") {
      if (data.dwellTimeDays > 14) return HEATMAP_COLORS.High;
      if (data.dwellTimeDays > 7) return HEATMAP_COLORS.Medium;
      return HEATMAP_COLORS.Low;
    }
    if (heatmapMode === "Weight") {
      if (data.weightTons > 28) return HEATMAP_COLORS.High;
      if (data.weightTons > 15) return HEATMAP_COLORS.Medium;
      return HEATMAP_COLORS.Low;
    }
    // Standard Mode
    if (data.type === 'Reefer') return BRAND_COLORS.Reefer;
    if (data.type === 'Hazardous') return BRAND_COLORS.Hazardous;
    if (data.type === 'Dry Bulk') return BRAND_COLORS.DryBulk;
    return BRAND_COLORS.Standard;
  }, [heatmapMode, data]);

  return (
    <group ref={groupRef} onClick={(e) => {
      e.stopPropagation();
      if (groupRef.current) onClick(data.id, groupRef.current.position);
    }}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[C_WIDTH - 0.05, C_HEIGHT - 0.05, C_DEPTH - 0.05]} />
        <meshStandardMaterial 
          color={color} 
          roughness={0.4} 
          metalness={0.6}
          emissive={isSelected ? "#3b82f6" : "#000000"}
          emissiveIntensity={isSelected ? 4 : 0}
        />
      </mesh>
      
      {/* 3D UI Overlay */}
      {isSelected && (
        <Html position={[0, C_HEIGHT, 0]} center zIndexRange={[100, 0]}>
          <div className="bg-[#0f172a]/80 backdrop-blur-md border border-[#334155] rounded-xl p-4 shadow-2xl w-64 text-white pointer-events-none transform translate-y-[-10px]">
            <div className="flex justify-between items-start mb-3 border-b border-[#334155] pb-2">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Container ID</p>
                <p className="font-mono text-sm">{data.id}</p>
              </div>
              <span className={`text-[10px] font-bold px-2 py-1 rounded bg-slate-800 border ${data.type === 'Hazardous' ? 'text-red-400 border-red-500/30' : 'text-blue-400 border-blue-500/30'}`}>
                {data.type}
              </span>
            </div>
            
            <div className="space-y-2">
               <div className="flex items-center justify-between text-xs">
                 <span className="flex items-center gap-2 text-slate-400"><Clock className="w-3 h-3" /> Dwell Time</span>
                 <span className={data.dwellTimeDays > 14 ? "text-red-400 font-bold" : "text-white"}>{data.dwellTimeDays} Days</span>
               </div>
               <div className="flex items-center justify-between text-xs">
                 <span className="flex items-center gap-2 text-slate-400"><Weight className="w-3 h-3" /> Weight</span>
                 <span className="text-white font-mono">{data.weightTons} MT</span>
               </div>
               <div className="flex items-center justify-between text-xs pt-2">
                 <span className="flex items-center gap-2 text-slate-400"><Package className="w-3 h-3" /> Cargo</span>
                 <span className="text-white truncate max-w-[100px] text-right">{data.cargoDesc}</span>
               </div>
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}

// -------------------------------------------------------------------------------------------------
// Camera Controller
// -------------------------------------------------------------------------------------------------

function CameraRig({ focusPos }: { focusPos: THREE.Vector3 | null }) {
  const { controls } = useThree();
  
  useFrame((state, delta) => {
    if (focusPos && controls) {
      const target = (controls as unknown as { target: THREE.Vector3 }).target;
      target.lerp(focusPos, delta * 4);
    }
  });

  return null;
}

// -------------------------------------------------------------------------------------------------
// Main Export
// -------------------------------------------------------------------------------------------------

export default function Yard3D() {
  const { containers } = useTelemetry();
  const [heatmapMode, setHeatmapMode] = useState<"Standard" | "DwellTime" | "Weight">("Standard");
  const [selectedContainer, setSelectedContainer] = useState<string | null>(null);
  const [focusPos, setFocusPos] = useState<THREE.Vector3 | null>(null);

  const activeCount = containers.filter(c => c.currentSlot).length;

  const containerPositions = useMemo(() => {
    const positions = new Map<string, {x: number, y: number, z: number}>();
    const stacks: Record<string, number> = {};
    
    const sorted = [...containers].sort((a, b) => {
      const aTier = a.currentSlot?.tier || 0;
      const bTier = b.currentSlot?.tier || 0;
      if (aTier === bTier) return a.id.localeCompare(b.id);
      return aTier - bTier;
    });

    sorted.forEach(c => {
      if (!c.currentSlot) return;
      const key = `${c.currentSlot.bay}-${c.currentSlot.row}`;
      const stackIndex = stacks[key] || 0;
      stacks[key] = stackIndex + 1;

      positions.set(c.id, {
        x: (c.currentSlot.bay - 5) * (C_WIDTH + 0.1),
        z: (c.currentSlot.row - 3) * (C_DEPTH + 0.05),
        y: (stackIndex * C_HEIGHT) + (C_HEIGHT / 2)
      });
    });

    return positions;
  }, [containers]);

  return (
    <div className="w-full h-full bg-black relative">
      
      {/* UI Control Panel */}
      <div className="absolute top-4 left-4 z-10 flex gap-4 pointer-events-auto">
        <div className="minimal-panel px-4 py-3">
          <h3 className="text-xs uppercase tracking-widest text-white flex items-center gap-2">
            Terminal Digital Twin
          </h3>
          <p className="text-xs text-slate-400 mt-1">Live Feed • {activeCount} TEUs</p>
        </div>
        
        <div className="minimal-panel p-1 flex gap-1">
          <button 
            onClick={() => { setHeatmapMode("Standard"); setFocusPos(null); setSelectedContainer(null); }}
            className={`px-3 py-1 text-xs font-mono tracking-widest uppercase transition-colors ${heatmapMode === 'Standard' ? 'bg-white text-black' : 'text-neutral-500 hover:text-white'}`}
          >
            Standard
          </button>
          <button 
            onClick={() => setHeatmapMode("DwellTime")}
            className={`px-3 py-1 text-xs font-mono tracking-widest uppercase transition-colors ${heatmapMode === 'DwellTime' ? 'bg-white text-black' : 'text-neutral-500 hover:text-white'}`}
          >
            Dwell Heatmap
          </button>
          <button 
            onClick={() => setHeatmapMode("Weight")}
            className={`px-3 py-1 text-xs font-mono tracking-widest uppercase transition-colors ${heatmapMode === 'Weight' ? 'bg-white text-black' : 'text-neutral-500 hover:text-white'}`}
          >
            Weight
          </button>
        </div>
      </div>

      {/* Legend */}
      {heatmapMode !== "Standard" && (
        <div className="absolute bottom-4 left-4 z-10 minimal-panel px-4 py-3 pointer-events-none flex gap-4">
           <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-none bg-[#22c55e]" /> <span className="text-xs font-mono uppercase text-neutral-400">{heatmapMode === 'DwellTime' ? '< 7 Days' : '< 15 MT'}</span></div>
           <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-none bg-[#eab308]" /> <span className="text-xs font-mono uppercase text-neutral-400">{heatmapMode === 'DwellTime' ? '7-14 Days' : '15-28 MT'}</span></div>
           <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-none bg-[#ef4444]" /> <span className="text-xs font-mono uppercase text-neutral-400">{heatmapMode === 'DwellTime' ? '> 14 Days' : '> 28 MT'}</span></div>
        </div>
      )}

      {/* Reset Camera Button */}
      {focusPos && (
        <button 
          onClick={() => { setFocusPos(null); setSelectedContainer(null); }}
          className="absolute top-4 right-4 z-10 minimal-panel text-white hover:bg-white hover:text-black px-4 py-2 text-xs font-mono uppercase tracking-widest transition-colors"
        >
          Reset Camera
        </button>
      )}

      <Canvas shadows orthographic camera={{ position: [50, 50, 50], zoom: 18, up: [0, 1, 0] }}>
        <color attach="background" args={["#000000"]} />
        
        <ambientLight intensity={0.4} />
        <directionalLight 
          position={[60, 100, 30]} 
          intensity={1.2} 
          castShadow 
          shadow-mapSize={[2048, 2048]}
          shadow-camera-left={-60}
          shadow-camera-right={60}
          shadow-camera-top={60}
          shadow-camera-bottom={-60}
          shadow-camera-near={0.1}
          shadow-camera-far={200}
          shadow-bias={-0.0005}
        />
        
        <React.Suspense fallback={null}>
          <Environment preset="city" />
          <StaticEnvironment />
          
          {containers.map(c => {
            const pos = containerPositions.get(c.id);
            if (!pos) return null;
            return (
              <ContainerMesh 
                key={c.id} 
                data={c} 
                targetPos={pos} 
                heatmapMode={heatmapMode}
                isSelected={selectedContainer === c.id}
                onClick={(id, pos) => {
                  setSelectedContainer(id);
                  setFocusPos(pos.clone());
                }}
              />
            );
          })}
        </React.Suspense>



        <CameraRig focusPos={focusPos} />

        <OrbitControls 
          makeDefault 
          enableRotate={true}
          maxPolarAngle={Math.PI / 2 - 0.1}
          enableZoom={true}
          enablePan={true}
          minZoom={5}
          maxZoom={60}
          target={[0, 0, 0]}
          enableDamping
          dampingFactor={0.05}
        />
      </Canvas>
    </div>
  );
}
