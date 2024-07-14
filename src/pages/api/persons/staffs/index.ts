import { ApiResponse } from "../../../../../utils/apiResponse";
import { CreateStaffDTO } from "../../../../modules/persons/staffs";
import { handleError } from "../../../../../utils/errorHandler";
import { MethodNotAllowedError } from "../../../../../utils/CustomError";
import { NextApiRequest, NextApiResponse } from "next";
import {
  createStaff,
  findAllStaffs,
} from "../../../../modules/persons/staffs/staff.service";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    switch (req.method) {
      case "GET":
        const staffs = await findAllStaffs();
        res.status(200).json({
          status: "Success",
          result: staffs,
          message: "All staffs retrieved successfully.",
        } as ApiResponse);
        break;
      case "POST":
        const staffData: CreateStaffDTO = req.body;
        // Additional validation can be performed here
        await createStaff(staffData);
        res.status(201).json({
          status: "Success",
          message: "New staff created successfully.",
        } as ApiResponse);
        break;
      default:
        throw new MethodNotAllowedError(req.method!);
    }
  } catch (error) {
    handleError(res, error);
  }
};
