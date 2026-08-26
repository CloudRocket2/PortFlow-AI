"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Ship,
  Truck,
  BrainCircuit,
  Anchor,
  ChevronLeft,
  ChevronRight,
  Container,
  LineChart,
  Radio,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/", label: "Terminal Operations", icon: Container },
  { href: "/chartering", label: "Fleet Chartering", icon: Ship },
  { href: "/forecast", label: "Market Forecast", icon: LineChart },
  { href: "/ai-logs", label: "AI Assistant", icon: BrainCircuit },
  { href: "/truck-queue", label: "Truck Gates", icon: Truck },
  { href: "/radio-logs", label: "VHF Radio Logs", icon: Radio },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`
        flex flex-col bg-black border-r border-neutral-800
        transition-all duration-300 ease-in-out h-full relative z-20 shrink-0
        ${collapsed ? "w-[68px]" : "w-[240px]"}
      `}
    >
      {/* Logo / Brand */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-neutral-800">
        <div className="flex items-center justify-center w-9 h-9 border border-white shrink-0">
          <Anchor className="w-5 h-5 text-white" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <h1 className="text-sm font-bold uppercase tracking-widest text-white leading-tight truncate">
              PortFlow
            </h1>
            <p className="text-[10px] font-mono text-neutral-500 leading-tight">
              TOS MODULE
            </p>
          </div>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 py-4 px-2 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`
                flex items-center gap-3 px-3 py-2.5 text-xs font-mono tracking-widest uppercase
                transition-all duration-200
                ${
                  isActive
                    ? "bg-white text-black"
                    : "text-neutral-500 hover:text-white hover:bg-neutral-900"
                }
              `}
              title={collapsed ? label : undefined}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {!collapsed && <span className="truncate">{label}</span>}
            </Link>
          );
        })}
      </nav>

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
