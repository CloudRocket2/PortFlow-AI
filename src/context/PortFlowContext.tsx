"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

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
}

export interface Vessel {
  id: string;
  name: string;
  class: VesselClass;
  status: VesselStatus;
  currentDraft: number;
  capacity: number; // MT
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
  status: "Draft Approved" | "Pending Signature" | "Lightering Req." | "AI Executed";
  predictedSavings: number;
  realizedSavings: number | null;
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
  updateContractStatus: (contractId: string, newStatus: Contract["status"], realized: number | null) => void;
  runFleetOptimization: () => { updatedCount: number; totalAdded: number };
}

// --- SEED DATA ---
const SEED_PORTS: Port[] = [
  // Origins
  { id: "P-NEWCASTLE", name: "Newcastle, Australia", type: "Origin", lat: -32.92, lng: 151.78, draftLimit: 15.2, handlingRate: 25000 },
  { id: "P-NORFOLK", name: "Norfolk, US", type: "Origin", lat: 36.85, lng: -76.28, draftLimit: 15.0, handlingRate: 22000 },
  { id: "P-MAPUTO", name: "Maputo, Mozambique", type: "Origin", lat: -25.96, lng: 32.57, draftLimit: 14.3, handlingRate: 18000 },
  { id: "P-VLADIVOSTOK", name: "Vladivostok, Russia", type: "Origin", lat: 43.11, lng: 131.87, draftLimit: 13.0, handlingRate: 15000 },
  { id: "P-KALIMANTAN", name: "Kalimantan, Indonesia", type: "Origin", lat: -3.00, lng: 114.00, draftLimit: 12.5, handlingRate: 12000 },
  // Destinations (India East Coast)
  { id: "P-PARADIP", name: "Paradip, India", type: "Destination", lat: 20.317, lng: 86.611, draftLimit: 14.5, handlingRate: 14000 },
  { id: "P-VIZAG", name: "Vizag, India", type: "Destination", lat: 17.686, lng: 83.218, draftLimit: 15.0, handlingRate: 16000 },
  { id: "P-GANGAVARAM", name: "Gangavaram, India", type: "Destination", lat: 17.616, lng: 83.238, draftLimit: 19.5, handlingRate: 20000 },
  { id: "P-GOPALPUR", name: "Gopalpur, India", type: "Destination", lat: 19.281, lng: 84.906, draftLimit: 12.5, handlingRate: 8000 },
  { id: "P-DHAMRA", name: "Dhamra, India", type: "Destination", lat: 20.787, lng: 86.977, draftLimit: 18.0, handlingRate: 18000 },
  { id: "P-SAGAR", name: "Sagar-Sandheads, India", type: "Destination", lat: 21.646, lng: 88.084, draftLimit: 10.0, handlingRate: 5000 }, // Anchorage
  { id: "P-HALDIA", name: "Haldia, India", type: "Destination", lat: 22.033, lng: 88.093, draftLimit: 8.5, handlingRate: 12000 },
];

const SEED_VESSELS: Vessel[] = [
  { id: "V-PACIFIC", name: "MV Pacific Horizon", class: "Capesize", status: "In Transit", currentDraft: 17.2, capacity: 180000 },
  { id: "V-GLOBAL", name: "Global Spirit", class: "Capesize", status: "Loading", currentDraft: 14.1, capacity: 160000 },
  { id: "V-MAERSK", name: "Maersk Sentinel", class: "Panamax", status: "Idle", currentDraft: 12.0, capacity: 75000 },
  { id: "V-OCEANIC", name: "Oceanic Pioneer", class: "Supramax", status: "In Transit", currentDraft: 11.2, capacity: 55000 },
  { id: "V-STELLAR", name: "Stellar Dawn", class: "Handysize", status: "Discharging", currentDraft: 9.5, capacity: 35000 },
  { id: "V-APOLLO", name: "Apollo Bulk", class: "Panamax", status: "Anchored", currentDraft: 13.5, capacity: 80000 },
];

