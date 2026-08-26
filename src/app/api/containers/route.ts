// =============================================================================
// GET /api/containers
// =============================================================================
// Returns paginated, filtered, sorted list of containers with their
// current yard slot coordinates and vessel info.
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { ContainerQuerySchema } from "@/lib/validators";

export async function GET(request: NextRequest) {
  try {
    const searchParams = Object.fromEntries(request.nextUrl.searchParams);
    const query = ContainerQuerySchema.parse(searchParams);

    // Build dynamic where clause
    const where: Record<string, unknown> = {};
    if (query.status) where.status = query.status;
    if (query.priorityLevel) where.priorityLevel = query.priorityLevel;
    if (query.type) where.type = query.type;
    if (query.minDwellHours)
      where.dwellTimeHours = { gte: query.minDwellHours };

    // Count for pagination
    const total = await prisma.container.count({ where });

    // Fetch containers with relations
    const containers = await prisma.container.findMany({
      where,
      include: {
        currentSlot: {
          select: { bay: true, row: true, tier: true },
        },
        vessel: {
          select: { name: true, callSign: true },
        },
        _count: {
          select: { events: true },
        },
      },
      orderBy: { [query.sortBy]: query.sortOrder },
      skip: (query.page - 1) * query.limit,
      take: query.limit,
    });

    return NextResponse.json({
      data: containers,
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.ceil(total / query.limit),
      },
    });
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { error: "Invalid query parameters", details: error },
        { status: 400 }
      );
    }
    console.error("Container list error:", error);
    return NextResponse.json(
      { error: "Failed to fetch containers" },
      { status: 500 }
    );
  }
}
