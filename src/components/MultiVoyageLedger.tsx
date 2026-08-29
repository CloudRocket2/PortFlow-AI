"use client";

import React, { useState, useMemo } from "react";
import { Ship, Anchor, MapPin, Search, ArrowRight, ShieldCheck, Route, Zap, Download, Loader2 } from "lucide-react";

const INITIAL_VOYAGES = [
  {
    id: "MV-CT-901",
    vessel: "MV Pacific Horizon (Capesize)",
    cargo: "Iron Ore",
    volume: "180,000 MT",
    origin: "Newcastle, Australia",
    destination: "Sagar-Sandheads, India",
    type: "Spot → 3-Voyage Contract",
    status: "AI Executed",
    savings: "$1.4M",
    rawSavings: 1400000,
  },
  {
    id: "MV-CT-902",
    vessel: "Maersk Sentinel (Panamax)",
    cargo: "Thermal Coal",
    volume: "75,000 MT",
    origin: "Maputo, Mozambique",
    destination: "Paradip, India",
    type: "Spot → 2-Voyage Contract",
    status: "Draft Approved",
    savings: "$420K",
    rawSavings: 420000,
  },
  {
    id: "MV-CT-903",
    vessel: "Oceanic Pioneer (Supramax)",
    cargo: "Coking Coal",
    volume: "55,000 MT",
    origin: "Vladivostok, Russia",
    destination: "Vizag, India",
    type: "Spot → 4-Voyage Contract",
    status: "Pending Signature",
    savings: "$890K",
    rawSavings: 890000,
  },
  {
    id: "MV-CT-904",
    vessel: "Global Spirit (Capesize)",
    cargo: "Thermal Coal",
    volume: "150,000 MT",
    origin: "Kalimantan, Indonesia",
    destination: "Haldia, India",
    type: "Single Spot Route",
    status: "Lightering Req.",
    savings: "N/A",
    rawSavings: 0,
  },
  {
    id: "MV-CT-905",
    vessel: "Apex Voyager (Capesize)",
    cargo: "Iron Ore",
    volume: "210,000 MT",
    origin: "Norfolk, United States",
    destination: "Dhamra, India",
    type: "Spot → 3-Voyage Contract",
    status: "AI Executed",
    savings: "$1.8M",
    rawSavings: 1800000,
  }
];

