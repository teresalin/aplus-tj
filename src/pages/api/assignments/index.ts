import { NextApiRequest, NextApiResponse } from "next";
import { ApiResponse } from "../../../../utils/apiResponse";
import { CreateAssignmentDTO } from "../../../modules/assignments";
import { MethodNotAllowedError } from "../../../../utils/CustomError";
import { handleError } from "../../../../utils/errorHandler";
import {
  createAssignment,
  findAllAssignments,
} from "../../../modules/assignments/assignment.service";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { filter } = req.query;

  try {
    switch (req.method) {
      case "GET":
        const assignments = await findAllAssignments(filter);
        res.status(200).json({
          status: "Success",
          result: assignments,
          message: "All assignments retrieved successfully.",
        } as ApiResponse);
        break;
      case "POST":
        const assignment: CreateAssignmentDTO = req.body;
        // Additional validation can be performed here
        await createAssignment(assignment);
        res.status(201).json({
          status: "Success",
          message: "New assignment created successfully.",
        } as ApiResponse);
        break;
      default:
        throw new MethodNotAllowedError(req.method!);
    }
  } catch (error) {
    handleError(res, error);
  }
};
