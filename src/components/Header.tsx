"use client";

import { Bell, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";

const PAGE_TITLES: Record<string, { title: string; subtitle: string }> = {
  "/": { title: "Fleet Command", subtitle: "Global vessel tracking & optimization" },
  "/forecast": { title: "Freight Forecast", subtitle: "AI market predictions & risk alerts" },
  "/legal": { title: "Legal Compliance", subtitle: "Regulatory screening & charter analysis" },
  "/risk": { title: "Risk Centre", subtitle: "Admiralty search & case law intelligence" },
  "/chartering": { title: "Chartering", subtitle: "AI vessel & freight rate optimizer" },
  "/scenarios": { title: "Portfolio Scenarios", subtitle: "Multi-voyage allocation comparison" },
  "/ai-logs": { title: "AI Insights", subtitle: "Operations intelligence assistant" },
};

import { usePortFlowData } from "@/context/PortFlowContext";
import { FileText, LineChart, Globe, AlertTriangle, Leaf } from "lucide-react";

export default function Header() {
  const pathname = usePathname();
  const [showNotifications, setShowNotifications] = useState(false);
  const [userInitials, setUserInitials] = useState("PF");
  const [userName, setUserName] = useState("PortFlow User");
  const [showProfile, setShowProfile] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const { state } = usePortFlowData();
  const { vessels, contracts, routes } = state;

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.user?.name) {
          setUserName(data.user.name);
          const parts = data.user.name.split(" ");
          setUserInitials(
            parts.length >= 2
              ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
              : parts[0].slice(0, 2).toUpperCase()
          );
        }
      })
      .catch(console.error);
  }, []);

  // Click-outside to close notifications
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    }
    if (showNotifications) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showNotifications]);

  const pageInfo = PAGE_TITLES[pathname] || PAGE_TITLES["/"];

  const alerts = [
    { id: 1, type: "high" as const, title: "New Regulation Detected", desc: "Merchant Shipping Rules 2026 drafted. Impact: High on Panamax coastal vessels. Requires immediate contract review.", time: "10 min ago" },
    { id: 2, type: "medium" as const, title: "Sanctions Update: OFAC", desc: "Added 12 new entities to SDN list. PortFlow AI has automatically rescanned your fleet portfolio.", time: "2 hrs ago" },
    { id: 3, type: "low" as const, title: "DG Shipping Notification", desc: "Digital port clearance mandated for all major Indian ports effective next quarter.", time: "1 day ago" },
  ];

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
    <header className="flex items-center justify-between bg-[#060606] border-b border-neutral-800/60 px-6 h-14 shrink-0 z-50 relative">
      {/* Left: Dynamic Page Title */}
      <div className="flex-shrink-0 mr-8">
        <h2 className="text-base font-semibold text-white whitespace-nowrap">{pageInfo.title}</h2>
        <p className="text-[11px] text-neutral-500 mt-0.5 whitespace-nowrap">{pageInfo.subtitle}</p>
      </div>

      {/* Center: Global HUD Metrics (Only on large screens) */}
      <div className="hidden lg:flex flex-1 items-center justify-center">
        <div className="flex items-center divide-x divide-neutral-800/60">
          <div className="px-4 flex items-center gap-2">
            <FileText className="w-4 h-4 text-amber-400" />
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-mono text-neutral-500">Active</span>
              <span className="text-sm font-mono font-semibold text-white">{multiVoyage} <span className="text-neutral-500 font-normal">CTs</span></span>
            </div>
          </div>
          <div className="px-4 flex items-center gap-2">
            <LineChart className="w-4 h-4 text-emerald-400" />
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-mono text-neutral-500">Accuracy</span>
              <span className="text-sm font-mono font-semibold text-white">{accuracy.toFixed(1)}%</span>
            </div>
          </div>
          <div className="px-4 flex items-center gap-2">
            <Globe className="w-4 h-4 text-cyan-400" />
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-mono text-neutral-500">In Transit</span>
              <span className="text-sm font-mono font-semibold text-white">{inTransit} <span className="text-neutral-500 font-normal">vessels</span></span>
            </div>
          </div>
          <div className="px-4 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-mono text-neutral-500">Delayed</span>
              <span className="text-sm font-mono font-semibold text-white">{anchored} <span className="text-neutral-500 font-normal">&gt;24h</span></span>
            </div>
          </div>
          <div className="px-4 flex items-center gap-2">
            <Leaf className="w-4 h-4 text-emerald-400" />
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-mono text-neutral-500">Saved</span>
              <span className="text-sm font-mono font-semibold text-white">{emissionsKtons.toFixed(1)}k <span className="text-neutral-500 font-normal">CO2</span></span>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="focus-ring relative p-2 text-neutral-500 hover:text-neutral-200 hover:bg-white/[0.04] rounded-lg transition-all duration-200"
          >
            <Bell className="w-[18px] h-[18px]" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full shadow-[0_0_6px_rgba(251,113,133,0.6)]" />
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <>
              {/* Invisible backdrop to capture click-away reliably */}
              <div 
                className="fixed inset-0 z-[40]" 
                onClick={() => setShowNotifications(false)}
              />
              <div className="absolute top-full right-0 mt-2 w-[380px] minimal-panel shadow-2xl overflow-hidden animate-slide-in z-[50]">
                <div className="p-4 border-b border-neutral-800/60 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <Bell className="w-3.5 h-3.5 text-cyan-400" />
                  Regulatory Intelligence
                </h3>
                <span className="text-xs font-mono bg-cyan-500/10 text-cyan-400 px-2 py-0.5 rounded-full border border-cyan-500/20">
                  3 new
                </span>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="p-4 border-b border-neutral-800/40 hover:bg-white/[0.02] transition-colors cursor-pointer group"
                  >
                    <div className="flex items-start justify-between mb-1.5">
                      <span
                        className={`text-sm font-medium ${
                          alert.type === "high"
                            ? "text-rose-400"
                            : alert.type === "medium"
                            ? "text-amber-400"
                            : "text-blue-400"
                        }`}
                      >
                        {alert.title}
                      </span>
                      <span className="text-xs text-neutral-600 font-mono">{alert.time}</span>
                    </div>
                    <p className="text-[11px] text-neutral-500 leading-relaxed group-hover:text-neutral-400 transition-colors">
                      {alert.desc}
                    </p>
                  </div>
                ))}
              </div>
              <div className="p-2.5 border-t border-neutral-800/60 text-center">
                <Link href="/risk" className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors font-medium">
                  View all alerts →
                </Link>
              </div>
              </div>
            </>
          )}
        </div>

        {/* User Avatar */}
        <div className="relative">
          <button 
            onClick={() => setShowProfile(!showProfile)}
            className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500/20 to-violet-500/20 border border-neutral-700/60 flex items-center justify-center hover:border-cyan-500/50 transition-colors focus-ring"
          >
            <span className="text-xs font-semibold text-neutral-300">{userInitials}</span>
          </button>
          
          {showProfile && (
            <>
              {/* Invisible backdrop to capture click-away reliably */}
              <div 
                className="fixed inset-0 z-[40]" 
                onClick={() => setShowProfile(false)}
              />
              <div className="absolute top-full right-0 mt-2 w-56 minimal-panel shadow-2xl overflow-hidden animate-slide-in z-[50]">
                <div className="p-4 border-b border-neutral-800/60">
                  <p className="text-xs font-mono text-neutral-500 uppercase tracking-widest mb-1">Signed In</p>
                  <p className="text-sm font-medium text-white truncate">{userName}</p>
                </div>
                <div className="p-1.5">
                  <Link href="/admin" className="block w-full text-left px-3 py-2 text-sm text-neutral-400 hover:text-white hover:bg-white/[0.03] rounded transition-colors">
                    Workspace Settings
                  </Link>
                  <button 
                    onClick={async () => {
                      await fetch('/api/auth/logout', { method: 'POST' });
                      window.location.href = '/login';
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded transition-colors mt-1"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
