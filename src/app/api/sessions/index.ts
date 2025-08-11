import { ApiResponse } from "../../../../utils/apiResponse";
import { CreateSessionDTO, Session } from "../../../modules/sessions";
import { handleError } from "../../../../utils/errorHandler";
import { NextApiRequest, NextApiResponse } from "next";
import {
  MethodNotAllowedError,
  UniqueConstraintError,
} from "../../../../utils/CustomError";
import {
  createSession,
  findAllSessions,
} from "../../../modules/sessions/session.service";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>,
) {
  try {
    switch (req.method) {
      case "GET":
        const sessions: Session[] = await findAllSessions();
        res.status(200).json({
          status: "Success",
          result: sessions,
          message: "Sessions retrieved successfully.",
        } as ApiResponse);
        break;
      case "POST":
        const body: CreateSessionDTO = req.body;
        try {
          const newSession: Session = await createSession(body);
          return res.status(201).json({
            status: "Success",
            result: newSession,
            message: "Session created successfully.",
          });
        } catch (error) {
          if (error.code === "23505") {
            throw new UniqueConstraintError(
              "A grade with that name already exists.",
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
