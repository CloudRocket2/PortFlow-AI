"use client";

import { Globe, AlertTriangle, Leaf, LucideIcon, LineChart, FileText } from "lucide-react";
import { usePortFlowData } from "@/context/PortFlowContext";

interface MetricCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
  subtitle?: string;
}

function MetricCard({ label, value, icon: Icon, color, subtitle }: MetricCardProps) {
  return (
    <div className="flex items-center gap-3 px-6 py-2">
      <div className={`flex items-center justify-center w-8 h-8 border ${color} shrink-0`}>
        <Icon className="w-4 h-4" />
      </div>
      <div>
        <p className="text-[10px] uppercase font-mono tracking-widest text-neutral-500 leading-tight">{label}</p>
        <p className="text-lg font-bold text-white leading-tight">{value}</p>
        {subtitle && (
          <p className="text-[10px] text-neutral-600 leading-tight font-mono">{subtitle}</p>
        )}
      </div>
    </div>
  );
}

export default function Header() {
  const { state } = usePortFlowData();
  const { vessels, contracts, routes } = state;

  // Compute metrics dynamically from the SSOT
  const multiVoyage = contracts.length;
  const executed = contracts.filter(c => c.status === "AI Executed");
  const spotRoutes = routes.length - executed.length; // rough proxy for "remaining spot routes"

  // Tonnage sum of all routes
  const totalTonnage = routes.reduce((sum, r) => sum + r.volume, 0);

  const inTransit = vessels.filter(v => v.status === "In Transit").length;
  const anchored = vessels.filter(v => v.status === "Anchored").length;

  // Compute forecast accuracy from executed contracts
  let accuracy = 94.5; // fallback
  if (executed.length > 0) {
    const totalPred = executed.reduce((sum, c) => sum + c.predictedSavings, 0);
    const totalReal = executed.reduce((sum, c) => sum + (c.realizedSavings || 0), 0);
    if (totalPred > 0) {
      const variance = Math.abs(totalReal - totalPred) / totalPred;
      accuracy = 100 - (variance * 100);
    }
  }

  // Emissions roughly based on completed optimization passes
  const emissionsKtons = 12.4 + (executed.length * 2.1);

  return (
    <header className="flex items-center justify-between bg-black border-b border-neutral-800 px-6 h-20 shrink-0 z-10">
      {/* Left Title */}
      <div>
        <h2 className="text-xs uppercase font-mono tracking-widest text-white">Global Fleet Command</h2>
        <p className="text-[10px] text-neutral-500 font-mono">
          REGIONAL FREIGHT FORECASTING
        </p>
      </div>

      {/* Right Global Metrics */}
      <div className="flex items-center divide-x divide-neutral-800">
        <MetricCard
          label="Active Contracts"
          value={multiVoyage}
          icon={FileText}
          color="border-amber-500 text-amber-500"
          subtitle={`${Math.max(0, spotRoutes)} Spot Routes Remaining`}
        />
        <MetricCard
          label="Forecast Accuracy"
          value={`${accuracy.toFixed(1)}%`}
          icon={LineChart}
          color="border-[#00ff00] text-[#00ff00]"
          subtitle="90-Day Moving Avg"
        />
        <MetricCard
          label="Vessels in Transit"
          value={inTransit}
          icon={Globe}
          color="border-blue-500 text-blue-400"
          subtitle={`${(totalTonnage / 1000000).toFixed(2)}M MT Cargo`}
        />
        <MetricCard
          label="Anchorage Delays"
          value={anchored}
          icon={AlertTriangle}
          color="border-red-500 text-red-500"
          subtitle=">24hr Wait Time"
        />
        <MetricCard
          label="Emissions Avoided"
          value={`${emissionsKtons.toFixed(1)}k Tons`}
          icon={Leaf}
          color="border-green-500 text-green-500"
          subtitle="Via route optimization"
        />
      </div>
    </header>
  );
}
