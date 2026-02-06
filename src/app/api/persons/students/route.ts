import { NextRequest, NextResponse } from "next/server";
import { authorize } from "@/lib/authz";
import { CreateStudentSchema } from "@/modules/persons/students/schema";
import { handleApiError } from "@/lib/api/error-handler";
import { studentService } from "@/modules/persons/students/student.service";

/**
 * GET /api/persons/students
 * Returns all students (summary view)
 */
export async function GET(req: NextRequest) {
  try {
    await authorize(["admin", "teacher"]);
    const students = await studentService.getAll();
    return NextResponse.json(students, { status: 200 });
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * POST /api/persons/students
 * Creates a new student
 */
export async function POST(req: NextRequest) {
  try {
    await authorize(["admin"]);

    const body = await req.json();
    const validatedData = CreateStudentSchema.parse(body);
    const newStudent = await studentService.create(validatedData);

    return NextResponse.json(newStudent, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
