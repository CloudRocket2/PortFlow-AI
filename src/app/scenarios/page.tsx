"use client";

import React from "react";
import { Ship, Droplet, ArrowRight, Route, BarChart3, TrendingDown, Scale } from "lucide-react";

export default function ScenariosPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                  <Scale className="w-5 h-5 text-[#00ff00]" />
                  Portfolio Scenarios
                </h1>
                <p className="text-sm text-neutral-400 mt-1">
                  Compare multi-voyage allocations, draft penalties, and volume trade-offs.
                </p>
              </div>
              <button className="bg-[#00ff00]/10 text-[#00ff00] border border-[#00ff00]/30 px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider hover:bg-[#00ff00]/20 transition-colors">
                + New Scenario
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Scenario A */}
              <div className="minimal-panel p-6 bg-neutral-900/30">
                <div className="flex items-center justify-between border-b border-neutral-800 pb-4 mb-4">
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    Scenario A <span className="text-xs font-mono text-[#00ff00] bg-[#00ff00]/10 px-2 py-0.5 ml-2 border border-[#00ff00]/20">CURRENT PLAN</span>
                  </h2>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center bg-black p-3 border border-neutral-800">
                    <div className="text-xs text-neutral-400 uppercase font-mono">Primary Strategy</div>
                    <div className="text-sm text-white font-bold">Spot Contract Now (Immediate)</div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-neutral-900/50 border border-neutral-800">
                      <div className="text-[10px] text-neutral-500 uppercase font-mono mb-1">Total Volume</div>
                      <div className="text-lg text-white font-bold">1.2M MT</div>
                    </div>
                    <div className="p-3 bg-neutral-900/50 border border-neutral-800">
                      <div className="text-[10px] text-neutral-500 uppercase font-mono mb-1">Execution Timing</div>
                      <div className="text-lg text-white font-bold">This Week</div>
                    </div>
                    <div className="p-3 bg-neutral-900/50 border border-neutral-800">
                      <div className="text-[10px] text-neutral-500 uppercase font-mono mb-1">Avg Freight Rate</div>
                      <div className="text-lg text-white font-bold">$16.10 / MT</div>
                    </div>
                    <div className="p-3 bg-red-900/10 border border-red-500/20">
                      <div className="text-[10px] text-red-400 uppercase font-mono mb-1">Total Logistics Cost</div>
                      <div className="text-lg text-red-400 font-bold">$19.32M</div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-neutral-800">
                    <div className="text-xs text-neutral-400 uppercase font-mono mb-2">Key Trade-offs</div>
                    <ul className="space-y-2 text-sm text-neutral-300">
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                        Locks in vessel availability immediately.
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                        Ignores AI forecast indicating an upcoming seasonal dip in rates.
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Scenario B */}
              <div className="minimal-panel p-6 bg-[#00ff00]/5 border-[#00ff00]/20">
                <div className="flex items-center justify-between border-b border-[#00ff00]/20 pb-4 mb-4">
                  <h2 className="text-lg font-bold text-[#00ff00] flex items-center gap-2">
                    Scenario B <span className="text-xs font-mono text-black bg-[#00ff00] px-2 py-0.5 ml-2">AI RECOMMENDED</span>
                  </h2>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center bg-black p-3 border border-neutral-800">
                    <div className="text-xs text-[#00ff00]/70 uppercase font-mono">Primary Strategy</div>
                    <div className="text-sm text-white font-bold">Wait 3 Weeks for Predicted Dip</div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-neutral-900/50 border border-neutral-800">
                      <div className="text-[10px] text-neutral-500 uppercase font-mono mb-1">Total Volume</div>
                      <div className="text-lg text-white font-bold">1.2M MT</div>
                    </div>
                    <div className="p-3 bg-neutral-900/50 border border-neutral-800">
                      <div className="text-[10px] text-neutral-500 uppercase font-mono mb-1">Execution Timing</div>
                      <div className="text-lg text-[#00ff00] font-bold flex items-center gap-2">
                        Delay until Nov 26
                      </div>
                    </div>
                    <div className="p-3 bg-neutral-900/50 border border-neutral-800">
                      <div className="text-[10px] text-neutral-500 uppercase font-mono mb-1">Avg Freight Rate</div>
                      <div className="text-lg text-[#00ff00] font-bold flex items-center gap-2">
                        <TrendingDown className="w-4 h-4" /> $14.80 / MT
                      </div>
                    </div>
                    <div className="p-3 bg-amber-900/10 border border-amber-500/20">
                      <div className="text-[10px] text-amber-400 uppercase font-mono mb-1">Total Logistics Cost</div>
                      <div className="text-lg text-amber-400 font-bold">$17.76M</div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-[#00ff00]/20">
                    <div className="text-xs text-[#00ff00]/70 uppercase font-mono mb-2">Key Trade-offs</div>
                    <ul className="space-y-2 text-sm text-neutral-300">
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#00ff00] mt-1.5 shrink-0" />
                        Saves $1.56M overall by riding the forecasted rate drop.
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                        Small risk of supply constraint if the predicted dip does not materialize.
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

            </div>
          </div>
  );
}
