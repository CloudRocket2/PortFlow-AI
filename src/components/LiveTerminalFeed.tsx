"use client";

import { useTelemetry } from "@/hooks/useTelemetry";
import { Terminal, Radio, Ship, AlertCircle, Anchor } from "lucide-react";

export default function LiveTerminalFeed() {
  const { events, isConnected } = useTelemetry();

  const getIcon = (type: string) => {
    switch (type) {
      case "AIS_POSITION_UPDATE": return <Radio className="w-3.5 h-3.5 text-blue-400" />;
      case "DRAFT_MEASUREMENT": return <Anchor className="w-3.5 h-3.5 text-amber-400" />;
      case "BERTH_APPROACH": return <Ship className="w-3.5 h-3.5 text-green-400" />;
      case "CARGO_DISCHARGE": return <Terminal className="w-3.5 h-3.5 text-purple-400" />;
      default: return <Radio className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case "AIS_POSITION_UPDATE": return "text-blue-400";
      case "DRAFT_MEASUREMENT": return "text-amber-400";
      case "BERTH_APPROACH": return "text-green-400";
      case "CARGO_DISCHARGE": return "text-purple-400";
      default: return "text-slate-400";
    }
  };

  const formatTime = (timestamp: string | number) => {
    return new Date(timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute:'2-digit', second:'2-digit' });
  };

  return (
    <div className="minimal-panel overflow-hidden flex flex-col h-[300px]">
      {/* Header */}
      <div className="px-4 py-3 border-b border-neutral-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-white" />
          <h3 className="text-[10px] font-mono tracking-widest uppercase text-white">Global AIS & AI Dispatch Log</h3>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            {isConnected && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            )}
            <span className={`relative inline-flex rounded-full h-2 w-2 ${isConnected ? "bg-white" : "bg-neutral-600"}`}></span>
          </span>
          <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">
            {isConnected ? "Connected" : "Disconnected"}
          </span>
        </div>
      </div>

      {/* Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 hide-scrollbar relative">
        {events.length === 0 ? (
          <div className="text-[10px] font-mono text-neutral-600 flex items-center justify-center h-full uppercase tracking-widest">
            Awaiting telemetry...
          </div>
        ) : (
          events.map((evt) => (
            <div key={evt.id} className="flex gap-3 text-xs animate-slide-in pb-3 border-b border-neutral-900 last:border-0">
              <div className="w-16 shrink-0 text-[10px] font-mono text-neutral-600 pt-0.5 flex flex-col items-start gap-1">
                {formatTime(evt.timestamp)}
                <div className={`px-1 py-0.5 rounded-sm bg-neutral-900 border border-neutral-800 ${getColor(evt.type)}`}>
                  {getIcon(evt.type)}
                </div>
              </div>
              <div className="flex-1">
                <span className={`font-mono font-bold mr-2 uppercase text-white`}>
                  {evt.vesselId}
                </span>
                <span className="text-[10px] uppercase font-mono tracking-widest text-neutral-500 block mt-1">{evt.details}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
