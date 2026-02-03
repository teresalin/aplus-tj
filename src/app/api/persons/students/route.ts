import { NextRequest, NextResponse } from "next/server";
import { MethodNotAllowedError } from "@/lib/CustomError";
import {
  createStudent,
  findAllStudents,
} from "@/modules/persons/students/student.service";
import type { CreateStudentDTO } from "@/modules/persons/students/dtos";
import { authorize } from "@/lib/authz";
import { CreateStudentSchema } from "@/modules/persons/students/schema";

// GET /api/persons/students
export async function GET(req: NextRequest) {
  try {
    await authorize(["admin", "teacher"]);
    const students = await findAllStudents();
    return NextResponse.json(
      { status: "Success", result: students },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { status: "Error", message: error.message },
      { status: 500 },
    );
  }
}

// POST /api/persons/students
export async function POST(req: NextRequest) {
  try {
    await authorize("admin");
    const dto = CreateStudentSchema.parse(await req.json());
    const newStudent = await createStudent(dto);
    return NextResponse.json(
      { status: "Success", result: newStudent, message: "Created" },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      { status: "Error", message: error.message },
      { status: 500 },
    );
  }
}

// Fallback for other methods
export const ALL = () => {
  throw new MethodNotAllowedError("ALL");
};
