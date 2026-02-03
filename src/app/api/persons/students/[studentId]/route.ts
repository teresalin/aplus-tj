import { NextRequest, NextResponse } from "next/server";
import { authorize, HttpError } from "@/lib/authz";
import { z } from "zod";
import {
  findStudentById,
  updateStudent,
  deleteStudent,
} from "@/modules/persons/students/student.service";
import { UpdateStudentSchema } from "@/modules/persons/students/schema";

export const runtime = "nodejs";

const IdParam = z.object({ studentId: z.string().uuid() });

// GET /api/persons/students/:studentId  — admins & teachers
export async function GET(
  _req: NextRequest,
  { params }: { params: { studentId: string } },
) {
  try {
    await authorize(["admin", "teacher"]);
    const { studentId } = IdParam.parse(params);
    const student = await findStudentById(studentId);
    if (!student)
      return NextResponse.json(
        { status: "Error", message: "Not found" },
        { status: 404 },
      );
    return NextResponse.json(
      { status: "Success", result: student },
      { status: 200 },
    );
  } catch (e: any) {
    const status =
      e.name === "ZodError" ? 400 : ((e as HttpError).status ?? 500);
    return NextResponse.json(
      { status: "Error", message: e.message ?? "Internal Server Error" },
      { status },
    );
  }
}

// PATCH /api/persons/students/:studentId  — admin only (Update)
// Use PUT instead if you require full replacement.
export async function PATCH(
  req: NextRequest,
  { params }: { params: { studentId: string } },
) {
  try {
    await authorize("admin");
    const { studentId } = IdParam.parse(params);
    const dto = UpdateStudentSchema.parse(await req.json()); // partial update
    const updated = await updateStudent(studentId, dto);
    return NextResponse.json(
      { status: "Success", result: updated },
      { status: 200 },
    );
  } catch (e: any) {
    const status =
      e.name === "ZodError" ? 400 : ((e as HttpError).status ?? 500);
    const body: any = {
      status: "Error",
      message: e.name === "ZodError" ? "Invalid body" : e.message,
    };
    if (e.name === "ZodError") body.details = e.flatten?.();
    return NextResponse.json(body, { status });
  }
}

// DELETE /api/persons/students/:studentId  — admin only (optional)
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { studentId: string } },
) {
  try {
    await authorize("admin");
    const { studentId } = IdParam.parse(params);
    await deleteStudent(studentId);
    return NextResponse.json({ status: "Success" }, { status: 204 });
  } catch (e: any) {
    return NextResponse.json(
      { status: "Error", message: e.message },
      { status: (e as HttpError).status ?? 500 },
    );
  }
}
