// src/app/api/persons/students/route.ts
import { NextRequest, NextResponse } from "next/server";
import { MethodNotAllowedError } from "@/lib/CustomError";
import {
  createStudent,
  findAllStudents,
} from "@/modules/persons/students/student.service";
import type { CreateStudentDTO } from "@/modules/persons/students/dtos";
import { withRole } from "@/lib/withRole";

// GET /api/persons/students
export const GET = withRole("STAFF", async (_req: NextRequest) => {
  const students = await findAllStudents();
  return NextResponse.json({
    status: "Success",
    result: students,
    message: "OK",
  });
});

// POST /api/persons/students
export const POST = withRole("ADMIN", async (req: NextRequest) => {
  const body = (await req.json()) as CreateStudentDTO;
  const newStudent = await createStudent(body);
  return NextResponse.json(
    { status: "Success", result: newStudent, message: "Created" },
    { status: 201 },
  );
});

// Fallback for other methods
export const ALL = () => {
  throw new MethodNotAllowedError("ALL");
};

// import { ApiResponse } from "../../../../../utils/apiResponse";
// import { CreateStudentDTO } from "../../../../modules/persons/students/dtos";
// import { handleError } from "../../../../../utils/errorHandler";
// import { NextApiRequest, NextApiResponse } from "next";
// import { Student } from "../../../../modules/persons/students/types";
// import {
//   MethodNotAllowedError,
//   UniqueConstraintError,
// } from "../../../../../utils/CustomError";
// import {
//   createStudent,
//   findAllStudents,
// } from "../../../../modules/persons/students/student.service";

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse,
// ) {
//   try {
//     switch (req.method) {
//       case "GET": {
//         const students = await findAllStudents();
//         return res.status(200).json({
//           status: "Success",
//           result: students,
//           message: "Students retrieved successfully.",
//         } as ApiResponse);
//       }

//       case "POST": {
//         const body: CreateStudentDTO = req.body;
//         try {
//           const newStudent: Student = await createStudent(body);
//           return res.status(201).json({
//             status: "Success",
//             result: newStudent,
//             message: "New student created successfully.",
//           } as ApiResponse);
//         } catch (error) {
//           if (error.code === "23505") {
//             throw new UniqueConstraintError(
//               "A student with that name and date of birth already exists.",
//             );
//           }
//           throw error;
//         }
//       }

//       default:
//         throw new MethodNotAllowedError(req.method!);
//     }
//   } catch (error) {
//     handleError(res, error as Error);
//   }
// }
