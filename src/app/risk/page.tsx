"use client";

import React, { useState } from "react";
import { Search, Anchor, FileText, Loader2, BookOpen, Scale, AlertTriangle, ShieldCheck } from "lucide-react";

export default function RiskCentrePage() {
  const [vesselQuery, setVesselQuery] = useState("");
  const [isSearchingVessel, setIsSearchingVessel] = useState(false);
  const [vesselResults, setVesselResults] = useState<any>(null);

  const [lawQuery, setLawQuery] = useState("");
  const [isSearchingLaw, setIsSearchingLaw] = useState(false);
  const [lawResults, setLawResults] = useState<any>(null);

  const handleVesselSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vesselQuery.trim()) return;
    
    setIsSearchingVessel(true);
    setVesselResults(null);
    
    setTimeout(() => {
      setIsSearchingVessel(false);
      setVesselResults({
        name: vesselQuery.toUpperCase(),
        imo: "IMO 9432810",
        flag: "Liberia",
        arrestStatus: "Clear",
        claims: [
          { date: "Oct 2024", type: "Bunker Lien", status: "Resolved", amount: "$145,000" },
          { date: "Mar 2025", type: "Cargo Damage Claim", status: "Pending", amount: "$89,000" }
        ],
        admiraltyNotes: "No pending warrants of arrest under Admiralty (Jurisdiction and Settlement of Maritime Claims) Act, 2017."
      });
    }, 1500);
  };

  const handleLawSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lawQuery.trim()) return;
    
    setIsSearchingLaw(true);
    setLawResults(null);

    setTimeout(() => {
      setIsSearchingLaw(false);
      setLawResults([
        {
          case: "The Johs Stove [1984] 1 Lloyd's Rep 38",
          topic: "Demurrage & Port Congestion",
          summary: "Established that 'always accessible' means the vessel must be able to reach the berth without delay. Congestion is the charterer's risk.",
          relevance: "High - Directly applicable to your GENCON 94 queries."
        },
        {
          case: "The Achilleas [2008] UKHL 48",
          topic: "Damages for Late Redelivery",
          summary: "Remoteness of damage in contract. Charterers are not generally liable for loss of a subsequent fixture due to late redelivery unless specifically assumed.",
          relevance: "Medium - Relevant for time charter extensions."
        }
      ]);
    }, 2000);
  };

  return (
    <div className="max-w-[1600px] mx-auto space-y-6 animate-page-enter">
      
      {/* Header Info */}
      <div className="minimal-panel px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BookOpen className="w-4 h-4 text-emerald-400" />
          <h1 className="text-lg font-semibold text-white">
            Risk Centre & Law Library
          </h1>
        </div>
        <p className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">
          Global Maritime Case Law & Admiralty DB
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        
        {/* Left: Vessel Claims DB */}
        <div className="minimal-panel flex flex-col h-[700px]">
          <div className="p-6 border-b border-neutral-800 flex items-center gap-3">
            <Anchor className="w-5 h-5 text-blue-400" />
            <div>
              <h2 className="text-sm font-medium text-white uppercase tracking-wide font-mono border-l-2 border-cyan-500/40 pl-3">
                Vessel Admiralty Search
              </h2>
              <p className="text-xs text-neutral-500 mt-1">
                Query global registries for arrest warrants & liens
              </p>
            </div>
          </div>

          <div className="p-6">
            <form onSubmit={handleVesselSearch} className="flex gap-2 mb-6">
              <input 
                type="text"
                value={vesselQuery}
                onChange={(e) => setVesselQuery(e.target.value)}
                placeholder="Enter Vessel Name or IMO (e.g. MV Pacific Horizon)"
                className="flex-1 bg-neutral-900/50 border border-neutral-800 rounded-lg px-3 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
              />
              <button 
                type="submit"
                disabled={isSearchingVessel || !vesselQuery.trim()}
                className="bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-lg px-6 py-2.5 text-xs font-mono font-bold uppercase tracking-wider hover:bg-blue-500/20 transition-all disabled:opacity-50 flex items-center gap-2 focus-ring btn-sweep active:scale-[0.97]"
              >
                {isSearchingVessel ? <Loader2 className="w-4 h-4 animate-spin drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]" /> : <Search className="w-4 h-4" />}
                Query
              </button>
            </form>

            {isSearchingVessel && (
              <div className="flex flex-col items-center justify-center py-20 text-blue-400">
                <Loader2 className="w-8 h-8 animate-spin drop-shadow-[0_0_8px_rgba(255,255,255,0.2)] mb-4" />
                <p className="text-[10px] font-mono uppercase tracking-widest">Scanning Global Admiralty Databases...</p>
              </div>
            )}

            {vesselResults && !isSearchingVessel && (
              <div className="animate-in fade-in slide-in-from-bottom-2 space-y-6">
                <div className="flex items-start justify-between border-b border-neutral-800 pb-4">
                  <div>
                    <h3 className="text-2xl font-mono text-white tabular-nums">{vesselResults.name}</h3>
                    <p className="text-xs text-neutral-500">{vesselResults.imo} • Flag: {vesselResults.flag}</p>
                  </div>
                  <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded text-emerald-400 text-[10px] font-mono uppercase tracking-widest flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4" />
                    Arrest Status: {vesselResults.arrestStatus}
                  </div>
                </div>

                <div>
                  <h4 className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 mb-3">Recorded Claims & Liens</h4>
                  <div className="space-y-2">
                    {vesselResults.claims.map((claim: any, idx: number) => (
                      <div key={idx} className="p-3 bg-neutral-900/30 border border-neutral-800 rounded-lg flex justify-between items-center animate-slide-in" style={{ animationDelay: `${idx * 0.05}s` }}>
                        <div>
                          <p className="text-sm font-medium text-white">{claim.type}</p>
                          <p className="text-xs text-neutral-500">{claim.date}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-mono tabular-nums text-white">{claim.amount}</p>
                          <p className={`text-[10px] font-mono uppercase tracking-widest ${claim.status === "Resolved" ? "text-emerald-400" : "text-amber-400"}`}>
                            {claim.status}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-blue-500/5 border border-blue-500/20 rounded-lg flex gap-3">
                  <Scale className="w-5 h-5 text-blue-400 shrink-0" />
                  <div>
                    <h4 className="text-sm font-medium text-white uppercase tracking-wide font-mono">AI Legal Summary</h4>
                    <p className="text-[11px] text-neutral-400 mt-1 leading-relaxed">
                      {vesselResults.admiraltyNotes} Vessel is clear to enter Indian ports under current commercial terms.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Case Law DB */}
        <div className="minimal-panel flex flex-col h-[700px]">
          <div className="p-6 border-b border-neutral-800 flex items-center gap-3">
            <Scale className="w-5 h-5 text-violet-400" />
            <div>
              <h2 className="text-sm font-medium text-white uppercase tracking-wide font-mono border-l-2 border-cyan-500/40 pl-3">
                Maritime Case Law AI
              </h2>
              <p className="text-xs text-neutral-500 mt-1">
                Semantic search across UKHL, LMAA, and Indian Admiralty Judgments
              </p>
            </div>
          </div>

          <div className="p-6 flex flex-col h-full">
            <form onSubmit={handleLawSearch} className="flex gap-2 mb-6 shrink-0">
              <input 
                type="text"
                value={lawQuery}
                onChange={(e) => setLawQuery(e.target.value)}
                placeholder="Search topic (e.g. Demurrage exceptions, Force Majeure)"
                className="flex-1 bg-neutral-900/50 border border-neutral-800 rounded-lg px-3 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
              />
              <button 
                type="submit"
                disabled={isSearchingLaw || !lawQuery.trim()}
                className="bg-violet-500/10 text-violet-400 border border-violet-500/20 rounded-lg px-6 py-2.5 text-xs font-mono font-bold uppercase tracking-wider hover:bg-violet-500/20 transition-all disabled:opacity-50 flex items-center gap-2 focus-ring btn-sweep active:scale-[0.97]"
              >
                {isSearchingLaw ? <Loader2 className="w-4 h-4 animate-spin drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]" /> : <Search className="w-4 h-4" />}
                Search
              </button>
            </form>

            {isSearchingLaw && (
              <div className="flex flex-col items-center justify-center py-20 text-violet-400 flex-1">
                <Loader2 className="w-8 h-8 animate-spin drop-shadow-[0_0_8px_rgba(255,255,255,0.2)] mb-4" />
                <p className="text-[10px] font-mono uppercase tracking-widest">Searching Legal Precedents...</p>
              </div>
            )}

            {lawResults && !isSearchingLaw && (
              <div className="animate-in fade-in slide-in-from-bottom-2 flex-1 overflow-y-auto space-y-4 pr-2">
                {lawResults.map((result: any, idx: number) => (
                  <div key={idx} className="p-4 bg-neutral-900/30 border border-neutral-800 rounded-lg hover:border-violet-500/30 transition-all duration-300 animate-slide-in hover:scale-[1.01]" style={{ animationDelay: `${idx * 0.05}s` }}>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-sm font-medium text-white">{result.case}</h3>
                      <FileText className="w-4 h-4 text-neutral-500" />
                    </div>
                    <p className="text-[10px] font-mono text-violet-400 uppercase tracking-widest mb-3">Topic: {result.topic}</p>
                    <p className="text-xs text-neutral-400 leading-relaxed mb-3 border-l-2 border-neutral-700 pl-3">
                      "{result.summary}"
                    </p>
                    <div className="pt-3 border-t border-neutral-800/50">
                      <p className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                        <ShieldCheck className="w-3 h-3" />
                        AI Relevance: {result.relevance}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!lawResults && !isSearchingLaw && (
              <div className="flex-1 flex flex-col items-center justify-center text-neutral-600">
                <Scale className="w-12 h-12 mb-4 opacity-20" />
                <p className="text-[10px] font-mono uppercase tracking-widest text-center max-w-xs">
                  Enter a legal concept to instantly pull relevant landmark cases and AI summaries.
                </p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
