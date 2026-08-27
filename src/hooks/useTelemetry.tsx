"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export interface TelemetryEvent {
  id: string;
  timestamp: string | number;
  type: string;
  vesselId: string;
  details: string;
}

interface TelemetryContextType {
  events: TelemetryEvent[];
  activeCranes: number;
  isConnected: boolean;
}

const TelemetryContext = createContext<TelemetryContextType>({
  events: [],
  activeCranes: 0,
  isConnected: false,
});

const BULK_VESSELS = [
  "MV PACIFIC HORIZON",
  "MAERSK SENTINEL",
  "OCEANIC PIONEER",
  "GLOBAL TRADER",
  "APEX VOYAGER"
];

const EVENT_TYPES = [
  "AIS_POSITION_UPDATE",
  "DRAFT_MEASUREMENT",
  "BERTH_APPROACH",
  "CARGO_DISCHARGE"
];

export function TelemetryProvider({ children }: { children: React.ReactNode }) {
  const [events, setEvents] = useState<TelemetryEvent[]>([]);
  const [activeCranes, setActiveCranes] = useState(3);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    setIsConnected(true);

    const interval = setInterval(() => {
      const vessel = BULK_VESSELS[Math.floor(Math.random() * BULK_VESSELS.length)];
      const eType = EVENT_TYPES[Math.floor(Math.random() * EVENT_TYPES.length)];
      
      let details = "";
      if (eType === "AIS_POSITION_UPDATE") details = "Speed: 12.4 knots, Heading: 210";
      if (eType === "DRAFT_MEASUREMENT") details = "Current Draft: 14.2m (Stable)";
      if (eType === "BERTH_APPROACH") details = "Pilot on board, tugs attached";
      if (eType === "CARGO_DISCHARGE") details = "Reclaimer active. Discharged 1,400 MT";

      const newEvent: TelemetryEvent = {
        id: `evt-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        timestamp: new Date().toISOString(),
        type: eType,
        vesselId: vessel,
        details: details
      };
      
      setEvents((prev) => [newEvent, ...prev].slice(0, 50));

      if (eType === 'CARGO_DISCHARGE') {
        setActiveCranes((prev) => Math.min(prev + 1, 8)); // Representing bulk unloaders
      } else if (eType === 'BERTH_APPROACH') {
        setActiveCranes((prev) => Math.max(prev - 1, 1));
      }

    }, 3500); 

    return () => {
      clearInterval(interval);
      setIsConnected(false);
    };
  }, []);

  return (
    <TelemetryContext.Provider value={{ events, activeCranes, isConnected }}>
      {children}
    </TelemetryContext.Provider>
  );
}

export function useTelemetry() {
  return useContext(TelemetryContext);
}
