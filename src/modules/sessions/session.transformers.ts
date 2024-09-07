import { UpdateSessionDTO } from "./dtos";
import { Session } from "./types";

export function sessionToUpdateSessionDTO(session: Session): UpdateSessionDTO {
  return {
    id: session.id,
    classId: session.class.id,
    date: session.date,
    startTime: session.startTime,
    endTime: session.endTime,
  };
}
