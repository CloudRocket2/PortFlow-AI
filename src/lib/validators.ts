// =============================================================================
// Zod Validation Schemas — API request/response validation
// =============================================================================

import { z } from "zod";

// ── Container Move Request ──────────────────────────────────────────────────
export const MoveContainerSchema = z.object({
  containerId: z
    .string()
    .min(1, "Container ID is required")
    .regex(/^[A-Z]{4}-\d{6}$/, "Container ID must match format XXXX-000000"),
  targetBay: z.number().int().min(1).max(10),
  targetRow: z.number().int().min(1).max(6),
  targetTier: z.number().int().min(1).max(4),
  craneOperatorId: z
    .string()
    .min(1, "Crane operator ID is required")
    .regex(/^OP-\d{4}$/, "Operator ID must match format OP-0000"),
  reason: z.string().optional(),
});

export type MoveContainerInput = z.infer<typeof MoveContainerSchema>;

// ── Container Query Params ──────────────────────────────────────────────────
export const ContainerQuerySchema = z.object({
  status: z
    .enum(["INBOUND", "YARD_STACKED", "READY_FOR_PICKUP", "DISPATCHED"])
    .optional(),
  priorityLevel: z.enum(["HIGH", "MEDIUM", "LOW"]).optional(),
  type: z.enum(["DRY", "REEFER", "HAZMAT"]).optional(),
  minDwellHours: z.coerce.number().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(1000).default(20),
  sortBy: z
    .enum(["dwellTimeHours", "weightKg", "priorityLevel", "carbonSavedKg", "id"])
    .default("dwellTimeHours"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type ContainerQuery = z.infer<typeof ContainerQuerySchema>;
