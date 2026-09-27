import "server-only";
import prisma from "@/lib/prisma";
import { dueDateFilter, type AssignmentFilter } from "./constants";
import {
  assignmentInclude,
  type Assignment,
  type AssignmentRecord,
} from "./types";
import type { CreateAssignmentDTO, UpdateAssignmentDTO } from "./schema";

function toAssignment({
  classAssignments,
  ...assignment
}: AssignmentRecord): Assignment {
  return { ...assignment, class: classAssignments[0]?.class ?? null };
}

export class AssignmentService {
  async getAll(filter: AssignmentFilter = "all"): Promise<Assignment[]> {
    const assignments = await prisma.assignment.findMany({
      where: {
        classAssignments: { some: {} },
        dueDate: dueDateFilter(filter),
      },
      include: assignmentInclude,
      orderBy: { dueDate: "asc" },
    });
    return assignments.map(toAssignment);
  }

  async create(data: CreateAssignmentDTO): Promise<Assignment> {
    const assignment = await prisma.assignment.create({
      data: {
        name: data.name,
        description: data.description,
        dueDate: data.dueDate,
        classAssignments: { create: { classId: data.classId } },
      },
      include: assignmentInclude,
    });
    return toAssignment(assignment);
  }

  async update(id: string, data: UpdateAssignmentDTO): Promise<Assignment> {
    const assignment = await prisma.assignment.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        dueDate: data.dueDate,
        classAssignments: {
          deleteMany: {},
          create: { classId: data.classId },
        },
      },
      include: assignmentInclude,
    });
    return toAssignment(assignment);
  }

  async delete(id: string): Promise<void> {
    await prisma.$transaction([
      prisma.classAssignment.deleteMany({ where: { assignmentId: id } }),
      prisma.assignment.delete({ where: { id } }),
    ]);
  }
}

export const assignmentService = new AssignmentService();
