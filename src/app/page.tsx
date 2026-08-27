"use client";

import React, { useState, useEffect } from "react";
import MultiVoyageLedger from "@/components/MultiVoyageLedger";
import DwellTimeChart from "@/components/DwellTimeChart";
import BottleneckAlerts from "@/components/BottleneckAlerts";
import OptimizerPanel from "@/components/OptimizerPanel";
import LiveTerminalFeed from "@/components/LiveTerminalFeed";
import dynamic from "next/dynamic";

const GlobeWrapper = dynamic(() => import("@/components/GlobeWrapper"), { ssr: false });

export default function DashboardPage() {
  const [bootSequence, setBootSequence] = useState(true);
  const [bootLog, setBootLog] = useState("Initializing PortFlow OS...");

  useEffect(() => {
    // Prevent scrolling while booting
    document.body.style.overflow = 'hidden';

    const logs = [
      "Establishing Secure Connection...",
      "Syncing Terminal AIS Telemetry...",
      "Calibrating Neural Forecasting Models...",
      "Connecting Global Radar Arrays...",
      "Mapping Deep-Water Anchorages...",
      "Interface Ready."
    ];
    let step = 0;
    
    const interval = setInterval(() => {
      if (step < logs.length) {
        setBootLog(logs[step]);
        step++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setBootSequence(false);
          document.body.style.overflow = 'auto'; // Restore scroll
        }, 400);
      }
    }, 250); // Speed of the boot logs (fast and snappy)

    return () => {
      clearInterval(interval);
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <>
      {/* Animated Boot Screen Overlay */}
      {bootSequence && (
        <div className="fixed inset-0 z-50 bg-[#020202] flex flex-col items-center justify-center text-center animate-out fade-out duration-500 fill-mode-forwards" style={{ animationDelay: '1.9s' }}>
          <div className="w-16 h-16 border border-[#00ff00]/30 flex items-center justify-center mb-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-[#00ff00]/10 animate-pulse" />
            <div className="w-8 h-8 border border-[#00ff00] animate-spin" style={{ animationDuration: '3s', animationTimingFunction: 'linear' }} />
            <div className="absolute inset-0 border border-[#00ff00]/50 animate-ping" style={{ animationDuration: '1.5s' }} />
          </div>
          <h2 className="text-[#00ff00] font-mono text-lg font-bold uppercase tracking-[0.3em] mb-4 shadow-[#00ff00] drop-shadow-[0_0_8px_rgba(0,255,0,0.5)]">
            System Boot
          </h2>
          <p className="text-neutral-500 font-mono text-xs uppercase tracking-widest h-4">
            {bootLog}
          </p>
          <div className="mt-8 w-64 h-1 bg-neutral-900 overflow-hidden relative">
            <div className="absolute inset-y-0 left-0 bg-[#00ff00] transition-all duration-200 ease-linear" style={{ width: bootLog === "Interface Ready." ? "100%" : "auto", animation: bootLog !== "Interface Ready." ? "progress 1.5s linear infinite" : "none" }} />
          </div>
          <style dangerouslySetInnerHTML={{__html: `
            @keyframes progress {
              0% { width: 0%; left: 0; }
              50% { width: 50%; left: 25%; }
              100% { width: 0%; left: 100%; }
            }
          `}} />
        </div>
      )}

      {/* Main Dashboard Content */}
      <div className={`space-y-6 max-w-[1600px] mx-auto transition-opacity duration-1000 ${bootSequence ? 'opacity-0' : 'opacity-100'}`}>
        
        {/* Header Info */}
        <div className="minimal-panel px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-[#00ff00] animate-pulse shadow-[0_0_5px_rgba(0,255,0,0.5)]" />
            <p className="text-xs font-mono uppercase tracking-widest text-[#00ff00]">
              Global Bulk Radar Active
            </p>
          </div>
          <p className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">
            AIS Fleet Architecture Ready
          </p>
        </div>

        {/* Row 1: Global Tracking + Sidebar Panels */}
        <div className="flex flex-col xl:flex-row gap-6">
          
          {/* Left: Global Tracking Globe - takes 2/3 of the row */}
          <div className="w-full xl:w-2/3 flex flex-col min-h-[800px] xl:h-[900px] shrink-0 minimal-panel relative overflow-hidden bg-black">
            <GlobeWrapper />
          </div>

          {/* Right column - Data Panels */}
          <div className="w-full xl:w-1/3 flex flex-col gap-6">
            <DwellTimeChart />
            <BottleneckAlerts />
            <div className="flex-1 min-h-[300px]">
              <LiveTerminalFeed />
            </div>
          </div>
        </div>

        {/* Row 2: AI Optimization Panel */}
        <OptimizerPanel />

        {/* Row 3: Full-width Multi-Voyage Contracts Ledger (Replaced Container Table) */}
        <MultiVoyageLedger />
      </div>
    </>
  );
}
