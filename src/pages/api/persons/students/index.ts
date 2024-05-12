import { NextApiRequest, NextApiResponse } from "next";
import { CreateStudentDTO } from "../../../../modules/persons/students/dtos";
import {
  createStudent,
  findAllStudents,
} from "../../../../modules/persons/students/student.service";

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
        res.setHeader("Allow", ["GET", "POST"]);
        res.status(405).json({
          status: "Error",
          result: null,
          message: `Method ${req.method} Not Allowed`,
        });
        break;
    }
  } catch (error) {
    console.error("API error:", error);
    res.status(500).json({
      status: "Error",
      result: null,
      message: "Internal server error",
    });
  }
}
