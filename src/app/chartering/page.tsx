"use client";

import { useState } from "react";
import { Ship, Anchor, Calculator, TrendingDown, Clock, ShieldAlert, Cpu, CheckCircle2, AlertTriangle, ArrowRight } from "lucide-react";

export default function CharteringPage() {
  const [origin, setOrigin] = useState("Australia (Newcastle)");
  const [destination, setDestination] = useState("Haldia");
  const [cargo, setCargo] = useState("Coal");
  const [volume, setVolume] = useState("75000");
  const [status, setStatus] = useState<"idle" | "calculating" | "complete">("idle");
  const [logs, setLogs] = useState<string[]>([]);

  const [result, setResult] = useState<any>(null);

  const handleOptimize = () => {
    setStatus("calculating");
    setLogs(["Initializing Gemini AI Freight Model..."]);

    setTimeout(() => setLogs(l => [...l, "Analyzing East Coast draft restrictions..."]), 600);
    setTimeout(() => setLogs(l => [...l, `Checking LOA limits for ${destination}...`]), 1200);
    setTimeout(() => setLogs(l => [...l, `Evaluating optimal vessel class for ${volume} MT...`]), 1800);
    setTimeout(() => setLogs(l => [...l, "Simulating Spot vs Multi-Voyage contract rates..."]), 2400);
    
    setTimeout(() => {
      const vol = parseInt(volume) || 50000;
      const shallowPorts = ["Haldia", "Gopalpur", "Sagar-Sandheads"];
      const isShallow = shallowPorts.includes(destination);
      
      let approvedVessel = "";
      let rejectedVessel = "";
      let rejectedReason = "";
      let approvedReason = "";

      if (vol > 100000) {
        if (isShallow) {
           approvedVessel = "2x PANAMAX";
           rejectedVessel = "CAPESIZE";
           rejectedReason = `Destination (${destination}) has a strict 8.0m draft limit. A Capesize vessel (16m draft) would ground or require costly lighterage.`;
           approvedReason = `Splitting ${vol.toLocaleString()} MT into two Panamax vessels perfectly aligns with ${destination}'s infrastructure and cargo handling rates.`;
        } else {
           approvedVessel = "CAPESIZE";
           rejectedVessel = "PANAMAX";
           rejectedReason = `Using multiple Panamax vessels for ${vol.toLocaleString()} MT to ${destination} is highly inefficient and increases port dues.`;
           approvedReason = `${destination} is a deep-water port capable of handling Capesize drafts. This maximizes economies of scale for ${cargo}.`;
        }
      } else if (vol > 55000) {
         if (isShallow && vol > 80000) {
           approvedVessel = "2x SUPRAMAX";
           rejectedVessel = "PANAMAX";
           rejectedReason = `${destination} draft constraints make fully laden Panamax arrivals risky during current tidal conditions.`;
           approvedReason = `Supramax vessels offer the ideal LOA and draft flexibility for ${destination} while handling ${vol.toLocaleString()} MT.`;
         } else {
           approvedVessel = "PANAMAX";
           rejectedVessel = "SUPRAMAX";
           rejectedReason = `A Supramax is too small for ${vol.toLocaleString()} MT, requiring multiple voyages and driving up logistics costs.`;
           approvedReason = `A single Panamax perfectly matches the ${vol.toLocaleString()} MT volume requirement while clearing ${destination}'s draft limits.`;
         }
      } else {
         approvedVessel = "HANDYSIZE / SUPRAMAX";
         rejectedVessel = "PANAMAX";
         rejectedReason = `Volume (${vol.toLocaleString()} MT) is too low to justify the chartering cost of a Panamax vessel.`;
         approvedReason = `Handysize/Supramax provides the best cost-to-volume ratio for ${cargo} on this trade lane to ${destination}.`;
      }

      const baseRate = (Math.random() * 5 + 20).toFixed(2); // 20 - 25
      const multiRate = (parseFloat(baseRate) - (Math.random() * 3 + 3)).toFixed(2);
      const savings = (parseFloat(baseRate) - parseFloat(multiRate)) * vol;

      setResult({
        approvedVessel,
        rejectedVessel,
        rejectedReason,
        approvedReason,
        spotRate: baseRate,
        multiRate,
        savings: savings.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
      });
      
      setStatus("complete");
    }, 3200);
  };

  return (
    <div className="flex flex-col gap-6 h-full p-2">
      <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
        <div>
          <h1 className="text-xl font-bold uppercase tracking-widest text-white flex items-center gap-3">
            <Calculator className="w-5 h-5" />
            AI Chartering & Vessel Optimizer
          </h1>
          <p className="text-xs font-mono text-neutral-500 mt-1 uppercase tracking-widest">
            Predictive Freight & Infrastructure Alignment Model
          </p>
        </div>
        <div className="text-[10px] font-mono border border-neutral-800 px-3 py-1 text-neutral-400 uppercase tracking-widest bg-neutral-900/50">
          Module: OMEGA-7
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
        
        {/* Left Column: Input Form */}
        <div className="lg:col-span-4 minimal-panel p-6 flex flex-col gap-6">
          <div>
            <label className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest block mb-2">Origin Port (Loading)</label>
            <select className="w-full bg-black border border-neutral-700 text-white font-mono text-sm p-2 outline-none focus:border-white transition-colors" value={origin} onChange={e => setOrigin(e.target.value)}>
              <option>Australia (Newcastle)</option>
              <option>US (Gulf Coast)</option>
              <option>Mozambique (Maputo)</option>
              <option>Russia (Ust-Luga)</option>
              <option>Indonesia (Kalimantan)</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest block mb-2">Destination Port (Discharge)</label>
            <select className="w-full bg-black border border-neutral-700 text-white font-mono text-sm p-2 outline-none focus:border-white transition-colors" value={destination} onChange={e => setDestination(e.target.value)}>
              <option>Paradip</option>
              <option>Vizag</option>
              <option>Gangavaram</option>
              <option>Gopalpur</option>
              <option>Dhamra</option>
              <option>Sagar-Sandheads</option>
              <option>Haldia</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest block mb-2">Cargo Type</label>
              <select className="w-full bg-black border border-neutral-700 text-white font-mono text-sm p-2 outline-none focus:border-white transition-colors" value={cargo} onChange={e => setCargo(e.target.value)}>
                <option>Coal</option>
                <option>Iron Ore</option>
                <option>Fertilizer</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest block mb-2">Volume (MT)</label>
              <input type="number" className="w-full bg-black border border-neutral-700 text-white font-mono text-sm p-2 outline-none focus:border-white transition-colors" value={volume} onChange={e => setVolume(e.target.value)} />
            </div>
          </div>

          <button 
            onClick={handleOptimize}
            disabled={status === "calculating"}
            className="mt-auto w-full border border-white bg-white text-black font-mono text-xs font-bold uppercase tracking-widest py-3 hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {status === "calculating" ? <Cpu className="w-4 h-4 animate-pulse" /> : <Ship className="w-4 h-4" />}
            {status === "calculating" ? "Calculating Routes..." : "Generate Optimal Charter"}
          </button>
        </div>

        {/* Right Column: AI Output */}
        <div className="lg:col-span-8 minimal-panel flex flex-col relative overflow-hidden">
          
          {status === "idle" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-neutral-600">
              <Cpu className="w-12 h-12 mb-4 opacity-20" />
              <p className="font-mono text-xs uppercase tracking-widest">Awaiting Logistics Parameters</p>
            </div>
          )}

          {status === "calculating" && (
            <div className="absolute inset-0 p-8 flex flex-col justify-end bg-black">
              <div className="space-y-3">
                {logs.map((log, i) => (
                  <div key={i} className="font-mono text-xs text-neutral-400 flex items-center gap-3 animate-slide-in">
                    <span className="text-white">&gt;</span> {log}
                  </div>
                ))}
                <div className="font-mono text-xs text-white flex items-center gap-3 animate-pulse mt-4">
                  <span>&gt;</span> _
                </div>
              </div>
            </div>
          )}

          {status === "complete" && result && (
            <div className="absolute inset-0 overflow-y-auto hide-scrollbar p-6 flex flex-col gap-6 animate-slide-in">
              
              {/* Top: Vessel Recommendation */}
              <div className="border border-neutral-800 p-5 bg-neutral-900/30">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-white" />
                      Vessel Type Optimization
                    </h2>
                    <p className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest mt-1">
                      Draft & Infrastructure Constraint Check
                    </p>
                  </div>
                  <div className="text-xs font-mono font-bold bg-white text-black px-2 py-1 uppercase tracking-widest">
                    {result.approvedVessel} SELECTED
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="border-l-2 border-red-900 pl-3">
                    <div className="text-[10px] font-mono text-red-500 uppercase tracking-widest mb-1 flex items-center gap-1">
                      <ShieldAlert className="w-3 h-3" /> {result.rejectedVessel} Rejected
                    </div>
                    <p className="text-xs font-mono text-neutral-300">
                      {result.rejectedReason}
                    </p>
                  </div>
                  <div className="border-l-2 border-white pl-3">
                    <div className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                      <Anchor className="w-3 h-3 text-white" /> {result.approvedVessel} Approved
                    </div>
                    <p className="text-xs font-mono text-neutral-300">
                      {result.approvedReason}
                    </p>
                  </div>
                </div>
              </div>

              {/* Middle: Market Entry */}
              <div className="border border-neutral-800 p-5 bg-neutral-900/30">
                <h2 className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2 mb-4">
                  <Clock className="w-4 h-4 text-white" />
                  Optimal Market Entry Timing
                </h2>
                <p className="text-xs font-mono text-neutral-400 mb-4">
                  AI Time-series analysis indicates high volatility on the {origin} route due to seasonal demand.
                </p>
                <div className="flex items-center gap-4 border border-neutral-700 p-3">
                  <AlertTriangle className="w-5 h-5 text-white animate-pulse" />
                  <div>
                    <div className="text-xs font-mono text-white uppercase tracking-widest">Recommendation: Enter market in 4-6 days.</div>
                    <div className="text-[10px] font-mono text-neutral-500">Wait for minor dip before Q3 rally. Securing now risks a 5% premium.</div>
                  </div>
                </div>
              </div>

              {/* Bottom: Financials (Spot vs Multi-voyage) */}
              <div className="border border-neutral-800 p-5 bg-neutral-900/30">
                <h2 className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2 mb-6">
                  <TrendingDown className="w-4 h-4 text-white" />
                  Financial Projection: Spot vs Multi-Voyage
                </h2>
                
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-mono text-neutral-400 uppercase tracking-widest">Reactive Single Spot Contract</div>
                    <div className="text-sm font-mono text-white">${result.spotRate} / MT</div>
                  </div>
                  <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
                    <div className="text-xs font-mono text-white font-bold uppercase tracking-widest">Proactive Multi-Voyage (6 Months)</div>
                    <div className="text-sm font-mono text-white font-bold border-b border-white">${result.multiRate} / MT</div>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <div className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">Total Projected Logistics Savings</div>
                    <div className="text-lg font-mono text-white font-bold flex items-center gap-2">
                      <ArrowRight className="w-4 h-4" />
                      {result.savings}
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}
