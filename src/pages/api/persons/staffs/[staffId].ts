import { ApiResponse } from "../../../../../utils/apiResponse";
import { handleError } from "../../../../../utils/errorHandler";
import { NextApiRequest, NextApiResponse } from "next";
import { UpdateStaffDTO } from "../../../../modules/persons/staffs";
import {
  MethodNotAllowedError,
  NotFoundError,
} from "../../../../../utils/CustomError";
import {
  findStaffById,
  updateStaff,
} from "../../../../modules/persons/staffs/staff.service";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const staffId = String(req.query.staffId);

  try {
    switch (req.method) {
      case "GET":
        const staff = await findStaffById(staffId);
        if (!staff) {
          throw new NotFoundError("Staff not found");
        } else {
          res.status(200).json({
            status: "Success",
            result: staff,
            message: "Staff retrieved successfully",
          } as ApiResponse);
        }
        break;
      case "PUT":
        const staffToUpdate: UpdateStaffDTO = req.body;
        await updateStaff(staffToUpdate);
        res.status(200).json({
          status: "Success",
          message: "Staff updated successfully",
        } as ApiResponse);
        break;
      case "DELETE":
        // TODO
        res
          .status(200)
          .json({ status: "Success", message: "Staff deleted successfully" });
        break;
      default:
        throw new MethodNotAllowedError(req.method!);
    }
  } catch (error) {
    handleError(res, error);
  }
}
