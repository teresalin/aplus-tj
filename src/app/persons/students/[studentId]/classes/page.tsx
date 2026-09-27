import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { requirePageAccess } from "@/lib/authz";
import { isUuid } from "@/lib/ids";
import { classService } from "@/modules/classes/class.service";
import { StudentClassesView } from "@/modules/persons/students/components";
import { studentService } from "@/modules/persons/students/student.service";

export const metadata: Metadata = { title: "Student classes" };

export default async function StudentClassesPage({
  params,
}: {
  params: { studentId: string };
}) {
  await requirePageAccess();
  if (!isUuid(params.studentId)) notFound();

  const [student, enrollments, classes] = await Promise.all([
    studentService.getById(params.studentId),
    studentService.getEnrollments(params.studentId),
    classService.getOptions(),
  ]);
  if (!student) notFound();

  return <StudentClassesView enrollments={enrollments} classes={classes} />;
}
