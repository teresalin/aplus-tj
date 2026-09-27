import { NextRequest, NextResponse } from "next/server";
import { authorize } from "@/lib/authz";
import { handleApiError } from "@/lib/api/error-handler";
import { parseBody, parseId } from "@/lib/api/request";
import { NotFoundError } from "@/lib/errors/custom-errors";
import { UpdateStudentSchema } from "@/modules/persons/students";
import { studentService } from "@/modules/persons/students/student.service";

type Params = { params: { studentId: string } };

/**
 * PATCH /api/persons/students/:studentId
 * Partially updates a student (admin only).
 */
export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    await authorize("admin");
    const studentId = parseId(params.studentId);
    const data = await parseBody(req, UpdateStudentSchema);
    const student = await studentService.update(studentId, data);
    if (!student) throw new NotFoundError("Student not found");
    return NextResponse.json(student);
  } catch (error) {
    return handleApiError(error);
  }
}
