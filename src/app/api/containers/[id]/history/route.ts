// =============================================================================
// GET /api/containers/[id]/history
// =============================================================================
// Returns the complete chronological event-log ("commit history") for a
// single container. This is the immutable audit trail — "Git for containers".
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Verify container exists
    const container = await prisma.container.findUnique({
      where: { id },
      include: {
        currentSlot: { select: { bay: true, row: true, tier: true } },
        vessel: { select: { name: true, callSign: true } },
      },
    });

    if (!container) {
      return NextResponse.json(
        { error: `Container ${id} not found` },
        { status: 404 }
      );
    }

    // Fetch all events in chronological order (oldest first)
    const events = await prisma.containerEvent.findMany({
      where: { containerId: id },
      orderBy: { timestamp: "asc" },
    });

    // Parse metadata JSON for each event
    const parsedEvents = events.map((e) => ({
      ...e,
      metadata: e.metadata ? JSON.parse(e.metadata) : null,
    }));

    return NextResponse.json({
      container,
      events: parsedEvents,
      totalEvents: events.length,
    });
  } catch (error) {
    console.error("Container history error:", error);
    return NextResponse.json(
      { error: "Failed to fetch container history" },
      { status: 500 }
    );
  }
}
