import "server-only";
import prisma from "@/lib/prisma";
import { rethrowUniqueViolation } from "@/lib/errors/prisma-errors";
import { roleSelect } from "./types";
import type { CreateRoleDTO } from "./schema";

export class RoleService {
  async getAll() {
    return await prisma.staffRole.findMany({
      select: roleSelect,
      orderBy: { createdAt: "asc" },
    });
  }

  async create(data: CreateRoleDTO) {
    try {
      return await prisma.staffRole.create({ data, select: roleSelect });
    } catch (error) {
      rethrowUniqueViolation(error, "A role with that name already exists.");
    }
  }
}

export const roleService = new RoleService();
