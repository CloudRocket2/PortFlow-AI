"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type VesselClass = "Handysize" | "Supramax" | "Panamax" | "Capesize";
export type VesselStatus = "In Transit" | "Loading" | "Discharging" | "Idle" | "Anchored";

export interface Port {
  id: string;
  name: string;
  type: "Origin" | "Destination";
  lat: number;
  lng: number;
  draftLimit: number;
  handlingRate: number; // MT/day
  legalStatus?: string; // Phase 1: Port Legal Compliance
  legalIssues?: string[];
  isSpoofed?: boolean;
}

export interface Vessel {
  id: string;
  name: string;
  class: VesselClass;
  status: VesselStatus;
  currentDraft: number;
  capacity: number; // MT
  legalScore?: number; // Phase 1: Vessel Legal Passport
  legalIssues?: string[];
  isSpoofed?: boolean;
  imo?: string;
  flag?: string;
  owner?: string;
  classSociety?: string;
  pni?: string;
}

export interface Route {
  id: string;
  vesselId: string;
  originId: string;
  destinationId: string;
  cargo: string;
  volume: number; // MT
  eta: string; // ISO or relative
}

export interface Contract {
  id: string;
  routeId: string;
  type: string;
  status: "Commercial Approval" | "Legal Review Req." | "Mgt Approval Pending" | "AI Executed"; // Phase 1: Human-in-the-Loop Governance
  predictedSavings: number;
  realizedSavings: number | null;
  commercialScore?: number; // Phase 1: AI Explainability
  operationalScore?: number;
  carbonSaved?: number;
  fuelSaved?: number;
}

export interface Alert {
  id: string;
  severity: "CRITICAL" | "WARNING" | "INFO";
  title: string;
  message: string;
  time: string;
}

export interface ForecastPoint {
  date: string; // MM/DD
  rate: number;
  volatility: number;
}

export interface PortFlowState {
  ports: Port[];
  vessels: Vessel[];
  routes: Route[];
  contracts: Contract[];
  alerts: Alert[];
  forecast: ForecastPoint[];
}

export interface PortFlowContextType {
  state: PortFlowState;
  selectedVoyageId: string | null;
  setSelectedVoyageId: (id: string | null) => void;
  updateContractStatus: (contractId: string, newStatus: Contract["status"], realized: number | null) => void;
  autoCharterAll: () => void;
  runFleetOptimization: () => { updatedCount: number; totalAdded: number };
  applyAiOptimization: (optimizedContracts: Partial<Contract>[]) => void;
  isRedSeaClosed?: boolean;
  toggleRedSeaReroute?: () => void;
  isCycloneActive?: boolean;
  toggleCyclone?: () => void;
  isDeveloperMode: boolean;
  toggleDeveloperMode: () => void;
  syncErpOrders: () => Promise<void>;
  isErpSyncing: boolean;
  hasSyncedErp: boolean;
  erpSyncPhase: string;
}

// --- SEED DATA ---
const SEED_PORTS: Port[] = [
  // Origins
  { id: "P-NEWCASTLE", name: "Newcastle, Australia", type: "Origin", lat: -32.92, lng: 151.78, draftLimit: 15.2, handlingRate: 25000, legalStatus: "Compliant" },
  { id: "P-NORFOLK", name: "Norfolk, US", type: "Origin", lat: 36.85, lng: -76.28, draftLimit: 15.0, handlingRate: 22000, legalStatus: "Compliant" },
  { id: "P-MAPUTO", name: "Maputo, Mozambique", type: "Origin", lat: -25.96, lng: 32.57, draftLimit: 14.3, handlingRate: 18000, legalStatus: "Compliant" },
  { id: "P-VLADIVOSTOK", name: "Vladivostok, Russia", type: "Origin", lat: 43.11, lng: 131.87, draftLimit: 13.0, handlingRate: 15000, legalStatus: "Review Required", legalIssues: ["Sanctions compliance check required"] },
  { id: "P-KALIMANTAN", name: "Kalimantan, Indonesia", type: "Origin", lat: -3.00, lng: 114.00, draftLimit: 12.5, handlingRate: 12000, legalStatus: "Compliant" },
  // Destinations (India East Coast)
  { id: "P-PARADIP", name: "Paradip, India", type: "Destination", lat: 20.317, lng: 86.611, draftLimit: 14.5, handlingRate: 14000, legalStatus: "Compliant" },
  { id: "P-VIZAG", name: "Vizag, India", type: "Destination", lat: 17.686, lng: 83.218, draftLimit: 15.0, handlingRate: 16000, legalStatus: "Compliant" },
  { id: "P-GANGAVARAM", name: "Gangavaram, India", type: "Destination", lat: 17.616, lng: 83.238, draftLimit: 19.5, handlingRate: 20000, legalStatus: "Review Required", legalIssues: ["Port clearance documentation pending"] },
  { id: "P-GOPALPUR", name: "Gopalpur, India", type: "Destination", lat: 19.281, lng: 84.906, draftLimit: 12.5, handlingRate: 8000, legalStatus: "Compliant" },
  { id: "P-DHAMRA", name: "Dhamra, India", type: "Destination", lat: 20.787, lng: 86.977, draftLimit: 18.0, handlingRate: 18000, legalStatus: "Compliant" },
  { id: "P-SAGAR", name: "Sagar-Sandheads, India", type: "Destination", lat: 21.646, lng: 88.084, draftLimit: 10.0, handlingRate: 5000, legalStatus: "Compliant" },
  { id: "P-HALDIA", name: "Haldia, India", type: "Destination", lat: 22.033, lng: 88.093, draftLimit: 8.5, handlingRate: 12000, legalStatus: "Compliant" },
];

