"use client";

import React, { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, Cell, CartesianGrid } from "recharts";
import { Activity, Target } from "lucide-react";

export default function ModelPerformancePanel({ completedVoyages }: { completedVoyages: any[] }) {
  const chartData = useMemo(() => {
    return completedVoyages.map((v, i) => {
      const p = v.rawSavings || 0;
      const r = v.realizedSavings || 0;
      return {
        name: v.id,
        Predicted: p,
        Realized: r,
        variance: ((r - p) / p) * 100
      };
    });
  }, [completedVoyages]);

  const avgAccuracy = useMemo(() => {
    if (chartData.length === 0) return 100;
    const totalVariance = chartData.reduce((acc, curr) => acc + Math.abs(curr.variance), 0);
    return Math.max(0, 100 - (totalVariance / chartData.length)).toFixed(1);
  }, [chartData]);

  if (completedVoyages.length === 0) {
    return null;
  }

  return (
    <div className="minimal-panel p-4 flex flex-col h-[300px] bg-black">
      <div className="flex items-center justify-between border-b border-neutral-800 pb-3 mb-4">
        <h2 className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Target className="w-4 h-4 text-white" />
          Model Performance Validation (Completed Contracts)
        </h2>
        <div className="text-xs font-mono font-bold uppercase tracking-widest text-[#00ff00] bg-[#00ff00]/10 border border-[#00ff00]/30 px-3 py-1 flex items-center gap-2">
          <Activity className="w-3 h-3" />
          Avg Forecast Accuracy: {avgAccuracy}%
        </div>
      </div>
      <div className="flex-1 min-h-0 text-xs font-mono">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
            <XAxis dataKey="name" stroke="#555" tick={{ fill: "#666", fontSize: 10 }} />
            <YAxis 
              stroke="#555" 
              tick={{ fill: "#666", fontSize: 10 }} 
              tickFormatter={(val) => `$${(val / 1000000).toFixed(1)}M`}
            />
            <Tooltip 
              cursor={{ fill: 'rgba(255,255,255,0.05)' }}
              contentStyle={{ backgroundColor: '#111', borderColor: '#333', fontSize: '11px', fontFamily: 'monospace' }}
              formatter={(value: any) => `$${(Number(value) / 1000).toFixed(0)}K`}
            />
            <Legend wrapperStyle={{ fontSize: '10px' }} />
            <Bar dataKey="Predicted" fill="#444" radius={[2, 2, 0, 0]} />
            <Bar dataKey="Realized" fill="#00ff00" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
