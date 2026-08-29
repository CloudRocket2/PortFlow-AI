"use client";

import React, { useState } from "react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine
} from "recharts";
import { MOCK_FREIGHT_FORECAST, MULTI_YEAR_SEASONALITY_DATA } from "@/lib/maritime-data";
import { TrendingDown, TrendingUp, Sparkles, Clock, CalendarDays } from "lucide-react";

export default function FreightForecastChart() {
  const [viewMode, setViewMode] = useState<'short-term' | 'seasonality'>('short-term');
  // Find the 'present day' index (where actual meets predicted)
  const presentDay = MOCK_FREIGHT_FORECAST.find(d => d.actual !== null && d.predicted !== null)?.date || "Nov 05";

  return (
    <div className="flex flex-col xl:flex-row gap-6 w-full h-full">
      {/* Chart Section */}
      <div className="flex-1 minimal-panel p-5 bg-neutral-900/20 flex flex-col">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3 mb-6">
          <h2 className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Clock className="w-4 h-4 text-white" />
            Spot Freight Rate Forecast (Capesize)
          </h2>
          
          <div className="flex gap-2">
            <button 
              onClick={() => setViewMode('short-term')}
              className={`px-3 py-1 text-[10px] uppercase font-mono tracking-wider border ${viewMode === 'short-term' ? 'bg-[#00ff00]/10 border-[#00ff00] text-[#00ff00]' : 'bg-transparent border-neutral-700 text-neutral-500 hover:text-white'}`}
            >
              Short-Term (Q4)
            </button>
            <button 
              onClick={() => setViewMode('seasonality')}
              className={`px-3 py-1 text-[10px] uppercase font-mono tracking-wider border flex items-center gap-1 ${viewMode === 'seasonality' ? 'bg-[#00ff00]/10 border-[#00ff00] text-[#00ff00]' : 'bg-transparent border-neutral-700 text-neutral-500 hover:text-white'}`}
            >
              <CalendarDays className="w-3 h-3" /> Seasonality
            </button>
          </div>
        </div>
        
        <div className="flex-1 min-h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            {viewMode === 'short-term' ? (
              <LineChart data={MOCK_FREIGHT_FORECAST} margin={{ top: 20, right: 30, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                <XAxis dataKey="date" stroke="#666" fontSize={10} tickMargin={10} axisLine={false} tickLine={false} />
                <YAxis stroke="#666" fontSize={10} tickFormatter={(val) => `$${val}`} axisLine={false} tickLine={false} domain={['dataMin - 1', 'dataMax + 1']} />
                <Tooltip contentStyle={{ backgroundColor: "#000", border: "1px solid #333", fontSize: "12px", fontFamily: "monospace" }} itemStyle={{ color: "#fff" }} />
                <ReferenceLine x={presentDay} stroke="#666" strokeDasharray="3 3" label={{ position: 'top', value: 'TODAY', fill: '#666', fontSize: 10, fontFamily: 'monospace' }} />
                <Line type="monotone" dataKey="actual" stroke="#ffffff" strokeWidth={2} dot={{ r: 4, fill: "#000", stroke: "#fff" }} activeDot={{ r: 6, fill: "#fff" }} name="Historical (USD/t)" />
                <Line type="monotone" dataKey="predicted" stroke="#00ff00" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 4, fill: "#000", stroke: "#00ff00" }} activeDot={{ r: 6, fill: "#00ff00" }} name="AI Prediction (USD/t)" />
              </LineChart>
            ) : (
              <LineChart data={MULTI_YEAR_SEASONALITY_DATA} margin={{ top: 20, right: 30, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                <XAxis dataKey="month" stroke="#666" fontSize={10} tickMargin={10} axisLine={false} tickLine={false} />
                <YAxis stroke="#666" fontSize={10} tickFormatter={(val) => `$${val}`} axisLine={false} tickLine={false} domain={['dataMin - 1', 'dataMax + 1']} />
                <Tooltip contentStyle={{ backgroundColor: "#000", border: "1px solid #333", fontSize: "12px", fontFamily: "monospace" }} />
                <Line type="monotone" dataKey="2024" stroke="#666666" strokeWidth={1.5} dot={false} activeDot={{ r: 4 }} name="2024 Actual" />
                <Line type="monotone" dataKey="2025" stroke="#ffffff" strokeWidth={2} dot={false} activeDot={{ r: 4 }} name="2025 Actual" />
                <Line type="monotone" dataKey="2026_Predicted" stroke="#00ff00" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 2, fill: "#000", stroke: "#00ff00" }} activeDot={{ r: 6, fill: "#00ff00" }} name="2026 Predicted" />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* AI Overview Section */}
      <div className="w-full xl:w-1/3 minimal-panel p-5 bg-neutral-900/40 flex flex-col">
        <h2 className="text-sm font-mono font-bold text-[#00ff00] uppercase tracking-wider flex items-center gap-2 border-b border-[#00ff00]/30 pb-3 mb-4">
          <Sparkles className="w-4 h-4" />
          Realtime AI Market Overview
        </h2>
        
        <div className="flex-1 flex flex-col gap-4">
          <div className="p-3 bg-black border border-neutral-800">
            <div className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest mb-1">Current Spot Rate</div>
            <div className="text-2xl font-mono text-white font-bold flex items-center gap-2">
              $15.90 <span className="text-xs text-neutral-500 font-normal">/ MT</span>
            </div>
          </div>
          
          <div className="p-3 bg-[#00ff00]/5 border border-[#00ff00]/20">
            <div className="text-[10px] font-mono text-[#00ff00]/70 uppercase tracking-widest mb-1 flex items-center justify-between">
              Projected {viewMode === 'short-term' ? '30-Day' : 'Seasonal'} Low
              <TrendingDown className="w-3 h-3" />
            </div>
            <div className="text-2xl font-mono text-[#00ff00] font-bold flex items-center gap-2">
              {viewMode === 'short-term' ? '$14.90' : '$12.50'} <span className="text-xs text-[#00ff00]/50 font-normal">/ MT ({viewMode === 'short-term' ? 'Dec 10' : 'Feb 2026'})</span>
            </div>
          </div>

          <div className="mt-2 text-xs font-mono text-neutral-300 leading-relaxed border-l-2 border-[#00ff00] pl-3 py-1">
            <span className="text-[#00ff00] font-bold uppercase tracking-widest text-[10px] block mb-1">AI Recommendation</span>
            {viewMode === 'short-term' ? (
              <>
                The neural forecasting model anticipates a sharp peak around mid-November due to seasonal congestion, followed by a sudden drop in rates as port queues clear. 
                <br/><br/>
                <strong>Action:</strong> Delay executing long-term charters for 3 weeks to secure the $14.90/t dip, projecting a structural savings of $120,000 per Capesize voyage.
              </>
            ) : (
              <>
                Historical 3-year overlay confirms a persistent pre-monsoon freight spike starting in June, peaking mid-July due to major East Coast draft constraints.
                <br/><br/>
                <strong>Action:</strong> Front-load Capesize Q2 volumes before May. Shift July/August allocations to Panamax vessels to avoid structural lightering penalties at Sagar.
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
