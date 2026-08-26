import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // Fetch the actual current average dwell time of all containers in the yard
    const agg = await prisma.container.aggregate({
      _avg: {
        dwellTimeHours: true,
      },
      where: {
        status: { in: ["YARD_STORAGE", "READY_FOR_PICKUP"] },
      },
    });

    const realAvg = agg._avg.dwellTimeHours || 42.5;

    // For a hackathon MVP where we don't have historical daily snapshots, 
    // we procedurally generate the last 6 days trending towards today's real average.
    // In production, this would query a daily snapshot table.
    
    const trendData = [];
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    
    // Get the current day index (0 = Sunday, 1 = Monday)
    const today = new Date().getDay();
    // Shift so 0 = Mon, 6 = Sun
    const currentDayIdx = today === 0 ? 6 : today - 1;

    let previousValue = realAvg * 1.15; // Start 15% higher a week ago

    for (let i = 6; i >= 0; i--) {
      const dayIdx = (currentDayIdx - i + 7) % 7;
      
      if (i === 0) {
        trendData.push({
          day: days[dayIdx],
          avg_hours: Math.round(realAvg * 10) / 10,
        });
      } else {
        // Add some random noise to the trend line
        const noise = (Math.random() * 4) - 2; // -2 to +2
        previousValue = previousValue - (previousValue - realAvg) / i + noise;
        trendData.push({
          day: days[dayIdx],
          avg_hours: Math.round(previousValue * 10) / 10,
        });
      }
    }

    return NextResponse.json({
      success: true,
      data: trendData,
    });
  } catch (error) {
    console.error("Dwell trend error:", error);
    return NextResponse.json(
      { error: "Failed to fetch dwell trends" },
      { status: 500 }
    );
  }
}
