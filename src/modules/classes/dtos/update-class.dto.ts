import { ScheduleDTO } from "../../schedules";

export interface UpdateClassDTO {
  name?: string;
  gradeId?: number;
  teacherId?: number;
  capacity?: number;
  schedules?: ScheduleDTO[];
}
