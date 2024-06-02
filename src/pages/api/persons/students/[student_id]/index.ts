import { handleError } from "../../../../../../utils/errorHandler";
import { NextApiRequest, NextApiResponse } from "next";
import { UpdateStudentDTO } from "../../../../../modules/persons/students/dtos";
import {
  findStudentById,
  updateStudent,
} from "../../../../../modules/persons/students/student.service";
import {
  MethodNotAllowedError,
  NotFoundError,
} from "../../../../../../utils/CustomError";

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
          throw new NotFoundError("Student not found");
        } else {
          res.status(200).json({
            status: "Success",
            result: student,
            message: "Student retrieved successfully",
          });
        }
        break;
      case "PUT":
        const studentData: UpdateStudentDTO = req.body;
        const updatedStudent = await updateStudent(studentData);
        res.status(200).json({
          status: "Success",
          result: updatedStudent,
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
        throw new MethodNotAllowedError(req.method!);
    }
  } catch (error) {
    handleError(res, error);
  }
}