export default function MultiVoyageLedger() {
  const [voyages, setVoyages] = useState(INITIAL_VOYAGES);
  const [searchTerm, setSearchTerm] = useState("");
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optResult, setOptResult] = useState<string | null>(null);

  const filteredVoyages = useMemo(() => {
    if (!searchTerm) return voyages;
    const lower = searchTerm.toLowerCase();
    return voyages.filter(v => v.id.toLowerCase().includes(lower) || v.vessel.toLowerCase().includes(lower));
  }, [voyages, searchTerm]);

  const handleOptimize = () => {
    setIsOptimizing(true);
    setOptResult(null);

    setTimeout(() => {
      let updatedCount = 0;
      let extraSavings = 0;

      const newVoyages = voyages.map((v) => {
        // If there's a search term, only optimize filtered rows
        if (searchTerm && !v.id.toLowerCase().includes(searchTerm.toLowerCase()) && !v.vessel.toLowerCase().includes(searchTerm.toLowerCase())) {
          return v;
        }

        // Optimize rows that aren't already AI Executed
        if (v.status === "Draft Approved" || v.status === "Pending Signature") {
          updatedCount++;
          const boost = Math.floor(v.rawSavings * 0.15); // Add ~15% savings
          extraSavings += boost;
          
          const newRaw = v.rawSavings + boost;
          let newSavingsStr = v.savings;
          if (newRaw >= 1000000) {
            newSavingsStr = `$${(newRaw / 1000000).toFixed(1)}M`;
          } else {
            newSavingsStr = `$${Math.round(newRaw / 1000)}K`;
          }

          return {
            ...v,
            status: "AI Executed",
            rawSavings: newRaw,
            savings: newSavingsStr
          };
        }
        return v;
      });

      setVoyages(newVoyages);
      setIsOptimizing(false);
      
      if (updatedCount > 0) {
        setOptResult(`Optimization complete — ${updatedCount} contract(s) updated, $${Math.round(extraSavings/1000)}K additional savings identified.`);
      } else {
        setOptResult(`Optimization complete — no pending contracts found to optimize.`);
      }
      
      // Auto-hide banner after 5s
      setTimeout(() => setOptResult(null), 5000);
    }, 1500);
  };

  const handleExportPDF = async () => {
    try {
      const { jsPDF } = await import("jspdf");
      const { default: autoTable } = await import("jspdf-autotable");
      
      const doc = new jsPDF();
      doc.setFontSize(16);
      doc.text("Multi-Voyage Execution Ledger", 14, 15);
      
      doc.setFontSize(10);
      doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 22);

      const tableData = voyages.map(v => [
        v.id, v.vessel, v.cargo, v.volume, v.origin, v.destination, v.status, v.savings
      ]);

      autoTable(doc, {
        startY: 28,
        head: [['ID', 'Vessel', 'Cargo', 'Volume', 'Origin', 'Destination', 'Status', 'Savings']],
        body: tableData,
        theme: 'grid',
        styles: { fontSize: 8 },
        headStyles: { fillColor: [0, 0, 0], textColor: [0, 255, 0] }
      });

      doc.save("portflow-ledger.pdf");
    } catch (error) {
      console.error("Failed to generate PDF", error);
    }
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

  return (
    <div className="minimal-panel p-4 flex flex-col h-full bg-black relative">
      {/* Toast Notification */}
      {optResult && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#00ff00]/20 border border-[#00ff00] text-[#00ff00] px-4 py-2 rounded text-xs font-mono z-50 flex items-center gap-2 shadow-[0_0_15px_rgba(0,255,0,0.3)] backdrop-blur-sm animate-in fade-in slide-in-from-top-5">
          <ShieldCheck className="w-4 h-4" />
          {optResult}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between border-b border-neutral-800 pb-4 mb-4">
        <div>
          <h2 className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Route className="w-4 h-4" />
            AI Multi-Voyage Contract Ledger
          </h2>
          <p className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest mt-1">
            Consolidating spot shipments into predictive multi-voyage schedules
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button onClick={exportCSV} className="text-xs font-mono text-neutral-400 hover:text-white transition-colors flex items-center gap-1 border border-neutral-700 px-2 py-1 rounded">
            <Download className="w-3 h-3" /> CSV
          </button>
          <button onClick={handleExportPDF} className="text-xs font-mono text-neutral-400 hover:text-white transition-colors flex items-center gap-1 border border-neutral-700 px-2 py-1 rounded">
            <Download className="w-3 h-3" /> PDF
          </button>
          <div className="relative ml-2">
            <Search className="w-3 h-3 absolute left-2 top-1/2 -translate-y-1/2 text-neutral-500" />
            <input 
              type="text" 
              placeholder="SEARCH VOYAGE ID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-neutral-900 border border-neutral-700 text-xs font-mono px-7 py-1.5 focus:outline-none focus:border-[#00ff00] text-white w-48"
            />
          </div>
          <button 
            onClick={handleOptimize}
            disabled={isOptimizing}
            className="bg-[#00ff00]/10 text-[#00ff00] border border-[#00ff00]/30 px-3 py-1.5 text-xs font-mono font-bold uppercase tracking-wider hover:bg-[#00ff00]/20 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed w-56 justify-center"
          >
            {isOptimizing ? (
              <>
                <Loader2 className="w-3 h-3 animate-spin" />
                Optimizing...
              </>
            ) : (
              <>
                <Zap className="w-3 h-3" />
                Run Fleet Optimization
              </>
            )}
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-neutral-800 text-[10px] font-mono text-neutral-500 uppercase tracking-widest bg-neutral-900/30">
              <th className="py-3 px-4 font-normal">Contract ID</th>
              <th className="py-3 px-4 font-normal">Vessel / Class</th>
              <th className="py-3 px-4 font-normal">Cargo Volume</th>
              <th className="py-3 px-4 font-normal">Global Route (Origin &rarr; East Coast)</th>
              <th className="py-3 px-4 font-normal">Contract Transition</th>
              <th className="py-3 px-4 font-normal">Predicted Savings</th>
              <th className="py-3 px-4 font-normal text-right">Status</th>
            </tr>
          </thead>
          <tbody className="text-xs font-mono text-neutral-300">
            {filteredVoyages.map((voyage, idx) => (
              <tr 
                key={voyage.id} 
                className={`border-b border-neutral-800 hover:bg-neutral-900/50 transition-colors ${idx % 2 === 0 ? 'bg-black' : 'bg-neutral-900/20'}`}
              >
                <td className="py-3 px-4">
                  <span className="text-white font-bold">{voyage.id}</span>
                </td>
                <td className="py-3 px-4 flex items-center gap-2">
                  <Ship className="w-3 h-3 text-neutral-500" />
                  {voyage.vessel}
                </td>
                <td className="py-3 px-4">
                  <div className="flex flex-col">
                    <span className="text-white">{voyage.volume}</span>
                    <span className="text-[9px] text-neutral-500">{voyage.cargo}</span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2 text-[10px]">
                    <span className="text-neutral-400">{voyage.origin}</span>
                    <ArrowRight className="w-3 h-3 text-neutral-600" />
                    <span className="text-white">{voyage.destination}</span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-1.5">
                    {voyage.type.includes("Spot") ? (
                      <>
                        <div className="w-1.5 h-1.5 rounded-full bg-[#00ff00] animate-pulse" />
                        <span className="text-[#00ff00] font-bold">{voyage.type}</span>
                      </>
                    ) : (
                      <>
                        <div className="w-1.5 h-1.5 rounded-full bg-neutral-600" />
                        <span className="text-neutral-500">{voyage.type}</span>
                      </>
                    )}
                  </div>
                </td>
                <td className="py-3 px-4 text-[#00ff00] font-bold transition-all duration-500">
                  {voyage.savings}
                </td>
                <td className="py-3 px-4 text-right">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 text-[9px] uppercase tracking-widest border transition-colors duration-500 ${
                    voyage.status === "AI Executed" ? "border-[#00ff00]/30 text-[#00ff00] bg-[#00ff00]/10" : 
                    voyage.status === "Draft Approved" ? "border-blue-500/30 text-blue-400 bg-blue-500/10" :
                    voyage.status === "Lightering Req." ? "border-amber-500/30 text-amber-400 bg-amber-500/10" :
                    "border-neutral-700 text-neutral-400 bg-neutral-800"
                  }`}>
                    {voyage.status === "AI Executed" && <ShieldCheck className="w-3 h-3" />}
                    {voyage.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredVoyages.length === 0 && (
          <div className="py-8 text-center text-neutral-500 font-mono text-xs">
            No voyages match the current search filter.
          </div>
        )}
      </div>
    </div>
  );
}
