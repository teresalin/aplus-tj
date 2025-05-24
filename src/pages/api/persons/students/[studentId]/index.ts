import { ApiResponse } from "../../../../../../utils/apiResponse";
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
  res: NextApiResponse,
) {
  const id = String(req.query.studentId);

  try {
    switch (req.method) {
      case "GET":
        const student = await findStudentById(id);
        if (!student) {
          throw new NotFoundError("Student not found");
        } else {
          res.status(200).json({
            status: "Success",
            result: student,
            message: "Student retrieved successfully",
          } as ApiResponse);
        }
        break;
      case "PUT":
        const studentToUpdate: UpdateStudentDTO = req.body;
        await updateStudent(studentToUpdate);
        res.status(200).json({
          status: "Success",
          message: "Student updated successfully",
        } as ApiResponse);
        break;
      case "DELETE":
        // TODO
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