const SEED_VESSELS: Vessel[] = [
  { id: "V-PACIFIC", name: "MV Pacific Horizon", class: "Capesize", status: "In Transit", currentDraft: 17.2, capacity: 180000, legalScore: 98, imo: "9413286", flag: "Panama", owner: "Horizon Maritime", classSociety: "DNV", pni: "UK P&I" },
  { id: "V-GLOBAL", name: "Global Spirit", class: "Capesize", status: "Loading", currentDraft: 14.1, capacity: 160000, legalScore: 95, imo: "9601443", flag: "Liberia", owner: "Global Bulk Carriers", classSociety: "Lloyd's Register", pni: "Gard" },
  { id: "V-MAERSK", name: "Maersk Sentinel", class: "Panamax", status: "Idle", currentDraft: 12.0, capacity: 75000, legalScore: 82, imo: "9352763", flag: "Singapore", owner: "Maersk Tankers", classSociety: "ABS", pni: "Skuld", legalIssues: ["Missing Indian port clearance for next voyage"] },
  { id: "V-OCEANIC", name: "MV Shadow Trader", class: "Supramax", status: "In Transit", currentDraft: 11.2, capacity: 55000, legalScore: 12, imo: "9345112", flag: "Comoros", owner: "Unknown Shell Corp", classSociety: "Unknown", pni: "Unknown", legalIssues: ["AIS Signal Lost for 72h", "GPS Spoofing Detected", "Possible Sanctions Violation"], isSpoofed: true },
  { id: "V-STELLAR", name: "Stellar Dawn", class: "Handysize", status: "Discharging", currentDraft: 9.5, capacity: 35000, legalScore: 99, imo: "9832115", flag: "Bahamas", owner: "Stellar Navigation", classSociety: "Bureau Veritas", pni: "Britannia" },
  { id: "V-APOLLO", name: "Apollo Bulk", class: "Panamax", status: "Anchored", currentDraft: 13.5, capacity: 80000, legalScore: 88, imo: "9510001", flag: "Malta", owner: "Apollo Shipping", classSociety: "RINA", pni: "Steamship Mutual", legalIssues: ["Environmental compliance certificate expiring in 14 days"] },
];

const SEED_ROUTES: Route[] = [
  { id: "R-901", vesselId: "V-PACIFIC", originId: "P-NEWCASTLE", destinationId: "P-SAGAR", cargo: "Iron Ore", volume: 180000, eta: "in 6h" },
  { id: "R-899", vesselId: "V-GLOBAL", originId: "P-MAPUTO", destinationId: "P-GANGAVARAM", cargo: "Thermal Coal", volume: 160000, eta: "in 2 days" },
  { id: "R-902", vesselId: "V-MAERSK", originId: "P-MAPUTO", destinationId: "P-PARADIP", cargo: "Thermal Coal", volume: 75000, eta: "in 4 days" },
  { id: "R-903", vesselId: "V-OCEANIC", originId: "P-VLADIVOSTOK", destinationId: "P-VIZAG", cargo: "Coking Coal", volume: 55000, eta: "in 12h" },
  { id: "R-904", vesselId: "V-STELLAR", originId: "P-NORFOLK", destinationId: "P-DHAMRA", cargo: "Coking Coal", volume: 35000, eta: "in 18 days" },
  { id: "R-905", vesselId: "V-APOLLO", originId: "P-KALIMANTAN", destinationId: "P-HALDIA", cargo: "Fertilizer", volume: 80000, eta: "in 5 days" },
];

