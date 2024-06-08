import { ApiResponse } from "../../../../utils/apiResponse";
import { findAllGrades } from "../../../modules/grades/grade.service";
import { handleError } from "../../../../utils/errorHandler";
import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const grades = await findAllGrades();
    res.status(200).json({
      status: "Success",
      result: grades,
      message: "Grades retrieved successfully.",
    } as ApiResponse);
  } catch (error) {
    handleError(res, error);
  }
};
