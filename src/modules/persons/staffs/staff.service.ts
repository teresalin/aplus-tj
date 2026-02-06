import prisma from "@/lib/prisma";
import { staffIncludes } from "./types";
import type { CreateStaffDTO, UpdateStaffDTO } from "./schema";
import type { StaffWithClasses } from "./types";

export class StaffService {
  async getById(id: string) {
    return await prisma.staff.findUnique({
      where: { id },
      include: staffIncludes.full,
    });
  }

  async getAll() {
    return await prisma.staff.findMany({
      include: staffIncludes.summary,
    });
  }

  async getWithClasses(id: string): Promise<StaffWithClasses | null> {
    return await prisma.staff.findUnique({
      where: { id },
      include: staffIncludes.withClasses,
    });
  }

  async create(data: CreateStaffDTO) {
    const staff = await prisma.staff.create({
      data: {
        person: {
          create: {
            name: data.name,
            preferredName: data.preferredName,
            gender: data.gender,
            phone: data.phone,
            email: data.email,
            dateOfBirth: data.dateOfBirth,
            notes: data.notes,
            active: true,
          },
        },
        roleId: data.roleId,
        hireDate: data.hireDate,
        leaveDate: data.leaveDate,
      },
      include: staffIncludes.full,
    });

    return staff;
  }

  async update(id: string, data: UpdateStaffDTO) {
    const existing = await prisma.staff.findUnique({
      where: { id },
    });

    if (!existing) return null;

    const staff = await prisma.staff.update({
      where: { id },
      data: {
        ...(data.roleId && { roleId: data.roleId }),
        ...(data.hireDate && { hireDate: data.hireDate }),
        ...(data.leaveDate !== undefined && { leaveDate: data.leaveDate }),
        person: {
          update: {
            ...(data.name && { name: data.name }),
            ...(data.preferredName !== undefined && {
              preferredName: data.preferredName,
            }),
            ...(data.gender && { gender: data.gender }),
            ...(data.phone !== undefined && { phone: data.phone }),
            ...(data.email && { email: data.email }),
            ...(data.dateOfBirth && { dateOfBirth: data.dateOfBirth }),
            ...(data.notes !== undefined && { notes: data.notes }),
          },
        },
      },
      include: staffIncludes.full,
    });

    return staff;
  }
}

export const staffService = new StaffService();
