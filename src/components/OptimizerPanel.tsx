"use client";

import { BrainCircuit, Leaf, Activity } from "lucide-react";
import { useTelemetry } from "@/hooks/useTelemetry";

export default function OptimizerPanel() {
  const { events } = useTelemetry();

  // Mocking AI optimization events for bulk freight
  const aiEvents = [
    { message: "Rerouted Panamax to Dhamra to avoid 48hr port congestion" },
    { message: "Secured Sagar-Sandheads anchorage for Capesize lightering" },
    { message: "Consolidated 3 Spot shipments into Multi-Voyage Contract" },
    { message: "Adjusted ETA to align with predicted spot rate dip ($14.90)" },
  ];
  const totalOptimizations = 142;

  return (
    <div className="minimal-panel mb-6">
      <div className="px-5 py-4 flex flex-col md:flex-row md:items-center justify-between border-b border-neutral-800">
        <div>
          <h3 className="text-xs font-mono uppercase tracking-widest text-white flex items-center gap-2">
            <BrainCircuit className="w-4 h-4 text-white" />
            AI Fleet & Anchorage Optimizer
          </h3>
          <p className="text-[10px] font-mono text-neutral-500 mt-1 uppercase">
            Evaluating draft limits & lightering penalties
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 border border-neutral-800 text-white text-[10px] font-mono uppercase tracking-widest">
          <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
          Active
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-5 bg-neutral-900/10">
        
        {/* Metric 1 */}
        <div className="flex flex-col gap-2">
          <div className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest flex items-center gap-1.5">
            <Activity className="w-3 h-3 text-[#00ff00]" />
            AI Actions Taken (24h)
          </div>
          <div className="text-2xl font-mono text-white">
            {totalOptimizations} <span className="text-[10px] text-neutral-500 ml-1">ROUTING DECISIONS</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="flex flex-col gap-2 border-l border-neutral-800 pl-6">
          <div className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest flex items-center gap-1.5">
            <Leaf className="w-3 h-3 text-[#00ff00]" />
            CO2 Equivalents Saved
          </div>
          <div className="text-2xl font-mono text-white">
            18.2 <span className="text-[10px] text-[#00ff00] ml-1">KILOTONS</span>
          </div>
          <p className="text-[9px] font-mono text-neutral-500 uppercase">
            Via multi-voyage empty transit reduction
          </p>
        </div>

        {/* AI Action Log */}
        <div className="flex flex-col gap-2 border-l border-neutral-800 pl-6">
          <div className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest mb-1">
            Recent Engine Operations
          </div>
          <div className="flex flex-col gap-1.5">
            {aiEvents.map((e, idx) => (
              <div key={idx} className="text-[9px] font-mono text-neutral-400 flex items-start gap-1.5">
                <span className="text-[#00ff00] mt-0.5">&gt;</span>
                {e.message}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
