"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, AlertCircle, Info, LucideIcon, BrainCircuit, Loader2 } from "lucide-react";

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
    text: "text-rose-400",
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
  const [resolvingIds, setResolvingIds] = useState<Set<string>>(new Set());

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

  const resolveAlert = async (id: string) => {
    // 1. Set resolving state
    setResolvingIds(prev => new Set(prev).add(id));
    
    // 2. Simulate AI working on the problem for 1.5 seconds
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // 3. Remove the alert from the UI
    setAlerts(prev => prev.filter(a => a.id !== id));
    
    // 4. Remove from resolving set
    setResolvingIds(prev => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  if (loading) {
    return (
      <div className="minimal-panel p-5 flex items-center justify-center text-neutral-500 text-xs font-mono uppercase tracking-widest">
        Scanning port anomalies...
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
          alerts.map((a) => {
            const config = severityConfig[a.severity] || severityConfig.INFO;
            const Icon = config.icon;
            const isResolving = resolvingIds.has(a.id);
            const canResolve = a.severity === "CRITICAL" || a.severity === "WARNING";

            return (
              <div
                key={a.id}
                className={`flex items-start gap-3 p-3 border border-neutral-800 rounded-lg transition-all ${isResolving ? 'bg-neutral-800/80 border-emerald-500/50' : 'bg-black/40 hover:bg-neutral-900/50'}`}
              >
                <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${isResolving ? 'text-emerald-400' : 'text-white'}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-white uppercase truncate">
                        {a.title}
                      </span>
                      {!isResolving && (
                        <span className="text-[10px] uppercase font-mono tracking-widest text-neutral-400 border border-neutral-800 px-1 rounded">
                          {a.severity}
                        </span>
                      )}
                    </div>
                    {!isResolving && (
                      <span className="text-[10px] text-neutral-600 font-mono whitespace-nowrap">
                        {a.time}
                      </span>
                    )}
                  </div>
                  
                  <p className="text-[10px] font-mono text-neutral-500 leading-relaxed uppercase tracking-widest mt-1">
                    {isResolving ? "AI generating rerouting instructions..." : a.message}
                  </p>
                  
                  {canResolve && !isResolving && (
                    <button 
                      onClick={() => resolveAlert(a.id)}
                      className="mt-3 flex items-center gap-1.5 px-3 py-1.5 text-[9px] font-mono tracking-widest uppercase border border-neutral-700 hover:border-emerald-500/20 hover:text-emerald-400 text-neutral-400 rounded transition-colors"
                    >
                      <BrainCircuit className="w-3 h-3" />
                      Deploy AI Fix
                    </button>
                  )}
                  {isResolving && (
                    <div className="mt-3 flex items-center gap-1.5 text-[9px] font-mono tracking-widest uppercase text-emerald-400">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      Resolving...
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
