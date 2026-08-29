"use client";

import React, { useMemo } from "react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine
} from "recharts";
import { MOCK_VOLATILITY_INDEX } from "@/lib/maritime-data";
import { Activity, TrendingUp, AlertTriangle } from "lucide-react";

export default function MacroVolatilityChart() {
  const latestData = MOCK_VOLATILITY_INDEX[7]; // Assuming "Nov 05" is index 7 as our "present day"
  const currentScore = latestData.score;
  
  const volatilityBadge = useMemo(() => {
    if (currentScore > 75) return { label: "HIGH", color: "text-red-500", border: "border-red-500/30", bg: "bg-red-500/10" };
    if (currentScore > 40) return { label: "MEDIUM", color: "text-amber-500", border: "border-amber-500/30", bg: "bg-amber-500/10" };
    return { label: "LOW", color: "text-[#00ff00]", border: "border-[#00ff00]/30", bg: "bg-[#00ff00]/10" };
  }, [currentScore]);

  return (
    <div className="flex flex-col h-full w-full">
      {/* Header section with Badge */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex flex-col">
          <div className={`text-3xl font-mono font-bold ${volatilityBadge.color}`}>
            {volatilityBadge.label}
          </div>
          <div className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest mt-1">
            Score: {currentScore}/100
          </div>
        </div>
      </div>
      
      {/* Chart Section */}
      <div className="flex-1 w-full min-h-[120px] mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={MOCK_VOLATILITY_INDEX} margin={{ top: 5, right: 0, left: -25, bottom: 0 }}>
            <defs>
              <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={currentScore > 75 ? "#ef4444" : "#f59e0b"} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={currentScore > 75 ? "#ef4444" : "#f59e0b"} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
            <XAxis 
              dataKey="date" 
              stroke="#666" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false} 
              tick={{ fill: '#666' }}
            />
            <YAxis 
              stroke="#666" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false}
              domain={[0, 100]}
              ticks={[0, 50, 100]}
              tick={{ fill: '#666' }}
            />
            <Tooltip
              contentStyle={{ backgroundColor: '#111', borderColor: '#333', fontSize: '12px', fontFamily: 'monospace' }}
              itemStyle={{ color: '#fff' }}
              labelStyle={{ color: '#888' }}
            />
            <ReferenceLine x="Nov 05" stroke="#fff" strokeDasharray="3 3" opacity={0.3} />
            <Area 
              type="monotone" 
              dataKey="score" 
              stroke={currentScore > 75 ? "#ef4444" : "#f59e0b"}
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorScore)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Drivers Section */}
      <div className="flex flex-col gap-2 mt-auto border-t border-neutral-800 pt-3">
        <div className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest mb-1">Primary Drivers</div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-3 h-3 text-red-400" />
            <span className="text-xs font-mono text-neutral-300">Baltic Dry Index</span>
          </div>
          <span className="text-xs font-mono text-red-400 font-bold">+8.2% (2w)</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-3 h-3 text-amber-400" />
            <span className="text-xs font-mono text-neutral-300">Coal Price Volatility</span>
          </div>
          <span className="text-xs font-mono text-amber-400 font-bold">Elevated</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-3 h-3 text-red-400" />
            <span className="text-xs font-mono text-neutral-300">Bunker Fuel Cost</span>
          </div>
          <span className="text-xs font-mono text-red-400 font-bold">+5.1% (30d)</span>
        </div>
      </div>
    </div>
  );
}
