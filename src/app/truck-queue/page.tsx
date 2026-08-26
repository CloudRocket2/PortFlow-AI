"use client";

import { Truck, Clock } from "lucide-react";

interface TruckData {
  plate: string;
  status: string;
  wait: string;
  assignedTo: string;
}

const mockQueue: TruckData[] = [
  { plate: "XYZ-123", status: "AT_GATE", wait: "5m", assignedTo: "MSCU-88219" },
  { plate: "LMN-992", status: "IN_YARD", wait: "12m", assignedTo: "MSCU-11234" },
  { plate: "ABC-441", status: "WAITING", wait: "22m", assignedTo: "MSCU-55321" },
  { plate: "RTY-776", status: "WAITING", wait: "31m", assignedTo: "MSCU-99120" },
];

export default function TruckQueuePage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">Truck Gate Queue</h2>
        <p className="text-sm text-slate-400">Live operational terminal gate feed</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Waiting Column */}
        <div className="bg-[#1e293b] rounded-xl border border-[#334155] p-4 flex flex-col h-[500px]">
          <h3 className="text-sm font-semibold text-slate-300 mb-4 flex justify-between">
            WAITING OUTSIDE GATE <span className="bg-[#334155] px-2 rounded-full">2</span>
          </h3>
          <div className="space-y-3">
            {mockQueue.filter(t => t.status === "WAITING").map(t => (
              <TruckCard key={t.plate} truck={t} />
            ))}
          </div>
        </div>

        {/* At Gate Column */}
        <div className="bg-[#1e293b] rounded-xl border border-[#334155] p-4 flex flex-col h-[500px]">
          <h3 className="text-sm font-semibold text-amber-400 mb-4 flex justify-between">
            PROCESSING AT GATE <span className="bg-amber-500/20 px-2 rounded-full">1</span>
          </h3>
          <div className="space-y-3">
            {mockQueue.filter(t => t.status === "AT_GATE").map(t => (
              <TruckCard key={t.plate} truck={t} />
            ))}
          </div>
        </div>

        {/* In Yard Column */}
        <div className="bg-[#1e293b] rounded-xl border border-[#334155] p-4 flex flex-col h-[500px]">
          <h3 className="text-sm font-semibold text-green-400 mb-4 flex justify-between">
            LOADING IN YARD <span className="bg-green-500/20 px-2 rounded-full">1</span>
          </h3>
          <div className="space-y-3">
            {mockQueue.filter(t => t.status === "IN_YARD").map(t => (
              <TruckCard key={t.plate} truck={t} />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

function TruckCard({ truck }: { truck: TruckData }) {
  return (
    <div className="bg-[#0f172a] border border-[#334155] rounded-lg p-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-mono font-bold text-white flex items-center gap-2">
          <Truck className="w-4 h-4 text-blue-400" />
          {truck.plate}
        </span>
        <span className="text-xs text-slate-500 flex items-center gap-1">
          <Clock className="w-3 h-3" /> {truck.wait}
        </span>
      </div>
      <div className="text-xs text-slate-400 flex items-center gap-2">
        Pickup: <span className="text-blue-300 font-mono">{truck.assignedTo}</span>
      </div>
    </div>
  );
}
