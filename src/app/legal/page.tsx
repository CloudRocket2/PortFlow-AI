"use client";

import React, { useState } from "react";
import { Scale, CheckCircle2, AlertTriangle, ShieldCheck, Search, Loader2, ArrowRight } from "lucide-react";

type AssessmentStatus = "Compliant" | "Review" | "Pending" | "Clear" | "Medium" | "Verified" | "No major flag";

interface LegalParameter {
  name: string;
  status: AssessmentStatus;
  type: "success" | "warning";
}

export default function LegalCompliancePage() {
  const [isScanning, setIsScanning] = useState(false);
  const [resultsReady, setResultsReady] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    vessel: "MV Pacific Horizon",
    flag: "Panama",
    owner: "Horizon Maritime",
    charterer: "PortFlow Industries",
    cargo: "Iron Ore",
    origin: "Newcastle, Australia",
    destination: "Paradip, India",
    charterType: "Voyage Charter",
    laycan: "15-20 Nov 2026",
    port: "Paradip",
    terms: "GENCON 94"
  });

  const handleScan = () => {
    setIsScanning(true);
    setResultsReady(false);
    setTimeout(() => {
      setIsScanning(false);
      setResultsReady(true);
    }, 2500); // Simulate AI thinking
  };

  const [activeTab, setActiveTab] = useState<"vessel" | "charter">("vessel");
  const [isAnalyzingCharter, setIsAnalyzingCharter] = useState(false);
  const [charterResultsReady, setCharterResultsReady] = useState(false);

  const handleAnalyzeCharter = () => {
    setIsAnalyzingCharter(true);
    setCharterResultsReady(false);
    setTimeout(() => {
      setIsAnalyzingCharter(false);
      setCharterResultsReady(true);
    }, 2000); // Simulate AI thinking
  };

  const parameters: LegalParameter[] = [
    { name: "Vessel regulatory status", status: "Compliant", type: "success" },
    { name: "Port eligibility", status: "Compliant", type: "success" },
    { name: "Charter licence requirement", status: "Review", type: "warning" },
    { name: "Maritime claims", status: "No major flag", type: "success" },
    { name: "Cargo documentation", status: "Pending", type: "warning" },
    { name: "Environmental compliance", status: "Compliant", type: "success" },
    { name: "Sanctions screening", status: "Clear", type: "success" },
    { name: "Contractual risk", status: "Medium", type: "warning" },
    { name: "Insurance/P&I", status: "Verified", type: "success" },
  ];

  return (
    <div className="max-w-[1600px] mx-auto space-y-6 animate-page-enter">
      
      {/* Header Tabs */}
      <div className="minimal-panel px-4 flex items-center justify-between border-b border-neutral-800">
        <div className="flex items-center">
          <button 
            onClick={() => setActiveTab("vessel")}
            className={`px-6 py-4 text-sm font-mono tracking-widest uppercase transition-colors relative focus-ring ${activeTab === "vessel" ? "text-emerald-400" : "text-neutral-500 hover:text-white"}`}
          >
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              Vessel Compliance Check
            </div>
            {activeTab === "vessel" && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-400 shadow-[0_0_8px_var(--accent-emerald)] transition-all duration-300" />}
          </button>
          
          <button 
            onClick={() => setActiveTab("charter")}
            className={`px-6 py-4 text-sm font-mono tracking-widest uppercase transition-colors relative focus-ring ${activeTab === "charter" ? "text-emerald-400" : "text-neutral-500 hover:text-white"}`}
          >
            <div className="flex items-center gap-2">
              <Scale className="w-4 h-4" />
              Charter Party Analyzer
            </div>
            {activeTab === "charter" && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-400 shadow-[0_0_8px_var(--accent-emerald)] transition-all duration-300" />}
          </button>
        </div>
        <p className="text-xs font-mono uppercase tracking-widest text-neutral-500">
          Powered by Gemini Contract Engine
        </p>
      </div>

      {activeTab === "vessel" ? (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        
        {/* Left: Input Form */}
        <div className="minimal-panel p-6 flex flex-col gap-6">
          <div className="border-b border-neutral-800 pb-4">
            <h2 className="text-base font-medium text-white uppercase tracking-wide font-mono flex items-center gap-2 border-l-2 border-cyan-500/40 pl-3">
              <Search className="w-4 h-4" />
              Charter Risk Parameters
            </h2>
            <p className="text-sm text-neutral-500 mt-1">
              Input voyage particulars for regulatory & sanctions screening
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Vessel", key: "vessel" },
              { label: "Flag", key: "flag" },
              { label: "Owner", key: "owner" },
              { label: "Charterer", key: "charterer" },
              { label: "Cargo", key: "cargo" },
              { label: "Charter Type", key: "charterType" },
              { label: "Origin", key: "origin" },
              { label: "Destination", key: "destination" },
              { label: "Proposed Laycan", key: "laycan" },
              { label: "Discharge Port", key: "port" },
            ].map((field) => (
              <div key={field.key} className="flex flex-col gap-1.5">
                <label className="text-sm text-neutral-500">{field.label}</label>
                <input 
                  type="text"
                  value={formData[field.key as keyof typeof formData]}
                  onChange={(e) => setFormData({...formData, [field.key]: e.target.value})}
                  className="bg-neutral-900/50 border border-neutral-800 rounded-lg px-3 py-2.5 text-sm font-mono text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
                />
              </div>
            ))}
            
            <div className="col-span-2 flex flex-col gap-1.5">
              <label className="text-sm text-neutral-500">Freight/Charter Terms (e.g. Clauses)</label>
              <textarea 
                value={formData.terms}
                onChange={(e) => setFormData({...formData, terms: e.target.value})}
                className="bg-neutral-900/50 border border-neutral-800 rounded-lg px-3 py-2.5 text-sm font-mono text-white focus:outline-none focus:border-cyan-500/50 transition-colors h-20 resize-none"
              />
            </div>
          </div>

          <div className="pt-4 mt-auto border-t border-neutral-800">
            <button 
              onClick={handleScan}
              disabled={isScanning}
              className="w-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg py-3 text-sm font-mono font-bold uppercase tracking-wider hover:bg-emerald-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed focus-ring btn-sweep active:scale-[0.97]"
            >
              {isScanning ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]" />
                  ANALYZING COMPLIANCE & SANCTIONS...
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  GENERATE COMPLIANCE REPORT
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right: Results Panel */}
        <div className="minimal-panel p-6 relative overflow-hidden flex flex-col">
          {!resultsReady && !isScanning && (
            <div className="flex flex-col items-center justify-center text-center p-8 bg-neutral-900/10 border border-neutral-800 rounded-xl mb-6">
              <Scale className="w-12 h-12 text-neutral-400 mb-4" />
              <p className="text-xs font-mono uppercase tracking-widest text-neutral-500">
                Awaiting voyage particulars...
              </p>
            </div>
          )}

          {isScanning && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-black/80 backdrop-blur-md z-10">
              <div className="w-16 h-16 border-2 border-emerald-500/30 rounded-full flex items-center justify-center mb-6 relative">
                <div className="absolute inset-0 border-t-2 border-emerald-500 rounded-full animate-spin drop-shadow-[0_0_8px_rgba(255,255,255,0.2)] drop-shadow-[0_0_8px_rgba(52,211,153,0.6)]" style={{ animationDuration: '1s' }} />
                <Scale className="w-6 h-6 text-emerald-400 animate-pulse" />
              </div>
              <p className="text-xs font-mono uppercase tracking-widest text-emerald-400">
                Scanning Global Sanctions Database...
              </p>
              <p className="text-xs font-mono uppercase tracking-widest text-neutral-500 mt-2">
                Verifying Merchant Shipping Act Sec 406/407 Requirements...
              </p>
            </div>
          )}

          <div className="flex items-center justify-between border-b border-neutral-800 pb-4 mb-6">
            <div>
              <h2 className="text-base font-medium text-white uppercase tracking-wide font-mono flex items-center gap-2 border-l-2 border-cyan-500/40 pl-3">
                <ShieldCheck className="w-4 h-4" />
                Compliance Scorecard
              </h2>
            </div>
            {resultsReady && (
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-neutral-500 uppercase tracking-widest">
                  OVERALL SCORE
                </span>
                <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 font-mono text-2xl tabular-nums flex items-center gap-2">
                  86/100
                </div>
              </div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto pr-2">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-neutral-800 text-xs font-mono text-neutral-500 uppercase tracking-widest">
                  <th className="py-3 px-2 font-normal">Legal Parameter</th>
                  <th className="py-3 px-2 font-normal text-right">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm text-neutral-400">
                {parameters.map((param, idx) => (
                  <tr key={idx} className="border-b border-neutral-800/50 hover:bg-neutral-900/30 transition-colors animate-slide-in" style={{ animationDelay: `${idx * 0.05}s` }}>
                    <td className="py-4 px-2 text-neutral-300">{param.name}</td>
                    <td className="py-4 px-2 text-right">
                      <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded border uppercase tracking-widest text-xs font-mono ${
                        param.type === "success" 
                          ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
                          : "bg-amber-500/10 border-amber-500/20 text-amber-400"
                      }`}>
                        {param.type === "success" ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                        {param.status}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {resultsReady && (
              <div className="mt-8 p-4 bg-amber-500/5 border border-amber-500/20 rounded-lg flex gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
                <div className="flex flex-col gap-1">
                  <h4 className="text-base font-medium text-white uppercase tracking-wide font-mono">
                    AI Remediation Advice
                  </h4>
                  <p className="text-[11px] text-neutral-400 leading-relaxed">
                    Vessel is flagged Panama. Indian cabotage/charter laws (Sec 406) require a specific license for foreign-flagged vessels to discharge coastal cargo. Obtain DG Shipping clearance prior to signing GENCON 94. Cargo documentation must be finalized 48h before laycan.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="minimal-panel p-6 flex flex-col gap-4">
            <div className="border-b border-neutral-800 pb-4">
              <h2 className="text-base font-medium text-white uppercase tracking-wide font-mono flex items-center gap-2">
                <Search className="w-4 h-4" />
                Charter Party Clause Input
              </h2>
              <p className="text-sm text-neutral-500 mt-1">
                Paste contract terms to evaluate against maritime law
              </p>
            </div>
            <textarea 
              placeholder="Paste charter party clauses here (e.g. Force Majeure, Demurrage, Arbitration)..."
              className="flex-1 bg-neutral-900/50 border border-neutral-800 rounded-lg px-3 py-2.5 text-sm font-mono text-white focus:outline-none focus:border-cyan-500/50 transition-colors resize-none"
              defaultValue="14. Force Majeure: Neither party shall be liable for failure to perform due to Acts of God, war, strikes, or port congestion exceeding 5 days..."
            />
            <button 
              onClick={handleAnalyzeCharter}
              disabled={isAnalyzingCharter}
              className="w-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg py-3 text-sm font-mono font-bold uppercase tracking-wider hover:bg-emerald-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed focus-ring btn-sweep active:scale-[0.97]"
            >
              {isAnalyzingCharter ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]" />
                  ANALYZING CLAUSES...
                </>
              ) : (
                <>
                  <Scale className="w-4 h-4" />
                  ANALYZE CLAUSE RISKS
                </>
              )}
            </button>
          </div>

          <div className="minimal-panel p-6 relative overflow-hidden flex flex-col">
            {!charterResultsReady && !isAnalyzingCharter && (
              <div className="flex flex-col items-center justify-center text-center p-8 bg-neutral-900/10 border border-neutral-800 rounded-xl mb-6">
                <Scale className="w-12 h-12 text-neutral-400 mb-4" />
                <p className="text-sm font-mono uppercase tracking-widest text-neutral-500">
                  Awaiting clause input...
                </p>
              </div>
            )}

            {isAnalyzingCharter && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-black/80 backdrop-blur-md z-10">
                <div className="w-16 h-16 border-2 border-emerald-500/30 rounded-full flex items-center justify-center mb-6 relative">
                  <div className="absolute inset-0 border-t-2 border-emerald-500 rounded-full animate-spin drop-shadow-[0_0_8px_rgba(52,211,153,0.6)]" style={{ animationDuration: '1s' }} />
                  <Scale className="w-6 h-6 text-emerald-400 animate-pulse" />
                </div>
                <p className="text-sm font-mono uppercase tracking-widest text-emerald-400">
                  Parsing Charter Party Clauses...
                </p>
                <p className="text-xs font-mono uppercase tracking-widest text-neutral-500 mt-2">
                  Cross-referencing maritime law and precedents...
                </p>
              </div>
            )}

            <div className="flex items-center justify-between border-b border-neutral-800 pb-4 mb-4">
              <h2 className="text-base font-medium text-white uppercase tracking-wide font-mono flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                AI Risk Assessment
              </h2>
              <span className="text-xs font-mono uppercase tracking-widest text-neutral-500">
                DISCLAIMER: NOT LEGAL ADVICE
              </span>
            </div>
            <div className="space-y-4">
              <div className="p-4 border border-rose-500/20 bg-rose-500/5 rounded-lg flex gap-3">
                <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
                <div>
                  <h4 className="text-base font-medium text-white uppercase tracking-wide font-mono">High Risk: Force Majeure Ambiguity</h4>
                  <p className="text-[11px] text-neutral-400 mt-1 leading-relaxed">
                    Including "port congestion" in Force Majeure nullifies demurrage claims. Standard GENCON 94 does not excuse charterer from laytime/demurrage obligations due to congestion. 
                  </p>
                  <p className="text-[11px] text-emerald-400 mt-2">
                    Recommendation: Strike "port congestion" from Clause 14.
                  </p>
                </div>
              </div>

              <div className="p-4 border border-emerald-500/20 bg-emerald-500/5 rounded-lg flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <h4 className="text-base font-medium text-white uppercase tracking-wide font-mono">Low Risk: Arbitration Venue</h4>
                  <p className="text-[11px] text-neutral-400 mt-1 leading-relaxed">
                    Arbitration in London (LMAA terms) is standard and acceptable. No deviation from standard maritime practice detected.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
