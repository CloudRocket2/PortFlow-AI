"use client";

import { useState } from "react";
import { BrainCircuit, Leaf, Activity, Loader2, Zap, CheckCircle2 } from "lucide-react";
import { useTelemetry } from "@/hooks/useTelemetry";
import { usePortFlowData } from "@/context/PortFlowContext";

export default function OptimizerPanel() {
  const { events } = useTelemetry();
  const { runFleetOptimization } = usePortFlowData();
  
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Mocking AI optimization events for bulk freight
  const aiEvents = [
    { message: "Rerouted Panamax to Dhamra to avoid 48hr port congestion" },
    { message: "Secured Sagar-Sandheads anchorage for Capesize lightering" },
    { message: "Consolidated 3 Spot shipments into Multi-Voyage Contract" },
    { message: "Adjusted ETA to align with predicted spot rate dip ($14.90)" },
  ];
  const totalOptimizations = 142;

  const handleOptimize = async () => {
    setIsOptimizing(true);
    setSuccessMsg(null);
    // Simulate AI thinking time to make the button state visible
    await new Promise(resolve => setTimeout(resolve, 2000));
    const result = runFleetOptimization();
    setIsOptimizing(false);
    
    if (result && result.updatedCount > 0) {
      setSuccessMsg(`${result.updatedCount} CONTRACTS OPTIMIZED`);
    } else {
      setSuccessMsg(`FLEET ALREADY OPTIMAL`);
    }
    
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  return (
    <div className="minimal-panel hover:scale-[1.005] hover:border-neutral-700/60 transition-all duration-300 mb-6">
      <div className="px-5 py-4 flex flex-col md:flex-row md:items-center justify-between border-b border-neutral-800">
        <div>
          <h3 className="text-sm font-mono uppercase tracking-widest text-white flex items-center gap-2 border-l-2 border-cyan-500/40 pl-3">
            <BrainCircuit className="w-4 h-4 text-white" />
            AI Fleet & Anchorage Optimizer
          </h3>
          <p className="text-xs font-mono text-neutral-500 mt-1 uppercase transition-all duration-200">
            Evaluating draft limits & lightering penalties
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 border border-neutral-800 text-white text-xs font-mono uppercase tracking-widest rounded-lg transition-all duration-200">
            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
            Active
          </div>
          <button 
            onClick={handleOptimize}
            disabled={isOptimizing || !!successMsg}
            className={`px-4 py-1.5 text-sm font-mono font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg focus-ring active:scale-[0.97] ${
              successMsg 
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40" 
                : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 btn-sweep"
            }`}
          >
            {isOptimizing ? (
              <>
                <Loader2 className="w-3 h-3 animate-spin" />
                ANALYZING...
              </>
            ) : successMsg ? (
              <>
                <CheckCircle2 className="w-3 h-3" />
                {successMsg}
              </>
            ) : (
              <>
                <Zap className="w-3 h-3" />
                RUN AI OPTIMIZATION
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-5 bg-neutral-900/10">
        
        {/* Metric 1 */}
        <div className="flex flex-col gap-2">
          <div className="text-xs font-mono text-neutral-500 uppercase tracking-widest flex items-center gap-1.5 transition-all duration-200">
            <Activity className="w-3 h-3 text-emerald-400" />
            AI Actions Taken (24h)
          </div>
          <div className="text-2xl font-mono text-white tabular-nums">
            {totalOptimizations} <span className="text-xs text-neutral-500 ml-1 transition-all duration-200">ROUTING DECISIONS</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="flex flex-col gap-2 border-l border-neutral-800 pl-6">
          <div className="text-xs font-mono text-neutral-500 uppercase tracking-widest flex items-center gap-1.5 transition-all duration-200">
            <Leaf className="w-3 h-3 text-emerald-400" />
            CO2 Equivalents Saved
          </div>
          <div className="text-2xl font-mono text-white tabular-nums">
            18.2 <span className="text-xs text-emerald-400 ml-1 transition-all duration-200">KILOTONS</span>
          </div>
          <p className="text-[10px] font-mono text-neutral-500 uppercase transition-all duration-200">
            Via multi-voyage empty transit reduction
          </p>
        </div>

        {/* AI Action Log */}
        <div className="flex flex-col gap-2 border-l border-neutral-800 pl-6">
          <div className="text-xs font-mono text-neutral-500 uppercase tracking-widest mb-1 transition-all duration-200">
            Recent Engine Operations
          </div>
          <div className="flex flex-col gap-1.5">
            {aiEvents.map((e, idx) => (
              <div key={idx} className="text-[10px] font-mono text-neutral-400 flex items-start gap-1.5 animate-slide-in" style={{ animationDelay: `${idx * 0.1}s` }}>
                <span className="text-emerald-400 mt-0.5">&gt;</span>
                {e.message}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
