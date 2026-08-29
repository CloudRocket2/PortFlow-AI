"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Ship,
  Truck,
  BrainCircuit,
  Anchor,
  ChevronLeft,
  ChevronRight,
  Globe,
  LineChart,
  Radio,
  Lock,
  Globe2,
  BarChart3,
  Scale,
  Droplet,
  Sparkles,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { label: "Fleet Command", icon: Globe2, href: "/" },
  { label: "Chartering", icon: Ship, href: "/chartering" },
  { label: "Freight Forecast", icon: BarChart3, href: "/forecast" },
  { label: "Scenarios", icon: Scale, href: "/scenarios" },
  { label: "AI Insights", icon: Sparkles, href: "/ai-logs" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      if (typeof window !== "undefined") {
        localStorage.removeItem("portflow_role");
        localStorage.removeItem("portflow_clearance");
      }
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <aside
      className={`bg-black border-r border-neutral-800 text-white flex flex-col h-full transition-all duration-300 ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Brand */}
      <div className="h-16 flex items-center justify-center border-b border-neutral-800 shrink-0">
        <div className="flex items-center gap-3">
          <Anchor className="w-6 h-6 text-white" />
          {!collapsed && (
            <span className="font-bold text-lg tracking-widest uppercase">
              PortFlow OS
            </span>
          )}
        </div>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 py-6 flex flex-col gap-2 px-3 overflow-y-auto hide-scrollbar">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              title={collapsed ? label : undefined}
              className={`flex items-center gap-3 px-3 py-3 font-mono text-xs tracking-widest uppercase transition-all
                ${
                  isActive
                    ? "bg-white text-black"
                    : "text-neutral-500 hover:text-white hover:bg-neutral-900 border border-transparent"
                }
                ${collapsed ? "justify-center" : ""}
              `}
            >
              <Icon className="w-5 h-5 shrink-0" />
              {!collapsed && <span className="truncate">{label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="p-2 border-t border-neutral-800">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-3 px-3 py-2 text-xs font-mono tracking-widest uppercase text-neutral-500 hover:text-white hover:bg-neutral-900 transition-colors"
          title={collapsed ? "Lock / Logout" : undefined}
        >
          <Lock className="w-4 h-4 shrink-0" />
          {!collapsed && <span className="truncate">Lock / Logout</span>}
        </button>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center justify-center py-4 border-t border-neutral-800 text-neutral-500 hover:text-white hover:bg-neutral-900 transition-colors"
      >
        {collapsed ? (
          <ChevronRight className="w-4 h-4" />
        ) : (
          <ChevronLeft className="w-4 h-4" />
        )}
      </button>
    </aside>
  );
}
