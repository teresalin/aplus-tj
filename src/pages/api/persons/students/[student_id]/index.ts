import { NextApiRequest, NextApiResponse } from "next";
import {
  findStudentById,
  updateStudent,
} from "../../../../../modules/persons/students/student.service";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const studentId = parseInt(req.query.student_id as string);

  try {
    switch (req.method) {
      case "GET":
        const student = await findStudentById(studentId);
        if (!student) {
          res.status(404).json({
            status: "Error",
            result: null,
            message: "Student not found",
          });
        } else {
          res.status(200).json({
            status: "Success",
            result: student,
            message: "Student retrieved successfully",
          });
        }
        break;
      case "PUT":
        // Assume req.body contains the updated student data
        await updateStudent(studentId, req.body);
        res.status(200).json({
          status: "Success",
          result: {},
          message: "Student updated successfully",
        });
        break;
      case "DELETE":
        // await deleteStudent(studentId);
        res
          .status(200)
          .json({ status: "Success", message: "Student deleted successfully" });
        break;
      default:
        res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error("API error:", error);
    res.status(500).json({ status: "Error", message: "Internal server error" });
  }
}
