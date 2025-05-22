import type { NextApiRequest, NextApiResponse } from "next";
import { ApiResponse } from "../../../../utils/apiResponse";
import { handleError } from "../../../../utils/errorHandler";
import type { CreateGradeDTO } from "../../../modules/grades/dtos/create-grade.dto";
import type { Grade } from "../../../modules/grades/types";
import {
  createGrade,
  findAllGrades,
} from "../../../modules/grades/grade.service";
import {
  UniqueConstraintError,
  MethodNotAllowedError,
} from "../../../../utils/CustomError";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>,
) {
  try {
    switch (req.method) {
      case "GET": {
        const grades: Grade[] = await findAllGrades();
        return res.status(200).json({
          status: "Success",
          result: grades,
          message: "Grades retrieved successfully.",
        });
      }

      case "POST": {
        // 1. Validate
        const body = req.body as Partial<CreateGradeDTO>;
        if (!body.name || typeof body.name !== "string") {
          return res
            .status(400)
            .json({ status: "Error", message: "'name' is required" });
        }

        try {
          // 2. Try to create
          const newGrade: Grade = await createGrade({ name: body.name });
          return res.status(201).json({
            status: "Success",
            result: newGrade,
            message: "Grade created successfully.",
          });
        } catch (err: any) {
          // 3. Translate PG unique-violation → your custom error
          if (err.code === "23505") {
            throw new UniqueConstraintError(
              "A grade with that name already exists.",
            );
          }
          throw err; // let handleError deal with everything else
        }
      }

      default:
        // Method not allowed
        throw new MethodNotAllowedError(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    return handleError(res, error as Error);
  }
}