const SEED_CONTRACTS: Contract[] = [
  { id: "MV-CT-901", routeId: "R-901", type: "Spot \u2192 3-Voyage Contract", status: "AI Executed", predictedSavings: 1400000, realizedSavings: 1310000, commercialScore: 98, operationalScore: 95 },
  { id: "MV-CT-899", routeId: "R-899", type: "Spot \u2192 4-Voyage Contract", status: "AI Executed", predictedSavings: 950000, realizedSavings: 965000, commercialScore: 94, operationalScore: 92 },
  { id: "MV-CT-902", routeId: "R-902", type: "Spot \u2192 2-Voyage Contract", status: "Commercial Approval", predictedSavings: 420000, realizedSavings: null, commercialScore: 91, operationalScore: 88 },
  { id: "MV-CT-903", routeId: "R-903", type: "Spot \u2192 4-Voyage Contract", status: "Legal Review Req.", predictedSavings: 890000, realizedSavings: null, commercialScore: 89, operationalScore: 85 },
  { id: "MV-CT-904", routeId: "R-904", type: "Spot \u2192 2-Voyage Contract", status: "Mgt Approval Pending", predictedSavings: 310000, realizedSavings: null, commercialScore: 82, operationalScore: 80 },
];

const SEED_ALERTS: Alert[] = [
  { id: "alert-1", severity: "CRITICAL", title: "Draft & Berth Conflict", message: "MV Pacific Horizon (Capesize) arrives in 6h \u2014 Berth 3 draft is 0.4m short at current tide.", time: "Just now" },
  { id: "alert-2", severity: "WARNING", title: "Demurrage Risk Detected", message: "42,000 MT of Coking Coal has been in the Vizag stockyard for 9 days \u2014 demurrage clock running, contact charterer.", time: "10m ago" },
  { id: "alert-3", severity: "WARNING", title: "Discharge Rate Shortfall", message: "Discharge rate at Haldia is running at 8,200 MT/day vs. the 12,000 MT/day assumed \u2014 laytime at risk of being exceeded.", time: "45m ago" },
  { id: "alert-4", severity: "INFO", title: "Vessel Approaching", message: "MV Global Spirit is arriving in 2h \u2014 confirm grab/conveyor discharge equipment and berth are ready.", time: "1h ago" },
  { id: "alert-5", severity: "INFO", title: "Tidal Delay Risk", message: "Sagar-Sandheads anchorage: MV Shadow Trader needs high tide to cross the bar \u2014 next window in 14h.", time: "2h ago" }
];

// Mock freight forecast data (90 days)
const SEED_FORECAST: ForecastPoint[] = Array.from({ length: 90 }).map((_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - 60 + i); // 60 days historical, 30 days future
  
  // Base rate with some sine wave seasonality and noise
  const baseRate = 18.5 + Math.sin(i / 10) * 3 + Math.random() * 2;
  const volatility = Math.max(0, 40 + Math.sin(i / 5) * 20 + Math.random() * 30 + (i > 55 && i < 65 ? 40 : 0)); // Spike near "today" (day 60)

  return {
    date: `${date.getMonth() + 1}/${date.getDate()}`,
    rate: Number(baseRate.toFixed(2)),
    volatility: Number(volatility.toFixed(0))
  };
});

const INITIAL_STATE: PortFlowState = {
  ports: SEED_PORTS,
  vessels: SEED_VESSELS,
  routes: SEED_ROUTES,
  contracts: SEED_CONTRACTS,
  alerts: SEED_ALERTS,
  forecast: SEED_FORECAST,
};

const PortFlowContext = createContext<PortFlowContextType | undefined>(undefined);

