"use client";

import dynamic from "next/dynamic";

const Yard3D = dynamic(() => import("@/components/Yard3D"), { ssr: false });

export default function YardMapPage() {
  return (
    <div className="flex flex-col h-full space-y-4">
      <div>
        <h2 className="text-xl font-bold text-white">Full Yard Map (3D)</h2>
        <p className="text-sm text-slate-400">Interactive Digital Twin. Use mouse to orbit, scroll to zoom.</p>
      </div>
      
      <div className="flex-1 rounded-xl overflow-hidden border border-[#334155]">
        <Yard3D />
      </div>
    </div>
  );
}
