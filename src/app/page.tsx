"use client";

import React, { useState, useEffect } from "react";
import MultiVoyageLedger from "@/components/MultiVoyageLedger";
import DwellTimeChart from "@/components/DwellTimeChart";
import BottleneckAlerts from "@/components/BottleneckAlerts";
import OptimizerPanel from "@/components/OptimizerPanel";
import LiveTerminalFeed from "@/components/LiveTerminalFeed";
import { usePortFlowData } from "@/context/PortFlowContext";
import dynamic from "next/dynamic";

const GlobeWrapper = dynamic(() => import("@/components/GlobeWrapper"), { ssr: false });

export default function DashboardPage() {
  const [bootSequence, setBootSequence] = useState(true);
  const [bootLog, setBootLog] = useState("Initializing PortFlow OS...");
  const { state } = usePortFlowData();
  const { vessels, contracts, routes } = state;

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const logs = [
      "Establishing Secure Connection...",
      "Syncing Terminal AIS Telemetry...",
      "Calibrating Neural Forecasting Models...",
      "Connecting Global Radar Arrays...",
      "Mapping Deep-Water Anchorages...",
      "Interface Ready.",
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
          document.body.style.overflow = "auto";
        }, 400);
      }
    }, 250);

    return () => {
      clearInterval(interval);
      document.body.style.overflow = "auto";
    };
  }, []);

  /* ── Compute KPI metrics ─────────────────────────────── */
  const multiVoyage = contracts.length;
  const executed = contracts.filter((c) => c.status === "AI Executed");
  const spotRoutes = routes.length - executed.length;
  const totalTonnage = routes.reduce((sum, r) => sum + r.volume, 0);
  const inTransit = vessels.filter((v) => v.status === "In Transit").length;
  const anchored = vessels.filter((v) => v.status === "Anchored").length;

  let accuracy = 94.5;
  if (executed.length > 0) {
    const totalPred = executed.reduce((sum, c) => sum + c.predictedSavings, 0);
    const totalReal = executed.reduce((sum, c) => sum + (c.realizedSavings || 0), 0);
    if (totalPred > 0) {
      const variance = Math.abs(totalReal - totalPred) / totalPred;
      accuracy = 100 - variance * 100;
    }
  }

  const emissionsKtons = 12.4 + executed.length * 2.1;

  return (
    <>
      {/* ── Boot Sequence (keeps original #00ff00) ────────── */}
      {bootSequence && (
        <div
          className="fixed inset-0 z-50 bg-[#020202] flex flex-col items-center justify-center text-center animate-out fade-out duration-500 fill-mode-forwards"
          style={{ animationDelay: "1.9s" }}
        >
          <div className="w-16 h-16 border border-[#00ff00]/30 flex items-center justify-center mb-6 relative overflow-hidden rounded-xl">
            <div className="absolute inset-0 bg-[#00ff00]/10 animate-pulse" />
            <div
              className="w-8 h-8 border border-[#00ff00] animate-spin rounded-md"
              style={{ animationDuration: "3s", animationTimingFunction: "linear" }}
            />
            <div
              className="absolute inset-0 border border-[#00ff00]/50 animate-ping rounded-xl"
              style={{ animationDuration: "1.5s" }}
            />
          </div>
          <h2 className="text-[#00ff00] font-mono text-lg font-bold uppercase tracking-[0.3em] mb-4 drop-shadow-[0_0_8px_rgba(0,255,0,0.5)]">
            System Boot
          </h2>
          <p className="text-neutral-500 font-mono text-sm uppercase tracking-widest h-4">
            {bootLog}
          </p>
          <div className="mt-8 w-64 h-1 bg-neutral-900 overflow-hidden relative rounded-full">
            <div
              className="absolute inset-y-0 left-0 bg-[#00ff00] transition-all duration-200 ease-linear rounded-full"
              style={{
                width: bootLog === "Interface Ready." ? "100%" : "auto",
                animation: bootLog !== "Interface Ready." ? "progress 1.5s linear infinite" : "none",
              }}
            />
          </div>
          <style
            dangerouslySetInnerHTML={{
              __html: `
            @keyframes progress {
              0% { width: 0%; left: 0; }
              50% { width: 50%; left: 25%; }
              100% { width: 0%; left: 100%; }
            }
          `,
            }}
          />
        </div>
      )}

      {/* ── Main Dashboard ────────────────────────────────── */}
      <div
        className={`space-y-5 max-w-[1600px] mx-auto transition-opacity duration-1000 ${
          bootSequence ? "opacity-0" : "opacity-100"
        } animate-page-enter`}
      >
        {/* Status Bar */}
        <div className="minimal-panel px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_rgba(52,211,153,0.5)]" />
            <p className="text-sm font-mono uppercase tracking-widest text-emerald-400">
              Global Bulk Radar Active
            </p>
          </div>
          <p className="text-xs font-mono text-neutral-500">
            AIS Fleet Architecture Ready
          </p>
        </div>

        {/* Row 1: Globe + Side Panels */}
        <div className="flex flex-col xl:flex-row gap-5">
          <div className="w-full xl:w-2/3 flex flex-col min-h-[600px] xl:h-[700px] shrink-0 minimal-panel relative overflow-hidden p-0 border-0">
            <GlobeWrapper />
          </div>
          <div className="w-full xl:w-1/3 flex flex-col gap-5">
            <DwellTimeChart />
            <BottleneckAlerts />
            <div className="flex-1 min-h-[500px]">
              <LiveTerminalFeed />
            </div>
          </div>
        </div>

        {/* Row 2: AI Optimizer */}
        <OptimizerPanel />

        {/* Row 3: Multi-Voyage Ledger */}
        <MultiVoyageLedger />
      </div>
    </>
  );
}
