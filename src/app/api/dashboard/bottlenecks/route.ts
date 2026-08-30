import { NextResponse } from "next/server";

export async function GET() {
  try {
    const alerts = [];

    // 1. Draft/berth conflict
    alerts.push({
      id: "alert-draft-conflict",
      severity: "CRITICAL",
      title: "Draft & Berth Conflict",
      message: "MV Pacific Horizon (Capesize) arrives in 6h \u2014 Berth 3 draft is 0.4m short at current tide.",
      time: "Just now"
    });

    // 2. Cargo dwell / demurrage risk
    alerts.push({
      id: "alert-demurrage",
      severity: "WARNING",
      title: "Demurrage Risk Detected",
      message: "42,000 MT of Coking Coal has been in the Vizag stockyard for 9 days \u2014 demurrage clock running, contact charterer.",
      time: "10m ago"
    });

    // 3. Loading/discharge rate shortfall
    alerts.push({
      id: "alert-rate-shortfall",
      severity: "WARNING",
      title: "Discharge Rate Shortfall",
      message: "Discharge rate at Haldia is running at 8,200 MT/day vs. the 12,000 MT/day assumed \u2014 laytime at risk of being exceeded.",
      time: "45m ago"
    });

    // 4. Vessel approaching
    alerts.push({
      id: "alert-vessel-approaching",
      severity: "INFO",
      title: "Vessel Approaching",
      message: "MV Global Spirit is arriving in 2h \u2014 confirm grab/conveyor discharge equipment and berth are ready.",
      time: "1h ago"
    });

    // 5. Weather/tide delay risk
    alerts.push({
      id: "alert-tide-delay",
      severity: "INFO",
      title: "Tidal Delay Risk",
      message: "Sagar-Sandheads anchorage: MV Oceanic Pioneer needs high tide to cross the bar \u2014 next window in 14h.",
      time: "2h ago"
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
