"use client";

import { useEffect, useState, useCallback } from "react";
import {
  ArrowUpDown,
  AlertCircle,
  CheckCircle2,
  Clock,
  Truck,
  Ship,
  Search,
  ChevronLeft,
  ChevronRight,
  History,
  LucideIcon,
} from "lucide-react";
import ContainerHistoryPanel from "./ContainerHistoryPanel";

// ── Types ────────────────────────────────────────────────────────────────────
interface ContainerRow {
  id: string;
  type: string;
  weightKg: number;
  dwellTimeHours: number;
  priorityLevel: string;
  status: string;
  carbonSavedKg: number;
  currentSlot: { bay: number; row: number; tier: number } | null;
  vessel: { name: string; callSign: string } | null;
  _count: { events: number };
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// ── Badge Configs ────────────────────────────────────────────────────────────
const statusConfig: Record<
  string,
  { label: string; bg: string; text: string; icon: LucideIcon }
> = {
  INBOUND: { label: "Inbound", bg: "bg-purple-500/20", text: "text-purple-400", icon: Ship },
  YARD_STACKED: { label: "In Yard", bg: "bg-amber-500/20", text: "text-amber-400", icon: Clock },
  READY_FOR_PICKUP: { label: "Ready", bg: "bg-blue-500/20", text: "text-blue-400", icon: CheckCircle2 },
  DISPATCHED: { label: "Dispatched", bg: "bg-green-500/20", text: "text-green-400", icon: Truck },
};

const priorityConfig: Record<string, { bg: string; text: string }> = {
  HIGH: { bg: "bg-red-500/20", text: "text-red-400" },
  MEDIUM: { bg: "bg-blue-500/20", text: "text-blue-400" },
  LOW: { bg: "bg-slate-500/20", text: "text-slate-400" },
};

const typeConfig: Record<string, { bg: string; text: string }> = {
  DRY: { bg: "bg-slate-500/20", text: "text-slate-300" },
  REEFER: { bg: "bg-cyan-500/20", text: "text-cyan-400" },
  HAZMAT: { bg: "bg-red-500/20", text: "text-red-400" },
};

function dwellColor(hours: number): string {
  if (hours >= 72) return "text-red-400";
  if (hours >= 48) return "text-amber-400";
  return "text-green-400";
}

// ── Main Component ───────────────────────────────────────────────────────────
export default function ContainerTable() {
  const [containers, setContainers] = useState<ContainerRow[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedContainerId, setSelectedContainerId] = useState<string | null>(null);

  // Query state
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("dwellTimeHours");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchContainers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: "15",
        sortBy,
        sortOrder,
      });
      if (statusFilter) params.set("status", statusFilter);
      if (typeFilter) params.set("type", typeFilter);

      const res = await fetch(`/api/containers?${params}`);
      const data = await res.json();
      setContainers(data.data);
      setPagination(data.pagination);
    } catch (err) {
      console.error("Failed to fetch containers:", err);
    } finally {
      setLoading(false);
    }
  }, [page, sortBy, sortOrder, statusFilter, typeFilter]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchContainers();
  }, [fetchContainers]);

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
    setPage(1);
  };

  // Client-side search filter on loaded data
  const filtered = searchTerm
    ? containers.filter(
        (c) =>
          c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (c.vessel?.name ?? "").toLowerCase().includes(searchTerm.toLowerCase())
      )
    : containers;

  const flaggedCount = containers.filter((c) => c.dwellTimeHours >= 72).length;

  return (
    <>
      <div className="glass-panel rounded-xl overflow-hidden">
        {/* Table Header with Filters */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/5">
          <div>
            <h3 className="text-sm font-semibold text-white">Container Inventory</h3>
            <p className="text-xs text-slate-400">
              {pagination?.total ?? "—"} containers tracked •{" "}
              {flaggedCount} over 72hr dwell • Live DB
            </p>
          </div>
          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
              <input
                type="text"
                placeholder="Search ID or vessel..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1.5 bg-[#0f172a] border border-[#334155] rounded-lg text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 w-48"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              className="px-2.5 py-1.5 bg-[#0f172a] border border-[#334155] rounded-lg text-xs text-white focus:outline-none focus:border-blue-500"
            >
              <option value="">All Statuses</option>
              <option value="INBOUND">Inbound</option>
              <option value="YARD_STACKED">In Yard</option>
              <option value="READY_FOR_PICKUP">Ready</option>
              <option value="DISPATCHED">Dispatched</option>
            </select>

            {/* Type Filter */}
            <select
              value={typeFilter}
              onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
              className="px-2.5 py-1.5 bg-[#0f172a] border border-[#334155] rounded-lg text-xs text-white focus:outline-none focus:border-blue-500"
            >
              <option value="">All Types</option>
              <option value="DRY">Dry</option>
              <option value="REEFER">Reefer</option>
              <option value="HAZMAT">Hazmat</option>
            </select>

            {/* High Dwell Badge */}
            {flaggedCount > 0 && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-red-500/10 text-red-400 text-[10px] font-medium">
                <AlertCircle className="w-3 h-3" />
                {flaggedCount} over 72hr
              </span>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-slate-400 uppercase tracking-wider border-b border-white/5">
                <th className="text-left px-5 py-3">
                  <button onClick={() => handleSort("id")} className="flex items-center gap-1 hover:text-white transition-colors">
                    Container ID <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="text-left px-4 py-3">Type</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-left px-4 py-3">
                  <button onClick={() => handleSort("dwellTimeHours")} className="flex items-center gap-1 hover:text-white transition-colors">
                    Dwell <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="text-left px-4 py-3">
                  <button onClick={() => handleSort("priorityLevel")} className="flex items-center gap-1 hover:text-white transition-colors">
                    Priority <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="text-left px-4 py-3">
                  <button onClick={() => handleSort("carbonSavedKg")} className="flex items-center gap-1 hover:text-white transition-colors">
                    CO₂ Saved <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="text-left px-4 py-3">Location</th>
                <th className="text-left px-4 py-3">Vessel</th>
                <th className="text-right px-5 py-3">Audit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#334155]/50">
              {loading ? (
                <tr>
                  <td colSpan={9} className="text-center py-12 text-slate-500">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                      Loading containers...
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-12 text-slate-500">
                    No containers found matching filters.
                  </td>
                </tr>
              ) : (
                filtered.map((c) => {
                  const st = statusConfig[c.status] || statusConfig.INBOUND;
                  const pr = priorityConfig[c.priorityLevel] || priorityConfig.MEDIUM;
                  const tp = typeConfig[c.type] || typeConfig.DRY;
                  const StatusIcon = st.icon;

                  return (
                    <tr key={c.id} className="hover:bg-[#334155]/30 transition-colors">
                      <td className="px-5 py-3">
                        <button
                          onClick={() => setSelectedContainerId(c.id)}
                          className="font-mono text-sm text-blue-400 hover:text-blue-300 hover:underline transition-colors"
                        >
                          {c.id}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${tp.bg} ${tp.text}`}>
                          {c.type}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${st.bg} ${st.text}`}>
                          <StatusIcon className="w-3 h-3" />
                          {st.label}
                        </span>
                      </td>
                      <td className={`px-4 py-3 font-semibold ${dwellColor(c.dwellTimeHours)}`}>
                        {c.dwellTimeHours}h
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${pr.bg} ${pr.text}`}>
                          {c.priorityLevel}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-300">
                        {c.carbonSavedKg > 0 ? `${c.carbonSavedKg} kg` : "—"}
                      </td>
                      <td className="px-4 py-3 text-slate-400 font-mono text-xs">
                        {c.currentSlot
                          ? `B${c.currentSlot.bay}:R${c.currentSlot.row}:T${c.currentSlot.tier}`
                          : "—"}
                      </td>
                      <td className="px-4 py-3 text-slate-400 text-xs truncate max-w-[120px]">
                        {c.vessel?.name ?? "—"}
                      </td>
                      <td className="px-5 py-3 text-right">
                        <button
                          onClick={() => setSelectedContainerId(c.id)}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-[#0f172a] border border-[#334155] text-xs text-slate-400 hover:text-white hover:border-blue-500 transition-colors"
                          title="View audit trail"
                        >
                          <History className="w-3 h-3" />
                          {c._count.events}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-[#334155]">
            <p className="text-xs text-slate-400">
              Page {pagination.page} of {pagination.totalPages} •{" "}
              {pagination.total} total containers
            </p>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="p-1.5 rounded-md border border-[#334155] text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setPage(Math.min(pagination.totalPages, page + 1))}
                disabled={page === pagination.totalPages}
                className="p-1.5 rounded-md border border-[#334155] text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Slide-over History Panel */}
      <ContainerHistoryPanel
        containerId={selectedContainerId}
        onClose={() => setSelectedContainerId(null)}
      />
    </>
  );
}
