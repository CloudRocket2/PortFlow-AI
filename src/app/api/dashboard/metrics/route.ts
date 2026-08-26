// =============================================================================
// GET /api/dashboard/metrics
// =============================================================================
// Aggregates: active vessels, yard capacity %, high-dwell alerts, carbon saved.
// This is the single endpoint the header bar polls for real-time KPIs.
// =============================================================================

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // Total yard slots and occupied count
    const totalSlots = await prisma.yardSlot.count();
    const occupiedSlots = await prisma.yardSlot.count({
      where: { isOccupied: true },
    });

    // Active vessels (DOCKED or APPROACHING)
    const activeVessels = await prisma.vessel.findMany({
      where: { berthStatus: { in: ["DOCKED", "APPROACHING"] } },
      select: {
        id: true,
        name: true,
        callSign: true,
        eta: true,
        berthNumber: true,
        berthStatus: true,
        _count: { select: { containers: true } },
      },
    });

    const dockedCount = activeVessels.filter(
      (v) => v.berthStatus === "DOCKED"
    ).length;

    // High-dwell alerts (containers > 72 hours)
    const highDwellContainers = await prisma.container.count({
      where: { dwellTimeHours: { gte: 72 } },
    });

    // Total carbon saved across all containers
    const carbonAgg = await prisma.container.aggregate({
      _sum: { carbonSavedKg: true },
    });

    // Container status breakdown
    const allContainers = await prisma.container.findMany({
      select: { status: true, type: true },
    });

    const statusBreakdown = allContainers.reduce(
      (acc, c) => {
        acc[c.status] = (acc[c.status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    const typeBreakdown = allContainers.reduce(
      (acc, c) => {
        acc[c.type] = (acc[c.type] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    return NextResponse.json({
      yardCapacity: {
        total: totalSlots,
        occupied: occupiedSlots,
        utilizationPercent: Math.round((occupiedSlots / totalSlots) * 100),
      },
      vessels: {
        active: activeVessels.length,
        docked: dockedCount,
        list: activeVessels,
      },
      alerts: {
        highDwellCount: highDwellContainers,
        threshold: 72,
      },
      carbon: {
        totalSavedKg: carbonAgg._sum.carbonSavedKg ?? 0,
      },
      containers: {
        total: allContainers.length,
        byStatus: statusBreakdown,
        byType: typeBreakdown,
      },
    });
  } catch (error) {
    console.error("Dashboard metrics error:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard metrics" },
      { status: 500 }
    );
  }
}
