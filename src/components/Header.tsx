"use client";

import { Activity, Container, Ship, AlertTriangle, Leaf, LucideIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useTelemetry } from "@/hooks/useTelemetry";

interface DashboardMetrics {
  yardCapacity: { total: number; occupied: number; utilizationPercent: number };
  vessels: { active: number; docked: number };
  alerts: { highDwellCount: number };
  carbon: { totalSavedKg: number };
  containers: { total: number };
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
  const { activeCranes } = useTelemetry();

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
          <h2 className="text-xs uppercase tracking-widest font-mono text-white">Operations Dashboard</h2>
          <p className="text-[10px] text-neutral-500">Loading metrics...</p>
        </div>
      </header>
    );
  }

  const densityPercent = metrics.yardCapacity.utilizationPercent;
  const densityColor =
    densityPercent > 80 ? "border-red-500 text-red-500" : densityPercent > 60 ? "border-amber-500 text-amber-500" : "border-neutral-500 text-neutral-300";

  return (
    <header className="flex items-center justify-between bg-black border-b border-neutral-800 px-6 h-20 shrink-0 z-10">
      {/* Left ?" Title */}
      <div>
        <h2 className="text-xs uppercase font-mono tracking-widest text-white">Operations Dashboard</h2>
        <p className="text-[10px] text-neutral-500 font-mono">
          REAL-TIME PORT TELEMETRY
        </p>
      </div>

      {/* Right ?" Global Metrics from API */}
      <div className="flex items-center divide-x divide-neutral-800">
        <MetricCard
          label="Yard Density"
          value={`${densityPercent}%`}
          icon={Container}
          color={densityColor}
          subtitle={`${metrics.yardCapacity.occupied} / ${metrics.yardCapacity.total} slots`}
        />
        <MetricCard
          label="Active Cranes"
          value={activeCranes}
          icon={Activity}
          color="border-white text-white"
          subtitle="Live Sensors"
        />
        <MetricCard
          label="Ships Docked"
          value={metrics.vessels.docked}
          icon={Ship}
          color="border-neutral-500 text-neutral-300"
        />
        <MetricCard
          label="High Dwell"
          value={metrics.alerts.highDwellCount}
          icon={AlertTriangle}
          color="border-red-500 text-red-500"
          subtitle=">72hr containers"
        />
        <MetricCard
          label="CO2 Saved"
          value={`${metrics.carbon.totalSavedKg.toFixed(0)} kg`}
          icon={Leaf}
          color="border-green-500 text-green-500"
        />
      </div>
    </header>
  );
}