export function PortFlowProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PortFlowState>(INITIAL_STATE);
  const [selectedVoyageId, setSelectedVoyageId] = useState<string | null>(null);
  const [isRedSeaClosed, setIsRedSeaClosed] = useState(false);
  const [isCycloneActive, setIsCycloneActive] = useState(false);
  const [isDeveloperMode, setIsDeveloperMode] = useState(false);
  const [isErpSyncing, setIsErpSyncing] = useState(false);
  const [hasSyncedErp, setHasSyncedErp] = useState(false);
  const [erpSyncPhase, setErpSyncPhase] = useState("Idle");
  const [hasHydrated, setHasHydrated] = useState(false);

  // Hydrate from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem("portFlowState");
    const savedRedSea = localStorage.getItem("isRedSeaClosed");
    const savedCyclone = localStorage.getItem("isCycloneActive");
    const savedDevMode = localStorage.getItem("isDeveloperMode");
    const savedErp = localStorage.getItem("hasSyncedErp");

    if (savedState) setState(JSON.parse(savedState));
    if (savedRedSea) setIsRedSeaClosed(savedRedSea === "true");
    if (savedCyclone) setIsCycloneActive(savedCyclone === "true");
    if (savedDevMode) setIsDeveloperMode(savedDevMode === "true");
    if (savedErp) setHasSyncedErp(savedErp === "true");
    if (savedErp === "true") setErpSyncPhase("Complete");
    
    setHasHydrated(true);
  }, []);

  // Persist state changes
  useEffect(() => {
    if (!hasHydrated) return; // Prevent overwriting with initial state on mount
    
    localStorage.setItem("portFlowState", JSON.stringify(state));
    localStorage.setItem("isRedSeaClosed", isRedSeaClosed.toString());
    localStorage.setItem("isCycloneActive", isCycloneActive.toString());
    localStorage.setItem("isDeveloperMode", isDeveloperMode.toString());
    localStorage.setItem("hasSyncedErp", hasSyncedErp.toString());
  }, [state, isRedSeaClosed, isCycloneActive, isDeveloperMode, hasSyncedErp, hasHydrated]);

  const toggleRedSeaReroute = () => {
    setIsRedSeaClosed(prev => !prev);
  };

  const toggleCyclone = () => {
    setIsCycloneActive(prev => !prev);
  };

  const toggleDeveloperMode = () => {
    setIsDeveloperMode(prev => !prev);
  };

  const syncErpOrders = async () => {
    if (hasSyncedErp || isErpSyncing) return;
    setIsErpSyncing(true);
    
    // Simulate ETL Pipeline
    setErpSyncPhase("Extracting SAP EDI Payload...");
    await new Promise(resolve => setTimeout(resolve, 1500));
    setErpSyncPhase("Normalizing Legacy Encodings...");
    await new Promise(resolve => setTimeout(resolve, 1500));
    setErpSyncPhase("Resolving 14 Port Name Discrepancies...");
    await new Promise(resolve => setTimeout(resolve, 1200));
    setErpSyncPhase("Generating LPU Vector Embeddings...");
    await new Promise(resolve => setTimeout(resolve, 1500));
    setErpSyncPhase("Data Quality Score 96.4% -> Injecting to Map");
    await new Promise(resolve => setTimeout(resolve, 800));

    const newVessels: Vessel[] = [];
    const newRoutes: Route[] = [];
    const newContracts: Contract[] = [];

    const origins = SEED_PORTS.filter(p => p.type === "Origin");
    const destinations = SEED_PORTS.filter(p => p.type === "Destination");
    const classes: VesselClass[] = ["Handysize", "Supramax", "Panamax", "Capesize"];
    const statuses: VesselStatus[] = ["In Transit", "Loading", "Discharging"];

    for (let i = 0; i < 45; i++) {
      const vId = `V-ERP-${1000 + i}`;
      const rId = `R-ERP-${1000 + i}`;
      const cId = `CT-ERP-${8000 + i}`;

      const o = origins[Math.floor(Math.random() * origins.length)];
      const d = destinations[Math.floor(Math.random() * destinations.length)];
      const vClass = classes[Math.floor(Math.random() * classes.length)];
      const stat = statuses[Math.floor(Math.random() * statuses.length)];

      newVessels.push({
        id: vId,
        name: `MV PortFlow ${i + 10}`,
        class: vClass,
        status: stat,
        currentDraft: 10 + Math.random() * 4,
        capacity: vClass === "Capesize" ? 180000 : vClass === "Panamax" ? 75000 : 55000,
        legalScore: 85 + Math.random() * 15,
        imo: `IMO${9000000 + i * 13}`,
        flag: ["Panama", "Liberia", "Marshall Islands", "Malta", "Singapore"][i % 5],
        owner: ["Oceanic Bulk Carriers", "Triton Maritime", "Atlas Shipping Co", "Neptune Lines"][i % 4],
        classSociety: ["DNV", "Lloyd's Register", "ABS", "Bureau Veritas"][i % 4],
        pni: ["Gard P&I", "UK P&I Club", "Skuld", "NorthStandard"][i % 4]
      });

      newRoutes.push({
        id: rId,
        vesselId: vId,
        originId: o.id,
        destinationId: d.id,
        cargo: "Iron Ore",
        volume: vClass === "Capesize" ? 175000 : 70000,
        eta: new Date(Date.now() + Math.random() * 10 * 86400000).toISOString()
      });

      newContracts.push({
        id: cId,
        routeId: rId,
        type: "Spot",
        status: "AI Executed",
        predictedSavings: 45000 + Math.random() * 20000,
        realizedSavings: null,
        commercialScore: 80 + Math.random() * 15,
        operationalScore: 85 + Math.random() * 10
      });
    }

    setState(prev => ({
      ...prev,
      vessels: [...prev.vessels, ...newVessels],
      routes: [...prev.routes, ...newRoutes],
      contracts: [...prev.contracts, ...newContracts]
    }));

    setIsErpSyncing(false);
    setHasSyncedErp(true);
    setErpSyncPhase("Complete");
  };


  const updateContractStatus = (contractId: string, newStatus: Contract["status"], realized: number | null) => {
    setState(prev => ({
      ...prev,
      contracts: prev.contracts.map(c => 
        c.id === contractId 
          ? { ...c, status: newStatus, realizedSavings: realized }
          : c
      )
    }));
  };

  const autoCharterAll = () => {
    setState(prev => ({
      ...prev,
      contracts: prev.contracts.map(c => 
        c.status !== "AI Executed" 
          ? { ...c, status: "AI Executed", realizedSavings: c.predictedSavings * (0.95 + Math.random() * 0.1) } // Randomize realized savings slightly
          : c
      )
    }));
  };

  const runFleetOptimization = () => {
    let updatedCount = 0;
    let totalAdded = 0;

    const newContracts = state.contracts.map(c => {
      if (c.status === "Commercial Approval" || c.status === "Legal Review Req." || c.status === "Mgt Approval Pending") {
        updatedCount++;
        const newRaw = c.predictedSavings * 1.15;
        totalAdded += (newRaw - c.predictedSavings);
        
        // Mock realized savings +/- 10%
        const variancePct = (Math.random() * 0.2) - 0.1;
        const realized = newRaw * (1 + variancePct);

        return { 
          ...c, 
          status: "AI Executed" as Contract["status"], 
          predictedSavings: newRaw,
          realizedSavings: realized,
        };
      }
      return c;
    });

    if (updatedCount > 0) {
      setState(prev => ({ ...prev, contracts: newContracts }));
    }

    return { updatedCount, totalAdded };
  };

  const applyAiOptimization = (optimizedContracts: Partial<Contract>[]) => {
    setState(prev => {
      const newContracts = prev.contracts.map(c => {
        const optimizedData = optimizedContracts.find(opt => opt.id === c.id);
        if (optimizedData) {
          return {
            ...c,
            status: "AI Executed" as Contract["status"],
            predictedSavings: optimizedData.predictedSavings || c.predictedSavings,
            realizedSavings: optimizedData.realizedSavings || c.predictedSavings * 1.05,
            commercialScore: 99,
            operationalScore: 99,
            carbonSaved: optimizedData.carbonSaved,
            fuelSaved: optimizedData.fuelSaved
          };
        }
        return c;
      });
      return { ...prev, contracts: newContracts };
    });
  };

  return (
    <PortFlowContext.Provider value={{ state, selectedVoyageId, setSelectedVoyageId, updateContractStatus, autoCharterAll, runFleetOptimization, applyAiOptimization, isRedSeaClosed, toggleRedSeaReroute, isCycloneActive, toggleCyclone, isDeveloperMode, toggleDeveloperMode, syncErpOrders, isErpSyncing, hasSyncedErp, erpSyncPhase }}>
      {children}
    </PortFlowContext.Provider>
  );
}

export function usePortFlowData() {
  const ctx = useContext(PortFlowContext);
  if (!ctx) throw new Error("usePortFlowData must be used within PortFlowProvider");
  return ctx;
}