const SEED_ROUTES: Route[] = [
  { id: "R-901", vesselId: "V-PACIFIC", originId: "P-NEWCASTLE", destinationId: "P-SAGAR", cargo: "Iron Ore", volume: 180000, eta: "in 6h" },
  { id: "R-899", vesselId: "V-GLOBAL", originId: "P-MAPUTO", destinationId: "P-GANGAVARAM", cargo: "Thermal Coal", volume: 160000, eta: "in 2 days" },
  { id: "R-902", vesselId: "V-MAERSK", originId: "P-MAPUTO", destinationId: "P-PARADIP", cargo: "Thermal Coal", volume: 75000, eta: "in 4 days" },
  { id: "R-903", vesselId: "V-OCEANIC", originId: "P-VLADIVOSTOK", destinationId: "P-VIZAG", cargo: "Coking Coal", volume: 55000, eta: "in 12h" },
  { id: "R-904", vesselId: "V-GLOBAL", originId: "P-MAPUTO", destinationId: "P-GANGAVARAM", cargo: "Iron Ore", volume: 160000, eta: "in 2h" }, // Duplicated vessel logic from before, maybe second leg? Let's use APOLLO
  { id: "R-905", vesselId: "V-APOLLO", originId: "P-KALIMANTAN", destinationId: "P-HALDIA", cargo: "Fertilizer", volume: 80000, eta: "in 5 days" },
];

const SEED_CONTRACTS: Contract[] = [
  { id: "MV-CT-901", routeId: "R-901", type: "Spot \u2192 3-Voyage Contract", status: "AI Executed", predictedSavings: 1400000, realizedSavings: 1310000 },
  { id: "MV-CT-899", routeId: "R-899", type: "Spot \u2192 4-Voyage Contract", status: "AI Executed", predictedSavings: 950000, realizedSavings: 965000 },
  { id: "MV-CT-902", routeId: "R-902", type: "Spot \u2192 2-Voyage Contract", status: "Draft Approved", predictedSavings: 420000, realizedSavings: null },
  { id: "MV-CT-903", routeId: "R-903", type: "Spot \u2192 4-Voyage Contract", status: "Pending Signature", predictedSavings: 890000, realizedSavings: null },
  { id: "MV-CT-904", routeId: "R-904", type: "Spot \u2192 2-Voyage Contract", status: "Lightering Req.", predictedSavings: 310000, realizedSavings: null },
];

const SEED_ALERTS: Alert[] = [
  { id: "alert-1", severity: "CRITICAL", title: "Draft & Berth Conflict", message: "MV Pacific Horizon (Capesize) arrives in 6h \u2014 Berth 3 draft is 0.4m short at current tide.", time: "Just now" },
  { id: "alert-2", severity: "WARNING", title: "Demurrage Risk Detected", message: "42,000 MT of Coking Coal has been in the Vizag stockyard for 9 days \u2014 demurrage clock running, contact charterer.", time: "10m ago" },
  { id: "alert-3", severity: "WARNING", title: "Discharge Rate Shortfall", message: "Discharge rate at Haldia is running at 8,200 MT/day vs. the 12,000 MT/day assumed \u2014 laytime at risk of being exceeded.", time: "45m ago" },
  { id: "alert-4", severity: "INFO", title: "Vessel Approaching", message: "MV Global Spirit is arriving in 2h \u2014 confirm grab/conveyor discharge equipment and berth are ready.", time: "1h ago" },
  { id: "alert-5", severity: "INFO", title: "Tidal Delay Risk", message: "Sagar-Sandheads anchorage: MV Oceanic Pioneer needs high tide to cross the bar \u2014 next window in 14h.", time: "2h ago" }
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

  const runFleetOptimization = () => {
    let updatedCount = 0;
    let totalAdded = 0;

    const newContracts = state.contracts.map(c => {
      if (c.status === "Draft Approved" || c.status === "Pending Signature") {
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

  return (
    <PortFlowContext.Provider value={{ state, updateContractStatus, runFleetOptimization }}>
      {children}
    </PortFlowContext.Provider>
  );
}

export function usePortFlowData() {
  const ctx = useContext(PortFlowContext);
  if (!ctx) throw new Error("usePortFlowData must be used within PortFlowProvider");
  return ctx;
}
