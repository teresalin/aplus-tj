import type { Metadata } from "next";

import { requirePageAccess } from "@/lib/authz";
import { gradeService } from "@/modules/grades/grade.service";
import { StudentsDashboard } from "@/modules/persons/students/components";
import { studentService } from "@/modules/persons/students/student.service";

export const metadata: Metadata = { title: "Students" };

export default async function StudentsPage() {
  await requirePageAccess();
  const [students, grades] = await Promise.all([
    studentService.getAll(),
    gradeService.getAll(),
  ]);

  return <StudentsDashboard students={students} grades={grades} />;
}
