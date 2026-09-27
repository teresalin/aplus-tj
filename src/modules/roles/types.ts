import type { Prisma } from "@prisma/client";

export const roleSelect = {
  id: true,
  name: true,
} as const satisfies Prisma.StaffRoleSelect;

export type Role = Prisma.StaffRoleGetPayload<{ select: typeof roleSelect }>;
