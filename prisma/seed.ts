// =============================================================================
// SEED SCRIPT — Realistic Port Operations Data
// =============================================================================
// Populates: 2 docked vessels, 40+ containers across yard slots, and full
// event histories (5+ containers with complete audit trails).
// Run: npx prisma db seed
// =============================================================================

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("⚓ Seeding PortFlow AI database...\n");

  // 🧹 Clear existing data --------------------------------------------------
  await prisma.containerEvent.deleteMany();
  await prisma.container.deleteMany();
  await prisma.yardSlot.deleteMany();
  await prisma.vessel.deleteMany();
  await prisma.user.deleteMany();

  // ─── 1. Create Vessels ──────────────────────────────────────────────────
  console.log("  Creating vessels...");
  const vessel1 = await prisma.vessel.create({
    data: {
      name: "MV Pacific Horizon",
      callSign: "9VKL3",
      eta: new Date("2026-08-25T14:30:00Z"),
      berthNumber: 3,
      berthStatus: "DOCKED",
    },
  });

  const vessel2 = await prisma.vessel.create({
    data: {
      name: "Maersk Sentinel",
      callSign: "OXJQ2",
      eta: new Date("2026-08-25T12:00:00Z"),
      berthNumber: 4,
      berthStatus: "DOCKED",
    },
  });

  const vessel3 = await prisma.vessel.create({
    data: {
      name: "MSC Aurora",
      callSign: "3FKP8",
      eta: new Date("2026-08-25T18:00:00Z"),
      berthNumber: 1,
      berthStatus: "APPROACHING",
    },
  });

  const vessel4 = await prisma.vessel.create({
    data: {
      name: "CMA CGM Liberty",
      callSign: "FHSD5",
      eta: new Date("2026-08-26T06:00:00Z"),
      berthNumber: 5,
      berthStatus: "APPROACHING",
    },
  });

  console.log(`  ✓ ${4} vessels created\n`);

  // ─── 2. Create Yard Slots ──────────────────────────────────────────────
  // Grid: 10 bays × 6 rows × 4 tiers = 240 total slots
  console.log("  Creating yard slots (10×6×4 grid = 240 slots)...");
  const slotData: { bay: number; row: number; tier: number }[] = [];
  for (let bay = 1; bay <= 10; bay++) {
    for (let row = 1; row <= 6; row++) {
      for (let tier = 1; tier <= 4; tier++) {
        slotData.push({ bay, row, tier });
      }
    }
  }

  await prisma.yardSlot.createMany({ data: slotData });

  const allSlots = await prisma.yardSlot.findMany({
    orderBy: [{ bay: "asc" }, { row: "asc" }, { tier: "asc" }],
  });

  console.log(`  ✓ ${allSlots.length} yard slots created\n`);

  // ─── 3. Create Containers ──────────────────────────────────────────────
  console.log("  Creating containers...");

  // Container definitions with realistic shipping line prefixes
  const containerDefs: {
    id: string;
    type: string;
    weightKg: number;
    dwellTimeHours: number;
    priorityLevel: string;
    status: string;
    carbonSavedKg: number;
    vesselId: string;
    slotIndex: number | null; // index into allSlots, null = no slot (inbound/dispatched)
  }[] = [
    // ── Vessel 1 containers (Pacific Horizon) ──
    { id: "MSCU-928374", type: "DRY", weightKg: 24500, dwellTimeHours: 96, priorityLevel: "HIGH", status: "YARD_STACKED", carbonSavedKg: 12.5, vesselId: vessel1.id, slotIndex: 0 },
    { id: "MSCU-183746", type: "REEFER", weightKg: 18200, dwellTimeHours: 72, priorityLevel: "HIGH", status: "YARD_STACKED", carbonSavedKg: 8.3, vesselId: vessel1.id, slotIndex: 1 },
    { id: "MSCU-294857", type: "DRY", weightKg: 22100, dwellTimeHours: 54, priorityLevel: "MEDIUM", status: "YARD_STACKED", carbonSavedKg: 15.2, vesselId: vessel1.id, slotIndex: 2 },
    { id: "MSCU-374651", type: "HAZMAT", weightKg: 19800, dwellTimeHours: 12, priorityLevel: "HIGH", status: "YARD_STACKED", carbonSavedKg: 3.1, vesselId: vessel1.id, slotIndex: 3 },
    { id: "MSCU-485762", type: "DRY", weightKg: 15400, dwellTimeHours: 4, priorityLevel: "LOW", status: "DISPATCHED", carbonSavedKg: 22.0, vesselId: vessel1.id, slotIndex: null },
    { id: "MSCU-596873", type: "REEFER", weightKg: 21000, dwellTimeHours: 0, priorityLevel: "MEDIUM", status: "INBOUND", carbonSavedKg: 0, vesselId: vessel1.id, slotIndex: null },
    { id: "MSCU-607984", type: "DRY", weightKg: 26300, dwellTimeHours: 108, priorityLevel: "HIGH", status: "YARD_STACKED", carbonSavedKg: 5.7, vesselId: vessel1.id, slotIndex: 4 },
    { id: "MSCU-718095", type: "DRY", weightKg: 17600, dwellTimeHours: 36, priorityLevel: "MEDIUM", status: "YARD_STACKED", carbonSavedKg: 9.8, vesselId: vessel1.id, slotIndex: 5 },
    { id: "MSCU-829106", type: "REEFER", weightKg: 20500, dwellTimeHours: 8, priorityLevel: "LOW", status: "READY_FOR_PICKUP", carbonSavedKg: 18.4, vesselId: vessel1.id, slotIndex: 6 },
    { id: "MSCU-930217", type: "DRY", weightKg: 23700, dwellTimeHours: 64, priorityLevel: "HIGH", status: "YARD_STACKED", carbonSavedKg: 7.1, vesselId: vessel1.id, slotIndex: 7 },

    // ── Vessel 2 containers (Maersk Sentinel) ──
    { id: "MSKU-110328", type: "DRY", weightKg: 14200, dwellTimeHours: 2, priorityLevel: "LOW", status: "DISPATCHED", carbonSavedKg: 25.6, vesselId: vessel2.id, slotIndex: null },
    { id: "MSKU-221439", type: "DRY", weightKg: 19000, dwellTimeHours: 0, priorityLevel: "MEDIUM", status: "INBOUND", carbonSavedKg: 0, vesselId: vessel2.id, slotIndex: null },
    { id: "MSKU-332540", type: "REEFER", weightKg: 16800, dwellTimeHours: 48, priorityLevel: "MEDIUM", status: "YARD_STACKED", carbonSavedKg: 11.3, vesselId: vessel2.id, slotIndex: 10 },
    { id: "MSKU-443651", type: "DRY", weightKg: 27100, dwellTimeHours: 120, priorityLevel: "HIGH", status: "YARD_STACKED", carbonSavedKg: 2.4, vesselId: vessel2.id, slotIndex: 11 },
    { id: "MSKU-554762", type: "DRY", weightKg: 18900, dwellTimeHours: 6, priorityLevel: "LOW", status: "READY_FOR_PICKUP", carbonSavedKg: 19.7, vesselId: vessel2.id, slotIndex: 12 },
    { id: "MSKU-665873", type: "HAZMAT", weightKg: 21500, dwellTimeHours: 28, priorityLevel: "MEDIUM", status: "YARD_STACKED", carbonSavedKg: 6.9, vesselId: vessel2.id, slotIndex: 13 },
    { id: "MSKU-776984", type: "DRY", weightKg: 16100, dwellTimeHours: 80, priorityLevel: "HIGH", status: "YARD_STACKED", carbonSavedKg: 4.2, vesselId: vessel2.id, slotIndex: 14 },
    { id: "MSKU-888095", type: "REEFER", weightKg: 22800, dwellTimeHours: 42, priorityLevel: "MEDIUM", status: "YARD_STACKED", carbonSavedKg: 13.6, vesselId: vessel2.id, slotIndex: 15 },
    { id: "MSKU-999106", type: "DRY", weightKg: 20100, dwellTimeHours: 15, priorityLevel: "LOW", status: "YARD_STACKED", carbonSavedKg: 16.8, vesselId: vessel2.id, slotIndex: 16 },
    { id: "MSKU-100217", type: "DRY", weightKg: 25400, dwellTimeHours: 88, priorityLevel: "HIGH", status: "YARD_STACKED", carbonSavedKg: 3.5, vesselId: vessel2.id, slotIndex: 17 },

    // ── Vessel 3 containers (MSC Aurora — approaching, some pre-assigned) ──
    { id: "MSCU-211328", type: "DRY", weightKg: 18700, dwellTimeHours: 0, priorityLevel: "MEDIUM", status: "INBOUND", carbonSavedKg: 0, vesselId: vessel3.id, slotIndex: null },
    { id: "MSCU-322439", type: "REEFER", weightKg: 15300, dwellTimeHours: 0, priorityLevel: "HIGH", status: "INBOUND", carbonSavedKg: 0, vesselId: vessel3.id, slotIndex: null },
    { id: "MSCU-433540", type: "HAZMAT", weightKg: 20900, dwellTimeHours: 0, priorityLevel: "HIGH", status: "INBOUND", carbonSavedKg: 0, vesselId: vessel3.id, slotIndex: null },
    { id: "MSCU-544651", type: "DRY", weightKg: 17200, dwellTimeHours: 0, priorityLevel: "LOW", status: "INBOUND", carbonSavedKg: 0, vesselId: vessel3.id, slotIndex: null },
    { id: "MSCU-655762", type: "DRY", weightKg: 23100, dwellTimeHours: 0, priorityLevel: "MEDIUM", status: "INBOUND", carbonSavedKg: 0, vesselId: vessel3.id, slotIndex: null },

    // ── Vessel 4 containers (CMA CGM Liberty — also approaching) ──
    { id: "CMAU-766873", type: "REEFER", weightKg: 19400, dwellTimeHours: 0, priorityLevel: "MEDIUM", status: "INBOUND", carbonSavedKg: 0, vesselId: vessel4.id, slotIndex: null },
    { id: "CMAU-877984", type: "DRY", weightKg: 24800, dwellTimeHours: 0, priorityLevel: "LOW", status: "INBOUND", carbonSavedKg: 0, vesselId: vessel4.id, slotIndex: null },
    { id: "CMAU-989095", type: "DRY", weightKg: 16500, dwellTimeHours: 0, priorityLevel: "HIGH", status: "INBOUND", carbonSavedKg: 0, vesselId: vessel4.id, slotIndex: null },

    // ── Additional yard containers (from previous vessels, still in yard) ──
    { id: "TCLU-100001", type: "DRY", weightKg: 21800, dwellTimeHours: 33, priorityLevel: "MEDIUM", status: "YARD_STACKED", carbonSavedKg: 10.1, vesselId: vessel1.id, slotIndex: 20 },
    { id: "TCLU-100002", type: "REEFER", weightKg: 19600, dwellTimeHours: 55, priorityLevel: "HIGH", status: "YARD_STACKED", carbonSavedKg: 6.4, vesselId: vessel1.id, slotIndex: 21 },
    { id: "TCLU-100003", type: "DRY", weightKg: 16900, dwellTimeHours: 22, priorityLevel: "LOW", status: "READY_FOR_PICKUP", carbonSavedKg: 14.3, vesselId: vessel2.id, slotIndex: 22 },
    { id: "TCLU-100004", type: "HAZMAT", weightKg: 23400, dwellTimeHours: 70, priorityLevel: "HIGH", status: "YARD_STACKED", carbonSavedKg: 4.8, vesselId: vessel2.id, slotIndex: 23 },
    { id: "TCLU-100005", type: "DRY", weightKg: 17800, dwellTimeHours: 44, priorityLevel: "MEDIUM", status: "YARD_STACKED", carbonSavedKg: 11.9, vesselId: vessel1.id, slotIndex: 24 },
    { id: "TCLU-100006", type: "DRY", weightKg: 25100, dwellTimeHours: 95, priorityLevel: "HIGH", status: "YARD_STACKED", carbonSavedKg: 3.2, vesselId: vessel2.id, slotIndex: 25 },
    { id: "TCLU-100007", type: "REEFER", weightKg: 18300, dwellTimeHours: 16, priorityLevel: "LOW", status: "READY_FOR_PICKUP", carbonSavedKg: 17.5, vesselId: vessel1.id, slotIndex: 26 },
    { id: "TCLU-100008", type: "DRY", weightKg: 22200, dwellTimeHours: 61, priorityLevel: "MEDIUM", status: "YARD_STACKED", carbonSavedKg: 8.7, vesselId: vessel2.id, slotIndex: 27 },
    { id: "TCLU-100009", type: "DRY", weightKg: 15700, dwellTimeHours: 3, priorityLevel: "LOW", status: "DISPATCHED", carbonSavedKg: 21.3, vesselId: vessel1.id, slotIndex: null },
    { id: "TCLU-100010", type: "DRY", weightKg: 20400, dwellTimeHours: 38, priorityLevel: "MEDIUM", status: "YARD_STACKED", carbonSavedKg: 12.6, vesselId: vessel2.id, slotIndex: 30 },
    { id: "TCLU-100011", type: "REEFER", weightKg: 19100, dwellTimeHours: 77, priorityLevel: "HIGH", status: "YARD_STACKED", carbonSavedKg: 5.1, vesselId: vessel1.id, slotIndex: 31 },
    { id: "TCLU-100012", type: "DRY", weightKg: 24000, dwellTimeHours: 50, priorityLevel: "MEDIUM", status: "YARD_STACKED", carbonSavedKg: 9.4, vesselId: vessel2.id, slotIndex: 32 },
  ];

  for (const def of containerDefs) {
    const slot = def.slotIndex !== null ? allSlots[def.slotIndex] : null;

    await prisma.container.create({
      data: {
        id: def.id,
        type: def.type,
        weightKg: def.weightKg,
        dwellTimeHours: def.dwellTimeHours,
        priorityLevel: def.priorityLevel,
        status: def.status,
        carbonSavedKg: def.carbonSavedKg,
        vesselId: def.vesselId,
        currentSlotId: slot?.id ?? null,
      },
    });

    // Mark slot as occupied
    if (slot) {
      await prisma.yardSlot.update({
        where: { id: slot.id },
        data: { isOccupied: true },
      });
    }
  }

  console.log(`  ✓ ${containerDefs.length} containers created\n`);

  // ─── 4. Create Container Events (Audit Trail) ──────────────────────────
  console.log("  Creating event histories...");

  // Full audit trails for 8 containers
  const eventHistories: {
    containerId: string;
    events: {
      eventType: string;
      sourceLocation: string | null;
      targetLocation: string | null;
      craneOperatorId: string | null;
      hoursAgo: number;
      metadata: string | null;
    }[];
  }[] = [
    {
      containerId: "MSCU-928374",
      events: [
        { eventType: "DISCHARGED", sourceLocation: "Vessel:MV Pacific Horizon:Hold-3", targetLocation: "Quay:Berth-3", craneOperatorId: "OP-4421", hoursAgo: 100, metadata: JSON.stringify({ sealIntact: true, temperature: null }) },
        { eventType: "INSPECTED", sourceLocation: "Quay:Berth-3", targetLocation: null, craneOperatorId: null, hoursAgo: 99, metadata: JSON.stringify({ inspectorId: "INS-102", result: "PASS", notes: "Seal intact, no damage" }) },
        { eventType: "MOVED_IN_YARD", sourceLocation: "Quay:Berth-3", targetLocation: "Bay:1,Row:1,Tier:1", craneOperatorId: "OP-4421", hoursAgo: 98, metadata: JSON.stringify({ craneId: "RTG-07", liftDurationSec: 145 }) },
        { eventType: "MOVED_IN_YARD", sourceLocation: "Bay:1,Row:1,Tier:1", targetLocation: "Bay:3,Row:2,Tier:1", craneOperatorId: "OP-5532", hoursAgo: 48, metadata: JSON.stringify({ reason: "Restack for access to MSCU-485762 below", craneId: "RTG-03" }) },
      ],
    },
    {
      containerId: "MSCU-183746",
      events: [
        { eventType: "DISCHARGED", sourceLocation: "Vessel:MV Pacific Horizon:Hold-1", targetLocation: "Quay:Berth-3", craneOperatorId: "OP-4421", hoursAgo: 76, metadata: JSON.stringify({ sealIntact: true, temperature: -18.2 }) },
        { eventType: "INSPECTED", sourceLocation: "Quay:Berth-3", targetLocation: null, craneOperatorId: null, hoursAgo: 75, metadata: JSON.stringify({ inspectorId: "INS-204", result: "PASS", notes: "Reefer unit functioning, -18.2°C" }) },
        { eventType: "MOVED_IN_YARD", sourceLocation: "Quay:Berth-3", targetLocation: "Bay:1,Row:1,Tier:2", craneOperatorId: "OP-6643", hoursAgo: 74, metadata: JSON.stringify({ craneId: "RTG-07", pluggedIn: true, reeferPowerKw: 4.5 }) },
      ],
    },
    {
      containerId: "MSCU-485762",
      events: [
        { eventType: "DISCHARGED", sourceLocation: "Vessel:MV Pacific Horizon:Hold-5", targetLocation: "Quay:Berth-3", craneOperatorId: "OP-4421", hoursAgo: 30, metadata: JSON.stringify({ sealIntact: true }) },
        { eventType: "INSPECTED", sourceLocation: "Quay:Berth-3", targetLocation: null, craneOperatorId: null, hoursAgo: 29, metadata: JSON.stringify({ inspectorId: "INS-102", result: "PASS" }) },
        { eventType: "MOVED_IN_YARD", sourceLocation: "Quay:Berth-3", targetLocation: "Bay:2,Row:3,Tier:1", craneOperatorId: "OP-5532", hoursAgo: 28, metadata: JSON.stringify({ craneId: "RTG-03" }) },
        { eventType: "MOVED_IN_YARD", sourceLocation: "Bay:2,Row:3,Tier:1", targetLocation: "Bay:8,Row:1,Tier:1", craneOperatorId: "OP-5532", hoursAgo: 8, metadata: JSON.stringify({ reason: "Pre-staged for truck pickup", craneId: "RTG-05" }) },
        { eventType: "LOADED_ON_TRUCK", sourceLocation: "Bay:8,Row:1,Tier:1", targetLocation: "Gate:4-Export", craneOperatorId: "OP-7754", hoursAgo: 4, metadata: JSON.stringify({ truckPlate: "KA-19-AB-4421", driverId: "DRV-887", gateOutTime: "2026-08-25T08:45:00Z" }) },
      ],
    },
    {
      containerId: "MSKU-443651",
      events: [
        { eventType: "DISCHARGED", sourceLocation: "Vessel:Maersk Sentinel:Hold-2", targetLocation: "Quay:Berth-4", craneOperatorId: "OP-3310", hoursAgo: 124, metadata: JSON.stringify({ sealIntact: true }) },
        { eventType: "INSPECTED", sourceLocation: "Quay:Berth-4", targetLocation: null, craneOperatorId: null, hoursAgo: 123, metadata: JSON.stringify({ inspectorId: "INS-305", result: "HOLD", notes: "Documentation mismatch — bill of lading weight vs actual" }) },
        { eventType: "INSPECTED", sourceLocation: "Quay:Berth-4", targetLocation: null, craneOperatorId: null, hoursAgo: 121, metadata: JSON.stringify({ inspectorId: "INS-305", result: "PASS", notes: "Weight discrepancy resolved with shipper" }) },
        { eventType: "MOVED_IN_YARD", sourceLocation: "Quay:Berth-4", targetLocation: "Bay:1,Row:2,Tier:4", craneOperatorId: "OP-3310", hoursAgo: 120, metadata: JSON.stringify({ craneId: "RTG-02" }) },
      ],
    },
    {
      containerId: "MSKU-110328",
      events: [
        { eventType: "DISCHARGED", sourceLocation: "Vessel:Maersk Sentinel:Hold-4", targetLocation: "Quay:Berth-4", craneOperatorId: "OP-3310", hoursAgo: 20, metadata: JSON.stringify({ sealIntact: true }) },
        { eventType: "INSPECTED", sourceLocation: "Quay:Berth-4", targetLocation: null, craneOperatorId: null, hoursAgo: 19, metadata: JSON.stringify({ inspectorId: "INS-102", result: "PASS" }) },
        { eventType: "MOVED_IN_YARD", sourceLocation: "Quay:Berth-4", targetLocation: "Bay:9,Row:5,Tier:1", craneOperatorId: "OP-6643", hoursAgo: 18, metadata: JSON.stringify({ craneId: "RTG-05" }) },
        { eventType: "LOADED_ON_TRUCK", sourceLocation: "Bay:9,Row:5,Tier:1", targetLocation: "Gate:2-Export", craneOperatorId: "OP-7754", hoursAgo: 2, metadata: JSON.stringify({ truckPlate: "MH-12-CD-7890", driverId: "DRV-332", gateOutTime: "2026-08-25T10:15:00Z" }) },
      ],
    },
    {
      containerId: "TCLU-100004",
      events: [
        { eventType: "DISCHARGED", sourceLocation: "Vessel:Maersk Sentinel:Hold-1", targetLocation: "Quay:Berth-4", craneOperatorId: "OP-3310", hoursAgo: 74, metadata: JSON.stringify({ sealIntact: true, hazmatClass: "3-Flammable", imdgCode: "3.1" }) },
        { eventType: "INSPECTED", sourceLocation: "Quay:Berth-4", targetLocation: null, craneOperatorId: null, hoursAgo: 73, metadata: JSON.stringify({ inspectorId: "INS-HZ-01", result: "PASS", notes: "HAZMAT Class 3 verified. Segregation zone B confirmed." }) },
        { eventType: "MOVED_IN_YARD", sourceLocation: "Quay:Berth-4", targetLocation: "Bay:2,Row:6,Tier:1", craneOperatorId: "OP-3310", hoursAgo: 72, metadata: JSON.stringify({ craneId: "RTG-02", hazmatSegregation: "Zone-B" }) },
      ],
    },
    {
      containerId: "TCLU-100006",
      events: [
        { eventType: "DISCHARGED", sourceLocation: "Vessel:Maersk Sentinel:Hold-3", targetLocation: "Quay:Berth-4", craneOperatorId: "OP-3310", hoursAgo: 99, metadata: JSON.stringify({ sealIntact: false, notes: "Seal damaged — flagged for inspection" }) },
        { eventType: "INSPECTED", sourceLocation: "Quay:Berth-4", targetLocation: null, craneOperatorId: null, hoursAgo: 97, metadata: JSON.stringify({ inspectorId: "INS-305", result: "HOLD", notes: "Broken seal. Contents verified against manifest. No theft detected." }) },
        { eventType: "INSPECTED", sourceLocation: "Quay:Berth-4", targetLocation: null, craneOperatorId: null, hoursAgo: 96, metadata: JSON.stringify({ inspectorId: "INS-305", result: "PASS", notes: "Re-sealed. Cleared for yard placement." }) },
        { eventType: "MOVED_IN_YARD", sourceLocation: "Quay:Berth-4", targetLocation: "Bay:3,Row:2,Tier:2", craneOperatorId: "OP-5532", hoursAgo: 95, metadata: JSON.stringify({ craneId: "RTG-03" }) },
      ],
    },
    {
      containerId: "MSCU-607984",
      events: [
        { eventType: "DISCHARGED", sourceLocation: "Vessel:MV Pacific Horizon:Hold-2", targetLocation: "Quay:Berth-3", craneOperatorId: "OP-4421", hoursAgo: 112, metadata: JSON.stringify({ sealIntact: true }) },
        { eventType: "INSPECTED", sourceLocation: "Quay:Berth-3", targetLocation: null, craneOperatorId: null, hoursAgo: 111, metadata: JSON.stringify({ inspectorId: "INS-204", result: "PASS" }) },
        { eventType: "MOVED_IN_YARD", sourceLocation: "Quay:Berth-3", targetLocation: "Bay:1,Row:1,Tier:3", craneOperatorId: "OP-4421", hoursAgo: 110, metadata: JSON.stringify({ craneId: "RTG-07" }) },
        { eventType: "MOVED_IN_YARD", sourceLocation: "Bay:1,Row:1,Tier:3", targetLocation: "Bay:1,Row:1,Tier:4", craneOperatorId: "OP-5532", hoursAgo: 60, metadata: JSON.stringify({ reason: "Compaction — making room in tier 3", craneId: "RTG-07" }) },
      ],
    },
  ];

  let totalEvents = 0;
  for (const history of eventHistories) {
    for (const evt of history.events) {
      await prisma.containerEvent.create({
        data: {
          containerId: history.containerId,
          eventType: evt.eventType,
          sourceLocation: evt.sourceLocation,
          targetLocation: evt.targetLocation,
          craneOperatorId: evt.craneOperatorId,
          timestamp: new Date(Date.now() - evt.hoursAgo * 60 * 60 * 1000),
          metadata: evt.metadata,
        },
      });
      totalEvents++;
    }
  }

  console.log(`  📝 ${totalEvents} container events created across ${eventHistories.length} containers\n`);

  // 🔐 5. Create Authentication Users ---------------------------------------
  console.log("  Creating users...");
  const hashedPassword = await bcrypt.hash("admin123", 10);
  const users = [
    { email: "director@portflow.com", roleId: "DIR-01", name: "Sarah Chen", department: "Executive Operations", clearance: "LEVEL 5 (OMEGA)", password: hashedPassword },
    { email: "yardmaster@portflow.com", roleId: "OPS-04", name: "David Miller", department: "Yard Logistics", clearance: "LEVEL 4 (DELTA)", password: hashedPassword },
    { email: "security@portflow.com", roleId: "SEC-09", name: "Michael Chang", department: "Access Control", clearance: "LEVEL 2 (SIGMA)", password: hashedPassword },
    { email: "crane.op@portflow.com", roleId: "EQP-12", name: "Elena Rodriguez", department: "Heavy Machinery", clearance: "LEVEL 2 (SIGMA)", password: hashedPassword },
  ];

  await prisma.user.createMany({ data: users });
  console.log(`  🔐 4 users created (password: admin123)`);

  // 📈 Summary ────────────────────────────────────────────────────────────
  const containerCount = await prisma.container.count();
  const occupiedSlots = await prisma.yardSlot.count({ where: { isOccupied: true } });
  const eventCount = await prisma.containerEvent.count();

  console.log("─────────────────────────────────────────");
  console.log("  SEED COMPLETE");
  console.log(`  Vessels:    4`);
  console.log(`  Containers: ${containerCount}`);
  console.log(`  Yard Slots: ${allSlots.length} (${occupiedSlots} occupied)`);
  console.log(`  Events:     ${eventCount}`);
  console.log("─────────────────────────────────────────\n");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
