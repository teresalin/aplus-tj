import { ClassSummary } from "../classes";
import { Session } from "./types";

export function mapRowToSession(row: any): Session {
  return {
    id: row.id,
    class: { id: row.class_id, name: row.class_name } as ClassSummary,
    date: new Date(row.date),
    startTime: row.start_time,
    endTime: row.end_time,
  };
}
