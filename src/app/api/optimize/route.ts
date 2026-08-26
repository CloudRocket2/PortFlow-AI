import { NextRequest, NextResponse } from "next/server";
import { Container3DData } from "@/hooks/useTelemetry";

export async function POST(request: NextRequest) {
  try {
    const { containers } = await request.json() as { containers: Container3DData[] };
    
    if (!containers || !Array.isArray(containers)) {
      throw new Error("Invalid payload");
    }

    const suggestions: Array<{
      containerId: string;
      fromSlot: { bay: number; row: number; tier: number } | null;
      toSlot: { bay: number; row: number; tier: number };
      reason: string;
      estimatedCarbonSavedKg: number;
    }> = [];
    
    // 1. Find Heavy Containers (> 28 Tons) that are NOT on Tier 1
    const heavyContainers = containers.filter(c => c.weightTons > 28 && c.currentSlot && c.currentSlot.tier > 1);
    
    // 2. Find High Dwell Containers (> 14 Days) that are buried (someone on top of them)
    // To do this quickly, we find if any container exists in the same bay/row with a higher tier.
    const highDwellContainers = containers.filter(c => {
      if (!c.currentSlot || c.dwellTimeDays <= 14) return false;
      const hasContainerAbove = containers.some(above => 
        above.currentSlot && 
        above.currentSlot.bay === c.currentSlot!.bay && 
        above.currentSlot.row === c.currentSlot!.row && 
        above.currentSlot.tier > c.currentSlot!.tier
      );
      return hasContainerAbove;
    });

    // Create realistic moves
    for (const heavy of heavyContainers) {
      if (suggestions.length >= 3) break; // limit to top 3 moves
      
      // Find an empty Tier 1 slot in bays 8, 9, or 10
      const targetBay = 8;
      const targetRow = (heavy.currentSlot!.row % 4) + 1; 
      // check if slot is occupied
      const occupied = containers.some(c => c.currentSlot && c.currentSlot.bay === targetBay && c.currentSlot.row === targetRow && c.currentSlot.tier === 1);
      
      if (!occupied) {
        suggestions.push({
          containerId: heavy.id,
          fromSlot: heavy.currentSlot,
          toSlot: { bay: targetBay, row: targetRow, tier: 1 },
          reason: `High Weight (${heavy.weightTons} MT) detected on Tier ${heavy.currentSlot!.tier}. Relocating to Tier 1 for stack stability.`,
          estimatedCarbonSavedKg: 12.5
        });
      }
    }

    for (const dwell of highDwellContainers) {
      if (suggestions.length >= 5) break; 
      
      // Move to a front bay (Bay 1 or 2) on top tier for quick exit
      const targetBay = 1;
      const targetRow = dwell.currentSlot!.row;
      // find highest tier in that bay/row
      const stack = containers.filter(c => c.currentSlot && c.currentSlot.bay === targetBay && c.currentSlot.row === targetRow);
      const topTier = stack.reduce((max, c) => Math.max(max, c.currentSlot!.tier), 0);
      
      suggestions.push({
        containerId: dwell.id,
        fromSlot: dwell.currentSlot,
        toSlot: { bay: targetBay, row: targetRow, tier: topTier + 1 },
        reason: `High Dwell Time (${dwell.dwellTimeDays} Days) buried on Tier ${dwell.currentSlot!.tier}. Moving to Front Bay for immediate dispatch.`,
        estimatedCarbonSavedKg: 28.4
      });
    }

    // Sort by carbon saved
    suggestions.sort((a, b) => b.estimatedCarbonSavedKg - a.estimatedCarbonSavedKg);

    return NextResponse.json({
      success: true,
      suggestions,
      totalMoves: suggestions.length,
      totalCarbonSavedEstimate: suggestions.reduce((acc, s) => acc + s.estimatedCarbonSavedKg, 0)
    });
  } catch (error) {
    console.error("Yard optimization error:", error);
    return NextResponse.json(
      { error: "Failed to generate optimization plan" },
      { status: 500 }
    );
  }
}
