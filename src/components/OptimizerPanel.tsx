"use client";

import { BrainCircuit, Leaf, Activity } from "lucide-react";
import { useTelemetry } from "@/hooks/useTelemetry";

export default function OptimizerPanel() {
  const { events } = useTelemetry();

  // Filter out only the AI optimization events
  const aiEvents = events.filter(e => e.type === 'AI_AUTO_OPTIMIZATION').slice(0, 4);
  const totalOptimizations = events.filter(e => e.type === 'AI_AUTO_OPTIMIZATION').length;

  return (
    <div className="minimal-panel mb-6">
      <div className="px-5 py-4 flex flex-col md:flex-row md:items-center justify-between border-b border-neutral-800">
        <div>
          <h3 className="text-xs font-mono uppercase tracking-widest text-white flex items-center gap-2">
            <BrainCircuit className="w-4 h-4 text-white" />
            Autonomous AI Engine
          </h3>
          <p className="text-[10px] font-mono text-neutral-500 mt-1 uppercase">
            Evaluating stack physics & dwell times
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 border border-neutral-800 text-white text-[10px] font-mono uppercase tracking-widest">
          <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
          Active
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-[10px] font-mono uppercase tracking-widest text-neutral-400">Recent Output Log</h4>
          <div className="text-[10px] font-mono uppercase tracking-widest text-white border border-neutral-800 px-2.5 py-1">
            Total Saved: {(totalOptimizations * 12.5).toFixed(1)}kg CO2
          </div>
        </div>

        {aiEvents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-neutral-600">
            <p className="text-[10px] font-mono uppercase tracking-widest">Yield optimal.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {aiEvents.map((evt, i) => (
              <div key={i} className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border border-neutral-800 p-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-[10px] font-bold text-white uppercase">{evt.containerId}</span>
                    <span className="text-[10px] font-mono uppercase text-neutral-400 border border-neutral-800 px-1.5">
                      Resolved
                    </span>
                    <span className="text-[10px] text-neutral-600 font-mono ml-auto">
                      {new Date(evt.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-xs font-mono text-neutral-500">{evt.details}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
