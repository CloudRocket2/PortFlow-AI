"use client";

import { Bell, User } from "lucide-react";
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

export default function Header() {
  const pathname = usePathname();
  const [showNotifications, setShowNotifications] = useState(false);
  const [userInitials, setUserInitials] = useState("PF");
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.user?.name) {
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

  return (
    <header className="flex items-center justify-between bg-[#060606] border-b border-neutral-800/60 px-6 h-14 shrink-0 z-50 relative">
      {/* Left: Dynamic Page Title */}
      <div>
        <h2 className="text-base font-semibold text-white">{pageInfo.title}</h2>
        <p className="text-[11px] text-neutral-500 mt-0.5">{pageInfo.subtitle}</p>
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
            <div className="absolute top-full right-0 mt-2 w-[380px] minimal-panel shadow-2xl overflow-hidden animate-slide-in">
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
                <button className="text-[11px] text-cyan-400 hover:text-cyan-300 transition-colors font-medium">
                  View all alerts →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Avatar */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500/20 to-violet-500/20 border border-neutral-700/60 flex items-center justify-center">
          <span className="text-xs font-semibold text-neutral-300">{userInitials}</span>
        </div>
      </div>
    </header>
  );
}
