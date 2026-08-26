"use client";

import { useState } from "react";
import { Ship, Calculator, Anchor, ArrowRight, CheckCircle2, AlertOctagon, CloudRainWind, Download, TrendingDown } from "lucide-react";
import { INDIAN_EAST_COAST_PORTS, VESSEL_PROFILES, LIGHTERING_PENALTY_USD_PER_TON, PortConstraint } from "@/lib/maritime-data";
import { motion } from "framer-motion";
import jsPDF from "jspdf";
import "jspdf-autotable";

interface Recommendation {
  status: "RECOMMENDED" | "REJECTED" | "WARNING";
  vessel: string;
  reason: string;
  idleStrategy?: string;
  financials?: {
    baseRate: number;
    lighteringCost: number;
    totalCost: number;
    savingsVsAlternative: number;
  };
}

interface AnalysisResult {
  port: PortConstraint;
  recommendations: Recommendation[];
}

export default function CharteringPage() {
  const [cargoVolume, setCargoVolume] = useState<number>(120000);
  const [destination, setDestination] = useState<string>("Paradip");
  const [analyzingStep, setAnalyzingStep] = useState<number>(0);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const generatePDF = () => {
    if (!result) return;
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("Charter Party Agreement (Simulated)", 14, 22);
    
    doc.setFontSize(12);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 32);
    doc.text(`Destination Port: ${result.port.name}, ${result.port.region}`, 14, 40);
    doc.text(`Cargo Volume: ${cargoVolume.toLocaleString()} Metric Tonnes`, 14, 48);
    
    const rec = result.recommendations.find(r => r.status === "RECOMMENDED");
    if (rec) {
       doc.text(`Approved Vessel Strategy: ${rec.vessel}`, 14, 56);
       if (rec.financials) {
         doc.text(`Estimated Cost per Ton: $${rec.financials.totalCost.toFixed(2)}`, 14, 64);
         doc.text(`Total Projected Cost: $${(rec.financials.totalCost * cargoVolume).toLocaleString()}`, 14, 72);
       }
    }

    doc.save(`Charter_Agreement_${result.port.name}.pdf`);
  };

  const handleAnalyze = () => {
    setResult(null);
    setAnalyzingStep(1); // 1: Draft, 2: Weather, 3: Financials, 4: Done
    
    setTimeout(() => setAnalyzingStep(2), 800);
    setTimeout(() => setAnalyzingStep(3), 1600);
    setTimeout(() => {
      const port = INDIAN_EAST_COAST_PORTS[destination];
      const recommendations: Recommendation[] = [];

      // ROI Math Setup
      const capesizeBase = VESSEL_PROFILES.Capesize.baseRateUsdPerTon;
      const panamaxBase = VESSEL_PROFILES.Panamax.baseRateUsdPerTon;
      const supramaxBase = VESSEL_PROFILES.Supramax.baseRateUsdPerTon;

      if (cargoVolume >= 100000) {
        if (port.maxDraftMeters < VESSEL_PROFILES.Capesize.avgDraftMeters) {
          
          // REJECTED - Draft too small
          recommendations.push({
            status: "REJECTED",
            vessel: "1x Capesize (150k+ MT)",
            reason: `Draft restriction. Capesize requires ~18m, but ${port.name} is limited to ${port.maxDraftMeters}m. Lightering penalty makes this unviable.`,
            financials: {
              baseRate: capesizeBase,
              lighteringCost: LIGHTERING_PENALTY_USD_PER_TON,
              totalCost: capesizeBase + LIGHTERING_PENALTY_USD_PER_TON,
              savingsVsAlternative: 0
            }
          });
          
          // RECOMMENDED - Split Fleet
          const splitCost = port.maxDraftMeters < VESSEL_PROFILES.Panamax.avgDraftMeters ? supramaxBase : panamaxBase;
          const vesselStr = port.maxDraftMeters < VESSEL_PROFILES.Panamax.avgDraftMeters ? "3x Supramax" : "2x Panamax";
          
          let statusStr: "RECOMMENDED" | "WARNING" = "RECOMMENDED";
          let weatherReason = "";
          if (port.cycloneWarning) {
            statusStr = "WARNING";
            weatherReason = `SEVERE CYCLONE WARNING ACTIVE for ${port.region}. Delay voyage by 5 days or redirect to Vizag to prevent demurrage. `;
          }

          recommendations.push({
            status: statusStr,
            vessel: vesselStr,
            reason: `${weatherReason}${vesselStr} clears ${port.name} draft safely. Avoids expensive lightering operations.`,
            idleStrategy: `Post-discharge, secure coastal thermal coal route to South India.`,
            financials: {
              baseRate: splitCost,
              lighteringCost: 0,
              totalCost: splitCost,
              savingsVsAlternative: (capesizeBase + LIGHTERING_PENALTY_USD_PER_TON) - splitCost
            }
          });
        } else {
          // RECOMMENDED - Capesize Fits
          recommendations.push({
            status: port.cycloneWarning ? "WARNING" : "RECOMMENDED",
            vessel: "1x Capesize (150k+ MT)",
            reason: port.cycloneWarning ? `CYCLONE WARNING ACTIVE. Hold at origin. ${port.name} has sufficient draft when weather clears.` : `${port.name} has sufficient draft (${port.maxDraftMeters}m) to handle Capesize directly. Best economies of scale.`,
            idleStrategy: `Wait 4 days at anchorage post-discharge for Iron Ore fixture to China.`,
            financials: {
              baseRate: capesizeBase,
              lighteringCost: 0,
              totalCost: capesizeBase,
              savingsVsAlternative: panamaxBase - capesizeBase
            }
          });
        }
      } else {
         recommendations.push({
            status: port.cycloneWarning ? "WARNING" : "RECOMMENDED",
            vessel: "1x Panamax",
            reason: port.cycloneWarning ? `CYCLONE ALERT in ${port.region}. Do not fix charter today.` : `Volume handled efficiently by mid-sized bulker. Constraints clear.`,
            idleStrategy: `Standard backhaul route to SE Asia.`,
            financials: {
              baseRate: panamaxBase,
              lighteringCost: 0,
              totalCost: panamaxBase,
              savingsVsAlternative: supramaxBase - panamaxBase
            }
          });
      }

      setResult({ port, recommendations });
      setAnalyzingStep(4);
    }, 2400);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="max-w-6xl mx-auto space-y-6 pb-20">
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Ship className="w-6 h-6 text-blue-400" />
          AI Fleet Chartering & Routing Optimizer
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Constraint-based vessel matching, financial ROI, and weather risk analysis.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Input Form */}
        <motion.div variants={itemVariants} className="bg-[#0f172a]/80 backdrop-blur-xl rounded-2xl border border-[#334155]/50 p-6 h-fit shadow-xl">
          <h3 className="text-sm font-semibold text-slate-300 mb-5 flex items-center gap-2">
            <Calculator className="w-4 h-4" /> Cargo Parameters
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Commodity</label>
              <select className="w-full bg-slate-900/50 border border-[#334155]/50 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500">
                <option>Thermal Coal</option>
                <option>Iron Ore</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Cargo Volume (MT)</label>
              <input 
                type="number" 
                value={cargoVolume}
                onChange={(e) => setCargoVolume(Number(e.target.value))}
                className="w-full bg-slate-900/50 border border-[#334155]/50 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Destination Port</label>
              <select 
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full bg-slate-900/50 border border-[#334155]/50 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
              >
                {Object.keys(INDIAN_EAST_COAST_PORTS).map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            <button 
              onClick={handleAnalyze}
              disabled={analyzingStep > 0 && analyzingStep < 4}
              className="w-full mt-4 bg-blue-600 hover:bg-blue-500 text-white font-medium py-2.5 rounded-lg text-sm transition-all shadow-[0_0_15px_rgba(37,99,235,0.4)] flex justify-center items-center gap-2"
            >
              {(analyzingStep > 0 && analyzingStep < 4) ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Run Optimization Match <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </div>
        </motion.div>

        {/* Results Panel */}
        <motion.div variants={itemVariants} className="lg:col-span-2 space-y-6">
          
          {/* Default State */}
          {!result && analyzingStep === 0 && (
            <div className="bg-[#0f172a]/60 backdrop-blur-xl rounded-2xl border border-dashed border-[#334155] h-[500px] flex flex-col items-center justify-center text-slate-500">
              <Anchor className="w-12 h-12 mb-4 opacity-20" />
              <p>Enter cargo details to generate financial and routing optimizations.</p>
            </div>
          )}

          {/* Loading State */}
          {analyzingStep > 0 && analyzingStep < 4 && (
            <div className="bg-[#0f172a]/80 backdrop-blur-xl rounded-2xl border border-[#334155]/50 h-[500px] flex flex-col items-center justify-center p-8 shadow-xl">
               <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mb-8 shadow-[0_0_20px_rgba(59,130,246,0.5)]" />
               <div className="w-full max-w-sm space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className={analyzingStep >= 1 ? "text-white" : "text-slate-600"}>Cross-referencing Port Draft & LOA...</span>
                    {analyzingStep >= 2 && <CheckCircle2 className="w-4 h-4 text-green-400" />}
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className={analyzingStep >= 2 ? "text-white" : "text-slate-600"}>Analyzing Weather & Cyclone Risks...</span>
                    {analyzingStep >= 3 && <CheckCircle2 className="w-4 h-4 text-green-400" />}
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className={analyzingStep >= 3 ? "text-white" : "text-slate-600"}>Calculating Financial ROI...</span>
                  </div>
               </div>
            </div>
          )}

          {/* Results Render */}
          {analyzingStep === 4 && result && (
            <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6">
              
              {/* Abstract Visual Map */}
              <motion.div variants={itemVariants} className="bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-[#334155]/50 p-4 h-32 flex items-center justify-between px-10 relative overflow-hidden shadow-xl">
                 <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-indigo-900/20" />
                 
                 <div className="text-center z-10">
                   <div className="w-3 h-3 bg-blue-500 rounded-full mx-auto mb-2 shadow-[0_0_10px_rgba(59,130,246,1)]" />
                   <p className="text-xs font-bold text-slate-400 tracking-wider">ORIGIN</p>
                   <p className="text-sm font-semibold text-white">Newcastle, AU</p>
                 </div>
                 
                 {/* Animated Dashed Line */}
                 <div className="flex-1 mx-8 relative flex items-center justify-center z-10">
                    <div className="w-full border-t-2 border-dashed border-blue-500/50 absolute" />
                    <Ship className="w-6 h-6 text-blue-400 absolute animate-pulse shadow-blue-500" />
                 </div>

                 <div className="text-center z-10">
                   <div className={`w-3 h-3 rounded-full mx-auto mb-2 shadow-[0_0_10px_rgba(255,255,255,0.5)] ${result.port.cycloneWarning ? 'bg-red-500' : 'bg-green-500'}`} />
                   <p className="text-xs font-bold text-slate-400 tracking-wider">DESTINATION</p>
                   <p className="text-sm font-semibold text-white">{result.port.name}, IN</p>
                 </div>
              </motion.div>

              {/* Action Bar */}
              <motion.div variants={itemVariants} className="flex justify-end">
                <button onClick={generatePDF} className="bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
                  <Download className="w-4 h-4" /> Export Charter Party PDF
                </button>
              </motion.div>

              {/* Match Results */}
              <motion.div variants={itemVariants} className="space-y-4">
                {result.recommendations.map((rec: Recommendation, idx: number) => (
                  <div key={idx} className={`p-6 rounded-2xl border backdrop-blur-md shadow-xl
                    ${rec.status === 'RECOMMENDED' ? 'bg-green-500/10 border-green-500/30' : 
                      rec.status === 'WARNING' ? 'bg-amber-500/10 border-amber-500/30' : 
                      'bg-red-500/10 border-red-500/30'}`}>
                    
                    <div className="flex items-center justify-between mb-3">
                      <h4 className={`font-bold text-lg flex items-center gap-2 
                        ${rec.status === 'RECOMMENDED' ? 'text-green-400' : 
                          rec.status === 'WARNING' ? 'text-amber-400' : 
                          'text-red-400'}`}>
                        {rec.status === 'RECOMMENDED' ? <CheckCircle2 className="w-6 h-6" /> : 
                         rec.status === 'WARNING' ? <CloudRainWind className="w-6 h-6" /> : 
                         <AlertOctagon className="w-6 h-6" />}
                        {rec.vessel}
                      </h4>
                      <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider 
                        ${rec.status === 'RECOMMENDED' ? 'bg-green-500/20 text-green-300 border border-green-500/30' : 
                          rec.status === 'WARNING' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 
                          'bg-red-500/20 text-red-300 border border-red-500/30'}`}>
                        {rec.status}
                      </span>
                    </div>
                    
                    <p className="text-sm text-slate-300 leading-relaxed mb-6">{rec.reason}</p>
                    
                    {/* Financial ROI Output */}
                    {rec.financials && (
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="bg-slate-900/60 border border-slate-700 rounded-xl p-4">
                           <p className="text-xs text-slate-400 font-bold mb-1">FREIGHT COST</p>
                           <p className="text-xl text-white font-mono">${rec.financials.totalCost.toFixed(2)} <span className="text-xs text-slate-500">/ Ton</span></p>
                           {rec.financials.lighteringCost > 0 && (
                             <p className="text-[10px] text-red-400 mt-1">+${rec.financials.lighteringCost.toFixed(2)} Lightering Penalty</p>
                           )}
                        </div>
                        <div className="bg-slate-900/60 border border-slate-700 rounded-xl p-4">
                           <p className="text-xs text-slate-400 font-bold mb-1">TOTAL ROI SAVINGS</p>
                           <p className="text-xl text-green-400 font-mono flex items-center gap-2">
                             <TrendingDown className="w-5 h-5" />
                             +${((rec.financials.savingsVsAlternative || 0) * cargoVolume).toLocaleString()}
                           </p>
                           <p className="text-[10px] text-slate-500 mt-1">vs Lightering Alternative</p>
                        </div>
                      </div>
                    )}

                    {rec.idleStrategy && (
                      <div className="bg-slate-900/50 border border-indigo-500/20 rounded-xl p-4 mt-4">
                        <p className="text-xs font-semibold text-indigo-400 mb-1">IDLE SCENARIO MANAGEMENT</p>
                        <p className="text-sm text-slate-400 leading-relaxed">{rec.idleStrategy}</p>
                      </div>
                    )}
                  </div>
                ))}
              </motion.div>
            </motion.div>
          )}

        </motion.div>
      </div>
    </motion.div>
  );
}
