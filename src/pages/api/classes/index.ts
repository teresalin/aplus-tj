import { NextApiRequest, NextApiResponse } from "next";
import {
  createClass,
  findAllClasses,
} from "../../../modules/classes/class.service";
import { ApiResponse } from "../../../../utils/apiResponse";
import { CreateClassDTO } from "../../../modules/classes";
import { handleError } from "../../../../utils/errorHandler";
import { MethodNotAllowedError } from "../../../../utils/CustomError";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    switch (req.method) {
      case "GET":
        const classes = await findAllClasses();
        res.status(200).json({
          status: "Success",
          result: classes,
          message: "All classes retrieved successfully.",
        } as ApiResponse);
        break;
      case "POST":
        const classData: CreateClassDTO = req.body;
        // Additional validation can be performed here
        await createClass(classData);
        res.status(201).json({
          status: "Success",
          message: "New class created successfully.",
        } as ApiResponse);
        break;
      default:
        throw new MethodNotAllowedError(req.method!);
    }
  } catch (error) {
    handleError(res, error);
  }
}
