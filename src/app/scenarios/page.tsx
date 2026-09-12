"use client";

import React, { useState } from "react";
import { Scale, Plus, Trash2, TrendingDown, ArrowRight, ShieldAlert, Anchor, Ship, CircleDollarSign, Route } from "lucide-react";
import { usePortFlowData } from "@/context/PortFlowContext";

export default function ScenariosPage() {
  const { isRedSeaClosed, toggleRedSeaReroute } = usePortFlowData();
  const [loading, setLoading] = useState(false);

  const handleReroute = () => {
    setLoading(true);
    setTimeout(() => {
      if (toggleRedSeaReroute) toggleRedSeaReroute();
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="animate-page-enter max-w-[1600px] mx-auto space-y-6">
      
      {/* Geopolitical Simulator Module */}
      <div className={`p-6 rounded-xl border transition-all duration-700 ${
        isRedSeaClosed ? "bg-rose-950/20 border-rose-500/40 shadow-[0_0_40px_rgba(244,63,94,0.1)]" : "minimal-panel border-neutral-800"
      }`}>
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              isRedSeaClosed ? "bg-rose-500/20 text-rose-500 border border-rose-500/50" : "bg-neutral-800 border border-neutral-700 text-neutral-400"
            }`}>
              <ShieldAlert className={`w-6 h-6 ${isRedSeaClosed ? "animate-pulse" : ""}`} />
            </div>
            <div>
              <h2 className="text-xl font-bold font-mono tracking-wide text-white flex items-center gap-2">
                CRISIS SIMULATOR: Red Sea / Suez Blockade
                {isRedSeaClosed && (
                  <span className="text-[10px] bg-rose-500/20 text-rose-400 border border-rose-500/30 px-2 py-0.5 rounded uppercase tracking-widest whitespace-nowrap animate-fade-in">
                    ACTIVE SCENARIO
                  </span>
                )}
              </h2>
              <p className="text-sm text-neutral-400 mt-1 max-w-3xl">
                Simulate the immediate operational and financial impact of a complete Suez Canal closure due to escalating Houthi threats. The AI will instantly reroute affected voyages around the Cape of Good Hope and recalculate logistics costs.
              </p>
            </div>
          </div>
          
          <button 
            onClick={handleReroute}
            disabled={loading}
            className={`px-6 py-3 shrink-0 rounded-lg text-xs font-mono font-bold uppercase tracking-widest transition-all duration-300 flex items-center gap-2 border focus-ring active:scale-95 whitespace-nowrap ${
              isRedSeaClosed 
                ? "bg-neutral-800 text-neutral-300 border-neutral-700 hover:bg-neutral-700"
                : "bg-rose-500/10 text-rose-400 border-rose-500/30 hover:bg-rose-500/20 btn-sweep shadow-[0_0_20px_rgba(244,63,94,0.15)]"
            }`}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Route className="w-4 h-4 animate-spin" /> CALCULATING ROUTES...
              </span>
            ) : isRedSeaClosed ? (
              <span className="flex items-center gap-2">
                <Ship className="w-4 h-4" /> REVERT TO SUEZ CANAL
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Route className="w-4 h-4" /> EXECUTE REROUTE (CAPE OF GOOD HOPE)
              </span>
            )}
          </button>
        </div>

        {/* Dashboard Delta (Revealed when active) */}
        {isRedSeaClosed && (
          <div className="mt-8 grid grid-cols-4 gap-4 border-t border-rose-900/50 pt-6 animate-slide-in">
            <div className="bg-rose-950/40 border border-rose-900/50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-rose-400 text-xs font-mono uppercase tracking-widest mb-2">
                <Route className="w-4 h-4" /> Transit Time Delta
              </div>
              <div className="text-3xl font-bold text-white tabular-nums">+14 Days</div>
              <div className="text-xs text-neutral-400 mt-2">Avg. delay per US-India voyage</div>
            </div>
            
            <div className="bg-rose-950/40 border border-rose-900/50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-rose-400 text-xs font-mono uppercase tracking-widest mb-2">
                <Anchor className="w-4 h-4" /> Bunker Fuel Cost
              </div>
              <div className="text-3xl font-bold text-white tabular-nums">+$450,000</div>
              <div className="text-xs text-neutral-400 mt-2">Additional fuel burn at 12 knots</div>
            </div>
            
            <div className="bg-emerald-950/40 border border-emerald-900/50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono uppercase tracking-widest mb-2">
                <ShieldAlert className="w-4 h-4" /> War-Risk Insurance
              </div>
              <div className="text-3xl font-bold text-white tabular-nums">-$120,000</div>
              <div className="text-xs text-neutral-400 mt-2">Premiums saved by avoiding HRA</div>
            </div>

            <div className="bg-rose-950/40 border border-rose-900/50 rounded-lg p-4 flex flex-col justify-center">
              <div className="flex items-center gap-2 text-rose-400 text-xs font-mono uppercase tracking-widest mb-1">
                <CircleDollarSign className="w-4 h-4" /> Net Impact (Per Voyage)
              </div>
              <div className="text-3xl font-bold text-rose-400 tabular-nums">+$330,000</div>
              <div className="text-xs text-rose-400/70 mt-1">Total unexpected cost increase</div>
            </div>
          </div>
        )}
      </div>

      {/* Header */}
      <div className="flex items-center justify-between pt-6 border-t border-neutral-800">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
            <Scale className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-white">
              Portfolio Scenarios
            </h1>
            <p className="text-sm text-neutral-500 mt-1">
              Compare multi-voyage allocations, draft penalties, and volume trade-offs.
            </p>
          </div>
        </div>
        
        <button className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-4 py-2 rounded-lg text-sm font-mono font-bold uppercase tracking-wider hover:bg-emerald-500/20 transition-colors flex items-center gap-2 focus-ring btn-sweep active:scale-[0.97]">
          <Plus className="w-4 h-4" />
          New Scenario
        </button>
      </div>

      {/* Scenarios Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="minimal-panel p-6 border border-neutral-800 hover:scale-[1.01] hover:border-neutral-700/60 transition-all duration-300">
          <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
            <h2 className="text-base font-medium text-white flex items-center gap-2 uppercase tracking-wide font-mono">
              Scenario A
              <span className="text-xs font-mono px-2 py-0.5 ml-2 rounded bg-neutral-800 text-neutral-400">Baseline</span>
            </h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-neutral-900/50 rounded-lg p-3 border border-neutral-800">
              <div className="text-xs font-mono uppercase tracking-widest text-neutral-500">Primary Strategy</div>
              <div className="text-sm text-white">Split load across 3 Supramaxes</div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-neutral-900/50 rounded-lg border border-neutral-800">
                <div className="text-xs text-neutral-500 mb-1">Total Volume</div>
                <div className="text-xl font-mono tabular-nums text-white truncate">165k MT</div>
              </div>
              <div className="p-3 bg-neutral-900/50 rounded-lg border border-neutral-800">
                <div className="text-xs text-neutral-500 mb-1">Execution</div>
                <div className="text-lg leading-tight font-mono text-white">Oct 12-18</div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-white/10">
              <div className="text-xs font-mono uppercase tracking-widest mb-2 text-neutral-500">Key Trade-offs</div>
              <ul className="space-y-2 text-sm text-neutral-400">
                <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full mt-1 shrink-0 bg-blue-500" />Avoids draft restrictions at destination</li>
                <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full mt-1 shrink-0 bg-rose-500" />Higher total bunker fuel cost</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="minimal-panel p-6 border border-emerald-500/30 hover:scale-[1.01] hover:border-emerald-500/60 shadow-[0_0_30px_rgba(52,211,153,0.05)] transition-all duration-300 relative overflow-hidden">
          <div className="absolute inset-0 bg-emerald-500/5 pointer-events-none" />
          <div className="flex items-center justify-between border-b border-emerald-500/20 pb-4 mb-4 relative">
            <h2 className="text-base font-medium text-emerald-400 flex items-center gap-2 uppercase tracking-wide font-mono">
              Scenario B
              <span className="text-xs font-mono px-2 py-0.5 ml-2 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                AI Recommended
              </span>
            </h2>
          </div>
          
          <div className="space-y-4 relative">
            <div className="flex justify-between items-center bg-neutral-900/50 rounded-lg p-3 border border-neutral-800">
              <div className="text-xs font-mono uppercase tracking-widest text-emerald-400/70">Primary Strategy</div>
              <div className="text-sm text-white">Consolidate into 1 Capesize</div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-neutral-900/50 rounded-lg border border-neutral-800">
                <div className="text-xs text-neutral-500 mb-1">Total Volume</div>
                <div className="text-xl font-mono tabular-nums text-white truncate">165k MT</div>
              </div>
              <div className="p-3 bg-neutral-900/50 rounded-lg border border-neutral-800">
                <div className="text-xs text-neutral-500 mb-1">Execution</div>
                <div className="text-lg leading-tight font-mono text-emerald-400">Oct 20-22</div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-emerald-500/20">
              <div className="text-xs font-mono uppercase tracking-widest mb-2 text-emerald-400/70">Key Trade-offs</div>
              <ul className="space-y-2 text-sm text-neutral-400">
                <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full mt-1 shrink-0 bg-emerald-400" />Economies of scale reduce cost by $1.4M</li>
                <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full mt-1 shrink-0 bg-emerald-400" />Requires +2 days laycan extension</li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
