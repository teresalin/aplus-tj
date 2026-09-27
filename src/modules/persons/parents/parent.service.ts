import "server-only";
import prisma from "@/lib/prisma";
import { parentIncludes } from "./types";
import type { CreateParentDTO } from "./schema";

export class ParentService {
  async getAll() {
    return await prisma.parent.findMany({
      include: parentIncludes.summary,
      orderBy: { person: { name: "asc" } },
    });
  }

  async create(data: CreateParentDTO) {
    return await prisma.parent.create({
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
  }
}

export const parentService = new ParentService();
