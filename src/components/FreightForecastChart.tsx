"use client";

import React, { useState } from "react";
import { 
  ComposedChart, 
  LineChart,
  Line, 
  Area,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine
} from "recharts";
import { MOCK_FREIGHT_FORECAST, MULTI_YEAR_SEASONALITY_DATA } from "@/lib/maritime-data";
import { TrendingDown, TrendingUp, Sparkles, Clock, CalendarDays, BrainCircuit, Activity, Flame } from "lucide-react";
import { usePortFlowData } from "@/context/PortFlowContext";

export default function FreightForecastChart() {
  const [viewMode, setViewMode] = useState<'short-term' | 'seasonality'>('short-term');
  const [showBacktest, setShowBacktest] = useState(false);
  const { isRedSeaClosed } = usePortFlowData();
  
  // Format the data so Recharts can draw the confidence band using an array [lowerBound, upperBound]
  const formattedShortTermData = MOCK_FREIGHT_FORECAST.map(d => {
    // Determine if this date is "future" (rough heuristic, we can just bump the later ones)
    // presentDay is Nov 05, so let's spike everything from Nov 06 onwards.
    const isFuture = ["Nov 06", "Nov 07", "Nov 08", "Nov 09", "Nov 10"].includes(d.date);
    const spikeMultiplier = (isRedSeaClosed && isFuture) ? 1.45 : 1.0;
    
    return {
      ...d,
      actual: d.actual ? d.actual * spikeMultiplier : undefined,
      predicted: d.predicted ? d.predicted * spikeMultiplier : undefined,
      predictedBacktest: d.predictedBacktest ? d.predictedBacktest * spikeMultiplier : undefined,
      lowerBound: d.lowerBound ? d.lowerBound * spikeMultiplier : undefined,
      upperBound: d.upperBound ? d.upperBound * spikeMultiplier : undefined,
      confidenceRange: d.lowerBound && d.upperBound ? [d.lowerBound * spikeMultiplier, d.upperBound * spikeMultiplier] : null
    };
  });

  const presentDay = "Nov 05";

  return (
    <div className="flex flex-col xl:flex-row gap-6 w-full h-full animate-page-enter">
      {/* Chart Section */}
      <div className="flex-1 minimal-panel hover:scale-[1.005] hover:border-neutral-700/60 transition-all duration-300 p-5 flex flex-col">
        <div className="flex items-start justify-between border-b border-neutral-800 pb-3 mb-6">
          <div>
            <h2 className="text-base font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2 border-l-2 border-cyan-500/40 pl-3">
              <Clock className="w-4 h-4 text-white" />
              Spot Freight Rate Forecast (Capesize)
            </h2>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 border border-emerald-500/20 flex items-center gap-1 transition-all duration-200">
                <BrainCircuit className="w-3 h-3" /> MODEL: ENSEMBLE (XGBOOST + LSTM)
              </span>
              <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest bg-neutral-900 px-2 py-0.5 border border-neutral-800 transition-all duration-200">
                CONFIDENCE: 95% CI
              </span>
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-3">
            <div className="flex gap-2">
              <button 
                onClick={() => setViewMode('short-term')}
                className={`px-3 py-1 text-xs uppercase font-mono tracking-wider border hover:brightness-110 active:scale-[0.97] transition-all duration-200 ${viewMode === 'short-term' ? 'bg-emerald-500/10 border-emerald-400 text-emerald-400' : 'bg-transparent border-neutral-700 text-neutral-500 hover:text-white'}`}
              >
                Short-Term (Q4)
              </button>
              <button 
                onClick={() => setViewMode('seasonality')}
                className={`px-3 py-1 text-xs uppercase font-mono tracking-wider border hover:brightness-110 active:scale-[0.97] transition-all duration-200 ${viewMode === 'seasonality' ? 'bg-emerald-500/10 border-emerald-400 text-emerald-400' : 'bg-transparent border-neutral-700 text-neutral-500 hover:text-white'}`}
              >
                Seasonality View
              </button>
            </div>
            {viewMode === 'short-term' && (
              <label className="flex items-center gap-2 text-xs font-mono text-neutral-400 cursor-pointer hover:text-white transition-colors">
                <input 
                  type="checkbox" 
                  checked={showBacktest} 
                  onChange={e => setShowBacktest(e.target.checked)} 
                  className="accent-emerald-400" 
                />
                Show Model Backtest (94.2% Acc)
              </label>
            )}
          </div>
        </div>

        <div className="flex-1 w-full min-h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            {viewMode === 'short-term' ? (
              <ComposedChart data={formattedShortTermData} margin={{ top: 20, right: 30, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" vertical={false} />
                <XAxis dataKey="date" stroke="var(--chart-axis)" fontSize={10} tickMargin={10} axisLine={false} tickLine={false} />
                <YAxis stroke="var(--chart-axis)" fontSize={10} tickFormatter={(val) => `$${val}`} axisLine={false} tickLine={false} domain={['dataMin - 1', 'dataMax + 1']} />
                
                <Tooltip 
                  contentStyle={{ backgroundColor: "#000", border: "1px solid #333", fontSize: "12px", fontFamily: "monospace" }} 
                  itemStyle={{ color: "#fff" }}
                />
                
                <ReferenceLine x={presentDay} stroke="var(--chart-axis)" strokeDasharray="3 3" label={{ position: 'top', value: 'TODAY', fill: "var(--chart-axis)", fontSize: 10, fontFamily: 'monospace' }} />

                {/* Confidence Interval Area */}
                <Area 
                  type="monotone" 
                  dataKey="confidenceRange" 
                  stroke="none" 
                  fill="var(--route-active)" 
                  fillOpacity={0.08} 
                  name="95% Confidence Interval" 
                />

                {/* Actual Historical Line */}
                <Line 
                  type="monotone" 
                  dataKey="actual" 
                  stroke="var(--chart-line)" 
                  strokeWidth={2} 
                  dot={{ r: 3, fill: "#000", stroke: "#ffffff", strokeWidth: 2 }} 
                  activeDot={{ r: 6 }} 
                  name="Actual Rate" 
                />
                
                {/* Backtest Predicted Line (Historical) */}
                {showBacktest && (
                  <Line 
                    type="monotone" 
                    dataKey="predictedBacktest" 
                    stroke="var(--chart-line-alt)" 
                    strokeWidth={1.5} 
                    strokeDasharray="4 4" 
                    dot={false} 
                    activeDot={{ r: 4 }} 
                    name="Backtest Prediction" 
                  />
                )}

                {/* Future Predicted Line */}
                <Line 
                  type="monotone" 
                  dataKey="predicted" 
                  stroke="var(--route-active)" 
                  strokeWidth={2} 
                  strokeDasharray="5 5" 
                  dot={{ r: 3, fill: "#000", stroke: "#34d399", strokeWidth: 2 }} 
                  activeDot={{ r: 6, fill: "#34d399" }} 
                  name="Predicted Rate" 
                />
              </ComposedChart>
            ) : (
              <LineChart data={MULTI_YEAR_SEASONALITY_DATA} margin={{ top: 20, right: 30, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" vertical={false} />
                <XAxis dataKey="month" stroke="var(--chart-axis)" fontSize={10} tickMargin={10} axisLine={false} tickLine={false} />
                <YAxis stroke="var(--chart-axis)" fontSize={10} tickFormatter={(val) => `$${val}`} axisLine={false} tickLine={false} domain={['dataMin - 1', 'dataMax + 1']} />
                <Tooltip contentStyle={{ backgroundColor: "#000", border: "1px solid #333", fontSize: "12px", fontFamily: "monospace" }} />
                <Line type="monotone" dataKey="2024" stroke="var(--chart-axis)" strokeWidth={1.5} dot={false} activeDot={{ r: 4 }} name="2024 Actual" />
                <Line type="monotone" dataKey="2025" stroke="var(--chart-line)" strokeWidth={2} dot={false} activeDot={{ r: 4 }} name="2025 Actual" />
                <Line type="monotone" dataKey="2026_Predicted" stroke="var(--route-active)" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 2, fill: "#000", stroke: "#34d399" }} activeDot={{ r: 6, fill: "#34d399" }} name="2026 Predicted" />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* AI Overview Section */}
      <div className="w-full xl:w-1/3 minimal-panel hover:scale-[1.005] hover:border-neutral-700/60 transition-all duration-300 p-5 bg-neutral-900/40 flex flex-col">
        <h2 className="text-base font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2 border-b border-emerald-500/30 pb-3 mb-4 border-l-2 border-cyan-500/40 pl-3">
          <Sparkles className="w-4 h-4" />
          Realtime AI Market Overview
        </h2>
        
        <div className="flex-1 flex flex-col gap-4">
          <div className="p-3 bg-black border border-neutral-800 transition-all duration-300 hover:border-neutral-700">
            <div className="text-xs font-mono text-neutral-500 uppercase tracking-widest mb-1 transition-all duration-200">Current Spot Rate</div>
            <div className="text-2xl font-mono text-white font-bold flex items-center gap-2 tabular-nums">
              $15.90 <span className="text-sm text-neutral-500 font-normal">/ MT</span>
            </div>
          </div>
          
          <div className="p-3 bg-emerald-500/5 border border-emerald-500/20 transition-all duration-300 hover:border-emerald-500/40">
            <div className="text-xs font-mono text-emerald-400/70 uppercase tracking-widest mb-1 flex items-center justify-between transition-all duration-200">
              Projected {viewMode === 'short-term' ? '30-Day' : 'Seasonal'} Low
              <TrendingDown className="w-3 h-3 animate-bounce" />
            </div>
            <div className="text-2xl font-mono text-emerald-400 font-bold flex items-center gap-2 tabular-nums">
              {viewMode === 'short-term' ? '$14.90' : '$12.50'} <span className="text-sm text-emerald-400/50 font-normal transition-all duration-200">/ MT ({viewMode === 'short-term' ? 'Dec 10' : 'Feb 2026'})</span>
            </div>
          </div>

          <div className="mt-2 text-sm font-mono text-neutral-300 leading-relaxed border-l-2 border-emerald-400 pl-3 py-1">
            <span className="text-emerald-400 font-bold uppercase tracking-widest text-xs block mb-1 transition-all duration-200">AI Recommendation</span>
            {viewMode === 'short-term' ? (
              isRedSeaClosed ? (
                <span className="animate-in fade-in duration-300 text-rose-300">
                  <strong className="text-rose-400">CRITICAL SHOCK DETECTED:</strong> Red Sea closure has triggered massive vessel rerouting via Cape of Good Hope, tightening global tonnage supply. Spot rates are projected to surge by 45%.
                  <br/><br/>
                  <strong className="text-white">Action:</strong> Immediately lock in remaining Q4 Spot requirements at current multi-voyage rates. Delaying execution will result in projected $450,000 extra cost per Capesize voyage.
                </span>
              ) : (
                <span className="animate-in fade-in duration-300">
                  The neural forecasting model anticipates a sharp peak around mid-November due to seasonal congestion, followed by a sudden drop in rates as port queues clear. 
                  <br/><br/>
                  <strong>Action:</strong> Delay executing long-term charters for 3 weeks to secure the $14.90/t dip, projecting a structural savings of $120,000 per Capesize voyage.
                </span>
              )
            ) : (
              <span className="animate-in fade-in duration-300">
                Historical 3-year overlay confirms a persistent pre-monsoon freight spike starting in June, peaking mid-July due to major East Coast draft constraints.
                <br/><br/>
                <strong>Action:</strong> Front-load Capesize Q2 volumes before May. Shift July/August allocations to Panamax vessels to avoid structural lightering penalties at Sagar.
              </span>
            )}
          </div>

          {/* Model Inputs Legend */}
          <div className="mt-auto pt-4 border-t border-neutral-800">
            <div className="text-xs font-mono text-neutral-500 uppercase tracking-widest mb-2 transition-all duration-200">Live Model Inputs (Feature Importance)</div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="w-3 h-3 text-emerald-400" />
                  <span className="text-sm font-mono text-neutral-300 transition-all duration-200">Baltic Dry Index</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-1 bg-neutral-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-400 w-[45%]" />
                  </div>
                  <span className="text-xs font-mono text-neutral-500 tabular-nums">45%</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Flame className="w-3 h-3 text-amber-500" />
                  <span className="text-sm font-mono text-neutral-300 transition-all duration-200">Bunker Fuel Prices</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-1 bg-neutral-800 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 w-[30%]" />
                  </div>
                  <span className="text-xs font-mono text-neutral-500 tabular-nums">30%</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CalendarDays className="w-3 h-3 text-blue-500" />
                  <span className="text-sm font-mono text-neutral-300 transition-all duration-200">Seasonal Index</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-1 bg-neutral-800 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 w-[15%]" />
                  </div>
                  <span className="text-xs font-mono text-neutral-500 tabular-nums">15%</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
