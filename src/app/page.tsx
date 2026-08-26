"use client";

import ContainerTable from "@/components/ContainerTable";
import DwellTimeChart from "@/components/DwellTimeChart";
import BottleneckAlerts from "@/components/BottleneckAlerts";
import OptimizerPanel from "@/components/OptimizerPanel";
import LiveTerminalFeed from "@/components/LiveTerminalFeed";
import dynamic from "next/dynamic";

// R3F Canvas requires client-side only rendering to avoid hydration mismatch
const Yard3D = dynamic(() => import("@/components/Yard3D"), { ssr: false });

export default function DashboardPage() {
  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      
      {/* Header Info */}
      <div className="minimal-panel px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
          <p className="text-xs font-mono uppercase tracking-widest text-neutral-400">
            Live Telemetry feed
          </p>
        </div>
        <p className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">
          TOS & AIS Architecture Ready
        </p>
      </div>

      {/* Row 1: 3D Yard Digital Twin + Sidebar Panels */}
      <div className="flex flex-col xl:flex-row gap-6">
        
        {/* Left: 3D Digital Twin - takes 2/3 of the row */}
        <div className="w-full xl:w-2/3 h-[500px] xl:h-[700px] shrink-0 minimal-panel relative overflow-hidden">
          <Yard3D />
        </div>

        {/* Right column - Data Panels */}
        <div className="w-full xl:w-1/3 flex flex-col gap-6">
          <DwellTimeChart />
          <BottleneckAlerts />
          <div className="flex-1 min-h-[300px]">
            <LiveTerminalFeed />
          </div>
        </div>
      </div>

      {/* Row 2: AI Optimization Panel */}
      <OptimizerPanel />

      {/* Row 3: Full-width Container Table */}
      <ContainerTable />
    </div>
  );
}
