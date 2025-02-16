import { handleError } from "../../../../../utils/errorHandler";
import { NextApiRequest, NextApiResponse } from "next";
import { UpdateClassDTO } from "../../../../modules/classes";
import {
  findClassById,
  updateClass,
} from "../../../../modules/classes/class.service";
import {
  MethodNotAllowedError,
  NotFoundError,
} from "../../../../../utils/CustomError";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const classId = parseInt(req.query.class_id as string);

  try {
    switch (req.method) {
      case "GET":
        const fetchedClass = await findClassById(classId);
        if (!fetchedClass) {
          throw new NotFoundError("Class not found");
        } else {
          res.status(200).json({
            status: "Success",
            result: fetchedClass,
            message: "Class retrieved successfully",
          });
        }
        break;
      case "PUT":
        const classToUpdate: UpdateClassDTO = req.body;
        await updateClass(classToUpdate);
        res.status(200).json({
          status: "Success",
          message: "Class updated successfully",
        });
        break;
      case "DELETE":
        // TODO
        res
          .status(200)
          .json({ status: "Success", message: "Class deleted successfully" });
        break;
      default:
        throw new MethodNotAllowedError(req.method!);
    }
  } catch (error) {
    handleError(res, error);
  }
}
