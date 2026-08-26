// =============================================================================
// MOCK DATA CONTRACTS — Port Freight & Container Routing Optimizer
// =============================================================================
// These typed arrays simulate real-time port telemetry feeds. In production,
// each array maps 1-to-1 to a database table or streaming topic.
// =============================================================================

export type ContainerStatus =
  | "in-transit"
  | "at-berth"
  | "in-yard"
  | "cleared"
  | "flagged";

export type PriorityLevel = "critical" | "high" | "medium" | "low";

export interface Container {
  id: string;
  status: ContainerStatus;
  /** Dwell time in hours — how long the container has been idle in the yard */
  dwell_time: number;
  priority_level: PriorityLevel;
  /** Estimated CO₂ impact in kg from idle equipment & reefer power draw */
  carbon_impact: number;
  /** Container origin port code */
  origin: string;
  /** Destination yard block */
  yard_block: string;
  /** Weight in metric tons */
  weight: number;
}

export interface Vessel {
  id: string;
  name: string;
  /** Estimated time of arrival as ISO string */
  eta: string;
  container_count: number;
  /** Assigned berth number */
  berth: number;
  /** Vessel status */
  status: "approaching" | "docked" | "departing";
}

export interface YardMetrics {
  /** Total yard capacity in TEU (Twenty-foot Equivalent Units) */
  capacity: number;
  /** Current utilization in TEU */
  current_utilization: number;
  /** Active bottleneck zones */
  active_bottlenecks: BottleneckZone[];
  /** Number of active cranes */
  active_cranes: number;
  /** Ships currently at berth */
  ships_in_berth: number;
}

export interface BottleneckZone {
  zone: string;
  severity: "critical" | "warning" | "normal";
  description: string;
}

export interface DwellTimeTrend {
  day: string;
  avg_hours: number;
}

// =============================================================================
// CONTAINERS — 15 containers with varied statuses and dwell times
// =============================================================================
export const containers: Container[] = [
  {
    id: "CNTR-4821",
    status: "flagged",
    dwell_time: 96,
    priority_level: "critical",
    carbon_impact: 142,
    origin: "CNSHA",
    yard_block: "A-12",
    weight: 24.5,
  },
  {
    id: "CNTR-7733",
    status: "in-yard",
    dwell_time: 72,
    priority_level: "high",
    carbon_impact: 98,
    origin: "SGSIN",
    yard_block: "B-04",
    weight: 18.2,
  },
  {
    id: "CNTR-1294",
    status: "in-yard",
    dwell_time: 54,
    priority_level: "high",
    carbon_impact: 76,
    origin: "KRPUS",
    yard_block: "C-08",
    weight: 22.1,
  },
  {
    id: "CNTR-5587",
    status: "at-berth",
    dwell_time: 12,
    priority_level: "medium",
    carbon_impact: 23,
    origin: "JPTYO",
    yard_block: "A-03",
    weight: 19.8,
  },
  {
    id: "CNTR-9012",
    status: "cleared",
    dwell_time: 4,
    priority_level: "low",
    carbon_impact: 8,
    origin: "DEHAM",
    yard_block: "D-01",
    weight: 15.4,
  },
  {
    id: "CNTR-3345",
    status: "in-transit",
    dwell_time: 0,
    priority_level: "medium",
    carbon_impact: 12,
    origin: "NLRTM",
    yard_block: "—",
    weight: 21.0,
  },
  {
    id: "CNTR-6601",
    status: "flagged",
    dwell_time: 108,
    priority_level: "critical",
    carbon_impact: 167,
    origin: "CNSHA",
    yard_block: "A-14",
    weight: 26.3,
  },
  {
    id: "CNTR-2178",
    status: "in-yard",
    dwell_time: 36,
    priority_level: "medium",
    carbon_impact: 45,
    origin: "MYPKG",
    yard_block: "B-09",
    weight: 17.6,
  },
  {
    id: "CNTR-8899",
    status: "at-berth",
    dwell_time: 8,
    priority_level: "low",
    carbon_impact: 15,
    origin: "TWKHH",
    yard_block: "C-02",
    weight: 20.5,
  },
  {
    id: "CNTR-4456",
    status: "in-yard",
    dwell_time: 64,
    priority_level: "high",
    carbon_impact: 89,
    origin: "VNHPH",
    yard_block: "A-07",
    weight: 23.7,
  },
  {
    id: "CNTR-1100",
    status: "cleared",
    dwell_time: 2,
    priority_level: "low",
    carbon_impact: 5,
    origin: "AEJEA",
    yard_block: "D-05",
    weight: 14.2,
  },
  {
    id: "CNTR-7724",
    status: "in-transit",
    dwell_time: 0,
    priority_level: "medium",
    carbon_impact: 10,
    origin: "LKCMB",
    yard_block: "—",
    weight: 19.0,
  },
  {
    id: "CNTR-3398",
    status: "in-yard",
    dwell_time: 48,
    priority_level: "medium",
    carbon_impact: 62,
    origin: "INMAA",
    yard_block: "B-11",
    weight: 16.8,
  },
  {
    id: "CNTR-5500",
    status: "flagged",
    dwell_time: 120,
    priority_level: "critical",
    carbon_impact: 195,
    origin: "CNSHA",
    yard_block: "A-15",
    weight: 27.1,
  },
  {
    id: "CNTR-6200",
    status: "at-berth",
    dwell_time: 6,
    priority_level: "low",
    carbon_impact: 11,
    origin: "THBKK",
    yard_block: "C-06",
    weight: 18.9,
  },
];

