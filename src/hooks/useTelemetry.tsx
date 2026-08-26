"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { generateMockIoTEvent, TelemetryEvent } from "@/lib/simulator";

export interface Container3DData {
  id: string;
  type: string;
  priorityLevel: string;
  status: string;
  currentSlot: { bay: number; row: number; tier: number; id?: string } | null;
  dwellTimeDays: number;
  weightTons: number;
  cargoDesc: string;
}

interface TelemetryContextType {
  events: TelemetryEvent[];
  activeCranes: number;
  isConnected: boolean;
  containers: Container3DData[];
  moveContainer: (containerId: string, bay: number, row: number, tier: number) => void;
}

const TelemetryContext = createContext<TelemetryContextType>({
  events: [],
  activeCranes: 0,
  isConnected: false,
  containers: [],
  moveContainer: () => {},
});

export function TelemetryProvider({ children }: { children: React.ReactNode }) {
  const [events, setEvents] = useState<TelemetryEvent[]>([]);
  const [activeCranes, setActiveCranes] = useState(3);
  const [isConnected, setIsConnected] = useState(false);
  const [containers, setContainers] = useState<Container3DData[]>([]);

  // 1. Fetch initial container data for the 3D Yard and mock events
  useEffect(() => {
    fetch("/api/containers?limit=200") // Fetch up to 200 for the 3D yard
      .then((res) => res.json())
      .then((data) => {
        if (data.data) {
          const augmented = data.data.map((c: Container3DData) => ({
            ...c,
            dwellTimeDays: (c.id.charCodeAt(0) + c.id.charCodeAt(c.id.length - 1)) % 22,
            weightTons: 10 + ((c.id.charCodeAt(1) * 3) % 22),
            cargoDesc: c.type === 'Hazardous' ? 'Chemicals Class 3' : (c.type === 'Reefer' ? 'Frozen Produce' : 'Industrial Parts')
          }));
          setContainers(augmented);
        }
      })
      .catch(console.error);
  }, []);

  // 2. Initialize the Mock WebSocket / Event Loop
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsConnected(true);

    const interval = setInterval(() => {
      // Generate a new mock event using the available container IDs
      const containerIds = containers.map(c => c.id);
      const newEvent = generateMockIoTEvent(containerIds);
      
      // Update event feed
      setEvents((prev) => [newEvent, ...prev].slice(0, 50));

      // Dynamically fluctuate active cranes based on events
      if (newEvent.type === 'CRANE_LIFT_STARTED') {
        setActiveCranes((prev) => Math.min(prev + 1, 12));
      } else if (newEvent.type === 'CONTAINER_PLACED_YARD') {
        setActiveCranes((prev) => Math.max(prev - 1, 1));
        
        // Physically move the container in the 3D scene with "Gravity"
        if (newEvent.slot) {
          setContainers((prev) => {
            // Find what is currently in this Bay/Row
            const existingInStack = prev.filter(
              c => c.currentSlot?.bay === newEvent.slot!.bay && 
                   c.currentSlot?.row === newEvent.slot!.row &&
                   c.id !== newEvent.containerId // exclude self if moving
            );
            
            // Calculate the actual tier it should land on (highest + 1)
            const highestTier = existingInStack.reduce(
              (max, c) => Math.max(max, c.currentSlot!.tier), 
              0
            );
            
            const groundedSlot = { 
              ...newEvent.slot!, 
              tier: highestTier + 1 
            };

            return prev.map(c => 
              c.id === newEvent.containerId 
                ? { ...c, currentSlot: groundedSlot } 
                : c
            );
          });
        }
      }

    }, 3500); 

    return () => {
      clearInterval(interval);
      setIsConnected(false);
    };
  }, [containers]);

  // 3. Autonomous AI Optimizer Loop
  useEffect(() => {
    const aiInterval = setInterval(() => {
      setContainers((prev) => {
        let hasViolation = false;
        let violatedStack: Container3DData[] = [];
        let bay = 0, row = 0;

        // Group by bay/row
        const stacks: Record<string, Container3DData[]> = {};
        for (const c of prev) {
          if (c.currentSlot) {
            const key = `${c.currentSlot.bay}-${c.currentSlot.row}`;
            if (!stacks[key]) stacks[key] = [];
            stacks[key].push(c);
          }
        }

        // Find a stack that violates the sorting rule
        for (const key in stacks) {
          const stack = stacks[key];
          if (stack.length > 1) {
            // Sort them by tier to check from bottom to top
            stack.sort((a, b) => a.currentSlot!.tier - b.currentSlot!.tier);
            
            // Check if a container is above another but has HIGHER weight or HIGHER dwell
            for (let i = 1; i < stack.length; i++) {
              const lower = stack[i-1];
              const upper = stack[i];
              // Score = Weight (higher is heavier) + Dwell (higher is longer)
              const lowerScore = lower.weightTons + lower.dwellTimeDays;
              const upperScore = upper.weightTons + upper.dwellTimeDays;

              // Give a small threshold so it doesn't swap identical containers continuously
              if (upperScore > lowerScore + 5) {
                hasViolation = true;
                violatedStack = stack;
                bay = upper.currentSlot!.bay;
                row = upper.currentSlot!.row;
                break;
              }
            }
          }
          if (hasViolation) break;
        }

        if (hasViolation) {
          // Re-sort the violated stack by Score Descending (Highest score goes to bottom/tier 1)
          const sortedStack = [...violatedStack].sort((a, b) => {
             const scoreA = a.weightTons + a.dwellTimeDays;
             const scoreB = b.weightTons + b.dwellTimeDays;
             return scoreB - scoreA;
          });

          // Re-assign tiers
          const updatedStack = sortedStack.map((c, idx) => ({
            ...c,
            currentSlot: { ...c.currentSlot!, tier: idx + 1 }
          }));

          // Notify UI with an AI event
          setEvents(ePrev => [{
            id: `ai-opt-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
            timestamp: new Date().toISOString(),
            type: 'AI_AUTO_OPTIMIZATION' as const,
            containerId: updatedStack[0].id,
            details: `AI sorted Bay ${bay} Row ${row}: Heavy/High-Dwell placed at bottom tier.`,
          }, ...ePrev].slice(0, 50));

          // Merge back into state
          return prev.map(c => {
             const updated = updatedStack.find(u => u.id === c.id);
             return updated ? updated : c;
          });
        }

        return prev;
      });
    }, 4500); // Run AI check every 4.5 seconds

    return () => clearInterval(aiInterval);
  }, []);

  const moveContainer = (containerId: string, bay: number, row: number, tier: number) => {
    setContainers((prev) =>
      prev.map((c) =>
        c.id === containerId
          ? { ...c, currentSlot: { bay, row, tier, id: c.currentSlot?.id || "temp" } }
          : c
      )
    );
  };

  return (
    <TelemetryContext.Provider value={{ events, activeCranes, isConnected, containers, moveContainer }}>
      {children}
    </TelemetryContext.Provider>
  );
}

export function useTelemetry() {
  return useContext(TelemetryContext);
}
