import "server-only";
import prisma from "@/lib/prisma";
import { enrollmentInclude, studentIncludes } from "./types";
import type { CreateStudentDTO, UpdateStudentDTO } from "./schema";

export class StudentService {
  async getById(id: string) {
    return await prisma.student.findUnique({
      where: { id },
      include: studentIncludes.full,
    });
  }

  async getAll() {
    return await prisma.student.findMany({
      include: studentIncludes.summary,
      orderBy: { person: { name: "asc" } },
    });
  }

  /** All of a student's class enrollments, most recent first. */
  async getEnrollments(id: string) {
    return await prisma.classStudent.findMany({
      where: { studentId: id },
      include: enrollmentInclude,
      orderBy: { startDate: "desc" },
    });
  }

  async create(data: CreateStudentDTO) {
    return await prisma.student.create({
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
        grade: { connect: { id: data.gradeId } },
        currentSchool: data.currentSchool,
        textbookPublisher: data.textbookPublisher,
        admissionDate: data.admissionDate,
        departureDate: data.departureDate,
      },
      include: studentIncludes.full,
    });
  }

  async update(id: string, data: UpdateStudentDTO) {
    const existing = await prisma.student.findUnique({
      where: { id },
    });

    if (!existing) return null;

    return await prisma.student.update({
      where: { id },
      data: {
        ...(data.gradeId && { grade: { connect: { id: data.gradeId } } }),
        ...(data.currentSchool !== undefined && {
          currentSchool: data.currentSchool,
        }),
        ...(data.textbookPublisher !== undefined && {
          textbookPublisher: data.textbookPublisher,
        }),
        ...(data.admissionDate && { admissionDate: data.admissionDate }),
        ...(data.departureDate !== undefined && {
          departureDate: data.departureDate,
        }),
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
      include: studentIncludes.full,
    });
  }
}

export const studentService = new StudentService();
