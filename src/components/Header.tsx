"use client";

import { Activity, Globe, Ship, AlertTriangle, Leaf, LucideIcon, LineChart, FileText } from "lucide-react";
import { useEffect, useState } from "react";

interface DashboardMetrics {
  contracts: { multiVoyage: number; spot: number; totalTonnage: number };
  fleet: { inTransit: number; anchored: number };
  market: { forecastAccuracy: number; trend: string };
  alerts: { anchorageDelays: number };
  carbon: { totalSavedKg: number };
}

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
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);

  useEffect(() => {
    fetch("/api/dashboard/metrics")
      .then((res) => res.json())
      .then((data) => setMetrics(data))
      .catch(console.error);
  }, []);

  if (!metrics) {
    return (
      <header className="flex items-center justify-between bg-black border-b border-neutral-800 px-6 h-16 shrink-0 z-10">
        <div>
          <h2 className="text-xs uppercase tracking-widest font-mono text-white">Global Fleet Command</h2>
          <p className="text-[10px] text-neutral-500">Syncing telemetry...</p>
        </div>
      </header>
    );
  }

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
          value={metrics.contracts.multiVoyage}
          icon={FileText}
          color="border-amber-500 text-amber-500"
          subtitle={`${metrics.contracts.spot} Spot Routes Remaining`}
        />
        <MetricCard
          label="Forecast Accuracy"
          value={`${metrics.market.forecastAccuracy}%`}
          icon={LineChart}
          color="border-[#00ff00] text-[#00ff00]"
          subtitle="90-Day Moving Avg"
        />
        <MetricCard
          label="Vessels in Transit"
          value={metrics.fleet.inTransit}
          icon={Globe}
          color="border-blue-500 text-blue-400"
          subtitle={`${(metrics.contracts.totalTonnage / 1000000).toFixed(2)}M MT Cargo`}
        />
        <MetricCard
          label="Anchorage Delays"
          value={metrics.alerts.anchorageDelays}
          icon={AlertTriangle}
          color="border-red-500 text-red-500"
          subtitle=">24hr Wait Time"
        />
        <MetricCard
          label="Emissions Avoided"
          value={`${(metrics.carbon.totalSavedKg / 1000).toFixed(1)}k Tons`}
          icon={Leaf}
          color="border-green-500 text-green-500"
          subtitle="Via route optimization"
        />
      </div>
    </header>
  );
}
