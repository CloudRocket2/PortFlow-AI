"use client";

import React, { useState, useMemo, useEffect } from "react";
import { createPortal } from "react-dom";
import { Ship, Search, ArrowRight, ShieldCheck, Route, Download, ChevronRight, Scale, FileText, CheckCircle2, AlertTriangle, Zap, X } from "lucide-react";
import { usePortFlowData } from "@/context/PortFlowContext";

export default function MultiVoyageLedger() {
  const { state, selectedVoyageId, setSelectedVoyageId } = usePortFlowData();
  const { contracts, routes, vessels, ports } = state;

  const [searchTerm, setSearchTerm] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Map SSOT data into the format the ledger table expects
  const voyages = useMemo(() => {
    return contracts.map(c => {
      const route = routes.find(r => r.id === c.routeId)!;
      const vessel = vessels.find(v => v.id === route.vesselId)!;
      const origin = ports.find(p => p.id === route.originId)!;
      const destination = ports.find(p => p.id === route.destinationId)!;

      return {
        id: c.id,
        vessel: `${vessel.name} (${vessel.class})`,
        cargo: route.cargo,
        volume: `${(route.volume).toLocaleString()} MT`,
        origin: origin.name,
        destination: destination.name,
        type: c.type,
        status: c.status,
        savings: `$${(c.predictedSavings / 1000000).toFixed(2)}M`,
        rawSavings: c.predictedSavings,
        realizedSavings: c.realizedSavings,
        commercialScore: c.commercialScore,
        operationalScore: c.operationalScore,
          carbonSaved: c.carbonSaved,
          fuelSaved: c.fuelSaved,
        legalScore: vessel.legalScore,
        legalIssues: vessel.legalIssues || [],
        vesselDetails: {
          imo: vessel.imo,
          flag: vessel.flag,
          owner: vessel.owner,
          classSociety: vessel.classSociety,
          pni: vessel.pni
        },
        originDetails: origin,
        destDetails: destination
      };
    });
  }, [contracts, routes, vessels, ports]);

  const filteredVoyages = voyages.filter(v => 
    v.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.vessel.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.destination.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExportPDF = () => {
    window.print();
  };

  const exportCSV = () => {
    const headers = ["ID", "Vessel", "Cargo", "Volume", "Origin", "Destination", "Type", "Savings", "Status"];
    const rows = voyages.map(v => [v.id, v.vessel, v.cargo, v.volume, v.origin, v.destination, v.type, v.savings, v.status]);
    
    let csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n" + rows.map(e => e.map(item => `"${item}"`).join(",")).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "PortFlow-Recommendations.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const selectedVoyage = selectedVoyageId ? voyages.find(v => v.id === selectedVoyageId) : null;

  return (
    <div className="flex flex-col gap-6 h-full relative">
      <div className="minimal-panel p-4 flex flex-col relative overflow-hidden">
        <div className="flex items-center justify-between border-b border-neutral-800/60 pb-4 mb-4">
          <div>
            <h2 className="text-base font-medium uppercase tracking-wide font-mono text-white flex items-center gap-2">
              <Route className="w-4 h-4 text-cyan-400" />
              AI Multi-Voyage Contract Ledger
            </h2>
            <p className="text-sm text-neutral-500 mt-1">
              Consolidating spot shipments into predictive multi-voyage schedules
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button onClick={exportCSV} className="text-sm font-mono text-neutral-400 hover:text-white transition-colors flex items-center gap-1 border border-neutral-700 px-2 py-1 rounded-lg">
              <Download className="w-3 h-3" /> CSV
            </button>
            <button onClick={handleExportPDF} className="text-sm font-mono text-neutral-400 hover:text-white transition-colors flex items-center gap-1 border border-neutral-700 px-2 py-1 rounded-lg">
              <Download className="w-3 h-3" /> PDF
            </button>
            <div className="relative ml-2">
              <Search className="w-3 h-3 absolute left-2 top-1/2 -translate-y-1/2 text-neutral-500" />
              <input 
                type="text" 
                placeholder="SEARCH VOYAGE ID..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-neutral-900/50 border border-neutral-800 text-sm font-mono px-7 py-1.5 focus:outline-none focus:border-cyan-500/50 text-white w-48 rounded-lg transition-colors"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto" id="ledger-table">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-800 text-xs font-mono text-neutral-500 uppercase tracking-widest bg-neutral-900/30">
                <th className="py-3 px-4 font-normal">Contract ID</th>
                <th className="py-3 px-4 font-normal">Vessel / Class</th>
                <th className="py-3 px-4 font-normal">Cargo Volume</th>
                <th className="py-3 px-4 font-normal">Global Route (Origin &rarr; East Coast)</th>
                <th className="py-3 px-4 font-normal">Contract Transition</th>
                <th className="py-3 px-4 font-normal">Savings (Pred vs Realized)</th>
                <th className="py-3 px-4 font-normal">Eco Impact</th>
                  <th className="py-3 px-4 font-normal text-right">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm font-mono text-neutral-300">
              {filteredVoyages.map((voyage, idx) => {
                const isExecuted = voyage.status === "AI Executed" && voyage.realizedSavings !== null && voyage.realizedSavings !== undefined;
                let variance = 0;
                if (isExecuted && voyage.rawSavings > 0) {
                  variance = ((voyage.realizedSavings! - voyage.rawSavings) / voyage.rawSavings) * 100;
                }
                const isSelected = selectedVoyageId === voyage.id;

                return (
                  <tr 
                    key={voyage.id}
                    className={`border-b border-neutral-800/50 hover:bg-white/[0.03] transition-all duration-200 cursor-pointer animate-slide-in ${isSelected ? 'bg-cyan-500/[0.04] border-l-2 border-l-cyan-400' : idx % 2 === 0 ? 'bg-black/20' : 'bg-neutral-900/10'}`}
                    onClick={() => setSelectedVoyageId(isSelected ? null : voyage.id)}
                    style={{ animationDelay: `${idx * 0.03}s` }}
                  >
                    <td className="py-3 px-4"><div className="flex items-center gap-2"><span className="text-white font-bold">{voyage.id}</span></div></td>
                    <td className="py-3 px-4"><div className="flex items-center gap-2"><Ship className="w-3 h-3 text-neutral-500" />{voyage.vessel}</div></td>
                    <td className="py-3 px-4">
                      <div className="flex flex-col">
                        <span className="text-white">{voyage.volume}</span>
                        <span className="text-[10px] text-neutral-500">{voyage.cargo}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-neutral-400">{voyage.origin}</span>
                        <ArrowRight className="w-3 h-3 text-neutral-600" />
                        <span className="text-white">{voyage.destination}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        {voyage.type.includes("Spot") ? (
                          <>
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            <span className="text-emerald-400 font-bold">{voyage.type}</span>
                          </>
                        ) : (
                          <>
                            <div className="w-1.5 h-1.5 rounded-full bg-neutral-600" />
                            <span className="text-neutral-500">{voyage.type}</span>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="py-2 px-4">
                      <div className="flex flex-col">
                        <div className="text-neutral-400 text-xs flex items-center gap-1">
                          Pred: <span className="text-white font-bold tabular-nums">${(voyage.rawSavings / 1000000).toFixed(2)}M</span>
                        </div>
                        {isExecuted ? (
                          <div className={`text-xs font-bold flex items-center gap-1 mt-0.5 tabular-nums ${variance < 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                            Real: ${(voyage.realizedSavings! / 1000000).toFixed(2)}M
                            <span className={`px-1 py-0.5 rounded text-[10px] ${variance < 0 ? 'bg-amber-500/10' : 'bg-emerald-500/10'}`}>
                              {variance > 0 ? '+' : ''}{variance.toFixed(1)}%
                            </span>
                          </div>
                        ) : (
                          <div className="text-neutral-600 text-xs mt-0.5">Real: Pending execution...</div>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 text-[10px] uppercase tracking-widest border transition-colors duration-500 rounded-md ${
                        voyage.status === "AI Executed" ? "border-emerald-500/30 text-emerald-400 bg-emerald-500/10" : 
                        voyage.status === "Commercial Approval" ? "border-emerald-500/30 text-emerald-400 bg-emerald-500/10" :
                        voyage.status === "Legal Review Req." ? "border-amber-500/30 text-amber-400 bg-amber-500/10" :
                        voyage.status === "Mgt Approval Pending" ? "border-blue-500/30 text-blue-400 bg-blue-500/10" :
                        "border-neutral-700 text-neutral-400 bg-neutral-800"
                      }`}>
                        {voyage.status === "AI Executed" && <ShieldCheck className="w-3 h-3" />}
                        {voyage.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filteredVoyages.length === 0 && (
            <div className="py-8 text-center text-neutral-500 font-mono text-sm">
              No voyages match the current search filter.
            </div>
          )}
        </div>
      </div>

      {/* Drawer rendered in Portal to escape parent CSS transforms */}
      {mounted && typeof document !== 'undefined' && createPortal(
        <>
          {/* Backdrop Overlay */}
          <div 
            className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 ${selectedVoyage ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            onClick={() => setSelectedVoyageId(null)}
          />

          {/* Slide-Over Drawer for Selected Voyage */}
          <div 
            className={`fixed top-0 right-0 h-full w-[450px] bg-[#0a0a0a] border-l border-neutral-800/60 !rounded-none rounded-l-2xl z-50 transform transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] flex flex-col ${selectedVoyage ? 'translate-x-0' : 'translate-x-full'}`}
            style={{ boxShadow: selectedVoyage ? '-10px 0 40px rgba(0,0,0,0.9)' : 'none' }}
          >
        {selectedVoyage && (
          <>
            <div className="flex items-center justify-between p-6 border-b border-neutral-800">
              <div>
                <h3 className="text-lg font-bold text-white font-mono">{selectedVoyage.id}</h3>
                <p className="text-xs uppercase tracking-widest text-neutral-400 mt-1">Voyage Details & Compliance</p>
              </div>
              <button onClick={() => setSelectedVoyageId(null)} className="p-2 hover:bg-neutral-800 rounded-lg text-neutral-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-8 hide-scrollbar">
              
              {/* AI Explainability & Scores */}
              <div className="flex flex-col gap-3">
                <h4 className="text-xs uppercase tracking-widest text-neutral-500 flex items-center gap-2">
                  <Zap className="w-3 h-3 text-cyan-400" /> Why did AI select this vessel?
                </h4>
                <div className="bg-black/50 border border-neutral-800 rounded-xl p-4 flex flex-col gap-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-neutral-400">Commercial Score</span>
                    <span className="text-emerald-400 font-bold">{selectedVoyage.commercialScore}/100</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-neutral-400">Operational Score</span>
                    <span className="text-emerald-400 font-bold">{selectedVoyage.operationalScore}/100</span>
                  </div>
                  <div className="flex justify-between items-center text-sm border-b border-neutral-800 pb-3">
                    <span className="text-neutral-400 flex items-center gap-1"><Scale className="w-3 h-3" /> Legal Score</span>
                    <span className={`font-bold ${selectedVoyage.legalScore! >= 90 ? 'text-emerald-400' : selectedVoyage.legalScore! >= 80 ? 'text-amber-400' : 'text-red-400'}`}>{selectedVoyage.legalScore}/100</span>
                  </div>
                  <div className="flex justify-between items-center text-sm pt-1">
                    <span className="text-white font-bold uppercase">Overall AI Confidence</span>
                    <span className="text-white font-bold">{Math.round((selectedVoyage.commercialScore! + selectedVoyage.operationalScore! + selectedVoyage.legalScore!) / 3)}%</span>
                  </div>
                </div>
              </div>

              {/* Vessel Legal Passport */}
              <div className="flex flex-col gap-3">
                <h4 className="text-xs uppercase tracking-widest text-neutral-500 flex items-center gap-2">
                  <FileText className="w-3 h-3 text-emerald-400" /> Vessel Legal Passport
                </h4>
                <div className="bg-black/50 border border-neutral-800 rounded-xl p-4 flex flex-col gap-3 text-sm">
                  <div className="flex justify-between"><span className="text-neutral-500">IMO</span><span className="text-neutral-300 font-mono">{selectedVoyage.vesselDetails.imo}</span></div>
                  <div className="flex justify-between"><span className="text-neutral-500">Flag</span><span className="text-neutral-300 font-mono">{selectedVoyage.vesselDetails.flag}</span></div>
                  <div className="flex justify-between"><span className="text-neutral-500">Owner</span><span className="text-neutral-300 font-mono">{selectedVoyage.vesselDetails.owner}</span></div>
                  <div className="flex justify-between"><span className="text-neutral-500">Class</span><span className="text-neutral-300 font-mono">{selectedVoyage.vesselDetails.classSociety}</span></div>
                  <div className="flex justify-between"><span className="text-neutral-500">P&I Insurance</span><span className="text-neutral-300 font-mono">{selectedVoyage.vesselDetails.pni}</span></div>
                  
                  {selectedVoyage.legalIssues.length > 0 && (
                    <div className="mt-2 pt-3 border-t border-red-900/30 flex items-start gap-2 text-red-400">
                      <AlertTriangle className="w-3 h-3 mt-0.5 shrink-0" />
                      <div className="flex flex-col gap-1">
                        {selectedVoyage.legalIssues.map((iss, i) => <span key={i}>{iss}</span>)}
                      </div>
                    </div>
                  )}
                  {selectedVoyage.legalIssues.length === 0 && (
                    <div className="mt-2 pt-3 border-t border-emerald-900/30 flex items-center gap-2 text-emerald-400">
                      <CheckCircle2 className="w-3 h-3" /> All compliance checks clear
                    </div>
                  )}
                </div>
              </div>

              {/* Port Legal Status */}
              <div className="flex flex-col gap-3">
                <h4 className="text-xs uppercase tracking-widest text-neutral-500 flex items-center gap-2">
                  <ShieldCheck className="w-3 h-3 text-blue-400" /> Port Eligibility
                </h4>
                <div className="bg-black/50 border border-neutral-800 rounded-xl p-4 flex flex-col gap-4 text-sm">
                  <div>
                    <div className="text-neutral-500 mb-1 font-mono">Origin: {selectedVoyage.origin}</div>
                    <div className={`flex items-center gap-1.5 ${selectedVoyage.originDetails.legalStatus === 'Compliant' ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {selectedVoyage.originDetails.legalStatus === 'Compliant' ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                      <span className="font-bold">{selectedVoyage.originDetails.legalStatus}</span>
                    </div>
                    {selectedVoyage.originDetails.legalIssues?.map((iss, i) => <div key={i} className="text-neutral-400 mt-1 pl-4.5">- {iss}</div>)}
                  </div>
                  <div className="border-t border-neutral-800 pt-3">
                    <div className="text-neutral-500 mb-1 font-mono">Destination: {selectedVoyage.destination}</div>
                    <div className={`flex items-center gap-1.5 ${selectedVoyage.destDetails.legalStatus === 'Compliant' ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {selectedVoyage.destDetails.legalStatus === 'Compliant' ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                      <span className="font-bold">{selectedVoyage.destDetails.legalStatus}</span>
                    </div>
                    {selectedVoyage.destDetails.legalIssues?.map((iss, i) => <div key={i} className="text-neutral-400 mt-1 pl-4.5">- {iss}</div>)}
                  </div>
                </div>
              </div>

            </div>
          </>
        )}
      </div>
      </>, document.body)}

    </div>
  );
}
