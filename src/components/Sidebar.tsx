"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Ship,
  Anchor,
  ChevronLeft,
  ChevronRight,
  Globe2,
  BarChart3,
  Scale,
  Droplet,
  Sparkles,
  LineChart,
  LogOut,
} from "lucide-react";
import { useState, useEffect } from "react";

const NAV_SECTIONS = [
  {
    label: "Enterprise",
    items: [
      { label: "Provisioning", icon: Globe2, href: "/admin" },
    ],
  },
  {
    label: "Operations",
    items: [
      { label: "Fleet Command", icon: Globe2, href: "/" },
      { label: "Chartering", icon: Ship, href: "/chartering" },
    ],
  },
  {
    label: "Intelligence",
    items: [
      { label: "Freight Forecast", icon: BarChart3, href: "/forecast" },
      { label: "Scenarios", icon: LineChart, href: "/scenarios" },
      { label: "AI Insights", icon: Sparkles, href: "/ai-logs" },
    ],
  },
  {
    label: "Compliance",
    items: [
      { label: "Legal", icon: Scale, href: "/legal" },
      { label: "Risk Centre", icon: Droplet, href: "/risk" },
    ],
  },
];

const ROLE_ACCESS: Record<string, string[]> = {
  "DIR-12": ["/", "/forecast", "/legal", "/risk", "/chartering", "/scenarios", "/ai-logs"],
  "MGR-01": ["/", "/forecast", "/legal", "/chartering", "/scenarios"],
  "ANL-04": ["/forecast", "/risk", "/ai-logs"],
  "OPS-09": ["/"],
  "GOV-AUTH": ["/admin"],
};

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [allowedPaths, setAllowedPaths] = useState<string[]>([]);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.user?.role) {
          setAllowedPaths(ROLE_ACCESS[data.user.role] || []);
          setUserName(data.user.name || data.user.email || "");
        }
      })
      .catch(console.error);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (e) {
      console.error("Logout failed", e);
    } finally {
      if (typeof window !== "undefined") {
        localStorage.removeItem("portflow_role");
        localStorage.removeItem("portflow_clearance");
      }
      router.push("/login");
    }
  };

  // Filter sections to only show items the user has access to
  const filteredSections = NAV_SECTIONS
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => allowedPaths.includes(item.href)),
    }))
    .filter((section) => section.items.length > 0);

  return (
    <aside
      className={`bg-[#060606] border-r border-neutral-800/60 text-white flex flex-col h-full transition-all duration-300 ${
        collapsed ? "w-16" : "w-60"
      }`}
    >
      {/* Brand */}
      <div className="h-16 flex items-center px-4 border-b border-neutral-800/60 shrink-0">
        <Link href="/" className="flex items-center gap-2 px-1 cursor-pointer hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center shrink-0">
            <Anchor className="w-4 h-4 text-cyan-400" />
          </div>
          {!collapsed && (
            <span className="font-semibold text-base tracking-wider uppercase text-white/90">
              PortFlow
            </span>
          )}
        </Link>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 py-4 flex flex-col gap-1 px-2.5 overflow-y-auto hide-scrollbar">
        {filteredSections.map((section, sectionIdx) => (
          <div key={section.label} className={sectionIdx > 0 ? "mt-4" : ""}>
            {!collapsed && (
              <p className="text-xs font-mono uppercase tracking-widest text-neutral-600 px-2.5 mb-2">
                {section.label}
              </p>
            )}
            {collapsed && sectionIdx > 0 && (
              <div className="mx-3 mb-2 border-t border-neutral-800/60" />
            )}
            {section.items.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  title={collapsed ? label : undefined}
                  className={`focus-ring flex items-center gap-2.5 px-2.5 py-2 text-sm tracking-wide transition-all duration-200 rounded-lg group
                    ${
                      isActive
                        ? "bg-white/[0.06] text-white border-l-2 border-cyan-400 ml-0 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
                        : "text-neutral-500 hover:text-neutral-200 hover:bg-white/[0.03] border-l-2 border-transparent"
                    }
                    ${collapsed ? "justify-center px-0 border-l-0" : ""}
                  `}
                >
                  <Icon className={`w-[18px] h-[18px] shrink-0 transition-colors ${isActive ? "text-cyan-400" : "text-neutral-600 group-hover:text-neutral-400"}`} />
                  {!collapsed && <span className="truncate font-medium">{label}</span>}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="focus-ring flex items-center justify-center py-3 border-t border-neutral-800/60 text-neutral-600 hover:text-neutral-300 hover:bg-white/[0.03] transition-all duration-200"
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
