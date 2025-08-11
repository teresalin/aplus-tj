import { ApiResponse } from "../../../../../utils/apiResponse";
import { handleError } from "../../../../../utils/errorHandler";
import { NextApiRequest, NextApiResponse } from "next";
import { UpdateAssignmentDTO } from "../../../../modules/assignments";
import {
  MethodNotAllowedError,
  NotFoundError,
} from "../../../../../utils/CustomError";
import {
  deleteAssignment,
  findAssignmentById,
  updateAssignment,
} from "../../../../modules/assignments/assignment.service";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const assignmentId = String(req.query.assignmentId);

  try {
    switch (req.method) {
      case "GET":
        const assignment = await findAssignmentById(assignmentId);
        if (!assignment) {
          throw new NotFoundError("Assignment not found");
        } else {
          res.status(200).json({
            status: "Success",
            result: assignment,
            message: "Assignment retrieved successfully",
          } as ApiResponse);
        }
        break;
      case "PUT":
        const assignmentToUpdate: UpdateAssignmentDTO = req.body;
        await updateAssignment(assignmentToUpdate);
        res.status(200).json({
          status: "Success",
          message: "Assignment updated successfully",
        } as ApiResponse);
        break;
      case "DELETE":
        const { assignment_id } = req.query;
        await deleteAssignment(assignment_id as string);
        res.status(200).json({
          status: "Success",
          message: "Assignment deleted successfully",
        } as ApiResponse);
        break;
      default:
        throw new MethodNotAllowedError(req.method!);
    }
  } catch (error) {
    handleError(res, error);
  }
}
