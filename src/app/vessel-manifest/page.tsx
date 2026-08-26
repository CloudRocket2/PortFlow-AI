import prisma from "@/lib/prisma";
import { Ship, Anchor, Clock } from "lucide-react";

export const revalidate = 0; // Dynamic route

export default async function VesselManifestPage() {
  const vessels = await prisma.vessel.findMany({
    include: {
      _count: {
        select: { containers: true }
      }
    },
    orderBy: { eta: "asc" }
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">Vessel Manifest</h2>
        <p className="text-sm text-slate-400">Incoming and docked ships</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vessels.map((v) => (
          <div key={v.id} className="bg-[#1e293b] rounded-xl border border-[#334155] p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${v.berthStatus === 'DOCKED' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'}`}>
                  <Ship className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">{v.name}</h3>
                  <p className="text-xs text-slate-400 font-mono">Call Sign: {v.callSign}</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400 flex items-center gap-2"><Anchor className="w-4 h-4" /> Status</span>
                <span className={`font-semibold ${v.berthStatus === 'DOCKED' ? 'text-green-400' : 'text-amber-400'}`}>
                  {v.berthStatus}
                </span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400 flex items-center gap-2"><Clock className="w-4 h-4" /> ETA</span>
                <span className="text-slate-200">{v.eta.toLocaleString()}</span>
              </div>
              
              <div className="pt-3 border-t border-[#334155] flex justify-between items-center">
                <span className="text-xs text-slate-400">Assigned Freight</span>
                <span className="text-sm font-bold text-white">{v._count.containers} containers</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
