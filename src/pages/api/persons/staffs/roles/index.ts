import { ApiResponse } from "../../../../../../utils/apiResponse";
import { findAllRoles } from "../../../../../modules/persons/roles/role.service";
import { handleError } from "../../../../../../utils/errorHandler";
import { MethodNotAllowedError } from "../../../../../../utils/CustomError";
import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    switch (req.method) {
      case "GET":
        const roles = await findAllRoles();
        res.status(200).json({
          status: "Success",
          result: roles,
          message: "All roles retrieved successfully.",
        } as ApiResponse);
        break;

      default:
        throw new MethodNotAllowedError(req.method!);
    }
  } catch (error) {
    handleError(res, error);
  }
};
