import { ApiResponse } from "../../../../../utils/apiResponse";
import { handleError } from "../../../../../utils/errorHandler";
import { NextApiRequest, NextApiResponse } from "next";
import { UpdateSessionDTO } from "../../../../modules/sessions";
import {
  findSessionById,
  updateSession,
} from "../../../../modules/sessions/session.service";
import {
  MethodNotAllowedError,
  NotFoundError,
} from "../../../../../utils/CustomError";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const sessionId = String(req.query.sessionId);

  try {
    switch (req.method) {
      case "GET":
        const session = await findSessionById(sessionId);
        if (!session) {
          throw new NotFoundError("Session not found");
        } else {
          res.status(200).json({
            status: "Success",
            result: session,
            message: "Session retrieved successfully",
          } as ApiResponse);
        }
        break;
      case "PUT":
        const sessionToUpdate: UpdateSessionDTO = req.body;
        await updateSession(sessionToUpdate);
        res.status(200).json({
          status: "Success",
          message: "Session updated successfully",
        } as ApiResponse);
        break;
      case "DELETE":
        // TODO
        res
          .status(200)
          .json({ status: "Success", message: "Session deleted successfully" });
        break;
      default:
        throw new MethodNotAllowedError(req.method!);
    }
  } catch (error) {
    handleError(res, error);
  }
}
