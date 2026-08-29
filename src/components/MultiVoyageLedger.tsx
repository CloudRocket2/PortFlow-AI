"use client";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Ship, Anchor, MapPin, Search, ArrowRight, ShieldCheck, Route, Zap, Download } from "lucide-react";

export default function MultiVoyageLedger() {
  const voyages = [
    {
      id: "MV-CT-901",
      vessel: "MV Pacific Horizon (Capesize)",
      cargo: "Iron Ore",
      volume: "180,000 MT",
      origin: "Newcastle, Australia",
      destination: "Sagar-Sandheads, India",
      type: "Spot \u2192 3-Voyage Contract",
      status: "AI Executed",
      savings: "$1.4M",
    },
    {
      id: "MV-CT-902",
      vessel: "Maersk Sentinel (Panamax)",
      cargo: "Thermal Coal",
      volume: "75,000 MT",
      origin: "Maputo, Mozambique",
      destination: "Paradip, India",
      type: "Spot \u2192 2-Voyage Contract",
      status: "Draft Approved",
      savings: "$420K",
    },
    {
      id: "MV-CT-903",
      vessel: "Oceanic Pioneer (Supramax)",
      cargo: "Coking Coal",
      volume: "55,000 MT",
      origin: "Vladivostok, Russia",
      destination: "Vizag, India",
      type: "Spot \u2192 4-Voyage Contract",
      status: "Pending Signature",
      savings: "$890K",
    },
    {
      id: "MV-CT-904",
      vessel: "Global Trader (Panamax)",
      cargo: "Thermal Coal",
      volume: "68,000 MT",
      origin: "Kalimantan, Indonesia",
      destination: "Haldia, India",
      type: "Single Spot Route",
      status: "Lightering Req.",
      savings: "N/A",
    },
    {
      id: "MV-CT-905",
      vessel: "Apex Voyager (Capesize)",
      cargo: "Iron Ore",
      volume: "210,000 MT",
      origin: "Norfolk, United States",
      destination: "Dhamra, India",
      type: "Spot \u2192 3-Voyage Contract",
      status: "AI Executed",
      savings: "$1.8M",
    }
  ];

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Multi-Voyage AI Recommendations", 14, 15);
    
    autoTable(doc, {
      startY: 20,
      head: [["ID", "Vessel", "Cargo", "Origin", "Destination", "Type", "Savings", "Status"]],
      body: voyages.map(v => [
        v.id, v.vessel, `${v.volume} ${v.cargo}`, v.origin, v.destination, v.type, v.savings, v.status
      ]),
      styles: { fontSize: 8 },
      headStyles: { fillColor: [0, 0, 0] }
    });
    
    doc.save("PortFlow-Recommendations.pdf");
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
    <div className="minimal-panel p-4 flex flex-col h-full bg-black">
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
          <button onClick={exportPDF} className="text-xs font-mono text-neutral-400 hover:text-white transition-colors flex items-center gap-1 border border-neutral-700 px-2 py-1 rounded">
            <Download className="w-3 h-3" /> PDF
          </button>
          <div className="relative ml-2">
            <Search className="w-3 h-3 absolute left-2 top-1/2 -translate-y-1/2 text-neutral-500" />
            <input 
              type="text" 
              placeholder="SEARCH VOYAGE ID..." 
              className="bg-neutral-900 border border-neutral-700 text-xs font-mono px-7 py-1.5 focus:outline-none focus:border-[#00ff00] text-white w-48"
            />
          </div>
          <button className="bg-[#00ff00]/10 text-[#00ff00] border border-[#00ff00]/30 px-3 py-1.5 text-xs font-mono font-bold uppercase tracking-wider hover:bg-[#00ff00]/20 transition-colors flex items-center gap-2">
            <Zap className="w-3 h-3" />
            Run Fleet Optimization
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
            {voyages.map((voyage, idx) => (
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
                <td className="py-3 px-4 text-[#00ff00]">
                  {voyage.savings}
                </td>
                <td className="py-3 px-4 text-right">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 text-[9px] uppercase tracking-widest border ${
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
      </div>
    </div>
  );
}
