import { ApiResponse } from "../../../../../utils/apiResponse";
import { CreateStudentDTO } from "../../../../modules/persons/students/dtos";
import { handleError } from "../../../../../utils/errorHandler";
import { NextApiRequest, NextApiResponse } from "next";
import { Student } from "../../../../modules/persons/students/types";
import {
  MethodNotAllowedError,
  UniqueConstraintError,
} from "../../../../../utils/CustomError";
import {
  createStudent,
  findAllStudents,
} from "../../../../modules/persons/students/student.service";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    switch (req.method) {
      case "GET": {
        const students = await findAllStudents();
        return res.status(200).json({
          status: "Success",
          result: students,
          message: "Students retrieved successfully.",
        } as ApiResponse);
      }

      case "POST": {
        const studentData = req.body as CreateStudentDTO;
        try {
          const newStudent: Student = await createStudent(studentData);
          return res.status(201).json({
            status: "Success",
            result: newStudent,
            message: "New student created successfully.",
          } as ApiResponse);
        } catch (error) {
          if (error.code === "23505") {
            throw new UniqueConstraintError(
              "A student with that name and date of birth already exists.",
            );
          }
          throw error;
        }
      }

      default:
        throw new MethodNotAllowedError(req.method!);
    }
  } catch (error) {
    handleError(res, error as Error);
  }
}
