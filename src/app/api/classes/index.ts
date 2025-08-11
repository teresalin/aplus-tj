import { ApiResponse } from "../../../../utils/apiResponse";
import { Class, CreateClassDTO } from "../../../modules/classes";
import { handleError } from "../../../../utils/errorHandler";
import { NextApiRequest, NextApiResponse } from "next";
import {
  MethodNotAllowedError,
  UniqueConstraintError,
} from "../../../../utils/CustomError";
import {
  createClass,
  findAllClasses,
} from "../../../modules/classes/class.service";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>,
) {
  try {
    switch (req.method) {
      case "GET":
        const classes: Class[] = await findAllClasses();
        return res.status(200).json({
          status: "Success",
          result: classes,
          message: "Classes retrieved successfully.",
        } as ApiResponse);
      case "POST":
        const body: CreateClassDTO = req.body;
        console.log(body);
        try {
          const newClass: Class = await createClass(body);
          return res.status(201).json({
            status: "Success",
            result: newClass,
            message: "Class created successfully.",
          });
        } catch (error) {
          if (error.code === "23505") {
            throw new UniqueConstraintError(
              "A class with the same name and grade already exists.",
            );
          }
          throw error;
        }
      default:
        throw new MethodNotAllowedError(req.method!);
    }
  } catch (error) {
    handleError(res, error);
  }
}
