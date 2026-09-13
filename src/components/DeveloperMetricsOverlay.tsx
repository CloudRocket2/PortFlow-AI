"use client";

import React, { useEffect, useState } from "react";
import { usePortFlowData } from "@/context/PortFlowContext";
import { Cpu, Zap, Activity, Code2 } from "lucide-react";
import { usePathname } from "next/navigation";

export default function DeveloperMetricsOverlay() {
  const { isDeveloperMode } = usePortFlowData();
  const [latency, setLatency] = useState(14);
  const [throughput, setThroughput] = useState(820);
  const [showJson, setShowJson] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (!isDeveloperMode) return;

    const interval = setInterval(() => {
      setLatency(12 + Math.floor(Math.random() * 6));
      setThroughput(800 + Math.floor(Math.random() * 50));
    }, 1500);

    return () => clearInterval(interval);
  }, [isDeveloperMode]);

  if (!isDeveloperMode) return null;

  const getPayloadSchema = () => {
    if (pathname === '/chartering') {
      return `{
  "model": "llama3-70b-8192",
  "temperature": 0.1,
  "system": "You are an AI Shipbroker.",
  "tools": [{
    "name": "evaluate_vessel",
    "params": {
      "dest_draft_limit": 14.5,
      "volume_mt": 75000,
      "cargo": "Coal"
    }
  }]
}`;
    } else if (pathname === '/legal') {
      return `{
  "model": "llama3-70b-8192",
  "temperature": 0,
  "system": "Sanctions & Compliance AI",
  "tools": [{
    "name": "run_sanctions_check",
    "params": {
      "imo_number": "9340427",
      "flag": "Panama",
      "cargo": "Ural Crude"
    }
  }]
}`;
    } else if (pathname === '/risk') {
      return `{
  "model": "llama3-70b-8192",
  "temperature": 0.3,
  "system": "Geopolitical Risk AI",
  "data_sources": ["AIS", "OFAC", "GDELT"],
  "query": "Evaluate Red Sea routing"
}`;
    } else if (pathname === '/') {
      return `{
  "model": "llama3-70b-8192",
  "intent": "fleet_optimization",
  "data": "14 Active Voyages",
  "optimization_target": "demurrage_reduction"
}`;
    }
    return `{
  "model": "llama3-70b-8192",
  "status": "waiting_for_context"
}`;
  };

  return (
    <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-2 animate-slide-in items-end">
      {/* Network Latency Badge */}
      <div className="bg-black/90 backdrop-blur-md border border-fuchsia-500/30 rounded-lg p-3 shadow-[0_0_20px_rgba(217,70,239,0.1)] flex items-center gap-4 pointer-events-none">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-fuchsia-500/10 flex items-center justify-center border border-fuchsia-500/20">
            <Cpu className="w-4 h-4 text-fuchsia-400" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">Inference Engine</span>
            <span className="text-xs font-mono font-medium text-fuchsia-400">Groq LPU (GPT OSS 120B)</span>
          </div>
        </div>

        <div className="w-px h-8 bg-neutral-800" />

        <div className="flex flex-col">
          <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 flex items-center gap-1">
            <Zap className="w-3 h-3 text-amber-400" />
            TTFT
          </span>
          <span className="text-xs font-mono font-bold text-white">{latency}ms</span>
        </div>

        <div className="w-px h-8 bg-neutral-800" />

        <div className="flex flex-col">
          <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 flex items-center gap-1">
            <Activity className="w-3 h-3 text-emerald-400" />
            Throughput
          </span>
          <span className="text-xs font-mono font-bold text-white">{throughput} t/s</span>
        </div>
      </div>
      
      {/* Context Injection Status */}
      <div 
        className="bg-black/90 backdrop-blur-md border border-emerald-500/30 rounded-lg p-2 shadow-xl cursor-pointer hover:bg-emerald-500/5 transition-colors relative"
        onMouseEnter={() => setShowJson(true)}
        onMouseLeave={() => setShowJson(false)}
      >
        <div className="flex items-center justify-between gap-4 px-1">
          <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 flex items-center gap-1.5">
            <Code2 className="w-3 h-3" />
            Context Payload
          </span>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-mono font-bold text-emerald-400">ACTIVE</span>
          </div>
        </div>

        {/* JSON Dropdown */}
        {showJson && (
          <div className="absolute bottom-full right-0 mb-2 w-[300px] bg-[#0d1117] border border-neutral-700 rounded-lg shadow-2xl p-3 overflow-hidden animate-slide-in">
            <div className="flex items-center justify-between mb-2 pb-2 border-b border-neutral-800">
              <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest">Outbound Payload</span>
              <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">application/json</span>
            </div>
            <pre className="text-[10px] font-mono text-neutral-300 whitespace-pre-wrap leading-relaxed">
              {getPayloadSchema()}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
