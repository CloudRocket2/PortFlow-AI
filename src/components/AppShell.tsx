"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import DeveloperMetricsOverlay from "@/components/DeveloperMetricsOverlay";
import { usePortFlowData } from "@/context/PortFlowContext";
import { AlertTriangle } from "lucide-react";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isRedSeaClosed } = usePortFlowData();

  if (pathname === "/login") {
    return <main className="w-full h-full">{children}</main>;
  }

  return (
    <>
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 h-full">
        {isRedSeaClosed && (
          <div className="bg-rose-500/10 border-b border-rose-500/30 w-full py-2 px-6 flex items-center justify-center gap-3 shrink-0 animate-pulse">
            <AlertTriangle className="w-4 h-4 text-rose-500" />
            <span className="text-xs font-mono font-bold text-rose-400 uppercase tracking-widest">
              Critical Geopolitical Alert: Red Sea Transit Suspended • Global Fleet Rerouting via Cape of Good Hope
            </span>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </div>
        )}
        <Header />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
      <DeveloperMetricsOverlay />
    </>
  );
}
