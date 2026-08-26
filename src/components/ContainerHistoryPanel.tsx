"use client";

import { useEffect, useState } from "react";
import {
  X,
  Ship,
  ArrowRightLeft,
  ClipboardCheck,
  Truck,
  Clock,
  MapPin,
  User,
  ChevronDown,
  LucideIcon,
} from "lucide-react";

interface ContainerEvent {
  id: string;
  containerId: string;
  eventType: string;
  sourceLocation: string | null;
  targetLocation: string | null;
  craneOperatorId: string | null;
  timestamp: string;
  metadata: Record<string, unknown> | null;
}

interface ContainerDetail {
  id: string;
  type: string;
  weightKg: number;
  dwellTimeHours: number;
  priorityLevel: string;
  status: string;
  carbonSavedKg: number;
  currentSlot: { bay: number; row: number; tier: number } | null;
  vessel: { name: string; callSign: string } | null;
}

interface ContainerHistoryPanelProps {
  containerId: string | null;
  onClose: () => void;
}

const eventConfig: Record<
  string,
  { icon: LucideIcon; color: string; bg: string; label: string }
> = {
  DISCHARGED: {
    icon: Ship,
    color: "text-blue-400",
    bg: "bg-blue-500/20",
    label: "Discharged from Vessel",
  },
  MOVED_IN_YARD: {
    icon: ArrowRightLeft,
    color: "text-amber-400",
    bg: "bg-amber-500/20",
    label: "Moved in Yard",
  },
  INSPECTED: {
    icon: ClipboardCheck,
    color: "text-purple-400",
    bg: "bg-purple-500/20",
    label: "Inspected",
  },
  LOADED_ON_TRUCK: {
    icon: Truck,
    color: "text-green-400",
    bg: "bg-green-500/20",
    label: "Loaded on Truck",
  },
};

export default function ContainerHistoryPanel({
  containerId,
  onClose,
}: ContainerHistoryPanelProps) {
  const [container, setContainer] = useState<ContainerDetail | null>(null);
  const [events, setEvents] = useState<ContainerEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null);

  useEffect(() => {
    if (!containerId) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    fetch(`/api/containers/${containerId}/history`)
      .then((res) => res.json())
      .then((data) => {
        setContainer(data.container);
        setEvents(data.events);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [containerId]);

  if (!containerId) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Slide-over Panel */}
      <div className="fixed right-0 top-0 h-full w-full max-w-lg bg-[#0f172a] border-l border-[#334155] z-50 flex flex-col shadow-2xl animate-slide-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#334155] bg-[#1e293b]">
          <div>
            <h2 className="text-base font-bold text-white font-mono">
              {containerId}
            </h2>
            <p className="text-xs text-slate-400">Container Audit Trail</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-[#334155] text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Container Info Card */}
        {container && (
          <div className="px-6 py-4 border-b border-[#334155]">
            <div className="grid grid-cols-3 gap-3">
              <InfoBadge label="Type" value={container.type} />
              <InfoBadge label="Status" value={container.status.replace(/_/g, " ")} />
              <InfoBadge label="Priority" value={container.priorityLevel} />
              <InfoBadge label="Weight" value={`${(container.weightKg / 1000).toFixed(1)}t`} />
              <InfoBadge label="Dwell" value={`${container.dwellTimeHours}h`} />
              <InfoBadge label="CO₂ Saved" value={`${container.carbonSavedKg}kg`} />
            </div>
            {container.currentSlot && (
              <div className="flex items-center gap-2 mt-3 text-xs text-slate-400">
                <MapPin className="w-3.5 h-3.5" />
                Current: Bay {container.currentSlot.bay}, Row{" "}
                {container.currentSlot.row}, Tier {container.currentSlot.tier}
              </div>
            )}
            {container.vessel && (
              <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                <Ship className="w-3.5 h-3.5" />
                Origin: {container.vessel.name} ({container.vessel.callSign})
              </div>
            )}
          </div>
        )}

        {/* Event Timeline */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
            Event History ({events.length} events)
          </h3>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : events.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-12">
              No events recorded for this container.
            </p>
          ) : (
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-[15px] top-6 bottom-6 w-px bg-[#334155]" />

              <div className="space-y-1">
                {events.map((evt, idx) => {
                  const config = eventConfig[evt.eventType] || {
                    icon: Clock,
                    color: "text-slate-400",
                    bg: "bg-slate-500/20",
                    label: evt.eventType,
                  };
                  const Icon = config.icon;
                  const isExpanded = expandedEvent === evt.id;
                  const isLast = idx === events.length - 1;

                  return (
                    <div key={evt.id} className="relative flex gap-3">
                      {/* Timeline dot */}
                      <div
                        className={`relative z-10 flex items-center justify-center w-[30px] h-[30px] rounded-full ${config.bg} shrink-0 mt-1`}
                      >
                        <Icon className={`w-3.5 h-3.5 ${config.color}`} />
                      </div>

                      {/* Event Card */}
                      <div
                        className={`flex-1 rounded-lg border transition-colors cursor-pointer mb-2 ${
                          isExpanded
                            ? "bg-[#1e293b] border-[#475569]"
                            : "bg-[#1e293b]/50 border-[#334155] hover:border-[#475569]"
                        } ${isLast ? "" : ""}`}
                        onClick={() =>
                          setExpandedEvent(isExpanded ? null : evt.id)
                        }
                      >
                        <div className="px-3.5 py-2.5">
                          <div className="flex items-center justify-between">
                            <span
                              className={`text-xs font-semibold ${config.color}`}
                            >
                              {config.label}
                            </span>
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] text-slate-500">
                                {formatTimestamp(evt.timestamp)}
                              </span>
                              <ChevronDown
                                className={`w-3 h-3 text-slate-500 transition-transform ${
                                  isExpanded ? "rotate-180" : ""
                                }`}
                              />
                            </div>
                          </div>

                          {/* Locations */}
                          <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-400">
                            {evt.sourceLocation && (
                              <span className="font-mono bg-[#0f172a] px-1.5 py-0.5 rounded text-[10px]">
                                {evt.sourceLocation}
                              </span>
                            )}
                            {evt.sourceLocation && evt.targetLocation && (
                              <span className="text-slate-600">→</span>
                            )}
                            {evt.targetLocation && (
                              <span className="font-mono bg-[#0f172a] px-1.5 py-0.5 rounded text-[10px]">
                                {evt.targetLocation}
                              </span>
                            )}
                          </div>

                          {/* Expanded metadata */}
                          {isExpanded && (
                            <div className="mt-3 pt-3 border-t border-[#334155] space-y-1.5">
                              {evt.craneOperatorId && (
                                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                                  <User className="w-3 h-3" />
                                  Operator: {evt.craneOperatorId}
                                </div>
                              )}
                              {evt.metadata && (
                                <pre className="text-[10px] text-slate-500 bg-[#0f172a] rounded-md p-2 overflow-x-auto font-mono">
                                  {JSON.stringify(evt.metadata, null, 2)}
                                </pre>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function InfoBadge({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-[#1e293b] rounded-lg px-3 py-2 border border-[#334155]">
      <p className="text-[10px] text-slate-500 uppercase">{label}</p>
      <p className="text-xs font-semibold text-white">{value}</p>
    </div>
  );
}

function formatTimestamp(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

  if (diffHours < 1) return "< 1hr ago";
  if (diffHours < 24) return `${diffHours}hr ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return "1 day ago";
  return `${diffDays} days ago`;
}
