// =============================================================================
// POST /api/containers/move
// =============================================================================
// Validates and executes a container move:
//   1. Validates input with Zod
//   2. Checks container exists and is movable
//   3. Checks target slot exists and is empty
//   4. Updates old slot → unoccupied
//   5. Updates container → new slot
//   6. Updates new slot → occupied
//   7. Appends immutable ContainerEvent record
// All in a single Prisma transaction for atomicity.
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { MoveContainerSchema } from "@/lib/validators";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const input = MoveContainerSchema.parse(body);

    // Execute the entire move as an atomic transaction
    const result = await prisma.$transaction(async (tx) => {
      // 1. Find the container
      const container = await tx.container.findUnique({
        where: { id: input.containerId },
        include: { currentSlot: true },
      });

      if (!container) {
        throw new Error(`Container ${input.containerId} not found`);
      }

      if (container.status === "DISPATCHED") {
        throw new Error(
          `Container ${input.containerId} has already been dispatched`
        );
      }

      if (container.status === "INBOUND") {
        throw new Error(
          `Container ${input.containerId} is still inbound — must be discharged first`
        );
      }

      // 2. Find the target slot
      const targetSlot = await tx.yardSlot.findUnique({
        where: {
          bay_row_tier: {
            bay: input.targetBay,
            row: input.targetRow,
            tier: input.targetTier,
          },
        },
      });

      if (!targetSlot) {
        throw new Error(
          `Target slot Bay:${input.targetBay},Row:${input.targetRow},Tier:${input.targetTier} does not exist`
        );
      }

      if (targetSlot.isOccupied) {
        throw new Error(
          `Target slot Bay:${input.targetBay},Row:${input.targetRow},Tier:${input.targetTier} is already occupied`
        );
      }

      // 3. Build source location string for the event
      const sourceLocation = container.currentSlot
        ? `Bay:${container.currentSlot.bay},Row:${container.currentSlot.row},Tier:${container.currentSlot.tier}`
        : `Status:${container.status}`;

      const targetLocation = `Bay:${input.targetBay},Row:${input.targetRow},Tier:${input.targetTier}`;

      // 4. Free the old slot (if container was in one)
      if (container.currentSlotId) {
        await tx.yardSlot.update({
          where: { id: container.currentSlotId },
          data: { isOccupied: false },
        });
      }

      // 5. Move container to new slot
      const updatedContainer = await tx.container.update({
        where: { id: input.containerId },
        data: {
          currentSlotId: targetSlot.id,
          status: "YARD_STACKED",
        },
      });

      // 6. Mark new slot as occupied
      await tx.yardSlot.update({
        where: { id: targetSlot.id },
        data: { isOccupied: true },
      });

      // 7. Append immutable event record
      const event = await tx.containerEvent.create({
        data: {
          containerId: input.containerId,
          eventType: "MOVED_IN_YARD",
          sourceLocation,
          targetLocation,
          craneOperatorId: input.craneOperatorId,
          metadata: input.reason
            ? JSON.stringify({ reason: input.reason })
            : null,
        },
      });

      return { container: updatedContainer, event, targetLocation };
    });

    return NextResponse.json({
      success: true,
      message: `Container ${input.containerId} moved to ${result.targetLocation}`,
      container: result.container,
      event: result.event,
    });
  } catch (error) {
    if (error instanceof Error) {
      // Zod validation errors
      if (error.name === "ZodError") {
        return NextResponse.json(
          { error: "Validation failed", details: error },
          { status: 400 }
        );
      }
      // Business logic errors (container not found, slot occupied, etc.)
      return NextResponse.json({ error: error.message }, { status: 422 });
    }

    console.error("Container move error:", error);
    return NextResponse.json(
      { error: "Failed to move container" },
      { status: 500 }
    );
  }
}
