"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, AlertCircle, Info, LucideIcon } from "lucide-react";

interface SeverityStyle {
  icon: LucideIcon;
  bg: string;
  border: string;
  text: string;
  badge: string;
}

const severityConfig: Record<string, SeverityStyle> = {
  CRITICAL: {
    icon: AlertTriangle,
    bg: "bg-red-500/10",
    border: "border-red-500/30",
    text: "text-red-400",
    badge: "bg-red-500/20",
  },
  WARNING: {
    icon: AlertCircle,
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    text: "text-amber-400",
    badge: "bg-amber-500/20",
  },
  INFO: {
    icon: Info,
    bg: "bg-blue-500/10",
    border: "border-blue-500/30",
    text: "text-blue-400",
    badge: "bg-blue-500/20",
  },
};

interface Alert {
  id: string;
  severity: "CRITICAL" | "WARNING" | "INFO";
  title: string;
  message: string;
  time: string;
}

export default function BottleneckAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard/bottlenecks")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setAlerts(data.data);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="minimal-panel p-5 flex items-center justify-center text-neutral-500 text-xs font-mono uppercase tracking-widest">
        Scanning yard anomalies...
      </div>
    );
  }

  return (
    <div className="minimal-panel p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[10px] font-mono tracking-widest uppercase text-white">
          Active Bottlenecks
        </h3>
        <span className="text-[10px] text-neutral-500 font-mono flex items-center gap-1 uppercase tracking-widest">
          <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
          LIVE SCAN
        </span>
      </div>
      
      <div className="space-y-3">
        {alerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-neutral-600">
            <p className="text-[10px] font-mono uppercase tracking-widest">No bottlenecks detected</p>
          </div>
        ) : (
          alerts.map((a, i) => {
            const config = severityConfig[a.severity] || severityConfig.INFO;
            const Icon = config.icon;
            return (
              <div
                key={i}
                className="flex items-start gap-3 p-3 border border-neutral-800"
              >
                <Icon className="w-4 h-4 mt-0.5 shrink-0 text-white" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs font-mono font-bold text-white uppercase truncate">
                      {a.title}
                    </span>
                    <span className="text-[10px] uppercase font-mono tracking-widest text-neutral-400 border border-neutral-800 px-1">
                      {a.severity}
                    </span>
                  </div>
                  <p className="text-[10px] font-mono text-neutral-500 leading-relaxed uppercase tracking-widest mt-1">
                    {a.message}
                  </p>
                </div>
                <span className="text-[10px] text-neutral-600 font-mono whitespace-nowrap mt-1">
                  {a.time}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
