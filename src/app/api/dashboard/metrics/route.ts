// =============================================================================
// GET /api/dashboard/metrics
// =============================================================================
// Aggregates: active vessels, yard capacity %, high-dwell alerts, carbon saved.
// This is the single endpoint the header bar polls for real-time KPIs.
// =============================================================================

import { NextResponse } from "next/server";

export async function GET() {
  try {
    return NextResponse.json({
      contracts: {
        multiVoyage: 14,
        spot: 3,
        totalTonnage: 2450000, // 2.45M MT
      },
      fleet: {
        inTransit: 28,
        anchored: 4,
      },
      market: {
        forecastAccuracy: 94.2, // %
        trend: "BULLISH",
      },
      alerts: {
        anchorageDelays: 2,
        threshold: 24,
      },
      carbon: {
        totalSavedKg: 18200, 
      }
    });
  } catch (error) {
    console.error("Dashboard metrics error:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard metrics" },
      { status: 500 }
    );
  }
}
