"use client";

import React from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { Ship, Droplet, ArrowRight, Route, BarChart3, TrendingDown, Scale } from "lucide-react";

export default function ScenariosPage() {
  return (
    <div className="flex h-screen w-full bg-black overflow-hidden font-sans text-slate-200">
      <Sidebar />
      <div className="flex flex-col flex-1 relative">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 custom-scrollbar">
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
                    <div className="text-sm text-white font-bold">100% Panamax (Coal)</div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-neutral-900/50 border border-neutral-800">
                      <div className="text-[10px] text-neutral-500 uppercase font-mono mb-1">Total Volume</div>
                      <div className="text-lg text-white font-bold">1.2M MT</div>
                    </div>
                    <div className="p-3 bg-neutral-900/50 border border-neutral-800">
                      <div className="text-[10px] text-neutral-500 uppercase font-mono mb-1">Voyage Count</div>
                      <div className="text-lg text-white font-bold">16 Voyages</div>
                    </div>
                    <div className="p-3 bg-neutral-900/50 border border-neutral-800">
                      <div className="text-[10px] text-neutral-500 uppercase font-mono mb-1">Avg Freight Rate</div>
                      <div className="text-lg text-white font-bold">$15.20 / MT</div>
                    </div>
                    <div className="p-3 bg-red-900/10 border border-red-500/20">
                      <div className="text-[10px] text-red-400 uppercase font-mono mb-1">Lightering Penalty</div>
                      <div className="text-lg text-red-400 font-bold">$0.00 / MT</div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-neutral-800">
                    <div className="text-xs text-neutral-400 uppercase font-mono mb-2">Key Trade-offs</div>
                    <ul className="space-y-2 text-sm text-neutral-300">
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                        No draft penalties at Haldia/Paradip.
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                        Higher base freight rate compared to Capesize.
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
                    <div className="text-sm text-white font-bold">80% Capesize (Iron Ore), 20% Panamax</div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-neutral-900/50 border border-neutral-800">
                      <div className="text-[10px] text-neutral-500 uppercase font-mono mb-1">Total Volume</div>
                      <div className="text-lg text-white font-bold">1.2M MT</div>
                    </div>
                    <div className="p-3 bg-neutral-900/50 border border-neutral-800">
                      <div className="text-[10px] text-neutral-500 uppercase font-mono mb-1">Voyage Count</div>
                      <div className="text-lg text-[#00ff00] font-bold flex items-center gap-2">
                        <TrendingDown className="w-4 h-4" /> 7 Voyages
                      </div>
                    </div>
                    <div className="p-3 bg-neutral-900/50 border border-neutral-800">
                      <div className="text-[10px] text-neutral-500 uppercase font-mono mb-1">Avg Freight Rate</div>
                      <div className="text-lg text-[#00ff00] font-bold flex items-center gap-2">
                        <TrendingDown className="w-4 h-4" /> $12.10 / MT
                      </div>
                    </div>
                    <div className="p-3 bg-amber-900/10 border border-amber-500/20">
                      <div className="text-[10px] text-amber-400 uppercase font-mono mb-1">Lightering Penalty</div>
                      <div className="text-lg text-amber-400 font-bold">+$2.50 / MT</div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-[#00ff00]/20">
                    <div className="text-xs text-[#00ff00]/70 uppercase font-mono mb-2">Key Trade-offs</div>
                    <ul className="space-y-2 text-sm text-neutral-300">
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#00ff00] mt-1.5 shrink-0" />
                        Massive reduction in voyage count saves $3.7M overall.
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                        Incurs $2.50/t penalty for lightering Capesize at Sagar-Sandheads before entering Haldia.
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
