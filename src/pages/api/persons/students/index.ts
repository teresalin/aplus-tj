import { NextApiRequest, NextApiResponse } from "next";
import { CreateStudentDTO } from "../../../../modules/persons/students/dtos";
import {
  createStudent,
  findAllStudents,
} from "../../../../modules/persons/students/student.service";
import { handleError } from "../../../../../utils/errorHandler";
import { MethodNotAllowedError } from "../../../../../utils/CustomError";

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
        });
        break;
      case "POST":
        // Validate the incoming data before passing to the service
        const studentData: CreateStudentDTO = req.body;
        // Additional validation can be performed here
        const newStudent = await createStudent(studentData);
        res.status(201).json({
          status: "Success",
          result: newStudent,
          message: "New student created successfully.",
        });
        break;
      default:
        throw new MethodNotAllowedError(req.method!);
    }
  } catch (error) {
    handleError(res, error);
  }
}
