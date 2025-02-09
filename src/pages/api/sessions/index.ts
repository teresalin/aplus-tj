import { ApiResponse } from "../../../../utils/apiResponse";
import { CreateSessionDTO } from "../../../modules/sessions";
import { handleError } from "../../../../utils/errorHandler";
import { MethodNotAllowedError } from "../../../../utils/CustomError";
import { NextApiRequest, NextApiResponse } from "next";
import {
  createSession,
  findAllSessions,
} from "../../../modules/sessions/session.service";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { range } = req.query;

  try {
    switch (req.method) {
      case "GET":
        const sessions = await findAllSessions(range);
        res.status(200).json({
          status: "Success",
          result: sessions,
          message: "All sessions retrieved successfully.",
        } as ApiResponse);
        break;
      case "POST":
        const session: CreateSessionDTO = req.body;
        console.log(session);
        // Additional validation can be performed here
        await createSession(session);
        res.status(201).json({
          status: "Success",
          message: "New session created successfully.",
        } as ApiResponse);
        break;
      default:
        throw new MethodNotAllowedError(req.method!);
    }
  } catch (error) {
    handleError(res, error);
  }
}
