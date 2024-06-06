import { NextApiRequest, NextApiResponse } from "next";
import { CreateStudentDTO } from "../../../../modules/persons/students/dtos";
import {
  createStudent,
  findAllStudents,
} from "../../../../modules/persons/students/student.service";
import { handleError } from "../../../../../utils/errorHandler";
import { MethodNotAllowedError } from "../../../../../utils/CustomError";
import { ApiResponse } from "../../../../../utils/apiResponse";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    switch (req.method) {
      case "GET":
        const students = await findAllStudents();
        res.status(200).json({
          status: "Success",
          result: students,
          message: "All students retrieved successfully.",
        } as ApiResponse);
        break;
      case "POST":
        const studentData: CreateStudentDTO = req.body;
        // Additional validation can be performed here
        await createStudent(studentData);
        res.status(201).json({
          status: "Success",
          message: "New student created successfully.",
        } as ApiResponse);
        break;
      default:
        throw new MethodNotAllowedError(req.method!);
    }
  } catch (error) {
    handleError(res, error);
  }
}
