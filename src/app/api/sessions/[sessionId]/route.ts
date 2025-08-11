import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { MethodNotAllowedError, NotFoundError } from "@/lib/CustomError";
import { handleError } from "@/lib/errorHandler";
import {
  findSessionById,
  updateSession,
} from "@/modules/sessions/session.service";

// If you want this reusable elsewhere (e.g., page.tsx), export it here:
export async function getSessionDetails(sessionId: string) {
  const session = await findSessionById(sessionId);
  if (!session) throw new NotFoundError("Session not found");
  return session;
}

// Example validation for PUT body; tweak to your shape
const UpdateSessionSchema = z.object({
  id: z.string().uuid(),
  startTime: z.string().datetime().optional(),
  endTime: z.string().datetime().optional(),
  status: z.string().optional(),
  // ... add fields as needed
});

export async function GET(
  _req: NextRequest,
  { params }: { params: { sessionId: string } },
) {
  try {
    const session = await getSessionDetails(params.sessionId);
    return NextResponse.json(
      {
        status: "Success",
        result: session,
        message: "Session retrieved successfully",
      },
      { status: 200 },
    );
  } catch (err) {
    return handleError(null, err); // adjust if your handleError expects Response
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { sessionId: string } },
) {
  try {
    const json = await req.json();
    const parsed = UpdateSessionSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        {
          status: "Error",
          message: "Invalid request body",
          details: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    // Optional guard: ensure body.id matches the route id
    if (parsed.data.id !== params.sessionId) {
      return NextResponse.json(
        {
          status: "Error",
          message: "Body id does not match route id",
        },
        { status: 400 },
      );
    }

    await updateSession(parsed.data);
    return NextResponse.json(
      {
        status: "Success",
        message: "Session updated successfully",
      },
      { status: 200 },
    );
  } catch (err) {
    return handleError(null, err);
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { sessionId: string } },
) {
  try {
    // TODO: implement deleteSession(params.sessionId);
    return NextResponse.json(
      {
        status: "Success",
        message: "Session deleted successfully",
      },
      { status: 200 },
    );
  } catch (err) {
    return handleError(null, err);
  }
}

// Optional: reject other methods explicitly (usually not needed, but included for completeness)
export function OPTIONS() {
  // CORS preflight or method listing if you need it
  return NextResponse.json({}, { status: 204 });
}
