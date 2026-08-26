"use client";

import { motion } from "framer-motion";
import { MOCK_FREIGHT_FORECAST } from "@/lib/maritime-data";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceLine } from "recharts";
import { LineChart, TrendingUp, AlertTriangle, ShieldCheck } from "lucide-react";

export default function ForecastPage() {
  const currentRate = 15.9;

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div 
      className="max-w-6xl mx-auto space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <LineChart className="w-6 h-6 text-indigo-400" />
            Predictive Freight Forecast
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Machine Learning Time-Series Prediction for Australia → India East Coast
          </p>
        </div>
        <div className="flex gap-4">
          <div className="bg-[#0f172a]/60 backdrop-blur-md border border-[#334155]/50 rounded-lg px-4 py-2 shadow-lg">
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-0.5">Route</p>
            <p className="text-sm font-medium text-white">Newcastle → Vizag</p>
          </div>
          <div className="bg-[#0f172a]/60 backdrop-blur-md border border-[#334155]/50 rounded-lg px-4 py-2 shadow-lg">
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-0.5">Commodity</p>
            <p className="text-sm font-medium text-white">Bulk Coal (USD/Ton)</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Chart Column */}
        <motion.div variants={itemVariants} className="lg:col-span-2 bg-[#0f172a]/80 backdrop-blur-xl rounded-2xl border border-[#334155]/50 p-6 flex flex-col h-[500px] shadow-2xl relative overflow-hidden">
          {/* subtle glow effect */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-indigo-500/10 blur-[80px] rounded-full pointer-events-none" />

          <h3 className="text-sm font-semibold text-slate-300 mb-6 flex justify-between items-center relative z-10">
            Panamax Route Freight Index
            <span className="text-xs font-mono text-indigo-300 flex items-center gap-1 bg-indigo-500/10 border border-indigo-500/20 px-2 py-1 rounded shadow-[0_0_10px_rgba(99,102,241,0.2)]">
              <TrendingUp className="w-3 h-3" />
              AI FORECAST ACTIVE
            </span>
          </h3>

          <div className="flex-1 w-full relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_FREIGHT_FORECAST} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#818cf8" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#818cf8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val}`} domain={['dataMin - 1', 'dataMax + 1']} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "rgba(15, 23, 42, 0.9)", backdropFilter: "blur(8px)", borderColor: "#334155", borderRadius: "8px" }}
                  itemStyle={{ color: "#e2e8f0" }}
                  formatter={(value: unknown) => [`$${Number(value).toFixed(2)}`, "USD/Ton"]}
                />
                
                <ReferenceLine x="Nov 05" stroke="#94a3b8" strokeDasharray="3 3" label={{ position: 'top', value: 'Today', fill: '#94a3b8', fontSize: 10 }} />
                <Area type="monotone" dataKey="actual" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorActual)" name="Actual Rate" />
                <Area type="monotone" dataKey="predicted" stroke="#818cf8" strokeWidth={3} strokeDasharray="5 5" fillOpacity={1} fill="url(#colorPredicted)" name="Forecast Rate" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Action & Risk Panel */}
        <div className="space-y-6">
          
          <motion.div variants={itemVariants} className="bg-[#0f172a]/80 backdrop-blur-xl rounded-2xl border border-[#334155]/50 p-5 shadow-xl">
            <h3 className="text-sm font-semibold text-slate-300 mb-4">Optimal Market Entry</h3>
            
            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 mb-4 shadow-[0_0_15px_rgba(34,197,94,0.1)]">
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck className="w-5 h-5 text-green-400" />
                <span className="text-green-400 font-bold text-sm tracking-wide">RECOMMENDED ACTION</span>
              </div>
              <p className="text-white font-medium text-lg mb-1">Delay Charter by 3 Weeks</p>
              <p className="text-sm text-slate-400 leading-relaxed">
                The AI predicts a <span className="text-green-400 font-semibold">10.3% drop</span> in freight rates by Nov 26th due to easing congestion in Australian loading ports.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">Current Spot Rate:</span>
                <span className="text-white font-mono font-bold">${currentRate.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">Predicted Lowest:</span>
                <span className="text-green-400 font-mono font-bold">$14.90 (Dec 10)</span>
              </div>
              <div className="flex justify-between items-center text-sm pt-2 border-t border-[#334155]/50">
                <span className="text-slate-400">Est. Savings (120k MT):</span>
                <span className="text-white font-bold text-green-400">+$120,000</span>
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-[#0f172a]/80 backdrop-blur-xl rounded-2xl border border-[#334155]/50 p-5 shadow-xl">
            <h3 className="text-sm font-semibold text-slate-300 mb-4">Risk Factors</h3>
            
            <div className="space-y-3">
              <div className="flex gap-3 items-start p-3 bg-slate-900/50 rounded-xl border border-[#334155]/50">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-white mb-0.5">Newcastle Port Congestion</p>
                  <p className="text-[11px] text-slate-400">Average wait times increased by 4 days due to heavy rainfall, pushing short-term Capesize premiums up.</p>
                </div>
              </div>

              <div className="flex gap-3 items-start p-3 bg-slate-900/50 rounded-xl border border-[#334155]/50">
                <AlertTriangle className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-white mb-0.5">Paradip Draft Alert</p>
                  <p className="text-[11px] text-slate-400">Upcoming seasonal tides may restrict max draft to 14.0m. Capesize vessels will require lightering.</p>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </motion.div>
  );
}
