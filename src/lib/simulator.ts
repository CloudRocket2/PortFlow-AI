// =============================================================================
// TELEMETRY SIMULATOR — Mock IoT Data Generator
// =============================================================================
// Generates realistic port IoT events (crane movements, truck gates, sensors)
// =============================================================================

export type IoTEventType = 
  | 'TRUCK_ARRIVED_GATE' 
  | 'CRANE_LIFT_STARTED' 
  | 'CONTAINER_PLACED_YARD' 
  | 'REEFER_TEMP_WARNING'
  | 'AI_AUTO_OPTIMIZATION';

export interface TelemetryEvent {
  id: string;
  containerId: string;
  type: IoTEventType;
  timestamp: string;
  details: string;
  slot?: { bay: number; row: number; tier: number }; // Added for 3D animation
}

export function generateMockIoTEvent(containerIds: string[]): TelemetryEvent {
  const types: IoTEventType[] = [
    'TRUCK_ARRIVED_GATE', 
    'CRANE_LIFT_STARTED', 
    'CONTAINER_PLACED_YARD', 
    'REEFER_TEMP_WARNING'
  ];
  
  const type = types[Math.floor(Math.random() * types.length)];
  const containerId = containerIds.length > 0 
    ? containerIds[Math.floor(Math.random() * containerIds.length)] 
    : `MSCU-${Math.floor(Math.random() * 900000) + 100000}`;
    
  let details = "";
  let slot = undefined;
  
  switch (type) {
    case 'TRUCK_ARRIVED_GATE':
      details = `Gate T-${Math.floor(Math.random() * 10) + 1} cleared. Plate: XYZ-${Math.floor(Math.random() * 999)}`;
      break;
    case 'CRANE_LIFT_STARTED':
      details = `RTG-${Math.floor(Math.random() * 5) + 1} locked spreader. Spd: 0.8m/s`;
      break;
    case 'CONTAINER_PLACED_YARD':
      slot = {
        bay: Math.floor(Math.random() * 10) + 1,
        row: Math.floor(Math.random() * 6) + 1,
        tier: Math.floor(Math.random() * 4) + 1
      };
      details = `Bay:${slot.bay}, Row:${slot.row}, Tier:${slot.tier}`;
      break;
    case 'REEFER_TEMP_WARNING':
      details = `Temp spike: +3.2°C detected. Cooling unit engaged.`;
      break;
  }

  return {
    id: `evt_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    containerId,
    type,
    timestamp: new Date().toISOString(),
    details,
    slot
  };
}
