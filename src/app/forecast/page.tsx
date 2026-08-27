"use client";

import { Activity, AlertTriangle, Globe, MapPin, Route, ShieldAlert, ArrowRight, Ship } from "lucide-react";
import FreightForecastChart from "@/components/FreightForecastChart";

export default function ForecastPage() {
  return (
    <div className="flex flex-col gap-6 h-full p-2">
      <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
        <div>
          <h1 className="text-xl font-bold uppercase tracking-widest text-white flex items-center gap-3">
            <Globe className="w-5 h-5" />
            Global Risk & AI Market Forecasting
          </h1>
          <p className="text-xs font-mono text-neutral-500 mt-1 uppercase tracking-widest">
            Early Warnings, Deadheading Prevention, and Spot Rate Predictions
          </p>
        </div>
        <div className="text-[10px] font-mono border border-neutral-800 px-3 py-1 text-neutral-400 uppercase tracking-widest bg-neutral-900/50">
          Module: SIGMA-9
        </div>
      </div>

      <div className="flex-1 overflow-y-auto hide-scrollbar flex flex-col gap-6 pb-6">
        {/* Top Full-Width Section: AI Market Forecast */}
        <FreightForecastChart />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Left Column: Risk Mitigation */}
          <div className="flex flex-col gap-6">
          <div className="minimal-panel p-5 flex flex-col gap-4 bg-neutral-900/10">
            <h2 className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-neutral-800 pb-3">
              <ShieldAlert className="w-4 h-4 text-white" />
              Risk Mitigation Alerts
            </h2>
            
            <div className="flex flex-col gap-3">
              {/* Alert 1 */}
              <div className="border-l-2 border-white pl-4 py-2 bg-neutral-900/30">
                <div className="flex justify-between items-start mb-1">
                  <div className="text-[10px] font-mono text-white uppercase tracking-widest font-bold">Severe Weather Warning</div>
                  <div className="text-[10px] font-mono text-neutral-500">2 HRS AGO</div>
                </div>
                <div className="text-xs font-mono text-neutral-400">
                  Typhoon expected near Indonesia (Kalimantan) loading ports in 72 hours. 
                  Expect 3-4 days of berthing delays. 
                </div>
                <div className="mt-2 text-[10px] font-mono text-neutral-500 uppercase tracking-widest flex items-center gap-1">
                  <ArrowRight className="w-3 h-3" /> Impact: Spot rates for coal expected to jump 8%.
                </div>
              </div>

              {/* Alert 2 */}
              <div className="border-l-2 border-neutral-700 pl-4 py-2">
                <div className="flex justify-between items-start mb-1">
                  <div className="text-[10px] font-mono text-neutral-300 uppercase tracking-widest font-bold">Port Congestion</div>
                  <div className="text-[10px] font-mono text-neutral-500">14 HRS AGO</div>
                </div>
                <div className="text-xs font-mono text-neutral-400">
                  Australia (Newcastle) reporting massive queues for Panamax vessels due to crane maintenance.
                </div>
                <div className="mt-2 text-[10px] font-mono text-neutral-500 uppercase tracking-widest flex items-center gap-1">
                  <ArrowRight className="w-3 h-3" /> Impact: 48 hour turnaround delay.
                </div>
              </div>
            </div>
          </div>

          <div className="minimal-panel p-5 flex flex-col gap-4 bg-neutral-900/10 flex-1">
             <h2 className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-neutral-800 pb-3">
              <Activity className="w-4 h-4 text-white" />
              Macro Volatility Index
            </h2>
            <div className="flex-1 flex flex-col justify-center items-center text-center p-6">
              <div className="text-4xl font-mono text-white font-bold mb-2">HIGH</div>
              <p className="text-xs font-mono text-neutral-500 uppercase tracking-widest max-w-xs">
                Global freight volatility is peaking due to supply constraints. Recommend locking multi-voyage contracts immediately.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Idle Scenario Management (Deadheading) */}
        <div className="minimal-panel p-5 flex flex-col gap-4 bg-neutral-900/10">
          <h2 className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-neutral-800 pb-3">
            <Route className="w-4 h-4 text-white" />
            Idle Scenario Management (Deadhead Prevention)
          </h2>
          <p className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest mb-2">
            AI-suggested alternative employment routes to minimize empty vessel transit.
          </p>

          <div className="flex flex-col gap-4">
            
            {/* Scenario 1 */}
            <div className="border border-neutral-800 p-4 bg-black">
              <div className="flex items-center justify-between mb-3 border-b border-neutral-800 pb-2">
                <div className="text-xs font-mono font-bold text-white uppercase tracking-widest flex items-center gap-2">
                  <Ship className="w-4 h-4" />
                  MV Pacific Horizon (Supramax)
                </div>
                <div className="text-[10px] font-mono text-neutral-500">Status: Discharging</div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest mb-1">Current Location</div>
                  <div className="text-xs font-mono text-white flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-neutral-500" /> Vizag Port, India
                  </div>
                </div>
                <div>
                  <div className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest mb-1">Predicted Idle Time</div>
                  <div className="text-xs font-mono text-white">Starts in 48 Hours</div>
                </div>
              </div>

              <div className="border border-neutral-800 p-3 bg-neutral-900/50">
                <div className="text-[10px] font-mono text-white uppercase tracking-widest font-bold mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-3 h-3" />
                  AI Alternative Employment Route
                </div>
                <p className="text-xs font-mono text-neutral-400">
                  Instead of deadheading back to Australia empty, secure a short-term Iron Ore cargo from Vizag to China (Guangzhou). Market demand for Supramax on this route is currently elevated.
                </p>
                <div className="mt-3 text-[10px] font-mono text-white font-bold uppercase tracking-widest border border-white px-2 py-1 inline-block">
                  Estimated Savings: $145,000
                </div>
              </div>
            </div>

            {/* Scenario 2 */}
            <div className="border border-neutral-800 p-4 bg-black">
              <div className="flex items-center justify-between mb-3 border-b border-neutral-800 pb-2">
                <div className="text-xs font-mono font-bold text-white uppercase tracking-widest flex items-center gap-2">
                  <Ship className="w-4 h-4" />
                  Maersk Sentinel (Panamax)
                </div>
                <div className="text-[10px] font-mono text-neutral-500">Status: En Route</div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest mb-1">Current Location</div>
                  <div className="text-xs font-mono text-white flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-neutral-500" /> Approaching Haldia
                  </div>
                </div>
                <div>
                  <div className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest mb-1">Predicted Idle Time</div>
                  <div className="text-xs font-mono text-white">Starts in 6 Days</div>
                </div>
              </div>

              <div className="border border-neutral-800 p-3 bg-neutral-900/50">
                <div className="text-[10px] font-mono text-white uppercase tracking-widest font-bold mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-3 h-3" />
                  AI Alternative Employment Route
                </div>
                <p className="text-xs font-mono text-neutral-400">
                  Sub-optimal positioning. Suggest routing vessel to Dhamra post-discharge for a backhaul fertilizer cargo to Southeast Asia, perfectly matching the Panamax LOA profile.
                </p>
                <div className="mt-3 text-[10px] font-mono text-white font-bold uppercase tracking-widest border border-white px-2 py-1 inline-block">
                  Estimated Savings: $92,000
                </div>
              </div>
            </div>

          </div>
        </div>
        
        </div>
      </div>
    </div>
  );
}
