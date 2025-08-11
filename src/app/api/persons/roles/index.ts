import { ApiResponse } from "../../../../../utils/apiResponse";
import { CreateRoleDTO } from "../../../../modules/roles/dtos/create-role.dto";
import { handleError } from "../../../../../utils/errorHandler";
import { NextApiRequest, NextApiResponse } from "next";
import { Role } from "../../../../modules/roles/types";
import {
  MethodNotAllowedError,
  UniqueConstraintError,
} from "../../../../../utils/CustomError";
import {
  createRole,
  findAllRoles,
} from "../../../../modules/roles/role.service";

export default async (
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>,
) => {
  try {
    switch (req.method) {
      case "GET":
        const roles = await findAllRoles();
        return res.status(200).json({
          status: "Success",
          result: roles,
          message: "Roles retrieved successfully.",
        } as ApiResponse);
      case "POST": {
        // 1. Validate
        const body = req.body as Partial<CreateRoleDTO>;
        if (!body.name || typeof body.name !== "string") {
          return res
            .status(400)
            .json({ status: "Error", message: "'name' is required" });
        }
        try {
          // 2. Create
          const newRole: Role = await createRole({ name: body.name });
          return res.status(201).json({
            status: "Success",
            result: newRole,
            message: "Role created successfully.",
          });
        } catch (error) {
          // 3. Translate PG unique-violation → your custom error
          if (error.code === "23505") {
            throw new UniqueConstraintError(
              "A role with that name already exists.",
            );
          }
          throw error; // let handleError deal with everything else
        }
      }
      default:
        throw new MethodNotAllowedError(req.method!);
    }
  } catch (error) {
    handleError(res, error);
  }
};
