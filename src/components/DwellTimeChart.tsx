"use client";

import { useState, useEffect } from "react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { TrendingDown } from "lucide-react";

interface DwellData {
  day: string;
  avg_hours: number;
}

export default function DwellTimeChart() {
  const [dwellTimeTrend, setDwellTimeTrend] = useState<DwellData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard/dwell-trends")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setDwellTimeTrend(data.data);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading || dwellTimeTrend.length === 0) {
    return (
      <div className="bg-[#1e293b] rounded-xl border border-[#334155] p-5 h-[300px] flex items-center justify-center text-slate-400 text-xs">
        Loading trends...
      </div>
    );
  }

  const avgDwell =
    dwellTimeTrend.reduce((sum, d) => sum + d.avg_hours, 0) /
    dwellTimeTrend.length;
  
  // Calculate week-over-week trend
  const firstHalf = dwellTimeTrend.slice(0, 3);
  const secondHalf = dwellTimeTrend.slice(4);
  const firstAvg = firstHalf.reduce((s, d) => s + d.avg_hours, 0) / firstHalf.length;
  const secondAvg = secondHalf.reduce((s, d) => s + d.avg_hours, 0) / secondHalf.length;
  const trendPercent = Math.round(((secondAvg - firstAvg) / firstAvg) * 100);

  return (
    <div className="glass-panel rounded-xl overflow-hidden flex flex-col h-[300px]">
      {/* Chart Header */}
      <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-white">
            Avg Lightering Delays — Last 7 Days
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Target: &lt; 24 hours • Current avg:{" "}
            <span className={avgDwell > 24 ? "text-amber-400" : "text-green-400"}>
              {avgDwell.toFixed(1)}h
            </span>
          </p>
        </div>
        <div
          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium ${
            trendPercent < 0
              ? "bg-green-500/10 text-green-400"
              : "bg-red-500/10 text-red-400"
          }`}
        >
          <TrendingDown className={`w-3.5 h-3.5 ${trendPercent >= 0 ? "rotate-180" : ""}`} />
          {Math.abs(trendPercent)}% vs early week
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={dwellTimeTrend} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="dwellGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
          <XAxis
            dataKey="day"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#94a3b8", fontSize: 12 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#94a3b8", fontSize: 12 }}
            domain={[0, "auto"]}
            tickFormatter={(v: number) => `${v}h`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1e293b",
              border: "1px solid #334155",
              borderRadius: "8px",
              color: "#e2e8f0",
              fontSize: "12px",
            }}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            formatter={(value: any) => [`${value} hours`, "Avg Delay"]}
            labelStyle={{ color: "#94a3b8" }}
          />
          {/* Target threshold line */}
          <Area
            type="monotone"
            dataKey="avg_hours"
            stroke="#3b82f6"
            strokeWidth={2.5}
            fill="url(#dwellGradient)"
            dot={{ r: 4, fill: "#3b82f6", stroke: "#1e293b", strokeWidth: 2 }}
            activeDot={{ r: 6, fill: "#60a5fa", stroke: "#1e293b", strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
