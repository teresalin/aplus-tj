import { NextRequest, NextResponse } from "next/server";
import { authorize } from "@/lib/authz";
import { handleApiError } from "@/lib/api/error-handler";
import { parseBody } from "@/lib/api/request";
import { CreateStudentSchema } from "@/modules/persons/students";
import { studentService } from "@/modules/persons/students/student.service";

/**
 * POST /api/persons/students
 * Creates a new student (admin only).
 */
export async function POST(req: NextRequest) {
  try {
    await authorize("admin");
    const data = await parseBody(req, CreateStudentSchema);
    const student = await studentService.create(data);
    return NextResponse.json(student, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
