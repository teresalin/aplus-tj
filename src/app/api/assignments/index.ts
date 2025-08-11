import { ApiResponse } from "../../../../utils/apiResponse";
import { AssignmentFilter } from "../../../modules/assignments/constants";
import { CreateAssignmentDTO } from "../../../modules/assignments";
import { handleError } from "../../../../utils/errorHandler";
import { MethodNotAllowedError } from "../../../../utils/CustomError";
import { NextApiRequest, NextApiResponse } from "next";
import { parseAssignmentFilter } from "../../../modules/assignments/assignment.filters";
import {
  createAssignment,
  findAllAssignments,
} from "../../../modules/assignments/assignment.service";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>,
) {
  try {
    switch (req.method) {
      case "GET": {
        const filter: AssignmentFilter = parseAssignmentFilter(
          req.query.filter,
        );

        const assignments = await findAllAssignments(filter);
        return res.status(200).json({
          status: "Success",
          result: assignments,
          message: "Assignments retrieved successfully.",
        });
      }

      case "POST": {
        const dto: CreateAssignmentDTO = req.body;
        await createAssignment(dto);
        return res.status(201).json({
          status: "Success",
          message: "New assignment created successfully.",
        });
      }

      default:
        throw new MethodNotAllowedError(req.method!);
    }
  } catch (error) {
    handleError(res, error as Error);
  }
}
