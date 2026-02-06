import prisma from "@/lib/prisma";
import { parentIncludes } from "./types";
import type { CreateParentDTO, UpdateParentDTO } from "./schema";

export class ParentService {
  async getById(id: string) {
    return await prisma.parent.findUnique({
      where: { id },
      include: parentIncludes.full,
    });
  }

  async getAll() {
    return await prisma.parent.findMany({
      include: parentIncludes.summary,
    });
  }

  async create(data: CreateParentDTO) {
    const parent = await prisma.parent.create({
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
      },
      include: parentIncludes.full,
    });

    return parent;
  }

  async update(id: string, data: UpdateParentDTO) {
    const existing = await prisma.parent.findUnique({
      where: { id },
    });

    if (!existing) return null;

    const parent = await prisma.parent.update({
      where: { id },
      data: {
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
      include: parentIncludes.full,
    });

    return parent;
  }

  async delete(id: string) {
    const existing = await prisma.parent.findUnique({
      where: { id },
    });

    if (!existing) return null;

    // Soft delete by marking person as inactive
    return await prisma.parent.update({
      where: { id },
      data: {
        person: {
          update: {
            active: false,
          },
        },
      },
      include: parentIncludes.full,
    });
  }
}

export const parentService = new ParentService();
