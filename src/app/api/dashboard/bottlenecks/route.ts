import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const alerts = [];

    // 1. Check for high density
    const totalSlots = await prisma.yardSlot.count();
    const occupiedSlots = await prisma.yardSlot.count({
      where: { isOccupied: true },
    });
    
    const utilization = (occupiedSlots / totalSlots) * 100;
    if (utilization > 80) {
      alerts.push({
        id: "alert-density",
        severity: "CRITICAL",
        title: "Critical Yard Congestion",
        message: `Terminal capacity is at ${utilization.toFixed(1)}%. Recommend diverting inbound freight.`,
        time: "Just now"
      });
    } else if (utilization > 65) {
      alerts.push({
        id: "alert-density",
        severity: "WARNING",
        title: "Elevated Yard Density",
        message: `Terminal capacity reaching ${utilization.toFixed(1)}%. Keep crane efficiency high.`,
        time: "Just now"
      });
    }

    // 2. Check for buried HIGH priority containers
    const buriedHighPriority = await prisma.container.count({
      where: {
        priorityLevel: "HIGH",
        currentSlot: {
          tier: 1 // Stuck on the ground
        }
      }
    });

    if (buriedHighPriority > 0) {
      alerts.push({
        id: "alert-buried",
        severity: "WARNING",
        title: "Buried Priority Cargo",
        message: `${buriedHighPriority} High-Priority containers are currently at Tier 1, risking severe re-handle delays.`,
        time: "10m ago"
      });
    }

    // 3. Check for extremely long dwell times
    const staleContainers = await prisma.container.count({
      where: {
        dwellTimeHours: { gte: 96 } // 4+ days
      }
    });

    if (staleContainers > 0) {
      alerts.push({
        id: "alert-dwell",
        severity: "INFO",
        title: "Stale Freight Detected",
        message: `${staleContainers} containers have been dwelling for over 96 hours. Contact consignees.`,
        time: "1h ago"
      });
    }

    // 4. Inbound vessel warning
    const approachingVessels = await prisma.vessel.findMany({
      where: { berthStatus: "APPROACHING" },
      select: { name: true, eta: true }
    });

    approachingVessels.forEach(v => {
      alerts.push({
        id: `alert-vessel-${v.name}`,
        severity: "INFO",
        title: "Vessel Approaching",
        message: `MV ${v.name} is arriving shortly. Ensure RTG cranes are positioned at Berth.`,
        time: "2h ago"
      });
    });

    return NextResponse.json({
      success: true,
      data: alerts
    });

  } catch (error) {
    console.error("Bottleneck scan error:", error);
    return NextResponse.json(
      { error: "Failed to scan bottlenecks" },
      { status: 500 }
    );
  }
}