// =============================================================================
// VESSELS — 5 ships with staggered ETAs
// =============================================================================
export const vessels: Vessel[] = [
  {
    id: "VSL-001",
    name: "MV Pacific Horizon",
    eta: "2026-08-25T14:30:00Z",
    container_count: 1240,
    berth: 3,
    status: "docked",
  },
  {
    id: "VSL-002",
    name: "MSC Aurora",
    eta: "2026-08-25T18:00:00Z",
    container_count: 890,
    berth: 1,
    status: "approaching",
  },
  {
    id: "VSL-003",
    name: "CMA CGM Liberty",
    eta: "2026-08-26T06:00:00Z",
    container_count: 2100,
    berth: 5,
    status: "approaching",
  },
  {
    id: "VSL-004",
    name: "Evergreen Titan",
    eta: "2026-08-25T10:00:00Z",
    container_count: 670,
    berth: 2,
    status: "departing",
  },
  {
    id: "VSL-005",
    name: "Maersk Sentinel",
    eta: "2026-08-25T12:00:00Z",
    container_count: 1580,
    berth: 4,
    status: "docked",
  },
];

// =============================================================================
// YARD METRICS — Real-time port operational data
// =============================================================================
export const yardMetrics: YardMetrics = {
  capacity: 12000,
  current_utilization: 8760,
  active_bottlenecks: [
    {
      zone: "Gate 4 — Export Lane",
      severity: "critical",
      description:
        "Truck queue exceeds 45 min avg wait. 12 trucks stalled due to missing documentation.",
    },
    {
      zone: "Block A — Reefer Stack",
      severity: "warning",
      description:
        "3 reefer containers over 72hr dwell. Power draw at 87% plug capacity.",
    },
    {
      zone: "Berth 3 — Crane Ops",
      severity: "normal",
      description: "Crane #7 operating at reduced speed. Maintenance window in 2hr.",
    },
  ],
  active_cranes: 6,
  ships_in_berth: 2,
};

// =============================================================================
// DWELL TIME TREND — 7-day rolling average for line chart
// =============================================================================
export const dwellTimeTrend: DwellTimeTrend[] = [
  { day: "Mon", avg_hours: 38 },
  { day: "Tue", avg_hours: 42 },
  { day: "Wed", avg_hours: 55 },
  { day: "Thu", avg_hours: 48 },
  { day: "Fri", avg_hours: 35 },
  { day: "Sat", avg_hours: 29 },
  { day: "Sun", avg_hours: 32 },
];
