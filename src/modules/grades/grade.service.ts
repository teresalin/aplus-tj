import "server-only";
import prisma from "@/lib/prisma";
import { rethrowUniqueViolation } from "@/lib/errors/prisma-errors";
import { gradeSelect } from "./types";
import type { CreateGradeDTO } from "./schema";

export class GradeService {
  async getAll() {
    return await prisma.grade.findMany({
      select: gradeSelect,
      orderBy: { createdAt: "asc" },
    });
  }

  async create(data: CreateGradeDTO) {
    try {
      return await prisma.grade.create({ data, select: gradeSelect });
    } catch (error) {
      rethrowUniqueViolation(error, "A grade with that name already exists.");
    }
  }
}

export const gradeService = new GradeService();
