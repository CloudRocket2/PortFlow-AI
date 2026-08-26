import { Box, Maximize2 } from "lucide-react";

export default function YardPlaceholder() {
  return (
    <div
      id="3d-yard-placeholder"
      className="relative bg-[#1e293b] rounded-xl border border-[#334155] overflow-hidden flex flex-col items-center justify-center min-h-[400px]"
    >
      {/* Animated grid background to suggest 3D space */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(rgba(59,130,246,0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59,130,246,0.3) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
            transform: "perspective(500px) rotateX(30deg)",
            transformOrigin: "center top",
          }}
        />
      </div>

      {/* Floating badge */}
      <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0f172a]/80 border border-[#334155] text-xs text-slate-400">
        <Box className="w-3.5 h-3.5 text-blue-400" />
        3D Digital Twin — Yard View
      </div>

      {/* Expand button */}
      <button className="absolute top-4 right-4 p-2 rounded-lg bg-[#0f172a]/80 border border-[#334155] text-slate-400 hover:text-white transition-colors">
        <Maximize2 className="w-4 h-4" />
      </button>

      {/* Center content */}
      <div className="relative z-10 text-center">
        <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600/10 border border-blue-500/20 mx-auto mb-4">
          <Box className="w-8 h-8 text-blue-400" />
        </div>
        <h3 className="text-lg font-semibold text-white mb-1">
          3D Yard Digital Twin
        </h3>
        <p className="text-sm text-slate-400 max-w-sm">
          Three.js / React Three Fiber visualization will be injected here.
          <br />
          Real-time container positioning, crane movements, and vessel docking.
        </p>
        <div className="flex items-center justify-center gap-4 mt-4 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            WebGL Ready
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            Live Telemetry Feed
          </span>
        </div>
      </div>
    </div>
  );
}
