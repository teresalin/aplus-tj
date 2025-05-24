import { ApiResponse } from "../../../../../utils/apiResponse";
import { CreateStaffDTO, Staff } from "../../../../modules/persons/staffs";
import { handleError } from "../../../../../utils/errorHandler";
import { NextApiRequest, NextApiResponse } from "next";
import {
  MethodNotAllowedError,
  UniqueConstraintError,
} from "../../../../../utils/CustomError";
import {
  createStaff,
  findAllStaffs,
} from "../../../../modules/persons/staffs/staff.service";

export default async (
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>,
) => {
  try {
    switch (req.method) {
      case "GET":
        const staffs: Staff[] = await findAllStaffs();
        return res.status(200).json({
          status: "Success",
          result: staffs,
          message: "Staffs retrieved successfully.",
        } as ApiResponse);
      case "POST":
        const body: CreateStaffDTO = req.body;
        try {
          const newStaff: Staff = await createStaff(body);
          return res.status(201).json({
            status: "Success",
            result: newStaff,
            message: "Staff created successfully.",
          });
        } catch (err: any) {
          if (err.code === "23505") {
            throw new UniqueConstraintError(
              "A staff with that name and date of birth already exists.",
            );
          }
          throw err;
        }
      default:
        throw new MethodNotAllowedError(req.method!);
    }
  } catch (error) {
    handleError(res, error as Error);
  }
};
