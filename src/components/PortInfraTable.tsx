"use client";

import React from "react";
import { INDIAN_EAST_COAST_PORTS, ORIGIN_PORTS } from "@/lib/maritime-data";
import { Anchor, MapPin } from "lucide-react";

export default function PortInfraTable() {
  const allDestinations = Object.values(INDIAN_EAST_COAST_PORTS);
  const allOrigins = Object.values(ORIGIN_PORTS);

  return (
    <div className="w-full minimal-panel bg-[#0a0a0a] border-neutral-800 p-6">
      <div className="mb-6 flex items-center gap-3">
        <Anchor className="w-5 h-5 text-[#00ff00]" />
        <h2 className="text-xl font-bold text-white font-mono uppercase tracking-widest">
          Global Port Constraints DB
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Destination Ports */}
        <div>
          <h3 className="text-sm font-mono text-[#00ff00] mb-3 flex items-center gap-2 uppercase">
            <MapPin className="w-4 h-4" /> East Coast India (Destinations)
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono text-neutral-300">
              <thead className="text-[10px] uppercase text-neutral-500 bg-neutral-900 border-b border-neutral-800">
                <tr>
                  <th className="px-3 py-2 font-normal">Port</th>
                  <th className="px-3 py-2 font-normal text-right">Draft (m)</th>
                  <th className="px-3 py-2 font-normal text-right">LOA (m)</th>
                  <th className="px-3 py-2 font-normal text-right">Beam (m)</th>
                  <th className="px-3 py-2 font-normal text-right">Handling (TPD)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/50">
                {allDestinations.map((port) => (
                  <tr key={port.name} className="hover:bg-neutral-900/30 transition-colors">
                    <td className="px-3 py-2 text-white font-bold">{port.name}</td>
                    <td className="px-3 py-2 text-right">{port.maxDraftMeters.toFixed(1)}</td>
                    <td className="px-3 py-2 text-right">{port.maxLoaMeters}</td>
                    <td className="px-3 py-2 text-right">{port.maxBeamMeters.toFixed(1)}</td>
                    <td className="px-3 py-2 text-right text-neutral-400">{port.cargoHandlingRateTpd.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Origin Ports */}
        <div>
          <h3 className="text-sm font-mono text-[#00ff00] mb-3 flex items-center gap-2 uppercase">
            <MapPin className="w-4 h-4" /> Global Origins
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono text-neutral-300">
              <thead className="text-[10px] uppercase text-neutral-500 bg-neutral-900 border-b border-neutral-800">
                <tr>
                  <th className="px-3 py-2 font-normal">Port</th>
                  <th className="px-3 py-2 font-normal text-right">Draft (m)</th>
                  <th className="px-3 py-2 font-normal text-right">LOA (m)</th>
                  <th className="px-3 py-2 font-normal text-right">Beam (m)</th>
                  <th className="px-3 py-2 font-normal text-right">Handling (TPD)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/50">
                {allOrigins.map((port) => (
                  <tr key={port.name} className="hover:bg-neutral-900/30 transition-colors">
                    <td className="px-3 py-2 text-white font-bold">{port.name}</td>
                    <td className="px-3 py-2 text-right">{port.maxDraftMeters.toFixed(1)}</td>
                    <td className="px-3 py-2 text-right">{port.maxLoaMeters}</td>
                    <td className="px-3 py-2 text-right">{port.maxBeamMeters.toFixed(1)}</td>
                    <td className="px-3 py-2 text-right text-neutral-400">{port.cargoHandlingRateTpd.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
